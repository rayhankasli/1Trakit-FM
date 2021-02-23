
/**
 * @author Rayhan Kasli
 * @description This is data table presentation component.To represent get data from container component and render to dom.
 */
import { 
  Component, OnInit, ViewChildren, QueryList, Input, Output, EventEmitter, ChangeDetectionStrategy, OnDestroy, 
  ViewContainerRef, ViewChild, ChangeDetectorRef, HostBinding
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/operators/takeUntil';
// ---------------------------------------------------------- //
import { TableProperty, SortingOrderDirective, pageCount } from 'common-libs';
// ---------------------------------------------------------- //
import { TaskReport } from '../../report-task.model';
import { TaskReportListPresenter } from '../task-report-list-presenter/task-report-list.presenter';
import { TaskReportListPresentationBase } from '../task-report-list-presentation-base/task-report-list.presentation.base';
import { Permission } from '../../../../core/enums/role-permissions.enum';

/**
 * TaskReportListPresentationComponent
 */
@Component({
  selector: 'app-task-report-list-ui',
  templateUrl: './task-report-list.presentation.html',
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [TaskReportListPresenter]
})
export class TaskReportListPresentationComponent extends TaskReportListPresentationBase implements OnInit, OnDestroy {

  @HostBinding('class') public class: string;
  /** clientId */
  @Input() public set clientId(clientId: number) {
    if (clientId) {
      this.taskReportPresenter.clientChange(clientId);
    }
  }

  /** This property is used for get data from container component */
  @Input() public set baseResponse(baseResponse: any) {
    if (baseResponse) {
      this._baseResponse = baseResponse;
      this.setTableData();
    }
  };
  public get baseResponse(): any {
    return this._baseResponse;
  }
  

  /** This property is used for emit data to container component */
  @Output() public getTaskReport: EventEmitter<TableProperty>;
  /** This property is used for emit data to container component */
  @Output() public exportExcelData: EventEmitter<void>;


  
  /**
   * View child of customer list presentation component
   */
  @ViewChild('container', { read: ViewContainerRef, static: true }) public container: ViewContainerRef;
  
  /** This property is used to store QueryList of SortingOrderDirective */
  @ViewChildren(SortingOrderDirective) public sortingColumns: QueryList<SortingOrderDirective>;

  /** filterTaskFormGroup */
  public filterTaskFormGroup: FormGroup;

  /** This property is used to store the selected TaskReports */
  public selectedTaskReports: Set<TaskReport>;

  /** This property is used to store the criteria that are selected by the user */
  public tableProperty: TableProperty;

  /** This property is used to store the options that are available in the Page Size selection drawdown */
  public pageSize: number[];

  /** This boolean is used to indicate whether all rows are selected or not  */
  public isCheckAll: boolean;
  
  /** Table prop of customer list presentation component */
  public tableProp: Subject<TableProperty>; 
  
  /** This property is used for checking filter applied or not. */
  public isFilterApply: boolean;

  /** Determines whether form submitted is ture or false */
  public get isFormSubmitted(): boolean {
    return this.taskReportPresenter.isFormSubmitted;
  }

  /** Determines whether form submitted is ture or false */
  public get minDate(): Date {
    return this.taskReportPresenter.minDate;
  }

 /**
  * This enum is return users enum props.
  */
  public get reportsTaskEnum(): typeof Permission.ReportsTask {
   return Permission.ReportsTask;
  }
  
  /** create for getter setter */
  private _baseResponse: any;

  /** create for  */
  private destroy: Subject<boolean>;

  constructor(
    public taskReportPresenter: TaskReportListPresenter,
    public changeDetection: ChangeDetectorRef,
    ) {
    super(changeDetection);
    this.initProperty();
    this.class = "d-flex flex-column";
  }

  public ngOnInit(): void {
    this.taskReportPresenter.setTableProp$.pipe(takeUntil(this.destroy)).subscribe((tableProperty: TableProperty) => {
      this.getTaskReport.emit(tableProperty);
      this.tableProperty = tableProperty;
    });
    this.taskReportPresenter.tableProp$.subscribe((value: TableProperty) => {
      this.tableProperty = value;
    });
    this.filterTaskFormGroup.get('startDate').valueChanges.subscribe((startDate: Date) => {
      if (startDate) {
        this.taskReportPresenter.setStartDate(this.filterTaskFormGroup, startDate);
      }
    });
  }

  /** destroy */
  public ngOnDestroy(): void {
    this.destroy.next(true);
    this.destroy.unsubscribe();
  }

  /**
   * Sets table data
   */
  public setTableData(): void {
    this.taskReportPresenter.taskReports = this._baseResponse.taskList;
    this.taskReportPresenter.setTableData();
  }

  /** onSerach */
  public onSearch(searchTerm: string): void {
    this.taskReportPresenter.onSearch(searchTerm);
  }
  /** applyFilter */
  public applyTaskFilter(): void {
    this.taskReportPresenter.taskFilter(this.filterTaskFormGroup);
  }

  /** exportExcel */
  public exportExcel(): void {
    this.exportExcelData.emit();
  }

  /** Initializes default properties for the component */
  private initProperty(): void {
    this.filterTaskFormGroup = this.taskReportPresenter.buildForm()
    this.selectedTaskReports = new Set();
    this.isCheckAll = false;
    this.tableProp = new Subject();
    this.tableProperty = new TableProperty();
    this.pageSize = pageCount;
    this.destroy = new Subject();
    this.getTaskReport= new EventEmitter<TableProperty>();
    this.exportExcelData = new EventEmitter();
  }
}
