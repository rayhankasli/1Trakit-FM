import { ActivatedRouteSnapshot, Data,Resolve, RouterStateSnapshot, UrlSegment } from '@angular/router';
import { Observable } from 'rxjs/observable';
import { of } from 'rxjs/observable/of';
// ------------------------------------------------------------------------ //
import { IBreadcrumb, stringFormat } from './breadcrumb.shared';

export class BreadcrumbResolver implements Resolve<IBreadcrumb[]> {
  public resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<IBreadcrumb[]> | Promise<IBreadcrumb[]> | IBreadcrumb[] {
    const data: Data = route.routeConfig.data;
    const breadcrumbsPath: string = this.getFullPath(route);

    let breadcrumbsText: string =
      typeof data.breadcrumb === 'string'
        ? data.breadcrumb
        : data.breadcrumb.text || data.text || breadcrumbsPath;
    let breadcrumbsClassName: string =
      typeof data.className === 'string' ? data.className : breadcrumbsPath;
    breadcrumbsText = stringFormat(breadcrumbsText, route.data);
    breadcrumbsClassName = stringFormat(breadcrumbsClassName, route.data);

    const crumbs: IBreadcrumb[] = [
      {
        text: breadcrumbsText,
        path: breadcrumbsPath,
        className: breadcrumbsClassName
      }
    ];

    return of(crumbs);
  }

  public getFullPath(route: ActivatedRouteSnapshot): string {
    const relativePath = (segments: UrlSegment[]) =>
      segments.reduce((a, v) => (a += '/' + v.path), '');
    const fullPath = (routes: ActivatedRouteSnapshot[]) =>
      routes.reduce((a, v) => (a += relativePath(v.url)), '');

    return fullPath(route.pathFromRoot);
  }
}
