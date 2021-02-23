
/**
 * @name RequestInformationDetailsPresenter
 * @author Enter Your Name Here
 * @description This is a presenter service for request-information-detailswhich contains all logic for presentation component
 */

import { Injectable, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
//---------------------------------------------------------------------//
import { CopyitDefaultValues } from '../../../copyit-configurations.model';
import { PHONE_PATTERN, EMAIL_PATTERN } from '../../../../core/utility/constants';


/** 
 * RequestInformationDetailsFormPresenter 
 */
@Injectable()
export class RequestInformationDetailsFormPresenter {

    /** Determines whether form submitted is ture or false */
    public isFormSubmitted: boolean;
    /** This is used for subscribing the value of subject add */
    public add$: Observable<CopyitDefaultValues>;
    /** This is used for add camelCaseModelName object */
    private add: Subject<CopyitDefaultValues> = new Subject();

    constructor(private fb: FormBuilder, private cdr: ChangeDetectorRef) {
        this.add$ = this.add.asObservable();
        this.isFormSubmitted = false;
    }
    /**
     * This will create all the controls for the form group
     * @param requestInformationDetailsFormGroup is the form group
     * @param fb is the form builder which will create the controls
     * @returns It will return the requestInformationDetailsFromGroup with all the controls
     */
    public buildForm(): FormGroup {
        return this.fb.group({
            requestForId: [null, [Validators.required]],
            emailAddress: ['', [Validators.required, Validators.pattern(EMAIL_PATTERN)]],
            phoneNumber: ['', [Validators.pattern(PHONE_PATTERN)]],
            jobname: ['', [Validators.required, Validators.maxLength(100)]],
            isPriceQuote: [null, [Validators.required]],
            isProof: [null, [Validators.required]],
            priorityId: [null, []],
        })
    };

    /**
     * This will bind the form control value
     * @param requestInformationDetailsFormGroup is the form group containing all the controls
     * @param copyitDefaultValues the object storing all the values  
     */
    public bindControlValue(requestInformationDetailsFormGroup: FormGroup, copyitDefaultValues: CopyitDefaultValues): FormGroup {
        requestInformationDetailsFormGroup.patchValue({
            requestForId: copyitDefaultValues.requestForId,
            emailAddress: copyitDefaultValues.emailAddress,
            phoneNumber: copyitDefaultValues.phoneNumber,
            jobname: copyitDefaultValues.jobname,
            isPriceQuote: copyitDefaultValues.isPriceQuote,
            isProof: copyitDefaultValues.isProof,
            priorityId: copyitDefaultValues.priorityId
        })
        return requestInformationDetailsFormGroup;
    }

    /**
     * This method will validate the form
     * If form is valid then it will 
     * @param requestInformationDetailsFormGroup 
     */
    public saveRequestInformationDetails(requestInformationDetailsFormGroup: FormGroup): void {
        if (requestInformationDetailsFormGroup.valid) {
            this.isFormSubmitted = false;
            this.cdr.detectChanges();
            let requestInformationDetails: CopyitDefaultValues = requestInformationDetailsFormGroup.getRawValue();
            this.add.next(requestInformationDetails);
        } else {
            this.isFormSubmitted = true;
            this.cdr.detectChanges();
        }
    }

    public setUserDetail(userDetail: any, formGroup: FormGroup): void {
        formGroup.patchValue({
            emailAddress: userDetail.emailAddress,
            phoneNumber: userDetail.phoneNumber
        });
    }
}



