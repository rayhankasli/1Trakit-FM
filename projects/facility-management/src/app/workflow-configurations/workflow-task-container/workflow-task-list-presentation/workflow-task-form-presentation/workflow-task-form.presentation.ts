

/**
 * @name WorkflowTaskPresentationComponent
 * @author  Ronak Patel.
 * @description This is a presentation component for workflow-taskwhich contains the ui and business logic
 */

import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef, Inject, ViewChildren, QueryList, NgZone } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/operators';
//-------------------------------------------------------------------------------//
import { WorkflowTaskFormPresenter } from '../workflow-task-form-presenter/workflow-task-form.presenter';
import { WorkflowTask, Floor, Room, WorkflowTaskRequest, RepeatsOn } from '../../../workflow-configurations.model';
import { WeekDays } from '../../../../core/model/common.model';
import { NgSelectComponent } from '@ng-select/ng-select';
import { BaseCloseSelectDropdown } from 'projects/facility-management/src/app/core/base-classes/base-close-select-dropdown';
import { weekMap } from 'projects/facility-management/src/app/core/utility/utility';

/**
 * WorkflowTaskFormPresentationComponent
 */
@Component({
  selector: '[app-workflow-task-form-ui]',
  templateUrl: './workflow-task-form.presentation.html',
  viewProviders: [WorkflowTaskFormPresenter],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorkflowTaskFormPresentationComponent extends BaseCloseSelectDropdown implements OnInit, OnDestroy {
  /** This will set the data */
  @Input() public set workflowTask(value: WorkflowTask) {
    if (value) {
      this._workflowTask = value;
      this.selectedDayList = this._workflowTask.repeatsOn.repeatsOnDay;
      this.workflowTaskPresenter.bindControlValue(this.workflowTaskFormGroup, this._workflowTask);
      const floor = new Floor();
      floor.floorId = value.floorId;
      this.onFloorChange(floor);
    }
  }

  public get workflowTask(): WorkflowTask {
    return this._workflowTask;
  }

  /** This will set the data */
  @Input() public set weekDays(value: WeekDays[]) {
    if (value) {
      this._weekDays = value;
      this.cdr.detectChanges();
    }
  }
  public get weekDays(): WeekDays[] {
    return this._weekDays;
  }

  /** This will set the data */
  @Input() public set floors(value: Floor[]) {
    if (value) {
      this._floors = value;
    }
  }
  public get floors(): Floor[] {
    return this._floors;
  }

  /** This will set the data */
  @Input() public set rooms(value: Room[]) {
    if (value) {
      this._rooms = value;
    }
  }
  public get rooms(): Room[] {
    return this._rooms;
  }

  /** workflowTask form group of workflowTask form presentation component */
  public workflowTaskFormGroup: FormGroup;

  /** ng-select dropdown reference */
  @ViewChildren(NgSelectComponent) public ngSelects: QueryList<NgSelectComponent>;

  /*** Output of workflowTask form presentation component */
  @Output() public add: EventEmitter<WorkflowTaskRequest>;
  /*** Output of workflowTask form presentation component */
  @Output() public update: EventEmitter<WorkflowTaskRequest>;
  /*** Output of workflowTask form presentation component */
  @Output() public cancel: EventEmitter<WorkflowTask>;
  /*** Output of workflowTask form presentation component */
  @Output() public getRooms: EventEmitter<number | string>;
  /** Determines whether form submitted */
  public isFormSubmitted: boolean = false;
  /** picture Required */
  public picturesRequired: any[];

  /** Selected day list of slots form presentation component */
  public selectedDayList: WeekDays[] | number[];
  /** show/hide Weekly or Others */
  public isWeekly: boolean;

  /** workflowTask of workflowTask form presentation component */
  private _workflowTask: WorkflowTask;
  /** list of weekDays */
  private _weekDays: WeekDays[];
  /** list of floors */
  private _floors: Floor[];
  /** list of rooms */
  private _rooms: Room[];

  constructor(
    private workflowTaskPresenter: WorkflowTaskFormPresenter,
    private cdr: ChangeDetectorRef,
    @Inject('Window') window: Window,
    zone: NgZone
  ) {
    super(window, zone);
    this.window = window as Window;
    this.isWeekly = false;
    this.destroy = new Subject();
    this.add = new EventEmitter(true);
    this.update = new EventEmitter(true);
    this.cancel = new EventEmitter(true);
    this.getRooms = new EventEmitter(true);
    this.picturesRequired = [
      {
        picturesRequiredLabel: 'Yes',
        picturesRequiredValue: true
      },
      {
        picturesRequiredLabel: 'No',
        picturesRequiredValue: false
      }
    ]
    this.workflowTaskFormGroup = this.workflowTaskPresenter.buildForm();
  }

  public ngOnInit(): void {
    // This will subscribe the save event and emit to container component
    this.workflowTaskPresenter.add$.pipe(takeUntil(this.destroy)).subscribe((workflowTask: WorkflowTaskRequest) => {
      if (this.workflowTask && this.workflowTask.workflowTaskConfigId) {
        let updateWorkflow: WorkflowTaskRequest = {
          ...workflowTask,
          isActive: this.workflowTask.isActive,
          workflowId: this.workflowTask.workflowId,
          sequence: this.workflowTask.sequence,
        }
        this.update.emit(updateWorkflow);
      } else {
        this.add.emit(workflowTask);
      }
    });
    this.workflowTaskFormGroup.get('floorId').valueChanges.pipe(takeUntil(this.destroy)).subscribe(id => {
      this.workflowTaskFormGroup.get('floorRoomId').setValue(null);
    })

  }

  public ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }

  /** get locations based on floor Id */
  public onFloorChange(floor: Floor): void {
    if (floor.floorId === -1) {
      this.workflowTaskFormGroup.get('floorRoomId').setValue(null);
      this.workflowTaskFormGroup.get('floorId').clearValidators();
      this.workflowTaskFormGroup.get('floorRoomId').clearValidators();
      this.workflowTaskFormGroup.get('floorId').updateValueAndValidity({ emitEvent: false });
      this.workflowTaskFormGroup.get('floorRoomId').updateValueAndValidity();
    } else {
      this.workflowTaskFormGroup.get('floorId').setValidators([Validators.required]);
      this.workflowTaskFormGroup.get('floorRoomId').setValidators([Validators.required]);
      this.workflowTaskFormGroup.get('floorId').updateValueAndValidity({ emitEvent: false });
      this.workflowTaskFormGroup.get('floorRoomId').updateValueAndValidity();
    }
    this.getRooms.emit(floor.floorId);
  }


  /** bind control base on repeatOn control */
  public onRepeatOnSave(value: RepeatsOn): void {
    value.repeatsOnDay = weekMap(this.weekDays, value.repeatsOnDay);
    this.selectedDayList = value.repeatsOnDay;
    this.workflowTaskFormGroup.get('repeatsOn').setValue(value);
  }

  /** This is used to save the data */
  public saveWorkflowTask(): void {
    this.isFormSubmitted = true;
    this.workflowTaskPresenter.saveWorkflowTask(this.workflowTaskFormGroup);
  }

  /** When user click on cancel */
  public onCancel(): void {
    this.cancel.emit();
  }
}

