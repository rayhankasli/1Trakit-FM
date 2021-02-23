/**
 * @author Rayhan Kasli.
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
import { VisitorLogAdapter, VisitorStatusAdapter, IdentificationProofAdapter, UploadPictureAdapter, VisitorFilterAdapter, EmployeeAdapter, } from './visitor-log-adapter/visitor-log.adapter';
import { VisitorLog, VisitorLogFilterRecord, IdentificationProof, VisitorStatus, UploadPicture, Employee, VisitorLogListResult, NewVisitorLog, VisitorLogResponse } from './visitor-log.model';

@Injectable()
export class VisitorLogService {
  /** store base url */
  private baseUrl: string;
  /** API version */
  private readonly API_VERSION: string = environment.api_version;

  constructor(
    private http: HttpService,
    private visitorLogAdapter: VisitorLogAdapter,
    private identificationProofAdapter: IdentificationProofAdapter,
    private visitorStatusAdapter: VisitorStatusAdapter,
    private uploadPictureAdapter: UploadPictureAdapter,
    private visitorFilterAdapter: VisitorFilterAdapter,
    private employeeAdapter: EmployeeAdapter,
  ) {
    this.baseUrl = environment.baseUrl;
  }

  /**
   * This method invokes the server's get endpoint to fetch the record as per the criteria mentioned in the tabelProperty parameters.
   * It converts the criteria to key and values expected by the API by invoking processParam method. It then invokes the server, on successful
   * response, it fetches the count from the header and invokes the adapter to convert server's response to what is expected by the client.
   * What happens when there is an error from the server ?
   * @param  tableProperty - Store the criteria based on which the records should be fetched from the server.
   * @returns - visitorLog[]
   */
  public getVisitorLogs(tableProperty: TableProperty<VisitorLogFilterRecord>): Observable<VisitorLogListResult> {
    const url: string = this.baseUrl + 'visitors/search';
    const body: VisitorLogFilterRecord = tableProperty.filter ? this.visitorFilterAdapter.toRequest(tableProperty.filter) : null;
    const params: Params = convertToRequestParams(tableProperty);
    return this.http.httpPostRequest<VisitorLogListResult>(url, body, { params: { ...params } }).pipe(
      map((data: BaseResponse<any>) => {
        data.result.visitorlogList = data.result.visitorlogList.map((item: VisitorLogResponse) => this.visitorLogAdapter.toResponse(item));
        return data.result;
      }));
  }

  /** This will save the record into database */
  public addVisitorLog(visitorLog: VisitorLog): Observable<void> {
    const url: string = this.baseUrl + 'visitors';
    let newVisitor: NewVisitorLog = this.visitorLogAdapter.toRequest(visitorLog);
    return this.http.httpPostRequest<void>(url, newVisitor, this.API_VERSION);
  }

  /** This will save the record by id into database */
  public updateVisitorLog(visitorLog: VisitorLog): Observable<void> {
    const url: string = this.baseUrl + 'visitors/' + visitorLog.visitorId;
    let updateVisitor: NewVisitorLog = this.visitorLogAdapter.toRequest(visitorLog);
    return this.http.httpPutRequest<void>(url, updateVisitor, this.API_VERSION);
  }

  /**
   * It invokes the API to delete the record mentioned in the path parameter.
   * @param id The id of the record that needs to be deleted from the server.
   */
  public deleteVisitorLog(visitorLogId: number): Observable<void> {
    const url: string = `${this.baseUrl}visitors/${visitorLogId}`;
    return this.http.httpDeleteRequest<void>(url);
  }

  /**
   * uploadPicture
   * @param uploadPicture 
   */
  public uploadPicture(uploadPicture: UploadPicture): Observable<void> {
    const url: string = `${this.baseUrl}visitors/${uploadPicture.visitorId}/uploads`;
    const uploadPictureData: UploadPicture = this.uploadPictureAdapter.toRequest(uploadPicture);
    return this.http.httpPutRequest<void>(url, uploadPictureData, this.API_VERSION);
  }

  /** downloadPicture */
  public downloadPicture(visitorLog: VisitorLog): Observable<Blob> {
    const url: string = `${environment.base_host_url}Visitors/${visitorLog.imageName}`;
    return this.http.httpGetRequest(url, { responseType: 'blob' });
  }

  /** getIdentificationProofs */
  public getIdentificationProofs(): Observable<IdentificationProof[]> {
    const url: string = this.baseUrl + 'identificationproofs';
    return this.http.httpGetRequest<IdentificationProof[]>(url).pipe(
      map((data: BaseResponse<IdentificationProof[]>) => data.result.map(
        (item: IdentificationProof) => this.identificationProofAdapter.toResponse(item)
      )));
  }

  /** getIdentificationProofs  */
  public getVisitorStatus(): Observable<VisitorStatus[]> {
    const url: string = this.baseUrl + 'visitorstatuses';
    return this.http.httpGetRequest<VisitorStatus[]>(url).pipe(
      map((data: BaseResponse<VisitorStatus[]>) => data.result.map(
        (item: VisitorStatus) => this.visitorStatusAdapter.toResponse(item)
      )));
  }
  /** getIdentificationProofs  */
  public getEmployeeList(clientId: number): Observable<Employee[]> {
    const url: string = `${this.baseUrl}clients/${clientId}/allusers`;
    return this.http.httpGetRequest<Employee[]>(url).pipe(
      map((data: BaseResponse<Employee[]>) => data.result.map(
        (item: Employee) => this.employeeAdapter.toResponse(item)
      )));
  }

  /** exportAsPdf */
  public exportAsExcel(tableProperty: TableProperty<VisitorLogFilterRecord>): Observable<Blob> {
    const url: string = `${this.baseUrl}visitors/export`;
    const body: VisitorLogFilterRecord = tableProperty.filter ? this.visitorFilterAdapter.toRequest(tableProperty.filter) : null;
    const params: Params = convertToRequestParams(tableProperty);
    return this.http.httpPostRequest<void>(url, body, { params: { ...params }, responseType: 'blob' })
  }

}

