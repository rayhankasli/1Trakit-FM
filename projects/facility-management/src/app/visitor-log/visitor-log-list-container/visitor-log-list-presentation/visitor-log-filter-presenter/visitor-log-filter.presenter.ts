/**
 * @author Rayhan Kasli.
 * @description This class is used for VisitorLogpresenter component.
 */

import { Injectable } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

/**
 * VisitorLogFilterPresenter
 */
@Injectable()
export class VisitorLogFilterPresenter {

  constructor(private fb: FormBuilder) { }

  /**
   * This will create all the controls for the form group
   * @param visitorLogFormGroup is the form group
   * @param fb is the form builder which will create the controls
   * @returns It will return the visitorLogFromGroup with all the controls
   */
  public buildForm(): FormGroup {
    return this.fb.group({   
      fromPeriod: ['', [Validators.required]],       
      toPeriod: ['', [Validators.required]]       
    })
 }
}

