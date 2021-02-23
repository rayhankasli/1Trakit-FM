/**
 * @author YOUR_NAME_HERE
 * @description This is data table presentation component.To represent get data from container component and render to dom.
 */
import {
  Component, OnInit, ViewChildren, QueryList, Input, Output, EventEmitter, ChangeDetectionStrategy, OnDestroy,
  ViewContainerRef, ViewChild, ChangeDetectorRef
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/operators/takeUntil';
// ---------------------------------------------------------- //
import { TableProperty, SortingOrderDirective, pageCount } from 'common-libs';
// ---------------------------------------------------------- //
import { Permission } from '../../../../core/enums/role-permissions.enum'
import { WorkflowFilterRecord } from '../../../../workflow-configurations/workflow-configurations.model';
import { WorkflowReportDetail, WorkflowReportList } from '../../report-workflow.model';
import { WorkflowReportListPresenter } from '../workflow-report-list-presenter/workflow-report-list.presenter';
import { WorkflowReportListPresentationBase } from '../workflow-report-list-presentation-base/workflow-report-list.presentation.base';


/**
 * WorkflowReportListPresentationComponent
 */
@Component({
  selector: 'app-workflow-report-list-ui',
  templateUrl: './workflow-report-list.presentation.html',
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [WorkflowReportListPresenter]
})
export class WorkflowReportListPresentationComponent extends WorkflowReportListPresentationBase implements OnInit, OnDestroy {

  @Input() public set clientId(clientId: number) {
    if (clientId) {
      this.workflowReportPresenter.clientChange(clientId);
    }
  }

  /** This property is used for get data from container component */
  @Input() public set baseResponse(baseResponse: WorkflowReportDetail) {
    if (baseResponse) {
      this._baseResponse = baseResponse;
      this.workflowReportListData = baseResponse.workflowReportList;
      this.setTableData();
    }
  };
  public get baseResponse(): WorkflowReportDetail {
    return this._baseResponse;
  }

  /** This property is used for emit data to container component */
  @Output() public workflowReportDetails: EventEmitter<TableProperty<WorkflowFilterRecord>>;

  /**  Event emitter is used for emit data to container component */
  @Output() public workflowReportExcel: EventEmitter<TableProperty<WorkflowFilterRecord>>;

  /**
   * View child of customer list presentation component
   */
  @ViewChild('container', { read: ViewContainerRef, static: true }) public container: ViewContainerRef;

  /** This property is used to store QueryList of SortingOrderDirective */
  @ViewChildren(SortingOrderDirective) public sortingColumns: QueryList<SortingOrderDirective>;

  /** Filter FormGroup */
  public filterFormGroup: FormGroup;

  /** To-Do */
  public workflowReportListData: WorkflowReportList[];

  /** This property is used to store the selected WorkflowReports */
  public selectedWorkflowReports: Set<WorkflowReportDetail>;

  /** This property is used to store the criteria that are selected by the user */
  public tableProperty: TableProperty;

  /** This property is used to store the options that are available in the Page Size selection drawdown */
  public pageSize: number[];

  /** Table prop of customer list presentation component */
  public tableProp: Subject<TableProperty>;

  /** This property is used for checking filter applied or not. */
  public isFilterApply: boolean;

  /** This property is used for checking sort applied or not. */
  public isSortApply: boolean;

  /** Get Min Date */
  public get minDate(): Date {
    return this.workflowReportPresenter.minDate;
  }

  /** Determines whether form submitted is ture or false */
  public get isFormSubmitted(): boolean {
    return this.workflowReportPresenter.isFormSubmitted;
  }

  /**
   * This enum is return users enum props.
   */
  public get reportsWorkflowEnum(): typeof Permission.ReportsWorkflow {
    return Permission.ReportsWorkflow;
  }

  /** create for getter setter */
  private _baseResponse: WorkflowReportDetail;

  /** create for  */
  private destroy: Subject<boolean>;

  constructor(
    public workflowReportPresenter: WorkflowReportListPresenter,
    public changeDetection: ChangeDetectorRef
  ) {
    super(workflowReportPresenter, changeDetection);
    this.initProperty();
  }

  public ngOnInit(): void {
    this.workflowReportPresenter.setTableProp$.pipe(takeUntil(this.destroy)).subscribe((tableProperty: TableProperty) => {
      if (tableProperty.filter.clientId) {
        this.workflowReportDetails.emit(tableProperty);
        this.tableProperty = tableProperty;
      }
    });

    this.workflowReportPresenter.tableProp$.subscribe((value: TableProperty<WorkflowFilterRecord>) => {
      this.tableProperty = value;
    });

    this.filterFormGroup.get('startDate').valueChanges.subscribe((startDate: Date) => {
      if (startDate) {
        this.workflowReportPresenter.setWorkflowStartDate(this.filterFormGroup, startDate);
      }
    });
  }

  /** destroy */
  public ngOnDestroy(): void {
    this.destroy.next(true);
    this.destroy.unsubscribe();
  }

  /** To-Do */
  public onSearch(searchTerm: string): void {
    this.workflowReportPresenter.onSearch(searchTerm);
  }

  /** Workflow Filter */
  public workflowFilter(): void {
    this.workflowReportPresenter.workflowFilter(this.filterFormGroup);
  }

  /** Export Excel */
  public exportAsExcel(): void {
    this.workflowReportExcel.emit(this.tableProperty);
  }

  /**
   * Sets table data
   */
  public setTableData(): void {
    this.isSortApply = this.workflowReportPresenter.sortApply(this.tableProperty.sort);
    this.workflowReportPresenter.workflowReports = this._baseResponse.workflowReportList;
    this.workflowReportPresenter.setTableData();
  }

  /** Initializes default properties for the component */
  private initProperty(): void {
    this.selectedWorkflowReports = new Set();
    this.tableProp = new Subject();
    this.tableProperty = new TableProperty();
    this.pageSize = pageCount;
    this.destroy = new Subject();
    this.workflowReportDetails = new EventEmitter<TableProperty<WorkflowFilterRecord>>(true);
    this.workflowReportExcel = new EventEmitter(true);
    this.filterFormGroup = this.workflowReportPresenter.buildFilterForm();
  }
}
