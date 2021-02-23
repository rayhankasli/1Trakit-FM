
/**
 * @name UserProfilePresenter
 * @author Nitesh Sharma
 * @description This is a presenter service for user-profilewhich contains all logic for presentation component
 */

import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
//---------------------------------------------------------------------//
import { UserProfile } from '../../../core/model/core.model';
import { EMAIL_PATTERN, PHONE_PATTERN } from '../../../core/utility/constants';



@Injectable()
export class UserProfileFormPresenter {

    /** This is used for subscribing the value of subject add */
    public update$: Observable<UserProfile>;
    /** This is used for add camelCaseModelName object */
    private update: Subject<UserProfile> = new Subject();

    constructor(private fb: FormBuilder) {
        this.update$ = this.update.asObservable();
    }

    /**
     * This will create all the controls for the form group
     * @param userProfileForm is the form group
     * @param fb is the form builder which will create the controls
     * @returns It will return the userProfileFromGroup with all the controls
     */
    public buildForm(): FormGroup {

        return this.fb.group({
            firstName: ['', [Validators.required]],
            lastName: ['', [Validators.required]],
            email: ['', [Validators.required, Validators.pattern(EMAIL_PATTERN)]],
            userName: [{ value: '', disabled: true }, [Validators.required, Validators.maxLength(50), Validators.minLength(2)]],
            primaryContactNumber: ['', [Validators.required, Validators.pattern(PHONE_PATTERN)]]
        })
    };


    /**
     * This method will validate the form
     * If form is valid then it will 
     * @param userProfileForm 
     */
    public saveUserProfile(userProfileForm: FormGroup): void {
        if (userProfileForm.valid) {
            let userProfile: UserProfile = userProfileForm.getRawValue();
            this.update.next(userProfile);
        }
        else {
            // show any custom validation here 
        }
    }

    /**
     * This will bind the form control value
     * @param userFormGroup is the form group containing all the controls
     * @param userProfileis the object storing all the values  
     */
    public bindControlValue(userProfileForm: FormGroup, userProfile: UserProfile): FormGroup {
        if (userProfile) {
            userProfileForm.patchValue(userProfile);
        }
        return userProfileForm;
    }

}
