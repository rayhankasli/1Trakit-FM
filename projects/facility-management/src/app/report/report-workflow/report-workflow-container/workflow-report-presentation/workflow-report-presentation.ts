import { Component, OnInit, Input, ChangeDetectorRef, Output, EventEmitter, HostBinding } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
// ----------------------------------------------------------------- //
import { TableProperty } from 'common-libs';
// ----------------------------------------------------------------- //
import { ClientMaster } from '../../../../core/model/common.model';
import { WorkflowFilterRecord } from '../../../../workflow-configurations/workflow-configurations.model';
import { WorkFlowReportGraph, WorkflowReportDetail, ChartObject } from '../../report-workflow.model';

@Component({
  selector: 'app-workflow-report-ui',
  templateUrl: './workflow-report-presentation.html'
})
export class WorkflowReportPresentationComponent implements OnInit {

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
  @Input() public set clients(list: ClientMaster[]) {
    if (list) {
      this._clients = [...list];
    }
  }
  public get clients(): ClientMaster[] {
    return this._clients;
  }

  /** list of offices */
  @Input() public set workFlowReportGraph(value: WorkFlowReportGraph[]) {
    if (value) {
      this._workFlowReportGraph = value;
    }
  }

  public get workFlowReportGraph(): WorkFlowReportGraph[] {
    return this._workFlowReportGraph;
  }

  /** This property is used for get data from container component */
  @Input() public set workflowReportDetail(value: WorkflowReportDetail) {
    if (value) {
      this._workflowReportDetail = value;
    }
  };
  public get workflowReportDetail(): WorkflowReportDetail {
    return this._workflowReportDetail;
  }

  /** Output emitter defined for emit IdObject and get chart and list by selected Id */
  @Output() public workflowGraphListByClient: EventEmitter<ChartObject>;
  /** This property is used for emit filter data to container component */
  @Output() public workflowReportDetails: EventEmitter<TableProperty<WorkflowFilterRecord>>;
  /** This property is used for emit data to container component */
  @Output() public exportAsExcel: EventEmitter<TableProperty<WorkflowFilterRecord>>;
  /** Output clientId to load list of years */
  @Output() public loadYears: EventEmitter<number>;

  /** FormControl */
  public clientId: FormControl;
  /** FormControl */
  public year: FormControl;
  /** form group for client, year filter */
  public filter: FormGroup;

  /** list of clients */
  private _clients: ClientMaster[];

  /** WorkFlowReportGraph list */
  private _workFlowReportGraph: WorkFlowReportGraph[];

  /** WorkflowReportDetail */
  private _workflowReportDetail: WorkflowReportDetail;

  /** year list instance */
  private _yearList: number[];

  /** destroy */
  private destroy: Subject<void>;

  constructor(
    private cdr: ChangeDetectorRef
  ) {
    this.clientId = new FormControl();
    this.year = new FormControl(new Date().getFullYear());
    this.filter = new FormGroup({
      clientId: this.clientId,
      year: this.year
    })
    this.destroy = new Subject();
    this.workflowGraphListByClient = new EventEmitter(true);
    this.workflowReportDetails = new EventEmitter(true);
    this.exportAsExcel = new EventEmitter(true);
    this.loadYears = new EventEmitter(true);
    this.class = "d-flex flex-column h-100";
  }

  public ngOnInit(): void {
    this.clientId.valueChanges.pipe(takeUntil(this.destroy)).subscribe(clientId => {
      this.year.patchValue(new Date().getFullYear(), { emitEvent: false });
      if (clientId > 0) {
        this.loadYears.emit(clientId);
      }
      this.cdr.detectChanges();
    })
  }

  /** get Graph and list data by selected client */
  public getWorkFlowGraphList(chartObj: ChartObject): void {
    this.workflowGraphListByClient.emit(chartObj);
  }
  /** get Workflow report table data */
  public getWorkflowReportDetails(tableProperty: TableProperty<WorkflowFilterRecord>): void {
    this.workflowReportDetails.emit(tableProperty);
  }
  /** Export to excel */
  public onExportAsExcel(tableProperty: TableProperty<WorkflowFilterRecord>): void {
    this.exportAsExcel.emit(tableProperty);
  }
  /** load years for the given clientId of mail report */
  public getYearList(clientId: number): void {
    this.loadYears.emit(clientId);
  }

}
