
/**
 * @name OfficePresenter
 * @author Ronak Patel
 * @description This is a presenter service for officewhich contains all logic for presentation component
 */

import { Injectable } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
//---------------------------------------------------------------------//
import { Office } from '../../../office.model';



/** 
 * OfficeFormPresenter 
 */
@Injectable()
export class OfficeFormPresenter {

    /** This is used for subscribing the value of subject add */
    public add$: Observable<Office>;
    public lastOffice: string;
    /** This is used for add camelCaseModelName object */
    private add: Subject<Office> = new Subject();

    constructor(private fb: FormBuilder) {
        this.add$ = this.add.asObservable();
        this.lastOffice = 'Office 1';
    }
    /**
     * This will create all the controls for the form group
     * @param officeFormGroup is the form group
     * @param fb is the form builder which will create the controls
     * @returns It will return the officeFromGroup with all the controls
     */
    public buildForm(): FormGroup {
        return this.fb.group({
            officeId: [],
            officeName: [{ value: this.lastOffice, disabled: true }, [Validators.required]],
            nickName: ['', [Validators.required, Validators.maxLength(30)]],
            address1: ['', [Validators.required, Validators.maxLength(50)]],
            address2: ['', [Validators.maxLength(50)]],
            cityId: [null, [Validators.required]],
            stateId: [null, [Validators.required]],
            zipcode: ['', [Validators.pattern('^[0-9]+$'), Validators.required, Validators.maxLength(6)]]
        })
    };

    /**
     * This method will validate the form
     * If form is valid then it will 
     * @param officeFormGroup 
     */
    public saveOffice(officeFormGroup: FormGroup): void {
        if (officeFormGroup.valid) {
            let office: Office = officeFormGroup.getRawValue();
            this.add.next(office);
        }
        else {
            // show any custom validation here 
        }
    }

    /**
     * This will bind the form control value
     * @param userFormGroup is the form group containing all the controls
     * @param officeis the object storing all the values  
     */
    public bindControlValue(officeFormGroup: FormGroup, office: Office): FormGroup {
        if (office) {
            officeFormGroup.patchValue(office);
        }
        return officeFormGroup;
    }

    /** setOfficeName  */
    public setOfficeName(lastOffice: string): void {
        let lastOfficeNumber: number = +lastOffice.slice(6, lastOffice.length);
        ++lastOfficeNumber;
        this.lastOffice = lastOffice.slice(0, 6) + ' ' + lastOfficeNumber;
    }
}



