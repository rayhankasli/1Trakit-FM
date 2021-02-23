
/**
 * @name FloorPresenter
 * @author Ronak Patel
 * @description This is a presenter service for floorwhich contains all logic for presentation component
 */

import { Injectable } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
//---------------------------------------------------------------------//
import { Floor } from '../../../office.model';



/** 
 * FloorFormPresenter 
 */
@Injectable()
export class FloorFormPresenter {

    /** This is used for subscribing the value of subject add */
    public add$: Observable<Floor>;
    /** This is used for add camelCaseModelName object */
    private add: Subject<Floor> = new Subject();

    constructor(private fb: FormBuilder) {
        this.add$ = this.add.asObservable();
    }
    /**
     * This will create all the controls for the form group
     * @param floorFormGroup is the form group
     * @param fb is the form builder which will create the controls
     * @returns It will return the floorFromGroup with all the controls
     */
    public buildForm(): FormGroup {
        return this.fb.group({
            id: [],
            floorType: ['', [Validators.pattern('^[-+]?[0-9]+$'), Validators.required]],
            nickName: ['', [Validators.required, Validators.maxLength(30)]]
        })
    };

    /**
     * This method will validate the form
     * If form is valid then it will 
     * @param floorFormGroup 
     */
    public saveFloor(floorFormGroup: FormGroup): void {
        if (floorFormGroup.valid) {
            let floor: Floor = floorFormGroup.getRawValue();
            this.add.next(floor);
        }
        else {
            // show any custom validation here 
        }
    }

    /**
     * This will bind the form control value
     * @param userFormGroup is the form group containing all the controls
     * @param floor is the object storing all the values  
     */
    public bindControlValue(floorFormGroup: FormGroup, floor: Floor): FormGroup {
        if (floor) {
            floorFormGroup.patchValue(floor);
        }
        return floorFormGroup;
    }
}



