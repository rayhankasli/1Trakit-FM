/**
 * @name SchedulingDetailsPresenter
 * @author Shahbaz Shaikh
 * @description This is a presenter service for scheduling-detailswhich contains all logic for presentation component
 */

import { ChangeDetectorRef, Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { DefaultCopyItConfiguration } from '../../../shared/modules/copy-it-print-details/models/copyit-info';
// ------------------------------------------------------------------- //
import { CopyItInfo } from '../../../shared/modules/copy-it-print-details/models/copyit-info/copyit-info';


/**
 * SchedulingDetailsFormPresenter
 */
@Injectable()
export class SchedulingDetailsFormPresenter {

  /** Determines whether form submitted is ture or false */
  public isFormSubmitted: boolean;
  /** This is used for subscribing the value of subject add */
  public save$: Observable<CopyItInfo>;

  /** This is used for add camelCaseModelName object */
  private save: Subject<CopyItInfo>;

  constructor(
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    this.isFormSubmitted = false;
    this.save = new Subject<CopyItInfo>();
    this.save$ = this.save.asObservable();
  }

  /**
   * This will create all the controls for the form group
   * @param schedulingDetailsFormGroup is the form group
   * @param fb is the form builder which will create the controls
   * @returns It will return the schedulingDetailsFromGroup with all the controls
   */
  public buildForm(): FormGroup {
    return this.formBuilder.group({
      dueDate: ['', [Validators.required]],
      dueTime: ['', [Validators.required]],
    });
  }

  /**
   * This method will validate the form
   * If form is valid then it will
   * @param schedulingDetailsFormGroup
   */
  public saveSchedulingDetails(schedulingDetailsFormGroup: FormGroup, copyItObj: CopyItInfo): void {
    if (schedulingDetailsFormGroup.valid) {
      this.isFormSubmitted = false;
      this.cdr.detectChanges();
      let dataObj: CopyItInfo;
      if (copyItObj) {
        dataObj = { ...copyItObj, ...schedulingDetailsFormGroup.getRawValue() };
      } else {
        dataObj = schedulingDetailsFormGroup.getRawValue();
      }
      this.save.next(dataObj);
    } else {
      this.isFormSubmitted = true;
      this.cdr.detectChanges();
    }
  }

  /**
   * This will bind the form control value
   * @param userFormGroup is the form group containing all the controls
   * @param schedulingDetailsis the object storing all the values
   */
  public bindControlValue(schedulingDetailsFormGroup: FormGroup, schedulingDetails: CopyItInfo | DefaultCopyItConfiguration): FormGroup {
    if (schedulingDetails) {
      schedulingDetailsFormGroup.patchValue(schedulingDetails);
    }
    return schedulingDetailsFormGroup;
  }
}



