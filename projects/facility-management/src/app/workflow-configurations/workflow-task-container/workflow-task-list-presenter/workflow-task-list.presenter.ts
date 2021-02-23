/**
 * @author  Ronak Patel.
 * @description WorkflowTaskpresenter service for WorkflowTaskpresentation component.
 */

import {
  Injectable, Injector, ComponentRef,
  InjectionToken
} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { ComponentPortal, PortalInjector } from '@angular/cdk/portal';
import { OverlayConfig, OverlayRef, Overlay } from '@angular/cdk/overlay';
// ---------------------------------------------- //
import { ConfirmationModalService, TableProperty } from 'common-libs';
import {
  WorkflowTask,
  WORKFLOWTASK_FILTER,
  WorkflowTaskFilterRecord,

  Floor,
  Room
} from '../../workflow-configurations.model';
import { WorkflowTaskFilterPresentationComponent }
  from '../workflow-task-list-presentation/workflow-task-filter-presentation/workflow-task-filter.presentation';
import { WeekDays } from '../../../core/model/common.model';
import { BaseTablePresenter } from '../../../shared/base-presenter/base-table.presenter';

/**
 * WorkflowTaskListPresenter
 */
@Injectable()
export class WorkflowTaskListPresenter extends BaseTablePresenter<TableProperty | TableProperty<WorkflowTaskFilterRecord> | WorkflowTask> {


  /** Table prop$ of workflowTask list presenter */
  public tableProp$: Observable<TableProperty<WorkflowTaskFilterRecord>>;

  /** get list of Rooms */
  public getRooms$: Observable<number>;

  /** This property is used for emit when delete WorkflowTask.  */
  public deleteWorkflowTask$: Observable<WorkflowTask>;

  /** This property is used to store the WorkflowTasks that has been retrieved from the API. */
  public workflowTasks: WorkflowTask[];

  /** This property is used to store the criteria that are selected by the user */
  public tableProperty: TableProperty;

  /** Stores the current sorting order */
  public isAscending: boolean;

  /** The message that will be shown in template when no record found */
  public message: string;

  /** Stores the ID of the WorkflowTask that needs to be deleted */
  public workflowTaskId: number;
  /** isActive Status */
  public isActive: boolean;

  /** This property is used to store searchText . */
  public searchText: string;
  /** This property for store filter record */
  public filterRecord: WorkflowTaskFilterRecord;

  public clientId: string;

  /** get list of Rooms */
  private getRooms: Subject<number>;

  /** This property is used to store filterData.  */
  private filterData: WorkflowTaskFilterRecord;

  /** This property is used to store overlayRef. */
  private overlayRef: OverlayRef;

  /** Table prop of WorkflowTasklist presenter */
  private tableProp: Subject<TableProperty<WorkflowTaskFilterRecord>>;


  /** WorkflowTask data of workflowTask list presenter */
  private workflowTaskData: Subject<WorkflowTask[]>;
  /** component reference */
  private componentRef: ComponentRef<WorkflowTaskFilterPresentationComponent>;
  constructor(
    public modalService: ConfirmationModalService,
    private overlay: Overlay,
    private injector: Injector,
  ) {
    super(modalService)
    this.initProperty();
  }

  /**
   * This method is invoked when the user performs a global search. It resets the selected rows, updates the criteria
   * and then gets the new list of WorkflowTaskbased on updated criteria.
   * @param searchTerm The search string that has been searched by the user
   */
  public onSearch(searchTerm: string): void {
    if (searchTerm) {
      let filter: WorkflowTaskFilterRecord = this.tableProperty.filter;
      this.tableProperty = new TableProperty();
      this.tableProperty.search = searchTerm;
      this.tableProperty.filter = filter;
    } else {
      this.tableProperty = new TableProperty();
    }
    if (this.searchText === searchTerm) { return; }
    this.searchText = searchTerm;
    this.setTableProperty(this.tableProperty);
  }

  /**
   * Filters params
   */
  public filterOfficeList(floors: Floor[], rooms: Room[]): void {
    if (floors && floors.length > 0) {
      this.componentRef.instance.floorsFilter = floors;
      this.componentRef.instance.filterRooms = rooms;
    }
  }

  /*** This method is invoked when the user click on filter button. */
  public openFilter(): void {
    const overlayConfig: OverlayConfig = new OverlayConfig();
    overlayConfig.hasBackdrop = true;
    overlayConfig.backdropClass = '';
    this.overlayRef = this.overlay.create(overlayConfig);
    const injectionTokens: WeakMap<InjectionToken<WorkflowTaskFilterRecord>, WorkflowTaskFilterRecord>
      = new WeakMap<InjectionToken<WorkflowTaskFilterRecord>, WorkflowTaskFilterRecord>([
        [WORKFLOWTASK_FILTER, this.filterData]
      ]);
    // use injection token for passing value.
    const injector2: PortalInjector = new PortalInjector(this.injector, injectionTokens);
    const portal: ComponentPortal<WorkflowTaskFilterPresentationComponent>
      = new ComponentPortal<WorkflowTaskFilterPresentationComponent>(WorkflowTaskFilterPresentationComponent, null, injector2);
    this.componentRef = this.overlayRef.attach(portal);
    this.overlayRef.backdropClick().subscribe(() => {
      this.overlayRef.detach();
    });
    this.componentRef.instance.filterData.subscribe((data: WorkflowTaskFilterRecord) => {
      this.filterData = {...data};
      Object.keys(data).forEach((key: string) => { if (!data[key]) { delete data[key]; } });
      this.tableProperty = new TableProperty();
      // convert floorId All/(-1) to null
      data.floorId = +data.floorId === -1 ? null : data.floorId;
      this.tableProperty.filter = data;
      this.setTableProperty(this.tableProperty);
    });
    this.componentRef.instance.getRooms.subscribe((floorId: number) => {
      this.getRooms.next(floorId);
    })
    this.componentRef.instance.clearFilter.subscribe(() => {
      this.filterData = null;
      this.tableProperty.filter = null;
      this.overlayRef.detach();
      this.setTableProperty(this.tableProperty);
    });
    this.componentRef.instance.closeFilter.subscribe(() => { this.overlayRef.detach() })
  }
  /** passed data to filter presentation */
  public passWeedDays(weekDays: WeekDays[]): void {
    if (!this.componentRef) { return; }
    // this.componentRef.instance.weekDays = weekDays;
  }
  /** passed data to filter presentation */
  public passFloors(floors: Floor[]): void {
    if (!this.componentRef) { return; }
    this.componentRef.instance.floorsFilter = floors;
  }
  /** passed data to filter presentation */
  public passRooms(rooms: Room[]): void {
    if (!this.componentRef) { return; }
    this.componentRef.instance.filterRooms = rooms;

  }

  /**
   * Sets table data
   */
  public setTableData(): void {
    if (this.tableProperty.pageNumber > 0 && this.workflowTasks.length === 0) {
      return;
    } else if (this.workflowTasks.length === 0) {
      this.tableProperty.pageNumber = 0;
    }
    const workflowTaskLength: number = this.workflowTasks.length;
    this.workflowTaskData.next(this.workflowTasks);
    this.tableProperty = this.getTableProperty(this.tableProperty, workflowTaskLength);
    this.tableProp.next(this.tableProperty);
  }

  /**
   * This Method is used for close the inline form
   * @param workflowTasks - list of all workflowTask
   * @param workflowTask - selected workflowTask
   */
  public closeForm(workflowTasks: WorkflowTask[], workflowTask?: WorkflowTask): WorkflowTask[] {
    workflowTasks && workflowTasks.map((value: WorkflowTask) => {
      if (value.isEditable) {
        value.isEditable = false;
      }
      if (workflowTask === value) {
        value.isEditable = true;
      }
      if (value.workflowTaskConfigId !== 0) {
        return value;
      }
    });
    workflowTasks = workflowTasks && workflowTasks.filter((value: WorkflowTask) => value.workflowTaskConfigId !== 0);
    return workflowTasks;
  }

  /** new copy */
  public createCopy(workflowTasks: WorkflowTask[], workflowTask: WorkflowTask, index: number): WorkflowTask[] {
    let workflow: WorkflowTask[];
    workflowTasks = workflowTasks.filter((task: WorkflowTask) => task.workflowTaskConfigId);
    const newCopy: WorkflowTask = { ...workflowTask };
    newCopy.workflowTaskConfigId = 0;
    workflowTasks.splice(index + 1, 0, newCopy);
    workflowTasks && workflowTasks.map((value: WorkflowTask) => {
      if (value.isEditable) {
        value.isEditable = false;
      }
      if (!value.workflowTaskConfigId) {
        value.isEditable = true;
      }
    });
    return workflowTasks;
  }

  /**
   * Filters apply
   * @param filter
   * @returns true if apply
   */
  public filterApply(filter: WorkflowTaskFilterRecord): boolean {
    if (filter) {
      return true;
    } else {
      return false;
    }
  }

  /** Initializes default properties for the component */
  private initProperty(): void {
    this.workflowTasks = [];
    this.isAscending = false;
    this.searchText = '';
    this.tableProp = new Subject();
    this.workflowTaskData = new Subject();
    this.tableProp$ = this.tableProp.asObservable();
    this.getRooms = new Subject();
    this.getRooms$ = this.getRooms.asObservable();
  }
}

