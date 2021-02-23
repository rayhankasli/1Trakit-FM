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
import { CopyIMPBAndWResponse } from './copy-center-imp-b-and-w.model';
import { CopyCenterImpBAndWAdapter } from './copy-center-imp-b-and-w-adapter/copy-center-imp-b-and-w.adapter';

@Injectable()
export class CopyCenterImpBAndWService {

  /** store base url */
  private baseUrl: string;
  /** API version */
  private readonly API_VERSION: string = environment.api_version;

  constructor(
    private http: HttpService,
    private copyCenterImpBAndWAdapter: CopyCenterImpBAndWAdapter
  ) {
    this.baseUrl = environment.baseUrl;
  }

  /**
   *  Get Copy Center IMP Black and White list
   *  @param reportId Get the report type ID
   *  @param clientId Get the client Id
   */
  public getCopyCenterIMPBlackAndWhite(reportId: number, clientId?: number): Observable<CopyIMPBAndWResponse[]> {
    let url: string = `${this.baseUrl}reports/copyItImpReport/${reportId}`;

    if (clientId) { url = url + `?clientId=${clientId}` }

    return this.http.httpGetRequest<CopyIMPBAndWResponse[]>(url, this.API_VERSION).pipe(
      map((response: BaseResponse<CopyIMPBAndWResponse[]>) =>
        response.result.map((item: CopyIMPBAndWResponse) => this.copyCenterImpBAndWAdapter.toResponse(item)
        )));
  }

}
