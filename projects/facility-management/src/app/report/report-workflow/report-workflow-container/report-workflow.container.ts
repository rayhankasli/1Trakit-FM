/**
 * @name ReportWorkflowContainerComponent
 * @author Enter Your Name Here
 * @description This is a container component for ReportWorkflow. This is responsible for all data retrieving and posting to the server by http calls.
 */

import { Component, OnInit, HostBinding } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
//--------------------------------------------------------------------//
import { TableProperty } from 'common-libs';
//--------------------------------------------------------------------//
import { downloadFile } from '../../../core/utility/utility';
import { CoreDataService } from '../../../core/services/core-data.service';
import { ClientMaster } from '../../../core/model/common.model';
import { UserInfo } from '../../../core/model/core.model';
import { ReportWorkflowService } from '../report-workflow.service';
import { WorkFlowReportGraph, WorkflowReportDetail, ChartObject } from '../report-workflow.model';
import { YearReportType } from '../../report.enum';

/**
 * ReportWorkflowListContainerComponent
 */
@Component({
  selector: 'app-report-workflow-container',
  templateUrl: './report-workflow.container.html'
})
export class ReportWorkflowContainerComponent implements OnInit {

  /** This property is used for add class host element */
  @HostBinding('class') public class: string;

  /** Observable for get client list */
  public clients$: Observable<ClientMaster[]>

  /** This is a observable which passes the list of workflowReport to its child component */
  public workFlowReportGraph$: Observable<WorkFlowReportGraph[]>;

  /** This is a observable which passes the list of workflowReport to its child component */
  public workflowReportDetail$: Observable<WorkflowReportDetail>;

  /** Observable for year dropdown options */
  public years$: Observable<number[]>;

  constructor(
    private coreDataService: CoreDataService,
    private reportWorkflowService: ReportWorkflowService,
    private datePipe: DatePipe
  ) {
    this.class = 'flex-grow-1 overflow-auto';
  }

  public ngOnInit(): void {
    this.getMasterData();
  }

  /** WorkFlow GraphList By Client */
  public workFlowGraphListByClient(chartObj: ChartObject): void {
    this.workFlowReportGraph$ = this.reportWorkflowService.getWorkflowReportGraph(chartObj);
  }

  /** This Method is used to get data from server  */
  public getWorkflowReports(tableProperty: TableProperty): void {
    this.workflowReportDetail$ = this.reportWorkflowService.getWorkflowReportList(tableProperty);
  }

  /** This Method is used to get Excel file from server */
  public onExportAsExcel(tableProperty: TableProperty): void {
    this.reportWorkflowService.exportAsExcel(tableProperty).subscribe((response: Blob) => {
      downloadFile(response, `workflow-report-${this.datePipe.transform(new Date(), 'yyyy-MM-d')}.xlsx`);
    });
  }

  /**
   * load list of years for the given clientId
   * @param clientId number
   */
  public loadYears(clientId: number): void {
    this.years$ = this.reportWorkflowService.getYears(YearReportType.WorkFlow, clientId);
  }

  /** Get User info */
  private getMasterData(): void {
    this.clients$ = this.coreDataService.userInfo$.pipe(
      map((data: UserInfo) => data.clients)
    );
  }

}
