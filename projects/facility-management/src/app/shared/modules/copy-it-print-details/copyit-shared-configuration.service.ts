/**
 * @author Enter Your Name Here.
 * @description Service layer class to communicate with the server.
 */
import { Injectable } from '@angular/core';
// ------------------------------------------------------------- //
import { BaseResponse, HttpService } from 'common-libs';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
// ------------------------------------------------------------- //
import { environment } from '../../../../environments/environment';
import { DefaultCopyItConfigurationAdapter } from '../copy-it-print-details/copyit-adapter/copyit.adapter';
import { CopyItUser, CopyItUserList } from '../copyit-shared/copyit-shared.model';
import { CopyItUserAdapter } from './copyit-adapter/copyit-user-detail-adapter';
import { CopyItConfiguration, DefaultCopyItConfiguration } from './models/copyit-info';

/**
 * CopyIt Service
 * @author
 */
@Injectable()
export class CopyItSharedConfigurationService {
  
  /** store base url */
  private baseUrl: string;
  /** API version */
  private readonly API_VERSION: string = environment.api_version;

  constructor(
    private http: HttpService,
    private defaultCopyItConfigAdapter: DefaultCopyItConfigurationAdapter,
    private copyItUserAdapter: CopyItUserAdapter
  ) {
    this.baseUrl = environment.baseUrl;
  }

  /**
   * Get Configurations
   * @param id 
   */
  public getConfigurations(id: number, copyItId?: number): Observable<CopyItConfiguration> {
    let url: string = `${this.baseUrl}clients/${id}/configurations`;
    if (copyItId) { url = url + '?copyItId=' + copyItId }
    return this.http.httpGetRequest<CopyItConfiguration>(url, this.API_VERSION).pipe(map((response: any) =>
      response.result));
  };

  /**
   * Get copy it configurations
   * @param id 
   */
  public getCopyItConfigurations(id: number, copyItId?: number): Observable<CopyItConfiguration> {
    return this.getConfigurations(id, copyItId);
  }
  /**
   * Get Default Configurations
   * @param id 
   */
  public getDefaultConfigurations(id: number): Observable<DefaultCopyItConfiguration> {
    const url: string = `${this.baseUrl}clients/${id}/defaultconfigurations`;
    return this.http.httpGetRequest<DefaultCopyItConfiguration>(url, this.API_VERSION).pipe(map((response: any) =>
      this.defaultCopyItConfigAdapter.toResponse(response.result)
    ));
  }

  /** it will call the api for user list by client id */
  public getUserList(clientId: number): Observable<CopyItUserList[]> {
    const url: string = `${this.baseUrl}clients/${clientId}/users/list`;
    return this.http.httpGetRequest<CopyItUserList[]>(url, this.API_VERSION).pipe(map((response: BaseResponse<CopyItUserList[]>) =>
      response.result.map((item: CopyItUserList) => this.copyItUserAdapter.toListResponse(item))));
  }

  /** it will call the api for user details */
  public getUserDetailByUserId(userId: number): Observable<CopyItUser> {
    const url: string = `${this.baseUrl}users/${userId}`;
    return this.http.httpGetRequest<CopyItUser>(url, this.API_VERSION).pipe(map((response: any) =>
      this.copyItUserAdapter.toResponse(response.result)));
  };
}

