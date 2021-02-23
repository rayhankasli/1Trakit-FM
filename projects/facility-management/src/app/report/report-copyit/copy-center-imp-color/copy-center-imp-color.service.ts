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
import { CopyIMPColorResponse } from './copy-center-imp-color.model';
import { CopyCenterImpColorAdapter } from './copy-center-imp-color-adapter/copy-center-imp-color.adapter';

@Injectable()
export class CopyCenterImpColorService {

  /** store base url */
  private baseUrl: string;
  /** API version */
  private readonly API_VERSION: string = environment.api_version;

  constructor(
    private http: HttpService,
    private copyCenterImpColorAdapter: CopyCenterImpColorAdapter
  ) {
    this.baseUrl = environment.baseUrl;
  }

  /**
   *  Get Copy Center IMP Color list
   *  @param reportId Get the report type ID
   *  @param clientId Get the client Id
   */
  public getCopyCenterIMPColor(reportId: number, clientId?: number): Observable<CopyIMPColorResponse[]> {
    let url: string = `${this.baseUrl}reports/copyItImpReport/${reportId}`;

    if (clientId) { url = url + `?clientId=${clientId}` }

    return this.http.httpGetRequest<CopyIMPColorResponse[]>(url, this.API_VERSION).pipe(
      map((response: BaseResponse<CopyIMPColorResponse[]>) =>
        response.result.map((item: CopyIMPColorResponse) => this.copyCenterImpColorAdapter.toResponse(item)
        )));
  }

}
