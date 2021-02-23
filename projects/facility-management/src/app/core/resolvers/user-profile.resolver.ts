import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { UserInfo, UserProfile } from '../model/core.model';
import { CommonHttpService } from '../services/common-http.service';
import { CoreDataService } from '../services/core-data.service';
import { switchMap, tap, map } from 'rxjs/operators';
import { UserInfoResolverService } from './user-info.resolver';


@Injectable()
export class UserProfileResolverService implements Resolve<UserProfile> {
    constructor(
        private commonHttpService: CommonHttpService,
        private coreDataService: CoreDataService,
        private userInfoResolver: UserInfoResolverService
    ) { }

    // tslint:disable-next-line: completed-docs
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<UserProfile> {
        const userProfile: UserProfile = this.coreDataService.userInfo ? this.coreDataService.userInfo.userDetail : null;
        if (userProfile) {
            return of(userProfile);
        }
        return this.userInfoResolver.resolve(route, state).pipe(
            map((userInfo: UserInfo) => userInfo.userDetail)
        );
    }
}
