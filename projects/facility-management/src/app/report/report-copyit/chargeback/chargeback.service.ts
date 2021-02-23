/**
 * @author Shahbaz Shaikh.
 * @description Service Layer class to communicate with the server.
 */

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
// ------------------------------------------------------------- //
import { Params, TableProperty, HttpService, BaseResponse } from 'common-libs';
// --------------------------------------------------------- //
import { environment } from '../../../../environments/environment';
import { convertToRequestParams } from '../../../core/utility/utility';
import { ChargeBackListAdapter, AccountNumberAdapter, JobAdapter, ChargeBackFilterAdapter } from './chargeback-adapter/chargeback.adapter';
import { ChargeBack, Job, AccountNumber, FilterRecord } from './chargeback.model';

@Injectable()
export class ChargebackService {

  /** store base url */
  private baseUrl: string;
  /** API version */
  private readonly API_VERSION: string = environment.api_version;

  constructor(
    private http: HttpService,
    private chargeBackListAdapter: ChargeBackListAdapter,
    private chargeBackFilterAdapter: ChargeBackFilterAdapter,
    private accountNumberAdapter: AccountNumberAdapter,
    private jobAdapter: JobAdapter,
  ) {
    this.baseUrl = environment.baseUrl;
  }

  /**
   * Get the list of Account Number
   * @param clientId Get the client Id
   */
  public getAccountNumber(clientId?: number): Observable<AccountNumber[]> {

    let url: string = `${this.baseUrl}reports/copyit/accounts`;

    if (clientId) { url = url + `?clientId=${clientId}` }

    return this.http.httpGetRequest<AccountNumber[]>(url, this.API_VERSION).pipe(map((response: BaseResponse<AccountNumber[]>) =>
      response.result.map((item: AccountNumber) => this.accountNumberAdapter.toResponse(item)
      )));
  }


  /**
   * Get the list of Job
   * @param clientId Get the client Id
   */
  public getJob(clientId?: number): Observable<Job[]> {

    let url: string = `${this.baseUrl}reports/copyit/jobdetail`;

    if (clientId) { url = url + `?clientId=${clientId}` }

    return this.http.httpGetRequest<Job[]>(url, this.API_VERSION).pipe(map((response: BaseResponse<Job[]>) =>
      response.result.map((item: Job) => this.jobAdapter.toResponse(item)
      )));
  }

  /**
   * Get the list of Charge Back
   * @param tableProperty  Get the table property
   */
  public getChargeBackList(tableProperty: TableProperty): Observable<ChargeBack> {

    let url: string = `${this.baseUrl}reports/copyItChargeback`;
    const clientId: number = tableProperty.filter.clientId;

    if (clientId) { url = url + `?clientId=${clientId}` }

    const params: Params = convertToRequestParams(tableProperty);
    const body: FilterRecord = this.chargeBackFilterAdapter.toRequest(tableProperty.filter);

    return this.http.httpPostRequest<ChargeBack>(
      url, body, { params: { ...params } }, this.API_VERSION).pipe(map((data: BaseResponse<ChargeBack>) => {
        return this.chargeBackListAdapter.toResponse(data.result);
      }));
  }


  /**
   * Get dowanload Excel file from server
   * @param tableProperty Get the table property
   */
  public exportAsExcel(tableProperty: TableProperty): Observable<Blob> {

    let url: string = `${this.baseUrl}reports/copyItChargeback/excel`;

    const clientId: number = tableProperty.filter.clientId;
    const body: FilterRecord = this.chargeBackFilterAdapter.toRequest(tableProperty.filter);

    if (clientId) { url = url + `?clientId=${clientId}` }

    return this.http.httpPostRequest<void>(url, body, { responseType: 'blob' }, this.API_VERSION);
  }

}

