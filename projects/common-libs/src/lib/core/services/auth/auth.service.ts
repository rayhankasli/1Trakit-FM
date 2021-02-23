/**
 * @author Hem Chudgar
 */
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { User } from 'oidc-client';
import { OidcFacade } from 'ng-oidc-client';
import { from } from 'rxjs/observable/from';

/**
 * AuthService
 */
@Injectable()
export class AuthService {

  /** currentUserData */
  private currentUserData: BehaviorSubject<User>;


  constructor(private oidcFacade: OidcFacade, ) {
    this.currentUserData = new BehaviorSubject<User>(null);
    this.oidcFacade.getUserManager().getUser()
  }

  /**
   * setUserData
   * @param user 
   */
  public setUserData(user: User): void {
    this.currentUserData.next(user);
  }

  /**
   * getUserData
   */
  public getUserData(): Observable<User> {
    return this.currentUserData.asObservable();
  }

  /**
   * isLoggedInObs
   */
  public isLoggedInObs(): Observable<boolean> {
    return from(this.oidcFacade.getUserManager().getUser().then((user: User) => {
      if (user) {
        return true;
      } else {
        return false;
      }
    }));
  }
}
