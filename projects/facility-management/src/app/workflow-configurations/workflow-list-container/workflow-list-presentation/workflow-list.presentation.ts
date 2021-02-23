/**
 * @author Rayhan Kasli.
 * @description This is data table presentation component.To represent get data from container component and render to dom.
 */
import {
  Component,
  OnInit,
  ViewChildren,
  QueryList,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  OnDestroy,
  ViewContainerRef,
  ViewChild,
  ChangeDetectorRef,
  AfterViewInit,
  HostBinding,
  Inject,
  NgZone,
} from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { takeUntil } from 'rxjs/operators/takeUntil';
// ---------------------------------------------------------- //
import {
  TableProperty,
  SortingOrderDirective,
  pageCount,
} from 'common-libs';
import {
  Workflow,
  WorkflowFilterRecord,
} from '../../workflow-configurations.model';
import { WorkflowListPresenter } from '../workflow-list-presenter/workflow-list.presenter';
import { WorkflowListPresentationBase } from '../workflow-list-presentation-base/workflow-list.presentation.base';
import { Permission } from '../../../core/enums/role-permissions.enum'
import { BreakpointState } from '@angular/cdk/layout';

/**
 * WorkflowListPresentationComponent
 */
@Component({
  selector: 'app-workflow-list-ui',
  templateUrl: './workflow-list.presentation.html',
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [WorkflowListPresenter],
})
export class WorkflowListPresentationComponent
  extends WorkflowListPresentationBase
  implements OnInit, OnDestroy {

  @HostBinding('class') public class: string;
  /** This property is used for get data from container component */
  @Input() public set baseResponse(baseResponse: Workflow[]) {
    if (baseResponse) {
      this._baseResponse = baseResponse;
      this.setTableData();
    }
  }
  public get baseResponse(): Workflow[] {
    return this._baseResponse;
  }


  /** This property is used for get delete record or not. */
  @Input() public set isDeleted(response: boolean) {
    if (response) {
      this.changeDetection.detectChanges();
      this.getWorkflow.emit(this.tableProperty);
    }
  }

  /**
   * This enum is return offices enum props.
   */
  public get workflowEnum(): typeof Permission.WorkFlowConfiguration {
    return Permission.WorkFlowConfiguration;
  }

  /** This property is used for emit data to container component */
  @Output() public getWorkflow: EventEmitter<
    TableProperty<WorkflowFilterRecord>
  >;

  /** This property is used for emit data to container component */
  @Output() public deleteWorkflow: EventEmitter<Workflow>;


  /** This property is used for emit filter data to container component */
  @Output() public filterWorkflow: EventEmitter<
    TableProperty<WorkflowFilterRecord>
  >;

  /**
   * View child of customer list presentation component
   */
  @ViewChild('container', { read: ViewContainerRef, static: true }) public container: ViewContainerRef;

  /** This property is used to store QueryList of SortingOrderDirective */
  @ViewChildren(SortingOrderDirective) public sortingColumns: QueryList<
    SortingOrderDirective
  >;

  /** This property is used to store the selected Workflows */
  public selectedWorkflows: Set<Workflow>;

  /** This property is used to store the criteria that are selected by the user */
  public tableProperty: TableProperty<WorkflowFilterRecord>;

  /** Add slot form of workflow list presentation component */
  public addWorkFlowForm: boolean;

  /** This property is used to store the options that are available in the Page Size selection drawdown */
  public pageSize: number[];

  /** This boolean is used to indicate whether all rows are selected or not  */
  public isCheckAll: boolean;

  /** Table prop of customer list presentation component */
  public tableProp: Subject<TableProperty<WorkflowFilterRecord>>;

  /** isMobile property for mobile screen or not */
  public isMobile: Observable<BreakpointState>;

  /** This property is used for checking filter applied or not. */
  public isFilterApply: boolean;

  /** This property is used for checking sort applied or not. */

  public isSortApply: boolean;

  /** statuses */
  public status: string[] = ['active', 'inactive']

  /** create for getter setter */
  private _baseResponse: Workflow[];

  constructor(
    public workflowPresenter: WorkflowListPresenter,
    public changeDetection: ChangeDetectorRef,
    @Inject('Window') window: Window,
    zone: NgZone
  ) {
    super(workflowPresenter, changeDetection, window, zone);
    this.window = window as Window;
    this.initProperty();
    this.class = 'flex-grow-1 h-100 overflow-hidden';
  }

  public ngOnInit(): void {
    this.workflowPresenter.setTableProp$
      .pipe(takeUntil(this.destroy))
      .subscribe((tableProperty: TableProperty) => {
        // if (tableProperty.filter) {
        //   this.filterWorkflow.emit(tableProperty);
        //   this.tableProperty = tableProperty;
        // } else {
        this.getWorkflow.emit(tableProperty);
        this.tableProperty = tableProperty;
        // }
      });
    this.workflowPresenter.deleteRecord$
      .pipe(takeUntil(this.destroy))
      .subscribe((workflow: Workflow) => {
        this.deleteWorkflow.emit(workflow);
      });
    this.workflowPresenter.tableProp$.subscribe(
      (value: TableProperty<WorkflowFilterRecord>) => {
        this.tableProperty = value;
      }
    );

  }

  /**
   * Sets table data
   */
  public setTableData(): void {
    this.isFilterApply = this.workflowPresenter.filterApply(
      this.tableProperty.filter
    );
    this.isSortApply = this.workflowPresenter.sortApply(
      this.tableProperty.sort
    );
    this.workflowPresenter.workflows = this.baseResponse;
    this.workflowPresenter.setTableData();
  }

  /** Adds new slot */
  public addNewWorkFlow(): void {
    this.addWorkFlowForm = !this.addWorkFlowForm;
  }

  /**
   * Adds new slot
   */
  public closeWorkFlowForm(event: boolean): void {
    this.addWorkFlowForm = event;
  }

  /** This Method is used for change the status */
  public onStatusChange(status: string): void {
    this.workflowPresenter.onStatusChange(status);
    this.addWorkFlowForm && this.closeWorkFlowForm(false);
  }

  /** Initializes default properties for the component */
  private initProperty(): void {
    this.selectedWorkflows = new Set();
    this.isCheckAll = false;
    this.tableProp = new Subject();
    this.tableProperty = new TableProperty<WorkflowFilterRecord>();
    this.pageSize = pageCount;
    this.destroy = new Subject();
    this.getWorkflow = new EventEmitter<TableProperty<WorkflowFilterRecord>>();
    this.deleteWorkflow = new EventEmitter<Workflow>();
    this.filterWorkflow = new EventEmitter<
      TableProperty<WorkflowFilterRecord>
    >();
  }
}
