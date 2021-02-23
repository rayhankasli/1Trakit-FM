/**
 * @author Rayhan Kasli.
 * @description Service layer class to communicate with the server.
 */
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
// ------------------------------------------------------------- //
import { environment } from '../../../environments/environment';
import { Params, TableProperty, HttpService, BaseResponse } from 'common-libs';
import { MeterReadAdapter, MeterReadReportFilterAdapter } from './report-meter-read-adapter/report-meter-read.adapter';
import { MeterRead } from './report-meter-read.model';
import { map } from 'rxjs/operators';
import { FilterObject, FleetDetailList, IdObject, YearList } from '../report-model';
import { convertToRequestParams } from '../../core/utility/utility';
import { ReportFleetDetailListAdapter, ReportYearListAdapter } from '../../core/services/adapter/reports.adapter';

/** ReportMeterReadService */
@Injectable()
export class ReportMeterReadService {

  /** store base url */
  private baseUrl: string;
  
  constructor(
    private http: HttpService,
    private meterReadAdapter: MeterReadAdapter,
    private reportYearListAdapter: ReportYearListAdapter,
    private reportFleetDetailListAdapter: ReportFleetDetailListAdapter,
    private meterReadReportFilterAdapter: MeterReadReportFilterAdapter
  ) {
    this.baseUrl = environment.baseUrl;
  }

  /** Custom method */
  public getMeterReadsReports(tableProperty: TableProperty): Observable<MeterRead[]> {
    const url: string = `${this.baseUrl}reports/fleet/meterreads?clientId=${tableProperty.filter.clientId}`;
    const body: FilterObject = tableProperty.filter ? this.meterReadReportFilterAdapter.toRequest(tableProperty.filter) : null;
    const params: Params = convertToRequestParams(tableProperty);
    return this.http.httpPostRequest<MeterRead[]>(url, body , { params: { ...params } }).pipe(map((data: BaseResponse<MeterRead[]>)=>{
      return data.result.map((items: MeterRead)=> this.meterReadAdapter.toResponse(items));
    }));
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
    return this.http.httpGetRequest<YearList[]>(url)
      .pipe(
        map((data: BaseResponse<FleetDetailList[]>) => {
          return data.result.map((items: FleetDetailList) =>
            this.reportFleetDetailListAdapter.toResponse(items)
          );
        })
      );
  }
   
  /**
   * Get Year List
   */
  public getYears(): Observable<YearList[]> {
    let url: string = `${this.baseUrl}reports/fleet/years`;
    return this.http.httpGetRequest<YearList[]>(url)
      .pipe(
        map((data: BaseResponse<YearList[]>) => {
          return data.result.map((items: YearList) =>
            this.reportYearListAdapter.toResponse(items)
          );
        })
      );
  }

  /** exportAsPdf */
  public exportAsExcel(tableProperty: TableProperty): Observable<Blob> {
    const url: string = `${this.baseUrl}reports/fleet/meterreads/excel?clientId=${tableProperty.filter.clientId}`;
    const body: FilterObject = tableProperty.filter ? this.meterReadReportFilterAdapter.toRequest(tableProperty.filter) : null;
    const params: Params = convertToRequestParams(tableProperty);
    return this.http.httpPostRequest<void>(url, body, { params: { ...params }, responseType: 'blob' })
  }

}

