/**
 * @author Shahbaz Shaikh.
 * @description Service Layer class to communicate with the server.
 */

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
// ------------------------------------------------------ //
import { HttpService, BaseResponse } from 'common-libs';
// ------------------------------------------------------ //
import { environment } from '../../../../environments/environment';
import { CopyIMPScanResponse } from './copy-center-imp-scan.model';
import { CopyCenterImpScanAdapter } from './copy-center-imp-scan-adapter/copy-center-imp-scan.adapter';

@Injectable()
export class CopyCenterImpScanService {

  /** store base url */
  private baseUrl: string;
  /** API version */
  private readonly API_VERSION: string = environment.api_version;

  constructor(
    private http: HttpService,
    private copyCenterImpScanAdapter: CopyCenterImpScanAdapter
  ) {
    this.baseUrl = environment.baseUrl;
  }

  /**
   *  Get Copy Center IMP Scan list
   *  @param reportId Get the report type ID
   *  @param clientId Get the client Id
   */
  public getCopyCenterIMPScan(reportId: number, clientId?: number): Observable<CopyIMPScanResponse[]> {
    let url: string = `${this.baseUrl}reports/copyItImpReport/${reportId}`;
    
    if (clientId) { url = url + `?clientId=${clientId}` }

    return this.http.httpGetRequest<CopyIMPScanResponse[]>(url, this.API_VERSION).pipe(
      map((response: BaseResponse<CopyIMPScanResponse[]>) =>
        response.result.map((item: CopyIMPScanResponse) => this.copyCenterImpScanAdapter.toResponse(item)
        )));
  }

}
