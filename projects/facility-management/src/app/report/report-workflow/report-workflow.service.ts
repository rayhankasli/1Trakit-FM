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
import { WorkflowReportGraphAdapter, WorkflowReportListAdapter, WorkflowReportFilterAdapter } from './report-workflow-adapter/report-workflow.adapter';
import { WorkFlowReportGraph, WorkflowReportDetail, ChartObject, WorkflowReportFilterRecord, WorkflowReportDetailResponse, } from './report-workflow.model';
import { YearReportType } from '../report.enum';
import { of } from 'rxjs';
import { YearsResponse } from '../report-model';

@Injectable()
export class ReportWorkflowService {

  /** store base url */
  private baseUrl: string;
  /** API version */
  private readonly API_VERSION: string = environment.api_version;

  constructor(
    private http: HttpService,
    private workflowReportGraphAdapter: WorkflowReportGraphAdapter,
    private workflowReportListAdapter: WorkflowReportListAdapter,
    private workflowReportFilterAdapter: WorkflowReportFilterAdapter
  ) {
    this.baseUrl = environment.baseUrl;
  }

  /** Custom method */
  public getWorkflowReportGraph(chartObj: ChartObject): Observable<WorkFlowReportGraph[]> {

    let url: string = `${this.baseUrl}reports/workflow/${chartObj.graphCategory}`;

    return this.http.httpGetRequest<WorkFlowReportGraph[]>(
      url, { params: { clientId: chartObj.clientId, year: chartObj.year } }, this.API_VERSION).pipe(map((data: BaseResponse<WorkFlowReportGraph[]>) => {
        return data.result.map((items: WorkFlowReportGraph) => this.workflowReportGraphAdapter.toResponse(items));
      }));
  }

  /** Custom method */
  public getWorkflowReportList(tableProperty: TableProperty): Observable<WorkflowReportDetail> {

    let url: string = `${this.baseUrl}reports/workflow/detail`;
    const filterRecord: WorkflowReportFilterRecord = this.workflowReportFilterAdapter.toRequest(tableProperty.filter);
    const params: Params<TableProperty> = this.paramProcess(tableProperty);

    return this.http.httpGetRequest<WorkflowReportDetailResponse>(url, { params: { ...filterRecord, ...params, } }, this.API_VERSION).pipe(
      map((data: BaseResponse<WorkflowReportDetailResponse>) => {
        return this.workflowReportListAdapter.toResponse(data.result);
      }));
  }

  /** Get Excel file from server */
  public exportAsExcel(tableProperty: TableProperty): Observable<Blob> {

    let url: string = `${this.baseUrl}reports/workflow/excel`;
    const filterRecord: WorkflowReportFilterRecord = this.workflowReportFilterAdapter.toRequest(tableProperty.filter);

    return this.http.httpGetRequest<void>(url, { params: { ...filterRecord }, responseType: 'blob' }, this.API_VERSION);

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
    const params: Params = new Params();

    if (tableProperty.pageNumber || (tableProperty.pageNumber === 0)) { params.page = tableProperty.pageNumber.toString(); }
    if (tableProperty.pageLimit) { params.perPage = tableProperty.pageLimit.toString(); }
    if (tableProperty.sort) { params.sort = tableProperty.order + '' + tableProperty.sort; }
    if (tableProperty.search) { params.q = tableProperty.search; }

    return params;
  }

}

