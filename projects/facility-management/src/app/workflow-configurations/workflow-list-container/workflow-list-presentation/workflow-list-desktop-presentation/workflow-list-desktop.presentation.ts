/**
 * @author Rayhan Kasli.
 * @description This is data table desktop presentation component.To represent data in the desktop view.
 */
import {
  Component,
  ChangeDetectorRef,
  OnInit,
  OnDestroy,
  ViewChildren,
  QueryList,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  HostBinding,
  Inject,
  NgZone,
} from '@angular/core';
import { takeUntil } from 'rxjs/operators/takeUntil';
import { Subject } from 'rxjs/Subject';
import { SortingOrderDirective, SortingOrder } from 'common-libs';
//-----------------------------------------------------------------------------------------------------//
import { WorkflowListPresentationBase } from '../../workflow-list-presentation-base/workflow-list.presentation.base';
import { WorkflowListPresenter } from '../../workflow-list-presenter/workflow-list.presenter';
import { Workflow } from '../../../workflow-configurations.model';
import { Permission } from '../../../../core/enums/role-permissions.enum'
/** Time format used for datePipe in timePicker */
export const TIME_FORMAT: string = 'shortTime';
/**
 * WorkflowListDesktopPresentationComponent
 */
@Component({
  selector: 'app-workflow-list-desktop-presentation',
  templateUrl: './workflow-list-desktop.presentation.html',
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkflowListDesktopPresentationComponent
  extends WorkflowListPresentationBase
  implements OnInit, OnDestroy {

  @HostBinding('class') public class: string;
  /** Sets input */
  @Input() public set addWorkFlow(response: boolean) {
    this._addWorkFlow = response;
    if (response) {
      this.closeEditForm();
    }
  }
  public get addWorkFlow(): boolean {
    return this._addWorkFlow;
  }


  /**
   * This enum is return workflowEnum enum props.
   */
  public get workflowEnum(): typeof Permission.WorkFlowConfiguration {
    return Permission.WorkFlowConfiguration;
  }

  /*** Output of customer form presentation component */
  @Output() public closeWorkFlowForm: EventEmitter<boolean>;
  /*** Output of customer form presentation component */
  @Output() public getOffices: EventEmitter<void>;

  /** This property is used to store QueryList of SortingOrderDirective */
  @ViewChildren(SortingOrderDirective) public sortingColumns: QueryList<
    SortingOrderDirective
  >;

  /** Work flow status of workflow list desktop presentation component */
  public isCreateNewCopy: boolean;

  /** Date format of workflow form presentation component */
  public readonly dateFormat: string = TIME_FORMAT;

  /** Determines whether add new slot is */
  private _addWorkFlow: boolean;
  constructor(
    public workflowPresenter: WorkflowListPresenter,
    public changeDetection: ChangeDetectorRef,
    @Inject('Window') window: Window,
    zone: NgZone
  ) {
    super(workflowPresenter, changeDetection, window, zone);
    this.window = window as Window;
    this.destroy = new Subject();
    this.closeWorkFlowForm = new EventEmitter();
    this.getOffices = new EventEmitter();
    this.class = 'd-flex flex-column h-100 overflow-hidden';
  }

  public ngOnInit(): void {
    this.workflowPresenter.createNewCopy$.subscribe((workflow: Workflow)=>{
      if(workflow) {
        this.createNewCopy(workflow);
      }
    });
    this.workflowPresenter.isCheckAll$
      .pipe(takeUntil(this.destroy))
      .subscribe((isCheckAll: boolean) => {
        this.isCheckAll = isCheckAll;
      });
  }

  /**
   * This method is invoked when the user clicks on sorting icons. It sets the sort related criteria and queries the server
   * to get the updated list of workflows.
   * @param column The column on which sorting needs to be performed.
   * @param sortingOrder The sort order by which the column needs to be sorted.
   */
  public onSortOrder(column: string, sortingOrder: SortingOrder): void {
    this.workflowPresenter.onSortOrder(
      column,
      sortingOrder,
      this.sortingColumns
    );
  }

  /**
   * Edits reasons not picked
   * @param reasonsNotPicked
   */
  public editWorkFlow(workflow: Workflow): void {
    this._addWorkFlow = false;
    this.closeForm(false);
    this.getOffices.emit();
    this.workflows && this.workflows.filter((data: Workflow) => {
      if (data.isEditable) {
        data.isEditable = false;
      }
      if (workflow === data) {
        data.isEditable = true;
      }
    });
  }

  /**
   * Creates new copy
   * @param workflow
   */
  public createNewCopy(workflow: Workflow): void {
    this._addWorkFlow = false;
    this.closeForm(false);
    this.getOffices.emit();
    this.workflows && this.workflows.filter((data: Workflow) => {
      if (data.isCreateNewCopy) {
        data.isCreateNewCopy = false;
      }
      if (workflow === data) {
        data.isCreateNewCopy = true;
      }
    });
  }

  /** create for open modal when action perform */
  public openCreateCopyModal(workflow: Workflow): void {
      this.workflowPresenter.openCreateCopyModal(workflow);
  }

  /**
   * Closes edit form
   */
  public closeEditForm(): void {
    this.workflows && this.workflows.filter((data: Workflow) => {
      if (data.isEditable) {
        data.isEditable = false;
      }
      if (data.isCreateNewCopy) {
        data.isCreateNewCopy = false;
      }
    })
  }

  /**
   * Cancels slot
   * @param event
   */
  public closeForm(event: boolean): void {
    this.closeWorkFlowForm.emit(event);
    this.closeEditForm();
  }

}
