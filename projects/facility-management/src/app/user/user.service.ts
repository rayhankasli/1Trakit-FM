/**
 * @author Nitesh Sharma.
 * @description Service layer class to communicate with the server.
 */

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
// ------------------------------------------------------------- //
import { Params, TableProperty, HttpService, BaseResponse } from 'common-libs';
// ------------------------------------------------------------- //
import { environment } from '../../environments/environment';
import { convertToRequestParams } from '../core/utility/utility';
import { UserAdapter, UserFilterAdapter, BulkUploadUserAdapter } from './user-adapter/user.adapter';
import { User, UserFilterRecord, NewUser, BulkUploadUser, BulkUploadUserResponse, UserListResult } from './user.model';

@Injectable()
export class UserService {

  /** store base url */
  private baseUrl: string;
  /** API version */
  private readonly API_VERSION: string = environment.api_version;
  
  constructor(
    private userFilterAdapter: UserFilterAdapter,
    private bulkUploadUserAdapter: BulkUploadUserAdapter,
    private http: HttpService,
    private userAdapter: UserAdapter
  ) {
    this.baseUrl = environment.baseUrl;
  }

  /** This will save the record into database */
  public addUser(user: User): Observable<void> {
    const url: string = this.baseUrl + 'users';
    const body: NewUser = this.userAdapter.toRequest(user);
    return this.http.httpPostRequest<void>(url, body, this.API_VERSION);
  }

  /** This will save the record by id into database */
  public updateUser(user: User): Observable<void> {
    const url: string = this.baseUrl + 'users/' + user.userId;
    const body: NewUser = this.userAdapter.toUpdateRequest(user);
    return this.http.httpPutRequest<void>(url, body, this.API_VERSION);
  }

  /** This will toggle the user status in database into database */
  public toggleStatus(user: User): Observable<void> {
    // const url: string = this.baseUrl + 'users/togglestatus/' + user.userId;
    const url: string = `${this.baseUrl}users/${user.userId}/togglestatus`;
    const body = this.userAdapter.toggleStatus(user);
    return this.http.httpPutRequest<void>(url, body, this.API_VERSION);
  }

  /**
   * It invokes the API to delete the record mentioned in the path parameter.
   * @param id The id of the record that needs to be deleted from the server.
   */
  public deleteUser(user: User): Observable<void> {
    const url: string = this.baseUrl + 'users/' + user.userId;
    return this.http.httpDeleteRequest<void>(url);
  }

  /**
   * This method posts the filtered data to the server and returns the particular filtered data.
   * @param tableProperty - the data which needs to be filtered out.
   * @returns - User[]
   */
  public getUsers(tableProperty: TableProperty<UserFilterRecord>): Observable<UserListResult> {
    const url: string = this.baseUrl + 'users/search';
    const params: Params = convertToRequestParams(tableProperty);
    return this.http.httpPostRequest<UserListResult>(url, tableProperty.filter, { params: { ...params } }).pipe(
      map((data: BaseResponse<UserListResult>) => {
        data.result.userList = data.result.userList.map((item: User) => this.userAdapter.toResponse(item as any));
        return data.result;
      }));
  }

  /** Download sample file for bulk upload users */
  public downloadSampleFile(): Observable<Blob> {
    const url: string = `${environment.base_host_url}Document/sample-user-upload.xlsx`;
    return this.http.httpGetRequest(url, { responseType: 'blob' });
  }

  /** Bulk upload users for selected client */
  public bulkUploadUsers(data: BulkUploadUser): Observable<BulkUploadUserResponse> {
    const url: string = `${environment.baseUrl}clients/${data.clientId}/importusers`;
    const formData: FormData = this.bulkUploadUserAdapter.toRequest(data);
    return this.http.httpPostRequest<BulkUploadUserResponse>(url, formData).pipe(
      map((response: BaseResponse<BulkUploadUserResponse>) => this.bulkUploadUserAdapter.toResponse(response.result))
    );
  }
}

