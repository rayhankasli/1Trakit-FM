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
import { TotalCopyJobsResponse } from './total-copy-jobs.model';
import { TotalCopyJobsAdapter } from './total-copy-jobs-adapter/total-copy-jobs.adapter';

@Injectable()
export class TotalCopyJobsService {

  /** store base url */
  private baseUrl: string;
  /** API version */
  private readonly API_VERSION: string = environment.api_version;

  constructor(
    private http: HttpService,
    private totalCopyJobsAdapter: TotalCopyJobsAdapter
  ) {
    this.baseUrl = environment.baseUrl;
  }

  /**
   *  Get the liost of total copy Jobs
   * @param clientId Get the client Id
   */
  public getTotalCopyJobs(clientId?: number): Observable<TotalCopyJobsResponse[]> {
    let url: string = `${this.baseUrl}reports/totalcopyJobs`;

    if (clientId) { url = url + `?clientId=${clientId}` }

    return this.http.httpGetRequest<TotalCopyJobsResponse[]>(url, this.API_VERSION).pipe(map((response: BaseResponse<TotalCopyJobsResponse[]>) =>
      response.result.map((item: TotalCopyJobsResponse) => this.totalCopyJobsAdapter.toResponse(item)
      )));
  }
}
