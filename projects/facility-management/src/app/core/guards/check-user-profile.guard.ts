import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { UserProfile, UserInfo } from '../model/core.model';
import { CommonHttpService } from '../services/common-http.service';
import { ToastrService } from 'ngx-toastr';



@Injectable()
export class CheckUserProfileGuard implements CanActivate, CanActivateChild {

  constructor(
    private router: Router,
    private toast: ToastrService,
    private commonHttpService: CommonHttpService,
  ) { }

  /** canActivate if user profile exists */
  public canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.checkUserProfile(next, state);
  }
  /** canActivateChild if user profile exists */
  public canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.checkUserProfile(next, state);
  }

  /** Check user profile available */
  private checkUserProfile(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> {
    let flag: boolean = false;
    return this.commonHttpService.loadLoggedInUserInfo().toPromise()
      .then((userInfo: UserInfo) => {
        const userProfile: UserProfile = userInfo.userDetail;
        if (userProfile) {
          flag = userProfile.primaryContactNumber && userProfile.primaryContactNumber.length > 0;
          if (!flag) {
            this.toast.error('Please complete your profile before continue.', 'Alert!')
            this.router.navigate(['user-profile']);
          }
        } else {
          this.router.navigate(['inactive-user'])
        }
        return flag;
      }).catch((err => { this.logError(err); return false; }))
  }

  /** Log error */
  private logError(err) {
    this.toast.error(err);
  }

}
