
/**
 * @author Rayhan Kasli.
 * @description This is base class to represent the common members of desktop and mobile component.
 */

import { ChangeDetectorRef, Input, Output, EventEmitter, NgZone, Inject } from '@angular/core';
import { TableProperty } from 'common-libs';
// --------------------------------------------- //
import { WorkflowListPresenter } from '../workflow-list-presenter/workflow-list.presenter';
import { Workflow, WorkflowFilterRecord, ToggleStatus } from '../../workflow-configurations.model';
import { OfficeMaster, AssignedToMaster } from '../../../core/model/common.model';
import { BaseCloseSelectDropdown } from '../../../core/base-classes/base-close-select-dropdown';

/**
 * workflow list presentation base
 */
export class WorkflowListPresentationBase extends BaseCloseSelectDropdown {

  /** This property is used to store the workflows that has been retrieved from the API. */
  @Input() public set workflows(value: Workflow[]) {
    this._workflows = value;
    if (value) {
      // this.lastWorkflow = value.length > 0 && value[0].lastWorkflowName;
    }
  };

  public get workflows(): Workflow[] {
    return this._workflows;
  }


  /** Sets input for office list */
  @Input() public set offices(value: OfficeMaster[]) {
    this._offices = value;
  }
  public get offices(): OfficeMaster[] {
    return this._offices;
  }

  /** Sets input */
  @Input() public set assigner(value: AssignedToMaster[]) {
    if (value) {
      this._assigner = value;
    }
  }
  public get assigner(): AssignedToMaster[] {
    return this._assigner;
  }

  /*** Output of customer form presentation component */
  @Output() public addWorkflow: EventEmitter<Workflow>;
  /*** Output of customer form presentation component */
  @Output() public updateWorkflow: EventEmitter<Workflow>;
  /** This property is used for emit data to container component */
  @Output() public getOffices: EventEmitter<void>;
  /** Output  of workflow list presentation base */
  @Output() public toggleWorkflowStatus: EventEmitter<ToggleStatus>;


  /** This boolean is used to indicate whether all rows are selected or not  */
  public isCheckAll: boolean;

  /** This property is used for filter apply or not. */
  public isFilterApply: boolean;
  /** This property is used for filter apply or not. */
  public lastWorkflow: string;


  /** This property is used to store the criteria that are selected by the user */
  public tableProperty: TableProperty<WorkflowFilterRecord>;

  /** Work flow status of workflow list desktop presentation component */
  public workflowStatus: string;

  /** Workflows of workflow list presentation base */
  private _workflows: Workflow[];

  /** create for getter setter */
  private _offices: OfficeMaster[];

  /** assigner of mailConfigurations presentation component */
  private _assigner: AssignedToMaster[];

  constructor(
    public workflowPresenter: WorkflowListPresenter,
    public changeDetection: ChangeDetectorRef,
    @Inject('Window') window: Window,
    zone: NgZone
  ) {
    super(window, zone);
    this.window = window as Window;
    this.addWorkflow = new EventEmitter();
    this.updateWorkflow = new EventEmitter();
    this.toggleWorkflowStatus = new EventEmitter();
    this.getOffices = new EventEmitter<void>();
    this.workflowStatus = 'active';
  }

  /**
   * This method is invoked when the user changes the current page size.
   * @param pageSize The page number that needs to be set.
   */
  public onPageSizeChange(pageSize: number): void {
    this.workflowPresenter.onPageSizeChange(pageSize);
  }

  /**
   * This method is invoked when the user changes the page number from the pagination toolbar.
   * @param pageNumber The number to which the table should switch to
   */
  public onPageChange(pageNumber: number): void {
    this.workflowPresenter.onPageChange(pageNumber);
  }

  /** This method is invoked when the user click on filter button. */
  public openFilter(): void {
    // this.getOfficeList();
    this.workflowPresenter.openFilter();
    this.workflowPresenter.filterOfficeList(this._offices, this._assigner);
  }

  /** create for open modal when action perform */
  public clearFilter(): void {
    this.isFilterApply = false;
    this.workflowPresenter.setTableProperty(new TableProperty());
  }

  /**
   * This method is invoked when the user performs a global search. It resets the selected rows, updates the criteria
   * and then gets the new list of Workflow based on updated criteria.
   * @param searchTerm The search string that has been searched by the user
   */
  public onSearch(searchTerm: string): void {
    this.workflowPresenter.onSearch(searchTerm);
  }


  /** create for open modal when action perform */
  public openModal(workflow: Workflow): void {
    this.workflowPresenter.openModal(workflow);
  }

  /**
   * Adds work flow
   * @param event
   */
  public addWorkNewFlow(workflow: Workflow): void {
    this.addWorkflow.emit(workflow);
  }
  /**
   * Adds work flow
   * @param event
   */
  public updateWorkFlow(workflow: Workflow): void {
    this.workflows && this.workflows.forEach((response: Workflow) => {
      response.isEditable = false
    });
    this.updateWorkflow.emit(workflow);
  }

  /** Gets office list */
  public getOfficeList(): void {
    this.getOffices.emit();
  }
  /** This method is for toggle status */
  public onToggleStatus(workflow: any): void {
    this.toggleWorkflowStatus.emit(
      {
        id: workflow.workflowId ? workflow.workflowId : workflow.id,
        isActive: this.workflowStatus === 'active' ? false : true
      });
  }

}
