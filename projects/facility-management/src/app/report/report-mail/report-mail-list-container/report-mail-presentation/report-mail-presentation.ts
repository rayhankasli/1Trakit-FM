import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, HostBinding } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
// --------------------------------------------------- //
import { TableProperty } from 'common-libs';
// --------------------------------------------------- //
import { ClientMaster } from '../../../../core/model/common.model';
import { ChartObject, MailChartModel, MailReportFilterRecord, MailReportListResponse } from '../../report-mail.model';

@Component({
  selector: 'app-report-mail-ui',
  templateUrl: './report-mail-presentation.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReportMailPresentationComponent implements OnInit {

  @HostBinding('class') public class: string;

  @Input() public set yearList(list: number[]) {
    if (list) {
      this._yearList = list;
    }
  }
  public get yearList(): number[] {
    return this._yearList;
  }
  /** This property is used for get data from container component */
  @Input() public set graphData(baseResponse: MailChartModel[]) {
    if (baseResponse) {
      this._graphData = baseResponse;
    }
  };
  public get graphData(): MailChartModel[] {
    return this._graphData;
  }

  /** list of offices */
  @Input() public set clients(list: ClientMaster[]) {
    if (list) {
      this._clients = [...list];
    }
  }
  public get clients(): ClientMaster[] {
    return this._clients;
  }

  /** This property is used for get data from container component */
  @Input() public set baseResponse(mailReportList: MailReportListResponse) {
    if (mailReportList) {
      this._mailReportList = mailReportList;
    }
  };
  public get baseResponse(): MailReportListResponse {
    return this._mailReportList;
  }

  /** This property is used for emit filter data to container component */
  @Output() public filterMailReport: EventEmitter<TableProperty<MailReportFilterRecord>>;
  /** This property is used for emit data to container component */
  @Output() public exportExcel: EventEmitter<TableProperty<MailReportFilterRecord>>;
  /** Output emitter defined for emit IdObject and get chart and list by selected Id */
  @Output() public getChartListDataByClient: EventEmitter<ChartObject>;
  /** Output clientId to load list of years */
  @Output() public loadYears: EventEmitter<number>;

  public clientId: FormControl;
  public year: FormControl;
  public filter: FormGroup;
  private _clients: ClientMaster[];
  private _graphData: MailChartModel[];
  private _mailReportList: MailReportListResponse;
  private _yearList: number[];
  private destroy: Subject<void>;

  constructor(
    private cdr: ChangeDetectorRef,
  ) {
    this.filterMailReport = new EventEmitter(true);
    this.exportExcel = new EventEmitter(true);
    this.getChartListDataByClient = new EventEmitter(true);
    this.loadYears = new EventEmitter(true);
    this.clientId = new FormControl();
    this.year = new FormControl(new Date().getFullYear());
    this.filter = new FormGroup({
      clientId: this.clientId,
      year: this.year
    });
    this.destroy = new Subject();
    this.class = "d-flex flex-column h-100";
    this._yearList = [];
  }

  ngOnInit() {
    this.clientId.valueChanges.pipe(takeUntil(this.destroy)).subscribe(clientId => {
      this.year.patchValue(new Date().getFullYear(), { emitEvent: false });
      if (clientId > 0) {
        this.getYearList(clientId);
      }
      this.cdr.detectChanges();
    });
  }

  /** get Graph and list data by selected client */
  public getChartListData(chartObj: ChartObject): void {
    this.getChartListDataByClient.emit(chartObj);
  }
  /** get mail report table data */
  public filterMailReportData(tableProperty: TableProperty<MailReportFilterRecord>): void {
    this.filterMailReport.emit(tableProperty);
  }
  /** export to excel */
  public exportExcelData(tableProperty: TableProperty<MailReportFilterRecord>): void {
    this.exportExcel.emit(tableProperty);
  }
  /** load years for the given clientId of mail report */
  public getYearList(clientId: number): void {
    this.loadYears.emit(clientId);
  }

}
