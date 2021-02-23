
/**
 * @name ShippingDetailsPresenter
 * @author Enter Your Name Here
 * @description This is a presenter service for shipping-detailswhich contains all logic for presentation component
 */

import { ChangeDetectorRef, Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { DefaultCopyItConfiguration, ShippingOption } from '../../copy-it-print-details/models/copyit-info';
//---------------------------------------------------------------------//
import { CopyItInfo } from '../../copy-it-print-details/models/copyit-info/copyit-info';
import { CopyItConfigShippingMethod } from '../../copy-it-print-details/models/copyit-info/copyitConfigShippingMethod';
import { ShippingOptionEnum } from '../shippingdetails.enum';


/** 
 * ShippingDetailsFormPresenter 
 */
@Injectable()
export class ShippingDetailsFormPresenter {

    /** Determines shipping mthod item */
    public shippingServices: CopyItConfigShippingMethod[];
    /** Determines whether form submitted is ture or false */
    public isFormSubmitted: boolean;
    /** This is used for subscribing the value of subject add */
    public add$: Observable<any>;

    /** This is used for add camelCaseModelName object */
    private add: Subject<any> = new Subject();

    constructor(
        private fb: FormBuilder,
        private cdr: ChangeDetectorRef
    ) {
        this.add$ = this.add.asObservable();
        this.isFormSubmitted = false;
    }
    
    /**
     * This will create all the controls for the form group
     * @param shippingDetailsFormGroup is the form group
     * @param fb is the form builder which will create the controls
     * @returns It will return the shippingDetailsFromGroup with all the controls
     */
    public buildForm(): FormGroup {
        return this.fb.group({
            deliveredTo: [null, [Validators.maxLength(30)]],
            shippingServiceId: [null, []],
            shippingOptionId: [null, []],
            shippingOptionValue: [null, [Validators.maxLength(30)]]
        })
    };

    /**
     * This method will validate the form
     * If form is valid then it will 
     * @param shippingDetailsFormGroup 
     */
    public saveShippingDetails(shippingDetailsFormGroup: FormGroup, copyItInfo: CopyItInfo): void {
        if (shippingDetailsFormGroup.valid) {
            this.isFormSubmitted = false;
            this.cdr.detectChanges();
            let shippingDetails: any = shippingDetailsFormGroup.getRawValue();
            this.add.next({ ...copyItInfo, ...shippingDetails });
        }
        else {
            this.isFormSubmitted = true;
            this.cdr.detectChanges();
        }
    }

    /**
     * This will bind the form control value
     * @param userFormGroup is the form group containing all the controls
     * @param shippingDetailsis the object storing all the values  
     */
    public bindControlValue(shippingDetailsFormGroup: FormGroup, copyitDefaultValues: DefaultCopyItConfiguration | CopyItInfo): FormGroup {
        shippingDetailsFormGroup.patchValue(copyitDefaultValues)
        return shippingDetailsFormGroup;
    }

    /** create shipping option values and return shippiing oprion array  */
    public bindShippingOptionValues(): ShippingOption[] {
        return [
            {
                shippingOptionId: ShippingOptionEnum.CHARGE_SHIPPING_TO,
                shippingOption: 'Charge Shipping To'
            },
            {
                shippingOptionId: ShippingOptionEnum.SHIPPING_SPEC,
                shippingOption: 'Shipping Spec. Instruction'
            }
        ];
    }

}



