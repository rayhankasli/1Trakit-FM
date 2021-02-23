/**
 * @author Enter Your Name Here.
 * @description This class is used for Workflowpresenter component.
 */

import { Injectable } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { WorkflowFilterRecord } from '../../../workflow-configurations.model';

/**
 * WorkflowFilterPresenter
 */
@Injectable()
export class WorkflowFilterPresenter {
  constructor(private fb: FormBuilder) {}

  /**
   * This will create all the controls for the form group
   * @param workflowFormGroup is the form group
   * @param fb is the form builder which will create the controls
   * @returns It will return the workflowFromGroup with all the controls
   */
  public buildForm(): FormGroup {
    return this.fb.group({
      officeId: ['', [Validators.maxLength(30)]],
      workflowStartTime: [''],
      assignToId: [''],
    });
  }

  /**
   * Filters data
   * @param formData 
   * @returns data 
   */
  public filterWorkFlowData(formData: FormGroup): WorkflowFilterRecord {
    let workflowFilter: WorkflowFilterRecord = formData.getRawValue();
    return workflowFilter
  }
  /**
   * Filters data
   * @param formData 
   * @returns data 
   */
  public bindValue(formData: FormGroup, data: WorkflowFilterRecord): FormGroup {
    formData.patchValue(data);
    return formData;
  }
}
