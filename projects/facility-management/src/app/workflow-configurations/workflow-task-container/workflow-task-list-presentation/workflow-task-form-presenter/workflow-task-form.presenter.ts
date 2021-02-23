
/**
 * @name WorkflowTaskPresenter
 * @author  Ronak Patel.
 * @description This is a presenter service for workflow-taskwhich contains all logic for presentation component
 */

import { Injectable, ElementRef, ComponentRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { ComponentPortal } from '@angular/cdk/portal';
import { OverlayConfig, Overlay, OverlayRef } from '@angular/cdk/overlay';
//---------------------------------------------------------------------//
import { WorkflowTask, RepeatsOn, WorkflowTaskRequest } from '../../../workflow-configurations.model';
import { WeekDays } from '../../../../core/model/common.model';
import { RepeatOnPresentationComponent }
  from '../../../../shared/components/repeats-on/repeat-on-presentation/repeat-on-presentation.component';
import { weekMap } from 'projects/facility-management/src/app/core/utility/utility';


/**
 * WorkflowTaskFormPresenter
 */
@Injectable()
export class WorkflowTaskFormPresenter {

  /** This is used for subscribing the value of subject add */
  public add$: Observable<WorkflowTaskRequest>;
  /** This property is used to store overlay reference. */
  public overlayRef: OverlayRef
  /** This is used for subscribing the value of subject add */
  public selectedDays$: Observable<RepeatsOn>;
  /** This is used for add camelCaseModelName object */
  private selectedDays: Subject<RepeatsOn> = new Subject();
  /** This is used for add camelCaseModelName object */
  private add: Subject<WorkflowTaskRequest> = new Subject();

  constructor(
    private fb: FormBuilder,
    private overlay: Overlay
  ) {
    this.add$ = this.add.asObservable();
    this.selectedDays$ = this.selectedDays.asObservable();
  }
  /**
   * This will create all the controls for the form group
   * @param workflowTaskFormGroup is the form group
   * @param fb is the form builder which will create the controls
   * @returns It will return the workflowTaskFromGroup with all the controls
   */
  public buildForm(): FormGroup {
    return this.fb.group({
      workflowId: [''],
      workflowTaskConfigId: [''],
      taskName: ['', [Validators.required, Validators.maxLength(30)]],
      floorId: [null, [Validators.required]],
      floorRoomId: [null, [Validators.required]],
      repeatsOn: [null, [Validators.required]],
      description: ['', [Validators.required]],
      isPictureRequired: [true]
    })
  };

  /**
   * This method will validate the form
   * If form is valid then it will
   * @param workflowTaskFormGroup
   */
  public saveWorkflowTask(workflowTaskFormGroup: FormGroup): void {
    if (workflowTaskFormGroup.valid) {
      let workflowTask: WorkflowTask = workflowTaskFormGroup.getRawValue();
      this.add.next(workflowTask);
    }
  }

  /**
   * This will bind the form control value
   * @param userFormGroup is the form group containing all the controls
   * @param workflowTaskis the object storing all the values
   */
  public bindControlValue(workflowTaskFormGroup: FormGroup, workflowTask: WorkflowTask): FormGroup {
    if (workflowTask) {
      workflowTaskFormGroup.patchValue(workflowTask);
    }
    return workflowTaskFormGroup;
  }

  /**
   * Opens repeat on model
   * @param elementRef
   * @param weekDays
   * @param selectedDayList
   */
  public openRepeatOnModel(elementRef: ElementRef, weekDays: WeekDays[], repeatsOn: RepeatsOn): void {
    // set Configuration for overlay
    const overlayConfig: OverlayConfig = new OverlayConfig();
    // Backdrop
    overlayConfig.hasBackdrop = true;
    overlayConfig.backdropClass = '';
    // Position Strategy
    overlayConfig.positionStrategy = this.overlay.position().flexibleConnectedTo(elementRef).withPositions([{
      originX: 'start',
      originY: 'bottom',
      overlayX: 'start',
      overlayY: 'top',
    }]);
    // create overlay
    this.overlayRef = this.overlay.create(overlayConfig);
    // instance of conformation modal component
    const portal: ComponentPortal<RepeatOnPresentationComponent>
      = new ComponentPortal<RepeatOnPresentationComponent>(RepeatOnPresentationComponent);
    // attach component portal
    const componentRef: ComponentRef<RepeatOnPresentationComponent> = this.overlayRef.attach(portal);
    componentRef.instance.weekDays = weekDays;
    componentRef.instance.repeatOn = repeatsOn;
    componentRef.instance.save.subscribe((value: RepeatsOn) => {
      if (value) {
        value.repeatsOnDay = weekMap(weekDays, value.repeatsOnDay);
        this.selectedDays.next(value);
      }
      this.overlayRef.detach();
    });
    // Cancel subscribe
    componentRef.instance.cancel.subscribe(() => {
      this.overlayRef.detach();
    });
  }

}



