import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, CanLoad, Route, UrlSegment, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CoreDataService } from '../../services/core-data.service';
import { MenuLicensing } from '../../enums/menu-licensing.enum';
import { AuthPolicyService } from 'auth-policy';
import { PolicyRoles } from '../../enums/role-permissions.enum';

@Injectable()
export class CheckArchivedGuard implements CanActivate, CanActivateChild, CanLoad {

  private readonly key: string = 'archived';

  constructor(
    private router: Router,
    private coreDataService: CoreDataService,
    private authPolicyService: AuthPolicyService
  ) { }

  /** check for route  */
  public canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.checkClientArchived(next.data[this.key]);
  }
  /** check for child route  */
  public canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.checkClientArchived(next.data[this.key]);
  }
  /** check for lazy loaded route  */
  public canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
    return this.checkClientArchived(route.data[this.key]);
  }

  /** check client-archived for the given feature */
  private checkClientArchived(feature: string): boolean {
    let flag: boolean = false;
    if (this.authPolicyService.isInRole(PolicyRoles.manager) || this.authPolicyService.isInRole(PolicyRoles.associate)) {
      const archive = this.coreDataService.clientDetail().archive;

      switch (Number(feature)) {
        case MenuLicensing.CopyIt:
        case MenuLicensing.Fleet:
        case MenuLicensing.ReportCopyIt:
        case MenuLicensing.ReportFleet:
        case MenuLicensing.ReportMeterReads:
          flag = archive.copyIt;
          break;
        case MenuLicensing.BookIt:
        case MenuLicensing.ReportBookIt:
          flag = archive.bookIt;
          break;
        case MenuLicensing.VisitorLog:
          flag = archive.visitorLog;
          break;
        case MenuLicensing.Packages:
        case MenuLicensing.ReportMail:
          flag = archive.mail;
          break;
        case MenuLicensing.ReportWorkflow:
        case MenuLicensing.ReportTask:
          flag = archive.workflow;
          break;
      }
    }
    if (!flag) {
      this.router.navigate(['unauthorized']);
    }
    return flag;
  }
}
