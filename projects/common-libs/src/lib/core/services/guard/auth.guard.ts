import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivateChild, Route, UrlSegment, CanActivate, CanLoad } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { OidcFacade } from 'ng-oidc-client';
import { switchMap } from 'rxjs/operators/switchMap';
// -------------------------------------- //
import { AuthService } from '../auth/auth.service';

/**
 * AuthGuard
 */
@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild, CanLoad {

  constructor(
    private authService: AuthService,
    private oidcFacade: OidcFacade,
  ) { }
  /** canActivate route if pass policy check details */
  public canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.checkAuthentication();
  }
  /** canActivateChild route if pass policy check details */
  public canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.checkAuthentication();
  }
  /** canLoad route if pass policy check details */
  public canLoad(route: Route, segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
    return this.checkAuthentication();
  }

  /** canActivate */
  private async checkAuthentication(): Promise<boolean> {
    const isLoggedIn: Observable<boolean> = await this.authService.isLoggedInObs();

    return isLoggedIn.pipe(
      switchMap(
        (loggedIn: boolean) => {
          if (!loggedIn) {
            this.oidcFacade.signinRedirect();
            return of(false); // user not logged in, canActivate = false
          } else {
            this.oidcFacade.getUserManager().events.addAccessTokenExpired(() => {
              this.oidcFacade.signinRedirect();
              return of(false);
            });
            return of(true);
          }
        }
      )).toPromise();
  }

}
