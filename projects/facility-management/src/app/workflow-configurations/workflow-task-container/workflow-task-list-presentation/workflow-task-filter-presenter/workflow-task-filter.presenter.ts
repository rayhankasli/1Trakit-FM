/**
 * @author  Ronak Patel.
 * @description This class is used for WorkflowTaskpresenter component.
 */

import { Injectable } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { WorkflowTask } from '../../../workflow-configurations.model';
import { Overlay } from '@angular/cdk/overlay';

/**
 * WorkflowTaskFilterPresenter
 */
@Injectable()
export class WorkflowTaskFilterPresenter {
  constructor(
    private fb: FormBuilder
    ) {
  }

  /**
   * This will create all the controls for the form group
   * @param workflowTaskFormGroup is the form group
   * @param fb is the form builder which will create the controls
   * @returns It will return the workflowTaskFromGroup with all the controls
   */
  public buildForm(): FormGroup {
    return this.fb.group({
      floorId: [null],
      floorRoomId: [null, [Validators.maxLength(30)]],
    })
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

}

