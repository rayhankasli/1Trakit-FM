/**
 * @author Rayhan Kasli.
 */
import {
  Component, OnInit, ChangeDetectionStrategy, Input, EventEmitter, Output, OnDestroy, ChangeDetectorRef, HostBinding,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
// ------------------------------------------------------------- //
import { TableProperty } from 'common-libs';
// ------------------------------------------------------------- //
import { ClientMaster } from '../../../../core/model/common.model';
import { TaskReportChart, BacklogChart, ChartObject } from '../../report-task.model';


@Component({
  selector: 'app-report-task-presentation-ui',
  templateUrl: './report-task-presentation.component.html',
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportTaskPresentationComponent implements OnInit, OnDestroy {

  /** This property is used for add class host element */
  @HostBinding('class') public class: string;

  /** list of years */
  @Input() public set yearList(list: number[]) {
    if (list) {
      this._yearList = list;
    }
  }
  public get yearList(): number[] {
    return this._yearList;
  }
  /** list of offices */
  @Input() public set clients(value: ClientMaster[]) {
    if (value) {
      this._clients = value;
    }
  }

  public get clients(): ClientMaster[] {
    return this._clients;
  }

  /** This property is used to store the taskReports that has been retrieved from the API. */
  @Input() public set taskChart(value: TaskReportChart[]) {
    if (value) {
      this._taskChart = value;
    }
  }

  public get taskChart(): TaskReportChart[] {
    return this._taskChart;
  }

  /** This property is used to store the taskReports that has been retrieved from the API. */
  @Input() public set backlogChart(value: BacklogChart[]) {
    if (value) {
      this._backlogChart = value;
    }
  }

  public get backlogChart(): BacklogChart[] {
    return this._backlogChart;
  }

  /** This property is used for get data from container component */
  @Input() public set baseResponse(baseResponse: any) {
    if (baseResponse) {
      this._baseResponse = baseResponse;
    }
  }
  public get baseResponse(): any {
    return this._baseResponse;
  }

  /** This property is used for emit data to container component */
  @Output() public getTaskReport: EventEmitter<TableProperty>;
  /** This property is used for emit data to container component */
  @Output() public exportExcelData: EventEmitter<void>;
  /** This property is used for emit data to container component */
  @Output() public getChartDetail: EventEmitter<ChartObject>;
  /** Output clientId to load list of years */
  @Output() public loadYears: EventEmitter<number>;

  /** form control for clientId */
  public clientId: FormControl;
  /** form control for year */
  public year: FormControl;
  /** form group for client, year filter */
  public filter: FormGroup;
  /** _clients */
  private _clients: ClientMaster[];
  /** _taskChart */
  private _taskChart: TaskReportChart[];
  /** _backlogChart */
  private _backlogChart: BacklogChart[];
  /** create for getter setter */
  private _baseResponse: any;
  /** year list instance */
  private _yearList: number[];
  /** create for  */
  private destroy: Subject<boolean>;

  constructor(private cdr: ChangeDetectorRef) {
    this.getTaskReport = new EventEmitter<TableProperty>();
    this.exportExcelData = new EventEmitter();
    this.getChartDetail = new EventEmitter();
    this.destroy = new Subject();
    this.clientId = new FormControl();
    this.year = new FormControl(new Date().getFullYear());
    this.filter = new FormGroup({
      clientId: this.clientId,
      year: this.year
    })
    this.loadYears = new EventEmitter(true);
    this.class = 'flex-grow-1';
  }

  public ngOnInit(): void {
    this.clientId.valueChanges.pipe(takeUntil(this.destroy)).subscribe((clientId: number) => {
      this.year.patchValue(new Date().getFullYear(), { emitEvent: false });
      if (clientId) {
        this.loadYears.emit(clientId);
      }
      this.cdr.detectChanges();
    })
  }

  /** This Method is used to get data from server  */
  public getTaskReports(tableProperty: TableProperty): void {
    this.getTaskReport.emit(tableProperty);
  }


  /** exportExcelData */
  public exportExcel(): void {
    this.exportExcelData.emit();
  }

  /** getChartData */
  public getChartData(chartOption: ChartObject): void {
    this.getChartDetail.emit(chartOption);
  }

  /** destroy */
  public ngOnDestroy(): void {
    this.destroy.next(true);
    this.destroy.unsubscribe();
  }
}
