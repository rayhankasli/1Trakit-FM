
/**
 * @name CopyitManageAccountPresenter
 * @author Ronak Patel
 * @description This is a presenter service for copyit-manage-accountwhich contains all logic for presentation component
 */

import { Injectable } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
//---------------------------------------------------------------------//
import { CopyitManageAccount } from '../../../models/copyit-manage-account.model';


/**
 * CopyitManageAccountFormPresenter
 */
@Injectable()
export class CopyitManageAccountFormPresenter {

  /** This is used for subscribing the value of subject add */
  public add$: Observable<CopyitManageAccount>;
  /** This is used for add camelCaseModelName object */
  private add: Subject<CopyitManageAccount> = new Subject();

  constructor(private fb: FormBuilder) {
    this.add$ = this.add.asObservable();
  }
  /**
   * This will create all the controls for the form group
   * @param copyitManageAccountFormGroup is the form group
   * @param fb is the form builder which will create the controls
   * @returns It will return the copyitManageAccountFromGroup with all the controls
   */
  public buildForm(): FormGroup {
    return this.fb.group({
      clientAccountId: [''],
      departmentName: ['', [Validators.required]],
      accountNo: ['', [Validators.required]],
      isActive: [null, [Validators.required]],
      assignToRequestors: [[]],
      assignToAssociates: [[]]
    })
  };

  /**
   * This method will validate the form
   * If form is valid then it will
   * @param copyitManageAccountFormGroup
   */
  public saveCopyitManageAccount(copyitManageAccountFormGroup: FormGroup): void {
    if (copyitManageAccountFormGroup.valid) {
      let copyitManageAccount: CopyitManageAccount = copyitManageAccountFormGroup.getRawValue();
      this.add.next(copyitManageAccount);
    }
  }

  /**
   * This will bind the form control value
   * @param userFormGroup is the form group containing all the controls
   * @param copyitManageAccountis the object storing all the values
   */
  public bindControlValue(copyitManageAccountFormGroup: FormGroup, copyitManageAccount: any): FormGroup {
    if (copyitManageAccount) {
      let assignToRequestors: number[] = [];
      assignToRequestors = copyitManageAccount.assignToRequestors.map((response) => {
        return response.userId
      });
      let assignToAssociates: number[] = [];
      assignToAssociates = copyitManageAccount.assignToAssociates.map((response) => {
        return response.userId
      });
      copyitManageAccountFormGroup.patchValue(copyitManageAccount);
      copyitManageAccountFormGroup.get('assignToRequestors').setValue(assignToRequestors);
      copyitManageAccountFormGroup.get('assignToAssociates').setValue(assignToAssociates);
    }

    return copyitManageAccountFormGroup;
  }
}



