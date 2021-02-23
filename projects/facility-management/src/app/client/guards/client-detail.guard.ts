import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, CanLoad, Route, UrlSegment, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { ClientDetailPreserveService } from '../client-detail-preserve.service';
import { ClientService } from '../client.service';
import { ClientDetails } from '../client.model';

@Injectable()
export class ClientDetailGuard implements CanActivate {

  constructor(
    private clientService: ClientService,
    private clientPreserver: ClientDetailPreserveService
  ) { }

  /**
   * Check client details loaded 
   * if not, load from http service
   * @param next Activated route snapshot
   * @param state Router state
   */
  public canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.clientService.getClientById(next.paramMap.get('id')).pipe(
      tap((data: ClientDetails) => this.clientPreserver.setClientDetail(data)),
      map((data: ClientDetails) => data ? true : false));
  }
}
