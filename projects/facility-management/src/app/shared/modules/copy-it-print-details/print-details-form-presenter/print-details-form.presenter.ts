
/**
 * @name PrintDetailsPresenter
 * @author Nitesh Sharma | Ashok Yadav
 * @description This is a presenter service for print-detailswhich contains all logic for presentation component
 */

import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidationRegex } from 'common-libs';
import { BehaviorSubject } from 'rxjs';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { CopyitCommonService } from '../copyit-common.service';
import { CopyItConfiguration, DefaultCopyItConfiguration } from '../models/copyit-info';
import { CopyItInfo } from '../models/copyit-info/copyit-info';


/**
 * PrintDetailsFormPresenter
 */
@Injectable()
export class PrintDetailsFormPresenter {

  public isFormSubmitted: boolean;
  /** This is used for subscribing the value of subject add */
  public add$: Observable<CopyItInfo>;
  /** This is used for subscribing the value of subject showFrontPageCover */
  public showFrontPageCover$: Observable<boolean>;
  /** This is used for subscribing the value of subject showMiddlePageCover */
  public showMiddlePageCover$: Observable<boolean>;

  /** This is used for add CopyItInfo object */
  private add: Subject<CopyItInfo>;
  /** This is used for store showFrontPageCover */
  private showFrontPageCover: BehaviorSubject<boolean>;
  /** This is used for store showFrontPageCover */
  private showMiddlePageCover: BehaviorSubject<boolean>;

  constructor(private fb: FormBuilder, private copyItCommonService: CopyitCommonService) {
    this.add = new Subject<CopyItInfo>();
    this.add$ = this.add.asObservable();
    this.showFrontPageCover = new BehaviorSubject<boolean>(true);
    this.showFrontPageCover$ = this.showFrontPageCover.asObservable();
    this.showMiddlePageCover = new BehaviorSubject<boolean>(true);
    this.showMiddlePageCover$ = this.showMiddlePageCover.asObservable();
  }
  /**
   * This will create all the controls for the form group
   * @param printDetailsFormGroup is the form group
   * @param fb is the form builder which will create the controls
   * @returns It will return the printDetailsFromGroup with all the controls
   */
  public buildForm(): FormGroup {
    return this.fb.group({
      reproductionTypes: [null, [Validators.required]],
      tab: [null],
      finishings: [null, [Validators.required]],
      envelopes: [null],
      overSizedCopies: [null],
      frontCoverPageType: [null],
      frontCoverPageSize: [null],
      frontCoverPageColor: [null],
      frontCoverPageWeight: [null],
      middlePageSize: [null],
      middlePageColor: [null],
      middlePageWeight: [null],
      noOfPages: ['', [Validators.pattern(ValidationRegex.Digit), Validators.maxLength(9)]],
      noOfCopies: ['', [Validators.required, Validators.pattern(ValidationRegex.Digit), Validators.maxLength(9)]]
    })
  };

  /**
   * This method will validate the form
   * If form is valid then it will
   * @param printDetailsFormGroup
   */
  public savePrintDetails(printDetailsFormGroup: FormGroup, copyitObj: CopyItInfo, configurations: CopyItConfiguration): void {
    if (printDetailsFormGroup.valid) {
      this.isFormSubmitted = false;
      let dataObj: CopyItInfo;
      if (copyitObj) {
        dataObj = { ...copyitObj, ...printDetailsFormGroup.getRawValue() };
      } else {
        dataObj = printDetailsFormGroup.getRawValue();
      }

      dataObj.totalAmount = this.copyItCommonService.calculateAttributeAndPrintingCharges(dataObj);
      dataObj.showFrontPageCover$ = this.showFrontPageCover$;
      dataObj.showMiddlePageCover$ = this.showMiddlePageCover$;
      this.add.next(dataObj);
    }
    else {
      this.isFormSubmitted = true;
    }
  }

  /**
   * This will bind the form control value
   * @param userFormGroup is the form group containing all the controls
   * @param printDetailsis the object storing all the values
   */
  public bindControlValue(printDetailsFormGroup: FormGroup, defaultCopyItValues: DefaultCopyItConfiguration): FormGroup {
    if (defaultCopyItValues) {
      printDetailsFormGroup.patchValue(defaultCopyItValues);
    }
    return printDetailsFormGroup;
  }

  /**
   * This will bind the form control value
   * @param printDetailsFormGroup is the form group containing all the controls
   * @param copyItInfo the object storing all the values
   */
  public bindCopyItInfoToForm(printDetailsFormGroup: FormGroup, copyItInfo: CopyItInfo): FormGroup {
    printDetailsFormGroup.patchValue(copyItInfo, { emitEvent: true });
    return printDetailsFormGroup;
  }

}