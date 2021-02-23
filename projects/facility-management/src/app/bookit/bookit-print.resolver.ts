import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { BookItService } from './bookit.service';
import { Observable } from 'rxjs';
import { BookItMaster, BookIt } from './models/bookit.model';

/**
 * CopyIt detail resolver
 */
@Injectable()
export class BookItPrintResolver implements Resolve<any> {
    /** observable for bookit master data */
    public bookitMasterData$: Observable<BookItMaster>;
    /** Hold get by Id data for bookIt */
    public bookItDataById$: Observable<BookIt>
    constructor(private bookItService: BookItService) { }

    /**
     * Resolve CopyIt details
     * @param route Activated route
     * @param state Router state snapshot
     */
    public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
        return this.bookItService.getBookItById(+route.parent.paramMap.get('id'));
    }
}