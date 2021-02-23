/**
 * @author Shahbaz Shaikh.
 * @description Service Layer class to communicate with the server.
 */

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
// ------------------------------------------------------ //
import { Params, TableProperty, HttpService, BaseResponse } from 'common-libs';
// ------------------------------------------------------ //
import { environment } from '../../../../environments/environment';
import { convertToRequestParams } from '../../../core/utility/utility';
import { CostRecoveryAdapter, CostRecoveryFilterAdapter } from './cost-recovery-adapter/cost-recovery.adapter';
import { CostRecovery, ReportPeriod } from './cost-recovery.model';

@Injectable()
export class CostRecoveryService {

  /** store base url */
  private baseUrl: string;
  /** API version */
  private readonly API_VERSION: string = environment.api_version;

  constructor(
    private http: HttpService,
    private costRecoveryAdapter: CostRecoveryAdapter,
    private costRecoveryFilterAdapter: CostRecoveryFilterAdapter
  ) {
    this.baseUrl = environment.baseUrl;
  }

  /**
   * Get the Cost-Recovery list
   * @param tableProperty  Get the table property
   */
  public getCostRecovery(tableProperty: TableProperty): Observable<CostRecovery> {

    let url: string = `${this.baseUrl}reports/copyItCostrecovery`;
    const clientId: number = tableProperty.filter.clientId;
    const params: Params = convertToRequestParams(tableProperty);
    const dateOfPeriod: ReportPeriod = this.costRecoveryFilterAdapter.toRequest(tableProperty.filter);

    if (clientId) { url = url + `?clientId=${clientId}`; }

    return this.http.httpGetRequest<CostRecovery>(url, { params: { ...params, ...dateOfPeriod } }, this.API_VERSION).pipe(
      map((response: BaseResponse<CostRecovery>) =>
        this.costRecoveryAdapter.toResponse(response.result)
      ));
  }

  /**
   * Get dowanload Excel file from server
   * @param tableProperty Get the table property
   */
  public exportAsExcel(tableProperty: TableProperty): Observable<Blob> {

    let url: string = `${this.baseUrl}reports/copyItCostrecovery/excel`;
    const clientId: number = tableProperty.filter.clientId;
    const dateOfPeriod: ReportPeriod = this.costRecoveryFilterAdapter.toRequest(tableProperty.filter);

    if (clientId) { url = url + `?clientId=${clientId}`; }

    return this.http.httpGetRequest<void>(url, { params: { ...dateOfPeriod }, responseType: 'blob' }, this.API_VERSION);
  }

}
