

/**
 * @name ReportTaskContainerComponent
 * @author Rayhan Kasli
 * @description This is a container component for ReportTask. This is responsible for all data retrieving and posting to the server by http calls.
 */
import { Component, HostBinding, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Observable } from 'rxjs/Observable';
//--------------------------------------------------------------------//
import { TableProperty } from 'common-libs';
//--------------------------------------------------------------------//
import { ReportTaskService } from '../report-task.service';
import { TaskReport, TaskReportChart, BacklogChart, ChartObject } from '../report-task.model';
import { ClientMaster } from '../../../core/model/common.model';
import { CoreDataService } from '../../../core/services/core-data.service';
import { downloadFile } from '../../../core/utility/utility';
import { YearReportType } from '../../report.enum';

/**
 * ReportTaskListContainerComponent
 */
@Component({
  selector: 'app-report-task-list-container',
  templateUrl: './report-task-list.container.html'
})
export class ReportTaskListContainerComponent implements OnInit {

  /** This property is used for add class host element */
  @HostBinding('class') public class: string;
  /** This is a observable which passes the list of taskReport to its child component */
  public taskReports$: Observable<TaskReport[]>;

  /** This is a observable which passes the client data to its child component */
  public clients$: Observable<ClientMaster[]>;
  /** This is a observable which passes the client data to its child component */
  public taskChart$: Observable<TaskReportChart[]>;
  /** This is a observable which passes the client data to its child component */
  public backlogChart$: Observable<BacklogChart[]>;
  /** Observable for year dropdown options */
  public years$: Observable<number[]>;

  private tableProperty: TableProperty;

  constructor(
    private reportTaskService: ReportTaskService,
    private coreDataService: CoreDataService,
    private datePipe: DatePipe
  ) {
    this.class = 'flex-grow-1 overflow-auto';
    this.tableProperty = new TableProperty();
  }

  public ngOnInit(): void {
    this.getClientList();
  }

  /** This Method is used to get data from server  */
  public getTaskReports(tableProperty: TableProperty): void {
    this.tableProperty = tableProperty;
    this.taskReports$ = this.reportTaskService.getTaskReports(tableProperty);
  }

  /** exportExcelData */
  public exportExcelData(): void {
    this.reportTaskService.exportAsExcel(this.tableProperty).subscribe((response: Blob) => {
      downloadFile(response, `report-task-${this.datePipe.transform(new Date(), 'MMM-d-y')}.xlsx`);
    });
  }

  /** getChartData */
  public getChartData(chartOption: ChartObject): void {
    this.taskChart$ = this.reportTaskService.getTaskChart(chartOption);
    this.backlogChart$ = this.reportTaskService.getBacklogChart(chartOption);
  }

  /**
   * load list of years for the given clientId
   * @param clientId number
   */
  public loadYears(clientId: number): void {
    this.years$ = this.reportTaskService.getYears(YearReportType.Task, clientId);
  }

  /** getClientList */
  private getClientList(): void {
    this.clients$ = this.coreDataService.clients$;
  }

}
