/**
 * @author Rayhan Kasli.
 * @description Service layer class to communicate with the server.
 */
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
// ------------------------------------------------------------- //
import { environment } from '../../environments/environment';
import { Params, TableProperty, HttpService, BaseResponse } from 'common-libs';
import { SlotsAdapter, ReasonsAdapter, SlotFilterAdapter } from './mail-configurations-adapter/mail-configurations.adapter';
import { Slots, SlotsResponse, SlotsRequest, SlotFilterRequest, } from './mail-configurations.model';
import { Reasons, ReasonsResponse } from '../shared/components/reasons/reasons.model';
import { convertToRequestParams } from '../core/utility/utility';

/**
 * Injectable
 */
@Injectable()
export class MailConfigurationsService {
  /** store base url */
  private baseUrl: string;
  /** API version */
  private readonly API_VERSION: string = environment.api_version;

  constructor(
    private http: HttpService,
    private slotsAdapter: SlotsAdapter,
    private reasonsAdapter: ReasonsAdapter,
    private slotFilterAdapter: SlotFilterAdapter
  ) {
    this.baseUrl = environment.baseUrl;
  }

  /**
   * Gets test
   * @param tableProperty
   * @returns test
   */
  public getSlots(tableProperty: boolean, clientId: number): Observable<SlotsResponse> {

    const url: string = this.baseUrl + `clients/${clientId}/slots?isActive=` + tableProperty;
    return this.http.httpGetRequest<SlotsResponse>(url).pipe(map((response: BaseResponse<SlotsResponse>) =>
      this.slotsAdapter.toResponse(response.result[0])));
  }

  /** This will get the record by id from database */
  public getSlotsById(id: string): Observable<SlotsResponse> {
    const url: string = this.baseUrl + 'Slots/' + id;
    return this.http.httpGetRequest<SlotsResponse>(url).pipe(map((response: BaseResponse<SlotsResponse>) =>
      this.slotsAdapter.toResponse(response.result)));
  }

  /** This will save the record into database */
  public addSlots(slots: Slots, clientId: number): Observable<void> {
    const url: string = this.baseUrl + `clients/${clientId}/slots`;
    let addNewSlot: SlotsRequest = this.slotsAdapter.toRequest(slots);
    return this.http.httpPostRequest<void>(url, addNewSlot);
  }

  /** This will save the record by id into database */
  public updateSlots(id: number, slots: Slots, clientId: number): Observable<void> {
    const url: string = this.baseUrl + 'slots/' + id;
    let updateSlot: SlotsRequest = this.slotsAdapter.toUpdateRequest(slots, clientId);
    return this.http.httpPutRequest<void>(url, updateSlot);
  }

  /**
   * It invokes the API to delete the record mentioned in the path parameter.
   * @param id The id of the record that needs to be deleted from the server.
   */
  public deleteSlots(slots: Slots): Observable<void> {
    const url: string = this.baseUrl + 'slots/' + slots.slotId;
    return this.http.httpDeleteRequest<void>(url, this.API_VERSION);
  }

  /**
   * This method invokes the server's get endpoint to fetch the record as per the criteria mentioned in the tabelProperty parameters.
   * It converts the criteria to key and values expected by the API by invoking processParam method. It then invokes the server, on successful
   * response, it fetches the count from the header and invokes the adapter to convert server's response to what is expected by the client.
   * What happens when there is an error from the server ?
   * @param  tableProperty - Store the criteria based on which the records should be fetched from the server.
   * @returns - reasonsNotPicked[]
   */
  public getReasons(tableProperty: TableProperty, clientId: number): Observable<ReasonsResponse> {
    const url: string = this.baseUrl + `clients/${clientId}/reason`;
    const params: Params = convertToRequestParams(tableProperty);
    return this.http.httpGetRequest<ReasonsResponse>(url, { params: { ...params } }).pipe(map((response: BaseResponse<ReasonsResponse>) =>
      this.reasonsAdapter.toResponse(response.result)));
  }

  /** This will save the record into database */
  public addReasons(reasons: Reasons, clientId: number): Observable<void> {
    const url: string = this.baseUrl + `clients/${clientId}/reason`;
    let addReasons: Reasons = this.reasonsAdapter.toRequest(reasons)
    return this.http.httpPostRequest<void>(url, addReasons);
  }

  /** This will save the record by id into database */
  public updateReasons(id: number, reasons: Reasons, clientId: number): Observable<void> {
    const url: string = this.baseUrl + `clients/${clientId}/reason/` + id;
    let updatedReasons: Reasons = this.reasonsAdapter.toRequest(reasons)
    return this.http.httpPutRequest<void>(url, updatedReasons);
  }

  /**
   * It invokes the API to delete the record mentioned in the path parameter.
   * @param id The id of the record that needs to be deleted from the server.
   */
  public deleteReasons(reasons: Reasons, clientId: number): Observable<void> {
    const url: string = this.baseUrl + `clients/${clientId}/reason/` + reasons.reasonId;
    return this.http.httpDeleteRequest<void>(url);
  }

  /**
   * setSlotStatus method is responsible for updating the slot status(active,in-Active) 
   * @param slots passing the slot object as parameter
   */

  public setSlotStatus(slots: Slots): Observable<void> {
    const url: string = this.baseUrl + `slots/${slots.slotId}/togglestatus/`;
    const body: SlotFilterRequest = this.slotFilterAdapter.toRequest(slots);
    return this.http.httpPutRequest<void>(url, body);

  }

}

