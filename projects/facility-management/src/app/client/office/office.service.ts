/**
 * @author Ronak Patel.
 * @description Service layer class to communicate with the server.
 */

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
// ------------------------------------------- //
import { HttpService, TableProperty, Params, BaseResponse } from 'common-libs';
// ------------------------------------------- //
import { environment } from '../../../environments/environment';
import { convertToRequestParams } from '../../core/utility/utility';
import { OfficeAdapter } from './office-adapter/office.adapter';
import { Office, OfficeResult, State, City, ToggleStatus, } from './office.model';

@Injectable()
export class OfficeService {
  /** store base url */
  private baseUrl: string;

  constructor(
    private http: HttpService,
    private officeAdapter: OfficeAdapter
  ) {
    this.baseUrl = environment.baseUrl;
  }

  /*************************************************
   **************** Floors & Rooms *****************
   *************************************************/
  /** 
   * This method invokes the server's get endpoint to fetch the record as per the criteria mentioned in the table  Property parameters.
   * It converts the criteria to key and values expected by the API by invoking processParam method. It then invokes the server, on successful
   * response, it fetches the count from the header and invokes the adapter to convert server's response to what is expected by the client.
   * What happens when there is an error from the server ?
   * @param  tableProperty - Store the criteria based on which the records should be fetched from the server.
   * @returns - office[]
   */
  public getOffices(tableProperty: TableProperty, id: string): Observable<OfficeResult> {
    const url: string = this.baseUrl + 'clients/' + id + '/office/search';
    const params: Params<TableProperty> = convertToRequestParams(tableProperty);
    return this.http.httpPostRequest<OfficeResult>(
      url, tableProperty.filter, { params: { ...params } }).pipe(map((data: BaseResponse<OfficeResult>) => {
        data.result.offices = data.result.offices.map((items: Office) => {
          return this.officeAdapter.toResponse(items)
        });
        return data.result;
      }));
  }

  /** This will toggle  the record by id from database */
  public toggleOfficeStatus(status: ToggleStatus): Observable<BaseResponse<string>> {
    const url: string = this.baseUrl + 'offices/' + status.id + '/toggleStatus';
    return this.http.httpPutRequest<BaseResponse<string>>(url, { status: status.status });
  }

  /** This will save the record into database */
  public addOffice(id: string, office: Office): Observable<BaseResponse<string>> {
    const url: string = this.baseUrl + 'clients/' + id + '/office';
    return this.http.httpPostRequest<BaseResponse<string>>(url, this.officeAdapter.toRequest(office));
  }

  /** This will save the record by id into database */
  public updateOffice(id: string, office: Office): Observable<BaseResponse<string>> {
    const url: string = this.baseUrl + 'offices/' + office.officeId;
    return this.http.httpPutRequest<BaseResponse<string>>(url, this.officeAdapter.toRequest(office));
  }

  /**
   * It invokes the API to delete the record mentioned in the path parameter.
   * @param id The id of the record that needs to be deleted from the server.
   */
  public deleteOffice(id: string, office: Office): Observable<BaseResponse<string>> {
    const url: string = this.baseUrl + 'offices/' + office.officeId;
    return this.http.httpDeleteRequest<BaseResponse<string>>(url);
  }

  /**
   * getStates
   */
  public getStates(): Observable<State[]> {
    const url: string = this.baseUrl + 'states';
    return this.http.httpGetRequest<State[]>(url).pipe(map((data: BaseResponse<State[]>) => {
      return data.result;
    }));
  }

  /**
   * getCites
   * @param state 
   */
  public getCites(state: State): Observable<City[]> {
    const url: string = this.baseUrl + 'states/' + state.stateId + '/city';
    return this.http.httpGetRequest<State[]>(url).pipe(map((data: BaseResponse<City[]>) => {
      return data.result;
    }));
  }

}
