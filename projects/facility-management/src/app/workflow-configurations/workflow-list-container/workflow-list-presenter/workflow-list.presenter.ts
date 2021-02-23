/**
 * @author Rayhan Kasli.
 * @description Workflowpresenter service for Workflowpresentation component.
 */

import {
  Injectable, Renderer2, Injector, NgZone, ComponentRef,
  InjectionToken
} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { ComponentPortal, PortalInjector } from '@angular/cdk/portal';
import { OverlayConfig, OverlayRef, Overlay } from '@angular/cdk/overlay';
// ---------------------------------------------- //
import { ConfirmationModalService, ConfirmationModalComponent, TableProperty, CONFIRMATION_TYPE } from 'common-libs';
import { Workflow, WORKFLOW_FILTER, WorkflowFilterRecord, WorkflowSortRecord, Status } from '../../workflow-configurations.model';
import { WorkflowFilterPresentationComponent } from '../workflow-list-presentation/workflow-filter-presentation/workflow-filter.presentation';
import { OfficeMaster, AssignedToMaster } from '../../../core/model/common.model';
import { ModalSize } from 'projects/common-libs/src/projects';
import { BaseTablePresenter } from '../../../shared/base-presenter/base-table.presenter';

/**
 * WorkflowListPresenter
 */
@Injectable()
export class WorkflowListPresenter extends BaseTablePresenter<TableProperty | TableProperty<WorkflowFilterRecord> | Workflow> {

  /** This property is used for subscribe the value of subject deleteWorkflow */
  public createNewCopy$: Observable<Workflow>;
  /** This property is used for subscribe the value of subject  isCheckAll */
  public isCheckAll$: Observable<boolean>;

  /** This property is used for subscribe the value of subject  isCheckAll */
  public officeId$: Observable<number>;

  /** Table prop$ of workflow list presenter */
  public tableProp$: Observable<TableProperty<WorkflowFilterRecord>>;

  /** This boolean is used to indicate whether all rows are selected or not */
  public isCheckAll: Subject<boolean>;

  /** This property is used to store the Workflows that has been retrieved from the API. */
  public workflows: Workflow[];

  /** This property is used to store Workflow  of the selected Workflows */
  public selectedWorkflows: Set<Workflow>;

  /** This property is used to store the criteria that are selected by the user */
  public tableProperty: TableProperty;

  /** Stores the current sorting order */
  public isAscending: boolean;

  /** The message that will be shown in template when no record found */
  public message: string;

  /** Stores the ID of the Workflow that needs to be deleted */
  public workflowId: number;

  /** This property is sue to store selected items. */
  public selectedItems: string[];

  /** filter record */
  public filterRecord: Status;

  /** This property is used for emit when delete Workflow.  */
  private createNewCopy: Subject<Workflow>;
  /** This property is used to store filterData.  */
  private filterData: WorkflowFilterRecord;
  /** This property is used to store sortData.  */
  private sortData: WorkflowSortRecord;

  /** This property is used to store overlayRef. */
  private overlayRef: OverlayRef;


  /** Table prop of Workflowlist presenter */
  private tableProp: Subject<TableProperty<WorkflowFilterRecord>>;

  /** Component ref of data table presentation component */
  private componentRef: ComponentRef<WorkflowFilterPresentationComponent>;
  /** Workflow data of workflow list presenter */
  private workflowData: Subject<Workflow[]>;
  /** Workflow data of workflow list presenter */
  private officeId: Subject<number>;

  constructor(
    public renderer: Renderer2,
    public ngZone: NgZone,
    public modalService: ConfirmationModalService,
    private overlay: Overlay,
    private injector: Injector,
  ) {
    super(modalService, renderer, ngZone)
    this.initProperty();
  }

  /** create for open modal when action perform */
  public openCreateCopyModal(workflow: Workflow): void {
    const modalInstance: ConfirmationModalComponent = this.modalService.openModal();
    modalInstance.confirmationType = CONFIRMATION_TYPE.info; 
    modalInstance.modalSize = ModalSize.Large;
    modalInstance.confirmationMessage = 'Do you want to copy all the existing tasks for this workflow too?';
    modalInstance.positiveAction = 'Yes';
    modalInstance.negativeAction = 'No';
    modalInstance.theme.confirm.icon = 'icon-tick';
    modalInstance.confirmModal.subscribe((value: boolean) => {
      this.createCopyNewCopy(workflow, value);
      this.modalService.closeModal();
    });
  }

  /** createCopyNewCopy */
  public createCopyNewCopy(workflow: Workflow, isCreated: boolean): void {
    this.modalService.closeModal();
    workflow.isTaskCreated = isCreated ? true : false;
    this.createNewCopy.next(workflow);
  }

  /*** This method is invoked when the user click on filter button. */
  public openFilter(): void {
    const overlayConfig: OverlayConfig = new OverlayConfig();
    overlayConfig.hasBackdrop = true;
    overlayConfig.backdropClass = '';
    this.overlayRef = this.overlay.create(overlayConfig);
    const injectionTokens: WeakMap<InjectionToken<WorkflowFilterRecord>, WorkflowFilterRecord>
      = new WeakMap<InjectionToken<WorkflowFilterRecord>, WorkflowFilterRecord>([
        [WORKFLOW_FILTER, this.filterData]
      ]);
    // use injection token for passing value.
    const injector2: PortalInjector = new PortalInjector(this.injector, injectionTokens);
    const portal: ComponentPortal<WorkflowFilterPresentationComponent>
      = new ComponentPortal<WorkflowFilterPresentationComponent>(WorkflowFilterPresentationComponent, null, injector2);
    this.componentRef = this.overlayRef.attach(portal);
    this.overlayRef.backdropClick().subscribe(() => {
      this.overlayRef.detach();
    });
    this.componentRef.instance.filterData.subscribe((data: WorkflowFilterRecord) => {
      this.sortData.sortBy = this.tableProperty.order;
      this.sortData.sortColumn = this.tableProperty.sort;
      this.selectedWorkflows = new Set();
      this.isCheckAll.next(false);
      this.filterData = data;
      Object.keys(data).forEach((key: string) => { if (!data[key]) { delete data[key]; } });
      this.tableProperty = new TableProperty();
      this.tableProperty.filter = data;
      this.tableProperty.filter.isActive = this.filterRecord.isActive;
      this.tableProperty.sort = this.sortData.sortColumn;
      this.tableProperty.order = this.sortData.sortBy;
      this.setTableProperty(this.tableProperty);
    });
    this.componentRef.instance.clearFilter.subscribe(() => {
      this.filterData = null;
      this.overlayRef.detach();
      this.tableProperty.filter = { isActive: this.filterRecord.isActive };
      this.setTableProperty(this.tableProperty);
    });
    this.componentRef.instance.closeFilter.subscribe(() => { this.overlayRef.detach() });
  }
  
  /**
   * Sets table data
   */
  public setTableData(): void {
    if (this.tableProperty.pageNumber > 0 && this.workflows.length === 0) {
      // this.toaster.info('No more records found', 'alert');
      return;
    } else if (this.workflows.length === 0) {
      this.tableProperty.pageNumber = 0;
    }
    const workflowLength: number = this.workflows.length;
    this.workflowData.next(this.workflows);
    this.tableProperty = this.getTableProperty(this.tableProperty, workflowLength);
    this.tableProp.next(this.tableProperty);
  }

  /**
   * Filters apply
   * @param filter
   * @returns true if apply
   */
  public filterApply(filter: WorkflowFilterRecord): boolean {
    if (filter.assignToId || filter.officeId || filter.workflowStartTime) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Sorts apply
   * @param sort
   * @returns true if apply
   */
  public sortApply(sort: string): boolean {
    if (sort) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Filters params
   */
  public filterOfficeList(offices: OfficeMaster[], assigner: AssignedToMaster[]): void {
    if (offices && offices.length > 0) {
      this.componentRef.instance.offices = offices;
      this.componentRef.instance.assignerList = assigner;
    }
  }

  /** This methods is used for filter record base on status  */
  public onStatusChange(status: string): void {
    if (!this.tableProperty.filter.isActive) {
      this.filterRecord.isActive = status === 'active' ? true : false;
      if (this.filterRecord.isActive) {
        this.tableProperty.filter.isActive = true;
      } else {
        this.tableProperty.filter.isActive = false;
      }
    } else {
      this.filterRecord.isActive = status === 'active' ? true : false;
      this.tableProperty.filter.isActive = false;
    }
    this.setTableProperty(this.tableProperty);
  }

  /** Initializes default properties for the component */
  private initProperty(): void {
    this.workflows = [];
    this.selectedWorkflows = new Set();
    this.isAscending = false;
    this.tableProperty.filter = { isActive: true };
    this.tableProperty.filter.isActive = true;
    this.filterRecord = this.tableProperty.filter;
    this.sortData = new WorkflowSortRecord();
    this.selectedItems = [];
    this.isCheckAll = new Subject();
    this.tableProp = new Subject();
    this.workflowData = new Subject();
    this.createNewCopy = new Subject();
    this.createNewCopy$ = this.createNewCopy.asObservable();
    this.isCheckAll$ = this.isCheckAll.asObservable();
    this.tableProp$ = this.tableProp.asObservable();
    this.officeId = new Subject();
    this.officeId$ = this.officeId.asObservable();
  }
}

