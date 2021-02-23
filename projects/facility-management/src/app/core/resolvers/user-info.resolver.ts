import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { UserInfo, UserProfile } from '../model/core.model';
import { CommonHttpService } from '../services/common-http.service';
import { mergeMap, concatMap, switchMap } from 'rxjs/operators';
import { CoreDataService } from '../services/core-data.service';


@Injectable()
export class UserInfoResolverService implements Resolve<UserInfo> {
    constructor(
        private coreDataService: CoreDataService,
        private commonHttpService: CommonHttpService
    ) { }

    // tslint:disable-next-line: completed-docs
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<UserInfo> {
        if (this.coreDataService.userInfo) {
            return of(this.coreDataService.userInfo);
        }
        return this.commonHttpService.loadLoggedInUserInfo();
    }
}
