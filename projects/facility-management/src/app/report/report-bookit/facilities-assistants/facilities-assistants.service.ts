import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators/map';
// ------------------------------------------------------ //
import { HttpService, BaseResponse } from 'common-libs';
// ------------------------------------------------------ //
import { environment } from '../../../../environments/environment';
import { FacilitiesAssistantsAdapter } from './facilities-assistants-adapter/facilities-assistants.adapter';
import { FacilitiesAssistants } from './facilities-assistants.model';

/** Service defined for server calls */
@Injectable()
export class FacilitiesAssistantsService {

  /** store base url */
  private baseUrl: string;
  /** API version */
  private readonly API_VERSION: string = environment.api_version;

  constructor(
    private http: HttpService,
    private facilitiesAssistantsAdapter: FacilitiesAssistantsAdapter
  ) {
    this.baseUrl = environment.baseUrl;
  }

  /** FACILITIES ASSISTANTS LIST */
  public getFacilitiesAssistants(clientId:number): Observable<FacilitiesAssistants[]> {
    let url: string = `${this.baseUrl}reports/bookItfacilityassitance`;
    if (clientId) { url = url + `?clientId=${clientId}` }
    return this.http.httpGetRequest<FacilitiesAssistants[]>(url, this.API_VERSION)
      .pipe(
        map((data: BaseResponse<FacilitiesAssistants[]>) => {
          return data.result.map((items: FacilitiesAssistants) =>
            this.facilitiesAssistantsAdapter.toResponse(items)
          );
        })
      );
  }
}
