import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthPolicyService } from 'auth-policy';
import { Archive, ProductLicense } from 'common-libs';
import { Observable, of } from 'rxjs';
import { PolicyRoles, Permission } from '../../enums/role-permissions.enum';
import { CoreDataService } from '../../services/core-data.service';

@Injectable()
export class ActivateDashboardGuard implements CanActivate {
  constructor(
    private authPolicyService: AuthPolicyService,
    private coreDataService: CoreDataService,
    private router: Router
  ) { }
  /** 
   * check if any dashboard widget is enabled
   * Navigate to visitor log if no dashboard widget available and visitor-log is licensed
   */
  public canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return (next.data && next.data.isArchived) ? this.checkArchive() : this.checkLicensing();
  }

  /** check available default route for licensing */
  private checkLicensing(): Observable<boolean> {
    const clientLicensed: ProductLicense = this.coreDataService.clientDetail().productLicense;
    const allowedRole: boolean = this.authPolicyService.isInRole(PolicyRoles.superUser);
    if (allowedRole || clientLicensed.copyIt || clientLicensed.bookIt) {
      return of(true);
    } else if (this.authPolicyService.hasPermission(Permission.VisitorLog.viewVisitor) && clientLicensed.visitorLog) {
      this.router.navigate(['visitor-log']);
    } else if (this.authPolicyService.hasPermission(Permission.Packages.webView) && clientLicensed.mail) {
      this.router.navigate(['packages']);
    } else if (this.authPolicyService.hasPermission(Permission.ReportsWorkflow.reportWorkflowView) && clientLicensed.workflow) {
      this.router.navigate(['report', 'workflow']);
    } else {
      this.router.navigate(['no-license']);
    }
  }

  /** check available default route for licensing */
  private checkArchive(): Observable<boolean> {
    if (this.authPolicyService.isInRole(PolicyRoles.superUser) || this.authPolicyService.isInRole(PolicyRoles.requestor)) {
      this.router.navigate(['unauthorized']);
      return;
    }
    const clientArchived: Archive = this.coreDataService.clientDetail().archive;
    const allowedRole: boolean = this.authPolicyService.isInRole(PolicyRoles.manager) || this.authPolicyService.isInRole(PolicyRoles.associate);
    if (allowedRole && (clientArchived.copyIt || clientArchived.bookIt)) {
      return of(true);
    } else if (this.authPolicyService.hasPermission(Permission.VisitorLog.viewVisitor) && clientArchived.visitorLog) {
      this.router.navigate(['archive', 'visitor-log']);
    } else if (this.authPolicyService.hasPermission(Permission.Packages.webView) && clientArchived.mail) {
      this.router.navigate(['archive', 'packages']);
    } else if (this.authPolicyService.hasPermission(Permission.ReportsWorkflow.reportWorkflowView) && clientArchived.workflow) {
      this.router.navigate(['archive', 'report', 'workflow']);
    } else {
      this.router.navigate(['no-license']);
    }
  }

}
