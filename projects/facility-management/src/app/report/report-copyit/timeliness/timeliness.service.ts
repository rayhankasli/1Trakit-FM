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
import { TimelinessResponse } from './timeliness.model';
import { TimelinessAdapter } from './timeliness-adapter/timeliness.adapter';

@Injectable()
export class TimelinessService {

  /** store base url */
  private baseUrl: string;
  /** API version */
  private readonly API_VERSION: string = environment.api_version;

  constructor(
    private http: HttpService,
    private timelinessAdapter: TimelinessAdapter
  ) {
    this.baseUrl = environment.baseUrl;
  }

  /**
   * Get the Timeliness report list
   * @param clientId Get the client Id
   */
  public getTimeliness(clientId?: number): Observable<TimelinessResponse[]> {
    let url: string = `${this.baseUrl}reports/copyItTimeliness`;
    if (clientId) { url = url + `?clientId=${clientId}` }

    return this.http.httpGetRequest<TimelinessResponse[]>(url, this.API_VERSION).pipe(map((response: BaseResponse<TimelinessResponse[]>) =>
      response.result.map((item: TimelinessResponse) => this.timelinessAdapter.toResponse(item)
      )));
  }
}
