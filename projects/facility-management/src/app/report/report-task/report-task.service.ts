/**
 * @author Rayhan Kasli.
 * @description Service layer class to communicate with the server.
 */
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
// ------------------------------------------------------------- //
import { Params, TableProperty, HttpService, BaseResponse } from 'common-libs';
// ------------------------------------------------------------- //
import { environment } from '../../../environments/environment';
import { TaskReportAdapter, TaskReportChartAdapter, BacklogChartAdapter, TaskReportFilterAdapter, } from './report-task-adapter/report-task.adapter';
import { TaskReport, TaskReportChart, BacklogChart, TaskReportFilterRecord, ChartObject } from './report-task.model';
import { convertToRequestParams } from '../../core/utility/utility';
import { YearReportType } from '../report.enum';
import { YearsResponse } from '../report-model';

@Injectable()
export class ReportTaskService {
  /** store base url */
  private baseUrl: string;
  /** API version */
  private readonly API_VERSION: string = environment.api_version;

  constructor(
    private http: HttpService,
    private taskReportAdapter: TaskReportAdapter,
    private taskReportChartAdapter: TaskReportChartAdapter,
    private backlogChartAdapter: BacklogChartAdapter,
    private taskReportFilterAdapter: TaskReportFilterAdapter,

  ) {
    this.baseUrl = environment.baseUrl;
  }

  /** Custom method */
  public getTaskReports(tableProperty: TableProperty): Observable<TaskReport[]> {
    const body: TaskReportFilterRecord = this.taskReportFilterAdapter.toRequest(tableProperty.filter);
    const url: string = this.baseUrl + 'reports/task/detail?clientId=' + body.clientId + '&startDate=' + body.startDate + '&endDate=' + body.endDate;
    const params: Params<TableProperty> = convertToRequestParams(tableProperty);
    return this.http.httpGetRequest<TaskReport[]>(
      url, { params: { ...params } }, this.API_VERSION).pipe(map((data: BaseResponse<any>) => {
        data.result.taskList = data.result.data.map((items: TaskReport) => this.taskReportAdapter.toResponse(items));
        return data.result;
      }));
  }

  /** getTaskChart */
  public getTaskChart(chartOption: ChartObject): Observable<TaskReportChart[]> {
    const url: string = this.baseUrl + 'reports/task';
    const params = { clientId: chartOption.clientId, year: chartOption.year }
    return this.http.httpGetRequest<TaskReportChart[]>(
      url, { params: { ...params } }, this.API_VERSION).pipe(map((data: BaseResponse<TaskReportChart[]>) => {
        return data.result.map((items: TaskReportChart) => this.taskReportChartAdapter.toResponse(items));
      }));
  }
  /** getTaskChart */
  public getBacklogChart(chartOption: ChartObject): Observable<BacklogChart[]> {
    const url: string = this.baseUrl + 'reports/taskbacklog';
    const params = { clientId: chartOption.clientId, year: chartOption.year }
    return this.http.httpGetRequest<BacklogChart[]>(
      url, { params: { ...params } }, this.API_VERSION).pipe(map((data: BaseResponse<BacklogChart[]>) => {
        return data.result.map((items: BacklogChart) => this.backlogChartAdapter.toResponse(items));
      }));
  }

  /** exportAsExcel */
  public exportAsExcel(tableProperty: TableProperty): Observable<Blob> {
    const body: TaskReportFilterRecord = this.taskReportFilterAdapter.toRequest(tableProperty.filter);
    const url: string = this.baseUrl + 'reports/task/excel?clientId=' + body.clientId + '&startDate=' + body.startDate + '&endDate=' + body.endDate;
    const params: Params<TableProperty> = convertToRequestParams(tableProperty);
    return this.http.httpGetRequest<TaskReport[]>(
      url, { params: { ...params }, responseType: 'blob' }, this.API_VERSION);
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

}

