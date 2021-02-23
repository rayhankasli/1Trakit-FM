
/**
 * @name ReasonsPresenter
 * @author Rayhan Kasli.
 * @description This is a presenter service for reasonswhich contains all logic for presentation component
 */

import { Injectable } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
//---------------------------------------------------------------------//
import { Reasons } from '../reasons.model';


/** 
 * ReasonsFormPresenter 
 */
@Injectable()
export class ReasonsFormPresenter {

    /** This is used for subscribing the value of subject add */
    public add$: Observable<Reasons>;
    
    /** This is used for add camelCaseModelName object */
    private add: Subject<Reasons> = new Subject();
    /** Next reason id of reasons form presenter */
    private nextReasonId: number;

    constructor(private fb: FormBuilder) {
        this.add$ = this.add.asObservable();
        this.nextReasonId = 1;
    }
    /**
     * This will create all the controls for the form group
     * @param reasonsFormGroup is the form group
     * @param fb is the form builder which will create the controls
     * @returns It will return the reasonsFromGroup with all the controls
     */
    public buildForm(): FormGroup {
        return this.fb.group({
            // reasonId: [],
            reason: [{ value: 'Reason ' + this.nextReasonId, disabled: true }],           
            description: ['',[Validators.required ,Validators.maxLength(120) ]]           
      })
    };

    /**
     * News slot name id
     * @param id 
     */
    public newReasonNameId(lastReason: string): void {
        if (lastReason) {
        let nextId: string[] = lastReason.split(/(\d+)/);
        let convetInt: number = parseInt(nextId[1]);
        this.nextReasonId = this.nextReasonId + convetInt;
        }
  }

    /**
     * This method will validate the form
     * If form is valid then it will 
     * @param reasonsFormGroup 
     */
    public saveReasons(reasonsFormGroup: FormGroup): void {
        if (reasonsFormGroup.valid) {
            let reasons: Reasons = reasonsFormGroup.getRawValue();
            this.add.next(reasons);
        }
        else {
            // show any custom validation here 
        }
    }

    /**
     * This will bind the form control value
     * @param userFormGroup is the form group containing all the controls
     * @param reasonsis the object storing all the values  
     */
    public bindControlValue(reasonsFormGroup: FormGroup, reasons: Reasons): FormGroup {
        if (reasons) {
            reasonsFormGroup.patchValue(reasons);
        }
        return reasonsFormGroup;
    }
}



