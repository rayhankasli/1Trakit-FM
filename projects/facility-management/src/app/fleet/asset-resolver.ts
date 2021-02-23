import { ActivatedRouteSnapshot, RouterStateSnapshot, Resolve } from '@angular/router';
import { Asset } from './fleet.model';
import { Observable } from 'rxjs';
import { FleetService } from './fleet.service';
import { Injectable } from '@angular/core';

@Injectable()
export class AssetResolver implements Resolve<Asset> {
    constructor(
        private service: FleetService
    ) { }

    /**
     * Resolve CopyIt details
     * @param route Activated route
     * @param state Router state snapshot
     */
    public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
        Observable<Asset> {
        return this.service.getAssetById(route.paramMap.get('id'));
    }
}