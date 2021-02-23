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
import { TotalCopyVolumeResponse } from './total-copy-volume.model';
import { TotalCopyVolumeAdapter } from './total-copy-volume-adapter/total-copy-volume.adapter';

@Injectable()
export class TotalCopyVolumeService {

  /** store base url */
  private baseUrl: string;
  /** API version */
  private readonly API_VERSION: string = environment.api_version;

  constructor(
    private http: HttpService,
    private totalCopyVolumeAdapter: TotalCopyVolumeAdapter
  ) {
    this.baseUrl = environment.baseUrl;
  }

  /**
   *  Get the list of total copy Volume
   * @param clientId Get the client Id
   */
  public getTotalCopyVolume(clientId?: number): Observable<TotalCopyVolumeResponse> {
    let url: string = `${this.baseUrl}reports/totalcopyVolume`;

    if (clientId) { url = url + `?clientId=${clientId}` }

    return this.http.httpGetRequest<TotalCopyVolumeResponse>(url, this.API_VERSION).pipe(map((response: BaseResponse<TotalCopyVolumeResponse>) =>
      this.totalCopyVolumeAdapter.toResponse(response.result)
    ));
  }

}
