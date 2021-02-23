import { Observable, of } from 'rxjs';
import { tap, map } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';

import { ClientDetailsResponse, ClientDetails } from './client.model';
import { ClientService } from './client.service';
import { ClientDetailPreserveService } from './client-detail-preserve.service';
import { resolve } from 'url';

/**
 * Client detail resolver
 */
@Injectable()
export class ClientDetailResolver implements Resolve<ClientDetailsResponse> {
    constructor(
        private clientService: ClientService,
        private clientPreserver: ClientDetailPreserveService
    ) { }

    /**
     * Resolve client details
     * @param route Activated route
     * @param state Router state snapshot
     */
    public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
        Observable<ClientDetails> {
        return of(this.clientPreserver.clientDetails);
        // return this.clientPreserver.getClientDetail();
        // .pipe(
            // map((data) => {
            //     if (data) {
            //         return data;
            //     }
            // })
        // )
    }
}