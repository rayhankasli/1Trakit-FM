import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
// ------------------------------------------------- //
import { CopyitService } from './copyit.service';
import { CopyItInfo } from '../shared/modules/copy-it-print-details/models/copyit-info/copyit-info';

/**
 * CopyIt detail resolver
 */
@Injectable()
export class CopyItPrintResolver implements Resolve<CopyItInfo> {
    
    constructor(
        private copyItService: CopyitService
    ) { }

    /**
     * Resolve CopyIt details
     * @param route Activated route
     * @param state Router state snapshot
     */
    public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
        Observable<CopyItInfo> {
        return this.copyItService.getCopyItDetail(+route.paramMap.get('id'));
    }
}