/**
 * @name AssetTicketPresenter
 * @author Ronak Patel.
 * @description This is a presenter service for asset-ticketwhich contains all logic for presentation component
 */

import { Injectable } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
//---------------------------------------------------------------------//
import { AssetTicket } from '../../fleet.model';

@Injectable()
export class AssetTicketFormPresenter {
    /** This is used for subscribing the value of subject add */
    public add$: Observable<AssetTicket>;
    /** This is used for add camelCaseModelName object */
    private add: Subject<AssetTicket> = new Subject();

    constructor(private fb: FormBuilder) {
        this.add$ = this.add.asObservable();
    }
    /**
     * This will create all the controls for the form group
     * @param assetTicketFormGroup is the form group
     * @param fb is the form builder which will create the controls
     * @returns It will return the assetTicketFromGroup with all the controls
     */
    public buildForm(): FormGroup {
        return this.fb.group({
            ticketDate: ['', [Validators.required]],
            ticketTime: ['', [Validators.required]],
            assetTicketCategoryId: [null, [Validators.required]],
            priorityId: [null, [Validators.required]],
            statusId: [null, [Validators.required]],
            description: ['', [Validators.required]]
        })
    };

    /**
     * This method will validate the form
     * If form is valid then it will 
     * @param assetTicketFormGroup 
     */
    public saveAssetTicket(assetTicketFormGroup: FormGroup): void {
        if (assetTicketFormGroup.valid) {
            let assetTicket: AssetTicket = assetTicketFormGroup.getRawValue();
            this.add.next(assetTicket);
        }
    }

    /**
     * This will bind the form control value
     * @param userFormGroup is the form group containing all the controls
     * @param assetTicketis the object storing all the values  
     */
    public bindControlValue(assetTicketFormGroup: FormGroup, assetTicket: AssetTicket): FormGroup {
        if (assetTicket) {
            assetTicketFormGroup.patchValue(assetTicket);
        }
        return assetTicketFormGroup;
    }
}



