/**
 * @author Nitesh Sharma.
 * @description This class is used for Userpresenter component.
 */

import { Injectable } from '@angular/core';
// ----------------------------------------------- //
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

/**
 * UserFilterPresenter
 */
@Injectable()
export class UserFilterPresenter {

  constructor(private fb: FormBuilder) { }

  /**
   * This will create all the controls for the form group
   * @param userFormGroup is the form group
   * @param fb is the form builder which will create the controls
   * @returns It will return the userFromGroup with all the controls
   */
  public buildForm(): FormGroup {
    return this.fb.group({
      isActive: [true],
      clientId: []
    })
  }
}

