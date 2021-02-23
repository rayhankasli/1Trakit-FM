/**
 * @author Enter Your Name Here.
 * @description Service layer class to communicate with the server.
 */
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
// ------------------------------------------------------------- //
import { TableProperty, HttpService, BaseResponse, Params } from 'common-libs';
// ------------------------------------------------------------- //
import { environment } from '../../environments/environment';
import { BookItAdapter, ConversationAdapter, BookItStatusFilterAdapter, BookItFilterRecordAdapter } from './bookit-adapter/bookit.adapter';
import {
  BookIt, Users, Status, RecurringMaster,
  BookItResponse, BookItRequest, BookItAssignee,
  ClientAccountMaster, BookItResponseModel, BookItFilterRecordRequest, BookItListResult
} from './models/bookit.model';
import { convertToRequestParams } from '../core/utility/utility';
import { Conversation, ConversationResponse } from '../shared/modules/custom-chat-box/models/custom-chat-box.model';
import { StatusMaster, UsersMaster } from '../core/model/common.model';
import { BookItConversationRequest, BookItConversationResponse } from './models/bookIt-conversation.model';
import { Amenity, BookItRoomSearchParams, BookItRoomSearchParamsRequest, Catering, Facility, RoomLayoutMaster, RoomMaster } from './models/bookIt-rooms.model';

@Injectable()
export class BookItService {

  /** store base url */
  private baseUrl: string;

  constructor(
    private http: HttpService,
    private bookItAdapter: BookItAdapter,
    private conversationAdapter: ConversationAdapter,
    private bookItStatusFilterAdapter: BookItStatusFilterAdapter,
    private bookItFilterRecordAdapter: BookItFilterRecordAdapter
  ) {
    this.baseUrl = environment.baseUrl;
  }

  /**
   * This method invokes the server's get endpoint to fetch the record as per the criteria mentioned in the tabelProperty parameters.
   * It converts the criteria to key and values expected by the API by invoking processParam method. It then invokes the server, on successful
   * response, it fetches the count from the header and invokes the adapter to convert server's response to what is expected by the client.
   * What happens when there is an error from the server ?
   * @param  tableProperty - Store the criteria based on which the records should be fetched from the server.
   * @returns - bookIt[]
   */
  public getBookItList(tableProperty: TableProperty): Observable<BookItListResult> {
    const url: string = this.baseUrl + 'bookIts/search';
    const filter: BookItFilterRecordRequest = tableProperty.filter ? this.bookItFilterRecordAdapter.toRequest(tableProperty.filter) : {};
    const params: Params<TableProperty> = convertToRequestParams(tableProperty);
    return this.http.httpPostRequest<BookItListResult>(url, filter, { params: { ...params } }).pipe(
      map((data: BaseResponse<any>) => {
        data.result.bookItList = data.result.bookItList.map((item: BookItResponseModel) => this.bookItAdapter.toResponse(item));
        return data.result;
      }));
  }

  /** Send bookIt message */
  public sendMessage(message: Conversation): Observable<void> {
    const url: string = `${this.baseUrl}bookIts/chats`;
    const request: BookItConversationRequest = this.conversationAdapter.toRequest(message);
    return this.http.httpPostRequest(url, request);
  }

  /** Get bookIt conversation */
  public getConversation(id: number): Observable<ConversationResponse> {
    const url: string = `${this.baseUrl}bookIts/${id}/chats`;
    return this.http.httpGetRequest<BaseResponse<BookItConversationResponse>>(url).pipe(
      map((response: BaseResponse<BookItConversationResponse>) => this.conversationAdapter.toResponse(response.result))
    );
  }

  /** Get list of users as requested by */
  public getAllRequestedBy(clientId?: number): Observable<Users[]> {
    let url: string = this.baseUrl + 'users/bookIt-requestedby';
    if (clientId) { url = url + '?clientId=' + clientId; }
    return this.http.httpGetRequest<Users[]>(url).pipe(map((response: BaseResponse<UsersMaster[]>) =>
      response.result
    ));
  }
  /** Get list of users as assigned to */
  public getAllAssignedTo(clientId?: number): Observable<Users[]> {
    // const url: string = this.baseUrl + 'users/assignedto';
    let url: string = `${this.baseUrl}users/bookIt-assignedto`;
    if (clientId) { url = url + '?clientId=' + clientId; }
    return this.http.httpGetRequest<Users[]>(url).pipe(map((response: BaseResponse<UsersMaster[]>) =>
      response.result
    ));;
  }
  /** Get all status for bookIt request */
  public getStatuses(clientId?: number): Observable<Status[]> {
    let url: string = this.baseUrl + 'bookIts/statuses?isAll=false';
    if (clientId) { url = url + '&clientId=' + clientId }
    return this.http.httpGetRequest<Users[]>(url).pipe(map((response: BaseResponse<StatusMaster[]>) => {
      return response.result.map((items: StatusMaster) => this.bookItStatusFilterAdapter.toResponse(items))
    }));
  }

  /** This will get the record by id from database */
  public getBookItById(id: number): Observable<BookIt> {
    const url: string = this.baseUrl + 'bookIts/' + id;
    return this.http.httpGetRequest<BookIt>(url).pipe(
      map((response: BaseResponse<BookItResponse>) => this.bookItAdapter.toGetByIdResponse(response.result)));
  }

  /** This will save the record into database */
  public addBookIt(bookIt: BookIt): Observable<void> {
    const url: string = this.baseUrl + 'bookIts';
    const requestObj: FormData = this.bookItAdapter.toRequest(bookIt, true);
    return this.http.httpPostRequest<void>(url, requestObj);
  }

  /** This will save the record by id into database */
  public updateBookIt(id: string, bookIt: BookIt): Observable<void> {
    const url: string = this.baseUrl + 'bookIts/' + id;
    const requestObj: FormData = this.bookItAdapter.toRequest(bookIt, false);
    return this.http.httpPutRequest<void>(url, requestObj);
  }

  /**
   * It invokes the API to delete the record mentioned in the path parameter.
   * @param id The id of the record that needs to be deleted from the server.
   */
  public deleteBookIt(bookIt: BookIt): Observable<void> {
    const url: string = this.baseUrl + 'bookIts/' + bookIt.bookItId;
    return this.http.httpDeleteRequest<void>(url);
  }

  /**
   *  it will call the server for facility list
   */
  public getFacilities(): Observable<Facility[]> {
    const url: string = this.baseUrl + 'facilities/';
    return this.http.httpGetRequest<Facility[]>(url).pipe(
      map((data: BaseResponse<Facility[]>) => data.result)
    );
  }

  /**
   *  it will call the server for amenity list
   */
  public getAmenities(): Observable<Amenity[]> {
    const url: string = this.baseUrl + 'amenities';
    return this.http.httpGetRequest<Amenity[]>(url).pipe(
      map((data: BaseResponse<Amenity[]>) => data.result)
    );
  }

  /**
   *  it will call the server for amenity list
   */
  public getCaterings(): Observable<Catering[]> {
    const url: string = this.baseUrl + 'caterings';
    return this.http.httpGetRequest<Catering[]>(url).pipe(
      map((data: BaseResponse<Catering[]>) => data.result)
    );
  }

  /** it will call the server for room list */
  public getRooms(searchParams: BookItRoomSearchParams, bookItId: number): Observable<RoomMaster[]> {
    const requestObj: BookItRoomSearchParamsRequest = this.bookItAdapter.toRoomSearchRequest(searchParams);
    let url: string = `${this.baseUrl}rooms/search`;
    if (bookItId) { url = url + '?bookItId=' + bookItId }
    return this.http.httpPostRequest<RoomMaster[]>(url, requestObj).pipe(
      map((data: BaseResponse<RoomMaster[]>) => data.result)
    );
  }

  /** it will call the server for room layout list */
  public getRoomLayouts({ roomId, noOfPeople }: any): Observable<RoomLayoutMaster[]> {
    const url: string = `${this.baseUrl}/rooms/${roomId}/roomLayouts?noOfPeople=${Number(noOfPeople)}`;
    return this.http.httpGetRequest<RoomLayoutMaster[]>(url).pipe(
      map((data: BaseResponse<RoomLayoutMaster[]>) => data.result.map((response: RoomLayoutMaster) =>
        this.bookItAdapter.toRoomLayouts(response))));
  }

  /** it will call the server for account number list */
  public getAccountNumber(clientId: number): Observable<ClientAccountMaster[]> {
    const url: string = `${this.baseUrl}clients/${clientId}/account`;
    return this.http.httpGetRequest<ClientAccountMaster[]>(url).pipe(
      map((data: BaseResponse<ClientAccountMaster[]>) => data.result)
    );
  }

  /** it will call the server for recurring list */
  public getRecurring(): Observable<RecurringMaster[]> {
    const url: string = this.baseUrl + 'recurrings';
    return this.http.httpGetRequest<RecurringMaster[]>(url).pipe(
      map((data: BaseResponse<RecurringMaster[]>) => data.result)
    );
  }

  /** download attached file */
  public downloadAttachedFile(path: string): Observable<Blob> {
    return this.http.httpGetRequest(path, { responseType: 'blob' });
  }

  /** it will call the api for assignee list by client id */
  public getAssigneeListByClient(clientId: number, bookItId: number): Observable<BookItAssignee[]> {
    const url: string = `${this.baseUrl}clients/${clientId}/bookIt-associates?bookItId=${bookItId}`;
    return this.http.httpGetRequest<BookItAssignee[]>(url).pipe(map((response: BaseResponse<BookItAssignee[]>) =>
      response.result.map((item: BookItAssignee) => new BookItAssignee(item))));
  }

  /** Get all status for bookIt request */
  public getStatusForEdit(): Observable<Status[]> {
    const url: string = this.baseUrl + 'bookIts/statuses?isAll=true';
    return this.http.httpGetRequest<Status[]>(url).pipe(map((response: BaseResponse<Status[]>) =>
      response.result.map((item: StatusMaster) => new Status(item.statusId, item.status))
    ));
  }

  /** update bookIt status */
  public updateBookItStatus(bookItId: number, statusId: number): Observable<void> {
    const url: string = `${this.baseUrl}bookIts/${bookItId}/status`;
    return this.http.httpPutRequest(url, { statusId });
  }

  /** update bookIt assignee */
  public updateBookItAssignTo(bookitId: number, assignToId: number): Observable<void> {
    const url: string = `${this.baseUrl}bookIts/${bookitId}/assignto`;
    return this.http.httpPutRequest(url, { userId: assignToId });
  }

  /** download exported bookIt PDF */
  public exportBookItToPDF(bookItId: number): Observable<Blob> {
    const url: string = `${this.baseUrl}bookIts/${bookItId}/pdf`;
    return this.http.httpGetRequest(url, { responseType: 'blob' });
  }
}
