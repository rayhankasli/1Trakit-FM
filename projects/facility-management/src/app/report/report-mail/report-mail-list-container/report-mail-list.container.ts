/**
 * @name ReportMailContainerComponent
 * @author Enter Your Name Here
 * @description This is a container component for ReportMail. This is responsible for all data retrieving and posting to the server by http calls.
 */
import { Component, HostBinding } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Observable } from 'rxjs/Observable';
import { map, take } from 'rxjs/operators';
//--------------------------------------------------------------------//
import { TableProperty } from 'common-libs';
//--------------------------------------------------------------------//
import { ClientMaster } from '../../../core/model/common.model';
import { UserInfo } from '../../../core/model/core.model';
import { CoreDataService } from '../../../core/services/core-data.service';
import { downloadFile } from '../../../core/utility/utility';
import { ChartObject, MailReportFilterRecord, MailReportListResponse } from '../report-mail.model';
import { ReportMailService } from '../report-mail.service';
import { YearReportType } from '../../report.enum';

/**
 * ReportMailListContainerComponent
 */
@Component({
  selector: 'app-report-mail-list-container',
  templateUrl: './report-mail-list.container.html'
})
export class ReportMailListContainerComponent {

  /** This property is used for add class host element */
  @HostBinding('class') public class: string;
  /** This is a observable which passes the list of mailReport to its child component */
  public mailReports$: Observable<MailReportListResponse>;

  /** Observable for get fleet list */
  public graphData$: Observable<any[]>;

  /** Observable for get client list */
  public clients$: Observable<ClientMaster[]>;

  /** Observable for year dropdown options */
  public years$: Observable<number[]>;

  constructor(
    private reportMailService: ReportMailService,
    private coreDataService: CoreDataService,
    private datePipe: DatePipe
  ) {
    this.class = 'flex-grow-1 overflow-auto';
    this.getMasterData();
  }

  /** This Method is used to get data from server  */
  public filterMailReport(tableProperty: TableProperty<MailReportFilterRecord>): void {
    this.mailReports$ = this.reportMailService.getMailReports(tableProperty);
  }

  /** get Graph and list data by selected client */
  public getChartListDataByClient(chartObj: ChartObject): void {
    this.graphData$ = this.reportMailService.getGraphData(chartObj);
  }
  /** exportExcelData */
  public exportExcelData(tableProperty: TableProperty<MailReportFilterRecord>): void {
    this.reportMailService.exportExcel(tableProperty).pipe(take(1)).subscribe((response: Blob) => {
      downloadFile(response, `report-mail-${this.datePipe.transform(new Date(), 'yyyy-MM-d')}.xlsx`);
    });
  }

  /**
   * load list of years for the given clientId
   * @param clientId number
   */
  public loadYears(clientId: number): void {
    this.years$ = this.reportMailService.getYears(YearReportType.Mail, clientId);
  }

  /** Get User info */
  private getMasterData(): void {
    this.clients$ = this.coreDataService.userInfo$.pipe(
      map((data: UserInfo) => data.clients)
    );
  }


}
