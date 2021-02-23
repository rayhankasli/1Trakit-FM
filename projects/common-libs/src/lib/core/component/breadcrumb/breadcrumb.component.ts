/** 
 * @author Nitesh Sharma
 */

import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd, Event } from '@angular/router';
import { filter } from 'rxjs/operators/filter';
import { distinctUntilChanged } from 'rxjs/operators/distinctUntilChanged';
import { map } from 'rxjs/operators/map';
import { Observable } from 'rxjs/Observable';
// --------------------------------------------- //
import { BreadCrumb } from './breadcrumb.model';

/**
 * BreadcrumbComponent
 */
@Component({
  selector: 'lib-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BreadcrumbComponent implements OnInit {

  /** Async observable return the array of breadcrumbs */
  public breadcrumbs$: Observable<BreadCrumb[]>;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.breadcrumbs$ = new Observable<BreadCrumb[]>();
  }

  /**
   * on init
   */
  public ngOnInit(): void {
    this.breadcrumbs$ = this.router.events.pipe(
      filter((event: Event) => event instanceof NavigationEnd),
      distinctUntilChanged(),
      map((event: Event) => this.buildBreadCrumb(this.activatedRoute))
    );
  }

  /** Generate the list of breadcrumbs to be added for current routing module */
  public buildBreadCrumb(route: ActivatedRoute, url: string = '', breadcrumbs: Array<BreadCrumb> = []): Array<BreadCrumb> {
    let newBreadcrumbs: BreadCrumb[] = [];
    let nextUrl: string;
    let label: string;
    let path: string;
    // If no routeConfig is avalailable we are on the root path
    if (route.routeConfig) {
      if (!route.routeConfig.data && breadcrumbs.length > 0) {
        return breadcrumbs;
      }

      path = route.routeConfig ? route.routeConfig.path : '';
      // In the routeConfig the complete path is not available,
      // so we rebuild it each time
      nextUrl = `${url}${path}/`;
      if (route.routeConfig.data) {
        label = route.routeConfig ? route.routeConfig.data['breadcrumb'] : '';

        const breadcrumb: BreadCrumb = {
          label,
          url: nextUrl,
        };
        newBreadcrumbs = [...breadcrumbs, breadcrumb];
      }
      else {
        newBreadcrumbs = [...breadcrumbs];
      }
    }

    if (route.firstChild) {
      // If we are not on our current path yet,
      // there will be more children to look after, to build our breadcumb
      return this.buildBreadCrumb(route.firstChild, nextUrl, newBreadcrumbs);
    }
    return newBreadcrumbs;
  }

  /** track by function for breadcrumb */
  public breadcrumbs(index: number, item: BreadCrumb): string {
    return item.label;
  }
}
