import { ActivatedRouteSnapshot, RouterStateSnapshot, Resolve } from '@angular/router';
import { AssetMeterReadResult } from './fleet.model';
import { Observable, of } from 'rxjs';
import { FleetService } from './fleet.service';
import { Injectable } from '@angular/core';
import { TableProperty } from 'common-libs';

@Injectable()
export class MeterReadPrintResolver implements Resolve<AssetMeterReadResult> {
    constructor(
        private service: FleetService
    ) { }

    /**
     * Resolve CopyIt details
     * @param route Activated route
     * @param state Router state snapshot
     */
    public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
        Observable<AssetMeterReadResult> {
        return this.service.getMeterReads(new TableProperty(0, +route.paramMap.get('total')), +route.paramMap.get('id'));
    }
}