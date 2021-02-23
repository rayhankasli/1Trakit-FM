
/**
 * @author  Ronak Patel.
 * @description This is data table presentation component.To represent get data from container component and render to dom.
 */
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Inject, Input, NgZone, OnDestroy, OnInit, Output, QueryList, ViewChild, ViewChildren, ViewContainerRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { takeUntil } from 'rxjs/operators/takeUntil';
import { Subject } from 'rxjs/Subject';
// ---------------------------------------------------------- //
import { pageCount, SortingOrderDirective, TableProperty } from 'common-libs';
// ---------------------------------------------------------- //
import { Permission } from '../../../core/enums/role-permissions.enum';
import { WeekDays } from '../../../core/model/common.model';
import { Floor, RearrangeTask, Room, Workflow, WorkflowTask, WorkflowTaskFilterRecord, WorkflowTaskRequest } from '../../workflow-configurations.model';
import { WorkflowTaskListPresenter } from '../workflow-task-list-presenter/workflow-task-list.presenter';
import { BaseCloseSelectDropdown } from '../../../core/base-classes/base-close-select-dropdown';

/**
 * WorkflowTaskListPresentationComponent
 */
@Component({
  selector: 'app-workflow-task-list-ui',
  templateUrl: './workflow-task-list.presentation.html',
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [WorkflowTaskListPresenter]
})
export class WorkflowTaskListPresentationComponent extends BaseCloseSelectDropdown implements OnInit, OnDestroy {

  /** This property is used for get data from container component */
  @Input() public set baseResponse(baseResponse: WorkflowTask[]) {
    if (baseResponse) {
      this._baseResponse = baseResponse;
      this.reArrangedArray(baseResponse);
      this.setTableData();
    }
  };
  public get baseResponse(): WorkflowTask[] {
    return this._baseResponse;
  }
  /** This will set the data */
  @Input() public set weekDays(value: WeekDays[]) {
    if (value) {
      this._weekDays = value;
      this.workflowTaskPresenter.passWeedDays(this._weekDays);
    }
  }
  public get weekDays(): WeekDays[] {
    return this._weekDays;
  }
  /** This will set the data */
  @Input() public set floors(value: Floor[]) {
    if (value) {
      this._floors = value;
      this._floors.push({ floorId: -1, floor: 'All', nickName: 'All' });
      this.workflowTaskPresenter.passFloors(this._floors);
    }
  }
  public get floors(): Floor[] {
    return this._floors;
  }

  /** This will set the data */
  @Input() public set rooms(value: Room[]) {
    if (value) {
      this._rooms = value;
      this.workflowTaskPresenter.passRooms(this._rooms);
    }
  }
  public get rooms(): Room[] {
    return this._rooms;
  }

  /**
   * This enum is return task enum props.
   */
  public get taskEnum(): typeof Permission.Task {
    return Permission.Task;
  }

  /** This property is used for emit data to container component */
  @Output() public getWorkflowTask: EventEmitter<TableProperty<WorkflowTaskFilterRecord>>;

  /** This property is used for emit data to container component */
  @Output() public add: EventEmitter<WorkflowTaskRequest>;

  /** This property is used for emit data to container component */
  @Output() public update: EventEmitter<WorkflowTaskRequest>;

  /** This property is used for emit data to container component */
  @Output() public closeForm: EventEmitter<boolean>;
  /** This property is used for emit data to container component */
  @Output() public getFormMasterData: EventEmitter<void>;
  /** This property is used for emit data to container component */
  @Output() public getRooms: EventEmitter<number>;
  /** This property is used for emit data to container component */
  @Output() public deleteWorkflowTask: EventEmitter<WorkflowTask>;
  /** This property is used for emit data to container component */
  @Output() public reArrange: EventEmitter<RearrangeTask[]>;

  /**
   * View child of customer list presentation component
   */
  @ViewChild('container', { read: ViewContainerRef, static: false }) public container: ViewContainerRef;

  /** This property is used to store QueryList of SortingOrderDirective */
  @ViewChildren(SortingOrderDirective) public sortingColumns: QueryList<SortingOrderDirective>;

  /** This property is used to store the criteria that are selected by the user */
  public tableProperty: TableProperty<WorkflowTaskFilterRecord>;

  /** This property is used to store the options that are available in the Page Size selection drawdown */
  public pageSize: number[];

  /** Table prop of customer list presentation component */
  public tableProp: Subject<TableProperty<WorkflowTaskFilterRecord>>;

  /** This property is used for checking filter applied or not. */
  public isFilterApply: boolean;

  /** This property is used for form open or note */
  public formOpen: boolean;
  /** workflow details by workflowId */
  public workflowDetails: Workflow;
  /** isEditable or not */
  public isEditable: boolean;
  /** array for new arranged sequence */
  public workFlowTaskListArray: WorkflowTask[];
  /** use for update Sequence */
  public isUpdateSequence: boolean;
  /** create for getter setter */
  private _baseResponse: WorkflowTask[];
  /** create for getter setter */
  private _weekDays: WeekDays[];
  /** create for getter setter */
  private _floors: Floor[];
  /** create for getter setter */
  private _rooms: Room[];
  
  constructor(
    public workflowTaskPresenter: WorkflowTaskListPresenter,
    public changeDetection: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute,
    @Inject('Window') window: Window,
    zone: NgZone
  ) {
    super(window, zone);
    this.window = window as Window;
    this.initProperty();
  }

  public ngOnInit(): void {
    this.workflowTaskPresenter.setTableProp$.pipe(takeUntil(this.destroy)).subscribe((tableProperty: TableProperty) => {
      this.getWorkflowTask.emit(tableProperty);
      this.tableProperty = tableProperty;
    });
    this.workflowTaskPresenter.deleteRecord$.pipe(takeUntil(this.destroy)).subscribe(
      (workflowTask: WorkflowTask) => { this.deleteWorkflowTask.emit(workflowTask) });
    this.workflowTaskPresenter.tableProp$.subscribe((value: TableProperty<WorkflowTaskFilterRecord>) => {
      this.tableProperty = value;
    });
    this.workflowTaskPresenter.getRooms$.subscribe((value: number) => {
      this.getRooms.emit(value);
    });
    this.activatedRoute.data.subscribe((data: any) => {
      this.workflowDetails = data.workflow;
    });
    this.getFormMasterData.emit();
  }

  /** This method is used for add form  */
  public addForm(): void {
    this.formOpen = !this.formOpen;
    this.closeEditForm();
  }

  /** This method is used for get workflowTask from form presenter and pass to container */
  public addWorkflowTask(value: WorkflowTaskRequest): void {
    let updatedValue: WorkflowTaskRequest = {
      ...value,
      sequence: this.baseResponse.length ? this.baseResponse.length + 1 : 1,
    }
    this.formOpen = false;
    this.isEditable = false;
    this.add.emit(updatedValue);
  }

  /** This method is used for update the workflowTask */
  public updateWorkflowTask(value: WorkflowTaskRequest): void {
    this.baseResponse = this.workflowTaskPresenter.closeForm(this.baseResponse);
    this.isEditable = false;
    this.update.emit(value)
  }

  /** This method is used for close add form  */
  public close(value: boolean): void {
    this.formOpen = value;
  }

  /**
   * Sets table data
   */
  public setTableData(): void {
    this.isFilterApply = this.workflowTaskPresenter.filterApply(this.tableProperty.filter);
    this.workflowTaskPresenter.workflowTasks = this.baseResponse;
    this.workflowTaskPresenter.setTableData();
  }


  /** This method is invoked when the user click on filter button. */
  public openFilter(): void {
    this.getFormMasterData.emit();
    this.workflowTaskPresenter.openFilter();
    this.workflowTaskPresenter.filterOfficeList(this._floors, this._rooms);
  }

  /** create for open modal when action perform */
  public clearFilter(): void {
    this.isFilterApply = false;
    this.workflowTaskPresenter.setTableProperty(new TableProperty());
  }

  /** create for open modal when action perform */
  public openModal(workflowTask: WorkflowTask): void {
    this.workflowTaskPresenter.openModal(workflowTask);
  }

  /** This method is used for edit form  */
  public openEditForm(workflowTask: WorkflowTask): void {
    this.formOpen = false;
    this.isEditable = true;
    this.baseResponse = this.workflowTaskPresenter.closeForm(this.baseResponse, workflowTask);
  }

  /** This method is used for create a copy   */
  public onCreateCopy(workflowTask: WorkflowTask, index: number): void {
    this.formOpen = false;
    this.isEditable = true;
    this.baseResponse = this.workflowTaskPresenter.createCopy(this.baseResponse, workflowTask, index);
  }


  /** This method is used for close edit form */
  public closeEditForm(): void {
    this.isEditable = false;
    this.baseResponse = this.workflowTaskPresenter.closeForm(this.baseResponse);
  }


  /**
   * This method is invoked when the user performs a global search. It resets the selected rows, updates the criteria
   * and then gets the new list of WorkflowTask based on updated criteria.
   * @param searchTerm The search string that has been searched by the user
   */
  public onSearch(searchTerm: string): void {
    this.workflowTaskPresenter.onSearch(searchTerm);
  }

  /** get list of rooms */
  public onGetRooms(floorId: number): void {
    this.getRooms.emit(floorId);
  }

  /** rearrangeTask the workflow task  */
  public rearrangeTask(value: boolean): void {
    if (value) {
      let reArrangeBaseResponse: RearrangeTask[] = this.baseResponse.map((response: WorkflowTask, index: number) => {
        return {
          workflowTaskId: response.workflowTaskConfigId,
          currentIndex: index
        }
      })
      this.reArrange.emit(reArrangeBaseResponse);
    }
    this.isUpdateSequence = !this.isUpdateSequence;
  }
  /** Cancel RearrangeTsk list */
  public cancelRearrangeTask(): void {
    this.isUpdateSequence = false;
    this.getWorkflowTask.emit(this.tableProperty);
  }

  /** rearrange */
  public drop(event: CdkDragDrop<WorkflowTask[]>): void {
    moveItemInArray(this.baseResponse, event.previousIndex, event.currentIndex);
  }

  /** Initializes default properties for the component */
  private initProperty(): void {
    this.tableProp = new Subject();
    this.tableProperty = new TableProperty();
    this.pageSize = pageCount;
    this.destroy = new Subject();
    this.deleteWorkflowTask = new EventEmitter();
    this.add = new EventEmitter();
    this.update = new EventEmitter();
    this.closeForm = new EventEmitter();
    this.reArrange = new EventEmitter();
    this.getRooms = new EventEmitter();
    this.getFormMasterData = new EventEmitter();
    this.getWorkflowTask = new EventEmitter<TableProperty<WorkflowTaskFilterRecord>>();
  }

  /** sets Array as per arranged sequence */
  private reArrangedArray(workFlowList: WorkflowTask[]): void {
    this.workFlowTaskListArray = workFlowList.sort((a: WorkflowTask, b: WorkflowTask) => Number(a.sequence) - Number(b.sequence));
  }
}
