/**
 * @author Enter Your Name Here.
 * @description Service layer class to communicate with the server.
 */
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
// ------------------------------------------------------------- //
import { BaseResponse, HttpService, Params, TableProperty } from 'common-libs';
// ------------------------------------------------------------- //
import { environment } from '../../environments/environment';
import { StatusMaster, UsersMaster } from '../core/model/common.model';
import { convertToRequestParams } from '../core/utility/utility';
import { CopyItUserAdapter } from '../shared/modules/copy-it-print-details/copyit-adapter/copyit-user-detail-adapter';
import { CopyItInfoAdapter } from '../shared/modules/copy-it-print-details/copyit-adapter/copyit.adapter';
import { CopyItPickAsset } from '../shared/modules/copy-it-print-details/models/copyit-info/copyit-asset';
import { CopyItInfo } from '../shared/modules/copy-it-print-details/models/copyit-info/copyit-info';
import { CopyItResponse } from '../shared/modules/copy-it-print-details/models/copyit-info/copyItResponse';
import { CopyItAssignee, CopyItUserList } from '../shared/modules/copyit-shared/copyit-shared.model';
import { Conversation, ConversationResponse } from '../shared/modules/custom-chat-box/models/custom-chat-box.model';
import {
  ConversationAdapter, CopyItAssignToAdapter, CopyItFilterRecordAdapter, CopyItListAdapter,
  CopyItStatusAdapter, CopyItStatusFilterAdapter
} from './copyit-adapter/copyit.adapter';
import { Client, CopyItAssignToRequest, CopyItStatusRequest, Status, UserDetails } from './copyit.model';
import { CopyItConversationRequest, CopyItConversationResponse } from './models/copyit-conversation.model';
import { CopyItFilterRecordRequest, CopyItList, CopyItListResult } from './models/copyit-list.model';

/**
 * CopyIt Service
 * @author
 */
@Injectable()
export class CopyitService {

  /** store base url */
  private baseUrl: string;
  /** API version */
  private readonly API_VERSION: string = environment.api_version;

  constructor(
    private http: HttpService,
    private copyItFilterAdapter: CopyItFilterRecordAdapter,
    private copyItListAdapter: CopyItListAdapter,
    private copyItInfoAdapter: CopyItInfoAdapter,
    private conversationAdapter: ConversationAdapter,
    private copyItStatusAdapter: CopyItStatusAdapter,
    private copyItAssignToAdapter: CopyItAssignToAdapter,
    private copyItUserAdapter: CopyItUserAdapter,
    private copyItStatusFilterAdapter: CopyItStatusFilterAdapter,
  ) {
    this.baseUrl = environment.baseUrl;
  }

  /**
   * Get Client List
   */
  public getClients(): Observable<Client[]> {
    const url: string = this.baseUrl + 'clients';
    return this.http.httpGetRequest<Client>(url, this.API_VERSION).pipe(
      map((response: any) => response.result)
    );
  }

  /** it will call the api for user list by client id */
  public getUsersListByClient(clientId: number, copyItId?: number): Observable<CopyItUserList[]> {
    let url: string = `${this.baseUrl}clients/${clientId}/users/list`;
    if (!!copyItId) { url = url + `?copyitId=${copyItId}` }
    return this.http.httpGetRequest<CopyItUserList[]>(url, this.API_VERSION).pipe(map((response: BaseResponse<CopyItUserList[]>) =>
      response.result.map((item: CopyItUserList) => this.copyItUserAdapter.toListResponse(item))));
  }

  /** it will call the api for assignee list by client id */
  public getAssigneeListByClient(clientId: number, copyitId: number): Observable<CopyItAssignee[]> {
    const url: string = `${this.baseUrl}clients/${clientId}/associates?copyitId=${copyitId}`;
    return this.http.httpGetRequest<CopyItAssignee[]>(url, this.API_VERSION).pipe(map((response: BaseResponse<CopyItAssignee[]>) =>
      response.result.map((item: CopyItAssignee) => new CopyItAssignee(item))));
  }
  /**
   * Get User Details
   * @param id 
   */
  public getUserDetails(id: number): Observable<UserDetails> {
    const url: string = `${this.baseUrl}users/${id}`;
    return this.http.httpGetRequest<BaseResponse<UserDetails>>(url, this.API_VERSION).pipe(
      map((response: BaseResponse<UserDetails>) => response.result)
    );
  }

  /** to-do */
  public addStepperFormData(copyItInfo: CopyItInfo): Observable<string> {
    const url: string = this.baseUrl + 'copyIts';
    const requestObject: FormData = this.copyItInfoAdapter.toRequest(copyItInfo);
    return this.http.httpPostRequest<BaseResponse<string>>(url, requestObject, this.API_VERSION).pipe(
      map((response: BaseResponse<string>) => response.result)
    );
  }

  /** Get list of users as requested by */
  public getAllRequestedBy(clientId?: number): Observable<UsersMaster[]> {
    let url: string = this.baseUrl + 'users/requestedby';
    if (clientId) { url = url + '?clientId=' + clientId }
    return this.http.httpGetRequest<UsersMaster[]>(url).pipe(
      map((response: BaseResponse<UsersMaster[]>) => response.result)
    );
  }

  /** Get list of users as assigned to */
  public getAllAssignedTo(clientId?: number): Observable<UsersMaster[]> {
    let url: string = `${this.baseUrl}users/assignedto`;
    if (clientId) { url = url + '?clientId=' + clientId }
    return this.http.httpGetRequest<UsersMaster[]>(url).pipe(
      map((response: BaseResponse<UsersMaster[]>) => response.result)
    );
  }
  /** Get all status for copyIt request */
  public getStatusForEdit(): Observable<Status[]> {
    const url: string = this.baseUrl + 'copyIts/statuses?isAll=true';
    return this.http.httpGetRequest<Status[]>(url).pipe(
      map((response: BaseResponse<Status[]>) => response.result)
    );
  }
  /** Get all status for copyIt request */
  public getStatusForList(clientId?: number): Observable<StatusMaster[]> {
    let url: string = this.baseUrl + 'copyIts/statuses?isAll=false';
    if (clientId) { url = url + '&clientId=' + clientId }
    return this.http.httpGetRequest<StatusMaster[]>(url).pipe(map((response: BaseResponse<StatusMaster[]>) => {
      return response.result.map((items: StatusMaster) => this.copyItStatusFilterAdapter.toResponse(items))
    }));
  }

  /** Custom method */
  public getCopyItList(tableProperty: TableProperty): Observable<CopyItListResult> {
    const url: string = this.baseUrl + 'copyIts/search';
    const filter: CopyItFilterRecordRequest = tableProperty.filter ? this.copyItFilterAdapter.toRequest(tableProperty.filter) : null;
    const params: Params = convertToRequestParams(tableProperty);
    return this.http.httpPostRequest<CopyItListResult>(url, filter, { params: { ...params } }).pipe(
      map((data: BaseResponse<any>) => {
        data.result.copyItList = data.result.copyItList.map((items: CopyItList) => this.copyItListAdapter.toResponse(items));
        return data.result;
      }));
  }

  /** get copyIt detail */
  public getCopyItDetail(copyItId: number): Observable<CopyItInfo> {
    const url: string = `${this.baseUrl}copyIts/${copyItId}`;
    return this.http.httpGetRequest<BaseResponse<CopyItResponse>>(url).pipe(
      map((response: BaseResponse<CopyItResponse>) => this.copyItInfoAdapter.toResponse(response.result))
    )
  }
  /** Custom method */
  public deleteCopyIt(id: number): Observable<void> {
    const url: string = `${this.baseUrl}copyIts/${id}`;
    return this.http.httpDeleteRequest<void>(url, this.API_VERSION);
  }

  /**
   * Update copyIt detail
   * @param id copyitId
   * @param copyItInfo CopyItInfo
   */
  public updateCopyItRequest(id: number, copyItInfo: CopyItInfo): Observable<void> {
    const formData: FormData = this.copyItInfoAdapter.toRequest(copyItInfo);
    return this.http.httpPutRequest(`${this.baseUrl}copyIts/${id}`, formData);
  }

  /** Get copyIt conversation */
  public getConversation(id: number): Observable<ConversationResponse> {
    const url: string = `${this.baseUrl}copyIts/${id}/conversations`;
    return this.http.httpGetRequest<BaseResponse<CopyItConversationResponse>>(url).pipe(
      map((response: BaseResponse<CopyItConversationResponse>) => this.conversationAdapter.toResponse(response.result))
    );
  }

  /** Send copyIt message */
  public sendMessage(message: Conversation): Observable<void> {
    const url: string = `${this.baseUrl}copyIts/conversations`;
    const request: CopyItConversationRequest = this.conversationAdapter.toRequest(message);
    return this.http.httpPostRequest(url, request);
  }
  /** update copyIt assignee */
  public updateCopyItAssignTo(copyItId: number, assignToid: number): Observable<void> {
    const url: string = `${this.baseUrl}copyIts/${copyItId}/assignto`;
    const request: CopyItAssignToRequest = this.copyItAssignToAdapter.toRequest(assignToid);
    return this.http.httpPutRequest(url, request);
  }
  /** update copyIT status */
  public updateCopyItStatus(copyItId: number, statusId: number): Observable<void> {
    const url: string = `${this.baseUrl}copyIts/${copyItId}/status`;
    const request: CopyItStatusRequest = this.copyItStatusAdapter.toRequest(statusId);
    return this.http.httpPutRequest(url, request);
  }
  /** get list of assets for the copyIt  */
  public getAssetList(clientId: number): Observable<CopyItPickAsset[]> {
    const url: string = `${this.baseUrl}clients/${clientId}/assets`;
    return this.http.httpGetRequest<BaseResponse<CopyItPickAsset[]>>(url).pipe(map((response: BaseResponse<CopyItPickAsset[]>) => response.result));
  }
  /** download exported copyit PDF */
  public exportCopyItToPDF(copyItId: number): Observable<Blob> {
    const url: string = `${this.baseUrl}copyIts/${copyItId}/pdf`;
    return this.http.httpGetRequest(url, { responseType: 'blob' });
  }

  /** download attached file */
  public downloadAttachedFile(path: string): Observable<Blob> {
    return this.http.httpGetRequest(path, { responseType: 'blob' });
  }
}

