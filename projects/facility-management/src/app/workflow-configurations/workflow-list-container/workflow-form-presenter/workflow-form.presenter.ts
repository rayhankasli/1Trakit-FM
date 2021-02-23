
/**
 * @name WorkflowFormPresenter
 * @author Enter Your Name Here
 * @description This is a presenter service for workflowwhich contains all logic for presentation component
 */

import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Workflow } from '../../workflow-configurations.model';

/**
 * WorkflowFormPresenter
 */
@Injectable()
export class WorkflowFormPresenter {


  /** This is used for subscribing the value of subject add */
  public add$: Observable<Workflow>;
  /** This is used for add camelCaseModelName object */
  private add: Subject<Workflow> = new Subject();
  /** Next workflow id of workflow form presenter */
  private nextWorkflowId: number;
  /** Next workflow id of workflow form presenter */
  private newWorkflowName: string;

  constructor(private fb: FormBuilder) {
    this.add$ = this.add.asObservable();
    this.nextWorkflowId = 1;
  }
  /**
   * This will create all the controls for the form group
   * @param workflowFormGroup is the form group
   * @param fb is the form builder which will create the controls
   * @returns It will return the workflowFromGroup with all the controls
   */
  public buildForm(): FormGroup {
    return this.fb.group({
      workflowId: [],
      workflowName: ['', [Validators.required, Validators.maxLength(30)]],
      officeId: [null, [Validators.required, Validators.maxLength(30)]],
      // workflowStartTime: this.fb.group({
      //     fromTime: ['', Validators.required]
      //   }),
      workflowStartTime: ['', [Validators.required]],
      assignedToId: [null, [Validators.required]]
    })
  };

  /**
   * News slot name id
   * @param id
   */
  public newWorkflowId(lastWorkflowName: string): void {
    if (lastWorkflowName) {
      let nextId: string[] = lastWorkflowName.split(/(\d+)/);
      let convertInt: number = parseInt(nextId[1]);
      this.nextWorkflowId = this.nextWorkflowId + convertInt;
      this.newWorkflowName = 'Work Flow Name ' + this.nextWorkflowId;
    }
  }

  /**
   * This method will validate the form
   * If form is valid then it will
   * @param workflowFormGroup
   */
  public saveWorkflow(workflowFormGroup: FormGroup): void {
    if (workflowFormGroup.valid) {
      let workflow: Workflow = workflowFormGroup.getRawValue();
      this.add.next(workflow);
    }
    else {
      // show any custom validation here
    }
  }

  /**
   * This will bind the form control value
   * @param userFormGroup is the form group containing all the controls
   * @param workflowis the object storing all the values
   */
  public bindControlValue(workflowFormGroup: FormGroup, workflow: Workflow): FormGroup {
    if (workflow) {
      workflowFormGroup.patchValue(workflow);
    }
    return workflowFormGroup;
  }
}



