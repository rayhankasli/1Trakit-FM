import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
// ------------------------------------------------------ //
import { HttpService, BaseResponse } from 'common-libs';
// ------------------------------------------------------ //
import { environment } from '../../../../environments/environment';
import { FacilitiesHelpDesk } from './facilities-help-desk.model';
import { FacilitiesHelpDeskAdapter } from './facilities-help-desk-adapter/facilities-help-desk.adapter';

/** Service defined for server calls */
@Injectable()
export class FacilitiesHelpDeskService {

  /** store base url */
  private baseUrl: string;
  /** API version */
  private readonly API_VERSION: string = environment.api_version;

  constructor(
    private http: HttpService,
    private facilitiesHelpDeskAdapter: FacilitiesHelpDeskAdapter
  ) {
    this.baseUrl = environment.baseUrl;
  }

  /** FACILITIES HELP DESK LIST */
  public getFacilitiesHelpDeskList(clientId: number): Observable<FacilitiesHelpDesk[]> {
    let url: string = `${this.baseUrl}reports/bookItfacilityhelp`;
    if (clientId) { url = url + `?clientId=${clientId}` }
    return this.http.httpGetRequest<FacilitiesHelpDesk[]>(url, this.API_VERSION)
      .pipe(
        map((data: BaseResponse<FacilitiesHelpDesk[]>) => {
          return data.result.map((items: FacilitiesHelpDesk) =>
            this.facilitiesHelpDeskAdapter.toResponse(items)
          );
        })
      );
  }
}