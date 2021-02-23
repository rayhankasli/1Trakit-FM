/**
 * @author  Ronak Patel.
 * @description This is data filter presentation component. Used for filter data base on field.
 */

import { Component, ChangeDetectionStrategy, Inject, Optional, Input, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subject } from 'rxjs/Subject';
import { BsDatepickerConfig } from 'ngx-bootstrap';
// ---------------------------------------------------------- //
import { WORKFLOWTASK_FILTER, WorkflowTaskFilterRecord, Floor, Room } from '../../../workflow-configurations.model';
import { WorkflowTaskFilterPresenter } from '../workflow-task-filter-presenter/workflow-task-filter.presenter';
import { takeUntil } from 'rxjs/operators';

/**
 * WorkflowTaskFilterPresentationComponent
 */
@Component({
  selector: 'app-workflow-task-filter',
  templateUrl: './workflow-task-filter.presentation.html',
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [WorkflowTaskFilterPresenter]
})
export class WorkflowTaskFilterPresentationComponent {

  /** This will set the data */
  @Input() public set floorsFilter(value: Floor[]) {
    if (value) {
      this._floorsFilter = value;
    }
  }
  public get floorsFilter(): Floor[] {
    return this._floorsFilter;
  }

  /** This will set the data */
  @Input() public set filterRooms(value: Room[]) {
    if (value) {
      this._filterRooms = value;
    }
  }
  public get filterRooms(): Room[] {
    return this._filterRooms;
  }

  /** This property is used to create for filter Form. */
  public workflowTaskFilterFormGroup: FormGroup;
  /** This property is used for date picker. */
  public bsConfig: BsDatepickerConfig;
  /** This property is used for emit when filter apply. */
  public filterData: Subject<WorkflowTaskFilterRecord>;
  /** This property is used for emit when filter close. */
  public closeFilter: Subject<boolean>;
  /** This property is used for emit when filter data cleared. */
  public clearFilter: Subject<boolean>;
  /** Determines whether filter apply is */
  public isFilterApply: boolean;
  /** Determines whether form submitted is */
  public isFormSubmitted: boolean;
  /** emit floor id to get list of rooms */
  public getRooms: EventEmitter<number>;

  /** Destroy of workflowTask form presentation component */
  private destroy: Subject<void>;
  /** list of floors */
  private _floorsFilter: Floor[];
  /** list of rooms */
  private _filterRooms: Room[];

  constructor(
    private presenter: WorkflowTaskFilterPresenter,
    @Optional() @Inject(WORKFLOWTASK_FILTER) private data: WorkflowTaskFilterRecord,
  ) {
    this.workflowTaskFilterFormGroup = this.presenter.buildForm();
    this.filterData = new Subject();
    this.closeFilter = new Subject();
    this.clearFilter = new Subject();
    this.bsConfig = new BsDatepickerConfig();
    this.bsConfig.containerClass = 'theme-primary';
    this.bsConfig.adaptivePosition = false;
    this.isFilterApply = false;
    if (this.data) {
      this.isFilterApply = true;
      this.workflowTaskFilterFormGroup.patchValue(data);
      this.workflowTaskFilterFormGroup.markAsDirty();
    }
    this.destroy = new Subject();
    this.getRooms = new EventEmitter();
    this.workflowTaskFilterFormGroup.get('floorId').valueChanges.pipe(takeUntil(this.destroy))
      .subscribe(floorId => this.workflowTaskFilterFormGroup.get('floorRoomId').reset(null));
  }

  /**
   * This method is invoke when user click on Reset button.
   * Use for reset from value.
   */
  public onReset(): void {
    this.workflowTaskFilterFormGroup.reset();
  }

  /**
   * This method is invoke when user click on apply button.
   * Use for emit form value to parent.
   */
  public onApplyFilter(): void {
    this.filterData.next(this.workflowTaskFilterFormGroup.value);
    this.filterData.complete();
    this.dismiss();
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
    this.workflowTaskFilterFormGroup.reset();
    this.clearFilter.next(true);
    this.clearFilter.complete();
  }

  /** emits floor id to get rooms */
  public onRoomChange(floor: Floor): void {
    this.getRooms.emit(floor.floorId);
  }
}
