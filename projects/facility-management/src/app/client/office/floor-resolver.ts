import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
// -------------------------------------------------- //
import { FloorResponseResult } from './office.model';
import { FloorService } from './floor.service';

@Injectable()
export class FloorResolver implements Resolve<FloorResponseResult> {

    constructor(
        private floorService: FloorService,
    ) {
    }

    /**
     * Resolve floor details
     * @param route Activated route
     * @param state Router state snapshot
     */
    public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
        Observable<FloorResponseResult> {
        return this.floorService.getFloorsWithName(route.paramMap.get('id'));
    }
}