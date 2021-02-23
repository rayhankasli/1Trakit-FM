import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { ClientDetailPreserveService } from '../client-detail-preserve.service';
import { ClientDetails } from '../client.model';
import { CLIENT_GUARD_TYPE } from '../client.constant';



@Injectable()
export class ClientConfigGuard implements CanActivate, CanActivateChild {

  constructor(
    private router: Router,
    private clientPreserver: ClientDetailPreserveService
  ) { }

  /** canActivate client details */
  public canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.checkConfigEnabled(next.data);
  }
  /** canActivateChild client details */
  public canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.checkConfigEnabled(next.data);
  }

  /**
   * Check client
   * @param data route data
   */
  private checkConfigEnabled(data): Observable<boolean> {
    const config: CLIENT_GUARD_TYPE = data['config'];
    let result: Observable<boolean>;
    switch (config) {
      case CLIENT_GUARD_TYPE.office:
        result = this.clientPreserver.getClientDetail()
          .pipe(map((client: ClientDetails) => (client.mail || client.workflow || client.copyIt || client.bookIt)));
        break;
      case CLIENT_GUARD_TYPE.mailConfig:
        result = this.clientPreserver.getClientDetail()
          .pipe(map((client: ClientDetails) => client.mail));
        break;
      case CLIENT_GUARD_TYPE.copyItConfig:
        result = this.clientPreserver.getClientDetail()
          .pipe(map((client: ClientDetails) => client.copyIt));
        break;
      case CLIENT_GUARD_TYPE.workflowConfig:
        result = this.clientPreserver.getClientDetail()
          .pipe(map((client: ClientDetails) => client.workflow));
        break;
      case CLIENT_GUARD_TYPE.visitorLog: // not in use as visitor-log is stand alone module from sidebar
        result = this.clientPreserver.getClientDetail()
          .pipe(map((client: ClientDetails) => client.visitorLog));
        break;

      default:
        result = of(false);
        break;
    }
    return result.pipe(tap((flag) => {
      if (!flag) { this.router.navigate(['/unauthorized']); }
    }));
  }
}
