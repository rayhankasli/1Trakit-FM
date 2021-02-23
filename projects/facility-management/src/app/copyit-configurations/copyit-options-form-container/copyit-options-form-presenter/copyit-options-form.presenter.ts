
/**
 * @name CopyitOptionsPresenter
 * @author Enter Your Name Here
 * @description This is a presenter service for copyit-optionswhich contains all logic for presentation component
 */

import { Injectable } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
//---------------------------------------------------------------------//
import { CopyitOptions } from '../../copyit-configurations.model';


/** 
 * CopyitOptionsFormPresenter 
 */
@Injectable()
export class CopyitOptionsFormPresenter {

    /** This is used for subscribing the value of subject add */
    public add$: Observable<CopyitOptions>;
    /** This is used for add camelCaseModelName object */
    private add: Subject<CopyitOptions> = new Subject();

    constructor(private fb: FormBuilder) {
        this.add$ = this.add.asObservable();
    }
    /**
     * This will create all the controls for the form group
     * @param copyitOptionsFormGroup is the form group
     * @param fb is the form builder which will create the controls
     * @returns It will return the copyitOptionsFromGroup with all the controls
     */
    public buildForm(): FormGroup {
        return this.fb.group({
            paperSizes: [null, [Validators.required]],
            envelopes: [null, [Validators.required]],
            paperColors: [null, [Validators.required]],
            paperStocks: [null, [Validators.required]],
            finishings: [null, [Validators.required]],
            tabs: [null, [Validators.required]],
            reproductionTypes: [null, [Validators.required]],
            overSizedCopies: [null],
            requestorSections: [null],
            shippingServices: [null, [Validators.required]]
        })
    };

    /**
     * This method will validate the form
     * If form is valid then it will 
     * @param copyitOptionsFormGroup 
     */
    public saveCopyitOptions(copyitOptionsFormGroup: FormGroup): void {
        if (copyitOptionsFormGroup.valid) {
            let copyitOptions: CopyitOptions = copyitOptionsFormGroup.getRawValue();
            this.add.next(copyitOptions);
        }
        else {
            // show any custom validation here 
        }
    }

    /**
     * This will bind the form control value
     * @param userFormGroup is the form group containing all the controls
     * @param copyitOptionsis the object storing all the values  
     */
    public bindControlValue(copyitOptionsFormGroup: FormGroup, copyitOptions: CopyitOptions): FormGroup {
        if (copyitOptions) {
            copyitOptionsFormGroup.patchValue(copyitOptions);
        }
        return copyitOptionsFormGroup;
    }
}



