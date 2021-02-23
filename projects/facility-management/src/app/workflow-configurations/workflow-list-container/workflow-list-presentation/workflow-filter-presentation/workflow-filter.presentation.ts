/**
 * @author Rayhan Kasli.
 * @description This is data filter presentation component. Used for filter data base on field.
 */

import { Component, ChangeDetectionStrategy, Inject, Optional, Input, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subject } from 'rxjs/Subject';
import { BsDatepickerConfig } from 'ngx-bootstrap';
// ---------------------------------------------------------- //
import { WORKFLOW_FILTER, WorkflowFilterRecord } from '../../../workflow-configurations.model';
import { WorkflowFilterPresenter } from '../workflow-filter-presenter/workflow-filter.presenter';
import { OfficeMaster, AssignedToMaster } from 'projects/facility-management/src/app/core/model/common.model';
import { Observable } from 'rxjs';

/** Time format used for datePipe in timePicker */
export const TIME_FORMAT: string = 'shortTime';

/**
 * WorkflowFilterPresentationComponent
 */
@Component({
  selector: 'app-workflow-filter',
  templateUrl: './workflow-filter.presentation.html',
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [WorkflowFilterPresenter]
})
export class WorkflowFilterPresentationComponent {

  /** Sets input for office list */
  @Input() public set offices(value: OfficeMaster[]) {
    this._offices = value;
  }
  public get offices(): OfficeMaster[] {
    return this._offices;
  }

  /** Sets input */
  @Input() public set assignerList(value: AssignedToMaster[]) {
    if (value) {
      this._assigner = value;
    }
  }
  public get assignerList(): AssignedToMaster[] {
    return this._assigner;
  }

  /** Output of customer form presentation component */
  @Output() public officeId: EventEmitter<number>;

  /** Clear filter$ of workflow filter presentation component */
  public clearFilter$: Observable<boolean>;
  /** This property is used to create for filter Form. */
  public workflowFormGroup: FormGroup;
  /** This property is used for date picker. */
  public bsConfig: BsDatepickerConfig;
  /** This property is used for emit when filter apply. */
  public filterData: Subject<WorkflowFilterRecord>;
  /** This property is used for emit when filter close. */
  public closeFilter: Subject<boolean>;
  /** This property is used for emit when filter data cleared. */
  public clearFilter: Subject<boolean>;
  /** Determines whether filter apply is */
  public isFilterApply: boolean;
  /** Determines whether form submitted is */
  public isFormSubmitted: boolean;

  /** Date format of workflow form presentation component */
  public readonly dateFormat: string = TIME_FORMAT;


  /** create for getter setter */
  private _offices: OfficeMaster[];
  /** create for getter setter */
  private _assigner: AssignedToMaster[];

  constructor(
    private presenter: WorkflowFilterPresenter,
    private cdr: ChangeDetectorRef,
    @Optional() @Inject(WORKFLOW_FILTER) private data: WorkflowFilterRecord,
  ) {
    this.workflowFormGroup = this.presenter.buildForm();
    this.filterData = new Subject();
    this.closeFilter = new Subject();
    this.clearFilter = new Subject();
    this.clearFilter$ = this.clearFilter.asObservable();
    this.bsConfig = new BsDatepickerConfig();
    this.bsConfig.containerClass = 'theme-primary';
    this.bsConfig.adaptivePosition = false;
    this.isFilterApply = false;
    this.officeId = new EventEmitter();
    if (this.data) {
      this.isFilterApply = true;
      this.presenter.bindValue(this.workflowFormGroup, this.data);
      this.workflowFormGroup.markAsDirty();
    }
  }


  /**
   * This method is invoke when user click on Reset button.
   * Use for reset from value.
   */
  public onReset(): void {
    this.workflowFormGroup.reset();
  }

  /**
   * This method is invoke when user click on apply button.
   * Use for emit form value to parent.
   */
  public onApplyFilter(): void {
    let workflowFilter: WorkflowFilterRecord = this.presenter.filterWorkFlowData(this.workflowFormGroup);
    this.filterData.next(workflowFilter);
    this.filterData.complete();
    this.dismiss();
  }

  /**
   * Changes office
   * @param event
   */
  public changeOffice(office: OfficeMaster): void {
    if (office) {
      // this.officeId.emit(office.officeId);
      // this.workflowFormGroup.get('assignToId').setValue(null);
    }
  }

  /**
   * This method is invoke when user click dismiss button.
   */
  public dismiss(): void {
    this.closeFilter.next(true);
    this.closeFilter.complete();
  }

  /**
   * This method is invoke when user click clear filter button.
   */
  public onClearFilter(): void {
    this.workflowFormGroup.reset();
    this.clearFilter.next(true);
    this.clearFilter.complete();
  }
}
