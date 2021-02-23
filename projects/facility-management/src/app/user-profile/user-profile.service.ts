/**
 * @author Ronak Patel.
 * @description Service layer class to communicate with the server.
 */
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
// ------------------------------------------------------------- //
import { HttpService } from 'common-libs';
// ------------------------------------------------------------- //
import { environment } from '../../environments/environment';
import { UserProfile } from '../core/model/core.model';
import { UserProfileAdapter } from './user-profile-adapter/user-profile-adapter';

@Injectable()
export class UserProfileService {
  /** store base url */
  private baseUrl: string;

  constructor(
    private http: HttpService,
    private userProfileAdapter: UserProfileAdapter,
  ) {
    this.baseUrl = environment.baseUrl;
  }

  /** This will save the record by id into database */
  public updateUserProfile(id: number, userProfile: UserProfile): Observable<UserProfile> {
    const url: string = this.baseUrl + 'users/' + id + '/information';
    const data: UserProfile = this.userProfileAdapter.toRequest(userProfile);
    return this.http.httpPutRequest<UserProfile>(url, data);
  }

}
