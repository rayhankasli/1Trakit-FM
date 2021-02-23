import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators/map';
// ------------------------------------------------------ //
import { HttpService, BaseResponse } from 'common-libs';
// ------------------------------------------------------ //
import { environment } from '../../../environments/environment';
import { FleetList } from './report-fleet.model';
import { ReportFleetListAdapter } from './report-fleet-adapter/report-fleet.adapter';
import { FilterObject, FleetDetailList, IdObject, YearList } from '../report-model';
import { ReportFleetDetailListAdapter, ReportYearListAdapter } from '../../core/services/adapter/reports.adapter';

/** Service defin for get and post data of fleet report module */
@Injectable()
export class ReportFleetService {

  /** store base url */
  private baseUrl: string;
  /** API version */
  private readonly API_VERSION: string = environment.api_version;

  constructor(
    private http: HttpService,
    private reportYearListAdapter: ReportYearListAdapter,
    private reportFleetDetailListAdapter: ReportFleetDetailListAdapter,
    private reportFleetListAdapter: ReportFleetListAdapter,
    ) {
    this.baseUrl = environment.baseUrl;
  }

  /**
   * Get FLLET LIST
   * @param filterObject
   * for get data by filter selection
   */
  public getFleetList(filterObject: FilterObject): Observable<FleetList[]> {
    let url: string = this.baseUrl + 'reports/fleet';
    if (!!filterObject.clientId) { url = url + `?clientId=${filterObject.clientId}` }
    return this.http.httpPostRequest<FleetList[]>(url, filterObject, this.API_VERSION)
      .pipe(
        map((data: BaseResponse<FleetList[]>) => {
          return data.result.map((items: FleetList) =>
            this.reportFleetListAdapter.toResponse(items)
          );
        })
      );
  }

  /**
   * Get Year List
   */
  public getYears(): Observable<YearList[]> {
    let url: string = `${this.baseUrl}reports/fleet/years`;
    return this.http.httpGetRequest<YearList[]>(url, this.API_VERSION)
      .pipe(
        map((data: BaseResponse<YearList[]>) => {
          return data.result.map((items: YearList) =>
            this.reportYearListAdapter.toResponse(items)
          );
        })
      );
  }

  /**
   * Get Fleet Detail
   * @param idObjct
   * for get data by clientId and selected Year
   */
  public getFleetDetail(idObjct: IdObject): Observable<FleetDetailList[]> {
    let url: string = `${this.baseUrl}reports/fleet/detail`;
    url = url + `?year=${idObjct.selectedYear}`
    if (!!idObjct.clientId) { url = url + `&clientId=${idObjct.clientId}` }
    return this.http.httpGetRequest<YearList[]>(url, this.API_VERSION)
      .pipe(
        map((data: BaseResponse<FleetDetailList[]>) => {
          return data.result.map((items: FleetDetailList) =>
            this.reportFleetDetailListAdapter.toResponse(items)
          );
        })
      );
  }

  /** 
   * Export excel for Export excel file with applied filter data
   * @param filterObject Get the filter object
   */
  public exportExcel(filterObject: FilterObject): Observable<Blob> {
    let url: string = this.baseUrl + 'reports/fleet/excel';
    if (!!filterObject.clientId) { url = url + `?clientId=${filterObject.clientId}` }
    return this.http.httpPostRequest<void>(url, filterObject, { responseType: 'blob' });
  }

}
