import { AuthPolicyService } from 'auth-policy';
import { Observable } from 'rxjs/Observable';

import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot, CanActivate, CanActivateChild, CanLoad, Route, Router,
  RouterStateSnapshot, UrlSegment, UrlTree
} from '@angular/router';

/**
 * AuthGuard
 */
@Injectable()
export class AuthPolicyGuard implements CanActivate, CanActivateChild, CanLoad {

  constructor(
    private router: Router,
    private authPolicy: AuthPolicyService
  ) { }

  /** canActivate route if pass policy check details */
  public canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const permission: string = next.data['permission'];
    return this.checkPermission(permission);
  }
  /** canActivateChild route if pass policy check details */
  public canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const permission: string = next.data['permission'];
    return this.checkPermission(permission);
  }
  /** canLoad route if pass policy check details */
  public canLoad(route: Route, segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
    const permission: string = route.data['permission'];
    return this.checkPermission(permission);
  }

  /**
   * Check permission from auth-policy and return flag
   * @returns boolean
   */
  private checkPermission(permission: string): boolean {
    const authorized: boolean = this.authPolicy.hasPermission(permission);
    if (!authorized) {
      this.router.navigate(['/unauthorized']);
    }
    return authorized;
  }

}
