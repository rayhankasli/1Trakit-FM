/**
 * @author Enter Your Name Here.
 * @description Service layer class to communicate with the server.
 */

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
// ------------------------------------------------------------- //
import { Params, TableProperty, HttpService, BaseResponse } from 'common-libs';
// ------------------------------------------------------------- //
import { environment } from '../../../environments/environment';
import { MailReportAdapter, MailReportFilterAdapter, MailChartAdapter, } from './report-mail-adapter/report-mail.adapter';
import { MailReport, MailReportFilterRecord, ChartObject, MailChartModel, MailReportListResponse, } from './report-mail.model';
import { YearReportType } from '../report.enum';
import { YearsResponse } from '../report-model';
import { of } from 'rxjs';

/** Service for get data from server */
@Injectable()
export class ReportMailService {
  /** store base url */
  private baseUrl: string;
  /** API version */
  private readonly API_VERSION: string = environment.api_version;

  constructor(
    private http: HttpService,
    private mailReportAdapter: MailReportAdapter,
    private mailReportFilterAdapter: MailReportFilterAdapter,
    private mailChartAdapter: MailChartAdapter
  ) {
    this.baseUrl = environment.baseUrl;
  }

  /** Get graph data */
  public getGraphData(chartObj: ChartObject): Observable<MailChartModel[]> {
    let url: string = `${this.baseUrl}reports/mail/${chartObj.chartType}`;
    return this.http.httpGetRequest<MailChartModel[]>(url, { params: { clientId: chartObj.clientId, year: chartObj.year } }).pipe(map((data: BaseResponse<MailChartModel[]>) => {
      return data.result.map((items: MailChartModel) => this.mailChartAdapter.toResponse(items));
    }));
  }

  /**
   * This method invokes the server's get endpoint to fetch the record as per the criteria mentioned in the tabelProperty parameters.
   * It converts the criteria to key and values expected by the API by invoking processParam method. It then invokes the server, on successful
   * response, it fetches the count from the header and invokes the adapter to convert server's response to what is expected by the client.
   * What happens when there is an error from the server ?
   * @param  tableProperty - Store the criteria based on which the records should be fetched from the server.
   * @returns - mailReport[]
   */
  public getMailReports(tableProperty: TableProperty<MailReportFilterRecord>): Observable<MailReportListResponse> {
    const url: string = `${this.baseUrl}reports/mail/detail`;
    const params: Params<TableProperty> = this.paramProcess(tableProperty);
    return this.http.httpGetRequest<BaseResponse<MailReportListResponse>>(
      url, { params: { ...params } }).pipe(map((response: BaseResponse<MailReportListResponse>) => {
        response.result.data = response.result.data.map((items: MailReport) => this.mailReportAdapter.toResponse(items));
        return response.result;
      }));
  }

  /**
   * Used to Export & download data to excel file
   * @param tableProperty Table properties to append
   */
  public exportExcel(tableProperty: TableProperty<MailReportFilterRecord>): Observable<Blob> {
    let url: string = `${this.baseUrl}reports/mail/excel`;
    const params: Params<TableProperty> = this.paramProcess(tableProperty);
    return this.http.httpGetRequest<BaseResponse<MailReportListResponse>>(url, { params: { ...params }, responseType: 'blob' }, this.API_VERSION);
  }

  /**
   * To load years of feature report(given as reportType) for the given client
   * @param reportType YearReportType
   * @param clientId number
   */
  public getYears(reportType: YearReportType, clientId: number): Observable<number[]> {
    let url: string = `${this.baseUrl}reports/year`;
    const params = { reportType, clientId };
    return this.http.httpGetRequest<BaseResponse<YearsResponse>>(url, { params: { ...params } }, this.API_VERSION)
      .pipe(map((response: BaseResponse<YearsResponse>) => response.result.years));
  }

  /**
   * This function checks for the presence or criteria and constructs the query params object accordingly.
   * This function should be inside shared/utils
   * @param tableProperty The model which needs to be mapped to the criteria that is accepted by the API.
   */
  private paramProcess(tableProperty: TableProperty): Params {
    const params: Params<MailReportFilterRecord> = new Params<MailReportFilterRecord>();
    const filter: MailReportFilterRecord = this.mailReportFilterAdapter.toRequest(tableProperty.filter);
    if (tableProperty.pageNumber || (tableProperty.pageNumber === 0)) { params.page = tableProperty.pageNumber.toString(); }
    if (tableProperty.pageLimit) { params.perPage = tableProperty.pageLimit.toString(); }
    if (tableProperty.sort) { params.sort = tableProperty.order + '' + tableProperty.sort; }
    if (tableProperty.search) { params.q = tableProperty.search; }

    return { ...params, ...filter };
  }

}

