import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, CanLoad, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { AuthPolicyService } from 'auth-policy';
import { Observable } from 'rxjs';
import { MenuLicensing } from '../enums/menu-licensing.enum';
import { PolicyRoles } from '../enums/role-permissions.enum';
import { CoreDataService } from '../services/core-data.service';

@Injectable()
export class CheckLicensingGuard implements CanActivate, CanActivateChild, CanLoad {

  private readonly key: string = 'license';
  private isSuperUser: boolean;

  constructor(
    private router: Router,
    private coreDataService: CoreDataService,
    private authPolicy: AuthPolicyService
  ) {
    this.isSuperUser = this.authPolicy.isInRole(PolicyRoles.superUser);
  }

  /** check for route  */
  public canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.checkClientLicensing(next.data[this.key]);
  }
  /** check for child route  */
  public canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.checkClientLicensing(next.data[this.key]);
  }
  /** check for lazy loaded routes  */
  public canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
    return this.checkClientLicensing(route.data[this.key]);
  }

  /** check client-licensing for the given feature */
  private checkClientLicensing(feature: string): boolean {
    let flag: boolean = false;
    const license = this.coreDataService.clientDetail().productLicense;

    switch (Number(feature)) {
      case MenuLicensing.CopyIt:
      case MenuLicensing.Fleet:
      case MenuLicensing.ReportCopyIt:
      case MenuLicensing.ReportFleet:
      case MenuLicensing.ReportMeterReads:
        flag = this.isSuperUser || license.copyIt;
        break;
      case MenuLicensing.BookIt:
      case MenuLicensing.ReportBookIt:
        flag = this.isSuperUser || license.bookIt;
        break;
      case MenuLicensing.VisitorLog:
        flag = this.isSuperUser || license.visitorLog;
        break;
      case MenuLicensing.Packages:
      case MenuLicensing.ReportMail:
        flag = this.isSuperUser || license.mail;
        break;
      case MenuLicensing.ReportWorkflow:
      case MenuLicensing.ReportTask:
        flag = this.isSuperUser || license.workflow;
        break;
    }
    if (!flag) {
      this.router.navigate(['unauthorized']);
    }
    return flag;
  }
}
