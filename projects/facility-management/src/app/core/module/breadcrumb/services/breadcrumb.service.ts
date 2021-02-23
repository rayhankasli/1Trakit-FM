import { Injectable, Injector } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Data, NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { concat, distinct, filter, first, flatMap, toArray } from 'rxjs/operators';
// --------------------------------------------------------------------------- //
import { BreadcrumbConfig } from './breadcrumb.config';
import { BreadcrumbResolver } from './breadcrumb.resolver';
import { IBreadcrumb, wrapIntoObservable } from './breadcrumb.shared';

@Injectable()
export class BreadcrumbService {
  public breadcrumbs: BehaviorSubject<IBreadcrumb[]> = new BehaviorSubject<
    IBreadcrumb[]
  >([]);
  private defaultResolver: BreadcrumbResolver = new BreadcrumbResolver();

  constructor(
    private router: Router,
    route: ActivatedRoute,
    private config: BreadcrumbConfig,
    private injector: Injector
  ) {
    this.router.events
      .pipe(filter((x: any) => x instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        const currentRoot: ActivatedRouteSnapshot =
          router.routerState.snapshot.root;

        // Observable.of(this._config.prefixCrumbs)
        this._resolveCrumbs(currentRoot)
          .pipe(
            flatMap((x: IBreadcrumb[]) => x),
            distinct((x: IBreadcrumb) => x.text),
            toArray(),
            flatMap((x: IBreadcrumb[]) => {
              if (this.config.postProcess) {
                const y:
                  | IBreadcrumb[]
                  | Promise<IBreadcrumb[]>
                  | Observable<IBreadcrumb[]> = this.config.postProcess(x);
                return wrapIntoObservable<IBreadcrumb[]>(y).pipe(first());
              } else {
                return of(x);
              }
            })
          )
          .subscribe((x: IBreadcrumb[]) => {
            this.breadcrumbs.next(x);
          });
      });
  }

  public get crumbs$(): Observable<IBreadcrumb[]> {
    return this.breadcrumbs;
  }

  private _resolveCrumbs(
    route: ActivatedRouteSnapshot
  ): Observable<IBreadcrumb[]> {
    let crumbs$: Observable<IBreadcrumb[]>;

    const data: Data = route.routeConfig && route.routeConfig.data;

    if (data && data.breadcrumb) {
      let resolver: BreadcrumbResolver;

      if (data.breadcrumb.prototype instanceof BreadcrumbResolver) {
        resolver = this.injector.get(data.breadcrumb);
      } else {
        resolver = this.defaultResolver;
      }
      const result:
        | IBreadcrumb[]
        | Promise<IBreadcrumb[]>
        | Observable<IBreadcrumb[]> = resolver.resolve(
        route,
        this.router.routerState.snapshot
      );
      crumbs$ = wrapIntoObservable<IBreadcrumb[]>(result).pipe(first());
    } else {
      crumbs$ = of([]);
    }

    if (route.firstChild) {
      crumbs$ = crumbs$.pipe(concat(this._resolveCrumbs(route.firstChild)));
    }

    return crumbs$;
  }
}
