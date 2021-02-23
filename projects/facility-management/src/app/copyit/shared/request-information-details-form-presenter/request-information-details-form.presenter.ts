
/**
 * @name RequestInformationDetailsPresenter
 * @author Enter Your Name Here
 * @description This is a presenter service for request-information-detailswhich contains all logic for presentation component
 */

import { ChangeDetectorRef, Injectable } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
// ------------------------------------------------ //
import { ClientMaster, IdLabelPair } from '../../../core/model/common.model';
import { EMAIL_PATTERN, PHONE_PATTERN } from '../../../core/utility/constants';
import { validateFileSize } from '../../../core/utility/validations';
import { CopyItInfo } from '../../../shared/modules/copy-it-print-details/models/copyit-info/copyit-info';
import { CopyItUserList, CopyItUser } from '../../../shared/modules/copyit-shared/copyit-shared.model';
import { Client, ProjectCode, UserDetails } from '../../copyit.model';
import { RATE_REQUEST_TYPE } from '../../models/copyit-constant';


/**
 * RequestInformationDetailsFormPresenter
 */
@Injectable()
export class RequestInformationDetailsFormPresenter {

  /** Determines whether form submitted is ture or false */
  public isFormSubmitted: boolean;
  /** This is used for subscribing the value of subject add */
  public save$: Observable<CopyItInfo>;

  /** This is used for set the data */
  private save: Subject<CopyItInfo>;

  constructor(
    private formBuilder: FormBuilder,
    private cdrRef: ChangeDetectorRef
  ) {
    this.isFormSubmitted = false;
    this.save = new Subject();
    this.save$ = this.save.asObservable();
  }

  /**
   * This will create all the controls for the form group
   * @param requestInformationDetailsFormGroup is the form group
   * @param fb is the form builder which will create the controls
   * @returns It will return the requestInformationDetailsFromGroup with all the controls
   */
  public buildForm(): FormGroup {
    return this.formBuilder.group({
      clientId: [null, [Validators.required]],
      requestForId: [null, [Validators.required]],
      emailAddress: ['', [Validators.required, Validators.pattern(EMAIL_PATTERN)]],
      phoneNumber: ['', [Validators.pattern(PHONE_PATTERN)]],
      clientAccountId: [null],
      accountNo: ['', []],
      isPrepopulateAccountNumber: [false, []],
      departmentName: [null, []],
      jobname: ['', [Validators.required, Validators.maxLength(100)]],
      isPriceQuote: [null, [Validators.required]],
      isProof: [null, [Validators.required]],
      copyItNumber: [{ value: null, disabled: true }],
      rateRequestTypeId: [1],
      rateRequestType: [''],
      fileOptionId: [1, []],
      files: ['', [validateFileSize(51200)]],
      fileName: [''],
      uploadFile: [null, this.formBuilder.array([])],
      shareFilePath: ['']
    })
  };

  /**
   * This will bind the form control value
   * @param userFormGroup is the form group containing all the controls
   * @param requestInformationDetailsis the object storing all the values
   */
  public bindControlValue(requestInformationDetailsFormGroup: FormGroup, requestInformationDetails: any): FormGroup {
    if (requestInformationDetails) {
      requestInformationDetailsFormGroup.patchValue(requestInformationDetails);
    }
    return requestInformationDetailsFormGroup;
  }

  /**
   * This method will validate the form
   * If form is valid then it will
   * @param requestInformationDetailsFormGroup
   */
  public saveRequestInformationDetails(
    formGroup: FormGroup, clientList: Client[], userDetail: UserDetails,
    copyItObj: CopyItInfo
  ): void {

    if (formGroup.valid) {
      this.isFormSubmitted = false;
      this.cdrRef.detectChanges();

      let dataObj: CopyItInfo;
      let formValue: CopyItInfo = { ...formGroup.getRawValue() };

      formValue = { ...formValue, ...this.setClientDetails(clientList, formValue.clientId) };

      formValue.requestForName = this.setRequestorName(userDetail);

      if (copyItObj) {
        dataObj = { ...copyItObj, ...formValue }
      } else {
        dataObj = formValue;
      }
      this.save.next(dataObj);
    }
    else {
      // show any custom validation here
      this.isFormSubmitted = true;
      this.cdrRef.detectChanges();
    }
  }

  /** Client Chnage */
  public changeClient(formGroup: FormGroup): void {
    const controlNameAndValue: any = {
      requestForId: null,
      emailAddress: null,
      phoneNumber: null,
      clientAccountId: null,
      accountNo: null,
      departmentName: null,
      jobname: null,
      isPriceQuote: null,
      isProof: null,
      files: null,
      shareFilePath: null,
      fileName: null
    };
    formGroup.patchValue(controlNameAndValue);
  }

  /** On user Change */
  public userChange(formGroup: FormGroup): void {
    const controlNameAndValue: any = {
      emailAddress: null,
      phoneNumber: null,
      clientAccountId: null,
      accountNo: null,
      departmentName: null,
    };
    formGroup.patchValue(controlNameAndValue);
  }

  /** Set User Details */
  public setUserDetails(formGroup: FormGroup, userDetails: any): void {
    const controlNameAndValue: any = {
      requestForId: userDetails.userId,
      emailAddress: userDetails.emailAddress,
      phoneNumber: userDetails.phoneNumber,
    };
    formGroup.patchValue(controlNameAndValue);
  }

  /** To-Do */
  public setTenants(client: Client | ClientMaster): IdLabelPair[] {
    let rateList: IdLabelPair[] = RATE_REQUEST_TYPE;
    rateList[0].label = (client as Client).companyName ? (client as Client).companyName : (client as ClientMaster).client;
    return rateList;
  }

  /** To-Do */
  public changeProjectCode(formGroup: FormGroup, { departmentName, accountNo }: ProjectCode): void {
    formGroup.patchValue({ departmentName, accountNo })
  }

  /**
   * set selected rate request type
   * @param formGroup FormGrop
   * @param param1 Id-Label pair
   */
  public changeRateRequestType(formGroup: FormGroup, { label }: IdLabelPair): void {
    formGroup.patchValue({ rateRequestType: label })
  }

  /** To-Do */
  public changeFile(formGroup: FormGroup): void {
    const controlNameAndValue: any = {
      files: null,
      shareFilePath: null,
      fileName: null
    };
    formGroup.patchValue(controlNameAndValue);
  }

  /** Set File Name */
  public setFileName(files: any[], formGroup: FormGroup): void {
    let name: string[] = files.map((file: File) => {
      return file.name;
    });
    formGroup.get('fileName').setValue(name.filter((name) => name !== undefined));
  }

  /** To-DO */
  public setClientDisable(formGroup: FormGroup): void {
    formGroup.get('clientId').disable();
  }

  /** To-Do */
  public setAccountNumber(formGroup: FormGroup, client: Client | ClientMaster): void {
    formGroup.get('isPrepopulateAccountNumber').patchValue(client.accountNumber);
  }

  /** find and set client details */
  private setClientDetails(clientList: Client[], clientId: number): Client {
    return clientList.find((res: Client) => res.clientId === clientId) || new Client();
  }

  /** find and set username from user-list */
  private setRequestorName(userDetail: UserDetails): string {
    const user: CopyItUser | UserDetails = userDetail || new CopyItUser();
    return `${user.firstName} ${user.lastName}`.trim();
  }

}
