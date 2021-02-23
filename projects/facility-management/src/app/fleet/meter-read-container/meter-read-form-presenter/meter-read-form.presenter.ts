
/**
 * @name MeterReadPresenter
 * @author Ronak Patel.
 * @description This is a presenter service for meter-readwhich contains all logic for presentation component
 */

import { Injectable } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
//---------------------------------------------------------------------//
import { AssetMeter, AssetRates, MeterRead } from '../../fleet.model';
import { ValidateFormGroup } from '../../shared/validate-formgroup';


/** 
 * MeterReadFormPresenter 
 */
@Injectable()
export class MeterReadFormPresenter {

    /** This is used for subscribing the value of subject add */
    public add$: Observable<MeterRead>;

    /** This is used for add camelCaseModelName object */
    private add: Subject<MeterRead> = new Subject();

    constructor(private fb: FormBuilder) {
        this.add$ = this.add.asObservable();
    }

    /**
     * This will create all the controls for the form group
     * @param meterReadFormGroup is the form group
     * @param fb is the form builder which will create the controls
     * @returns It will return the meterReadFromGroup with all the controls
     */
    public buildForm(): FormGroup {
        return this.fb.group({
            rates: this.fb.group({
                colorRate: ['', [Validators.required]],
                bwRate: ['', [Validators.required]],
                scanRate: ['', [Validators.required]],
                colorTenantRate: ['', [Validators.required]],
                bwTenantRate: ['', [Validators.required]],
                scanTenantRate: ['', [Validators.required]],
            }),
            assetMeter: this.fb.group(
                {
                    tenantRates: [''],
                    requestType: ['Client'],
                    readingDate: [''],
                    previousColorRead: ['', [Validators.maxLength(9)]],
                    previousBwRead: ['', [Validators.maxLength(9)]],
                    previousScanRead: ['', [Validators.maxLength(9)]],
                    currentColorRead: ['', [Validators.maxLength(9)]],
                    currentBwRead: ['', [Validators.maxLength(9)]],
                    currentScanRead: ['', [Validators.maxLength(9)]],
                    colorRate: ['', [Validators.required]],
                    bwRate: ['', [Validators.required]],
                    scanRate: ['', [Validators.required]],
                },
                { validators: ValidateFormGroup.ValidateForm }
            )
        })
    };

    /**
     * This method will validate the form
     * If form is valid then it will 
     * @param formGroup 
     */
    public saveMeterRead(formGroup: FormGroup, currentRecord?: AssetMeter): void {
        const assetMeterForm: FormGroup = formGroup.get('assetMeter') as FormGroup;
        const meterData: MeterRead = { ...formGroup.getRawValue() };
        if (meterData.assetMeter && meterData.assetMeter.requestType === 'Client') {
            const { colorRate, bwRate, scanRate }: AssetRates = meterData.rates;
            assetMeterForm.patchValue({ colorRate, bwRate, scanRate, tenantRates: false });
        } else if (meterData.assetMeter && meterData.assetMeter.requestType === 'Tenant') {
            const { colorTenantRate, bwTenantRate, scanTenantRate }: AssetRates = meterData.rates;
            assetMeterForm.patchValue({ colorRate: colorTenantRate, bwRate: bwTenantRate, scanRate: scanTenantRate, tenantRates: true })
        }
        if (currentRecord) {
            this.setMinMaxValidation(formGroup, currentRecord);
            assetMeterForm.get('upAssetMeterId') && !assetMeterForm.get('upAssetMeterId').value && assetMeterForm.removeControl('upAssetMeterId');
            assetMeterForm.get('downAssetMeterId') && !assetMeterForm.get('downAssetMeterId').value && assetMeterForm.removeControl('downAssetMeterId');
        } else {
            assetMeterForm.removeControl('upAssetMeterId')
            assetMeterForm.removeControl('downAssetMeterId')
            this.setMinMaxValidation(formGroup);
        }
        this.updateControlAndValue(formGroup);
        meterData.assetMeter = { ...assetMeterForm.getRawValue() };
        if (formGroup.valid) {
            const assetMeter: AssetMeter = meterData.assetMeter;
            if (!assetMeter.previousColorRead) { meterData.assetMeter.previousColorRead = 0; }
            if (!assetMeter.previousBwRead) { meterData.assetMeter.previousBwRead = 0; }
            if (!assetMeter.previousScanRead) { meterData.assetMeter.previousScanRead = 0; }
            if (!assetMeter.currentColorRead) { meterData.assetMeter.currentColorRead = assetMeter.previousColorRead || 0; }
            if (!assetMeter.currentBwRead) { meterData.assetMeter.currentBwRead = assetMeter.previousBwRead || 0; }
            if (!assetMeter.currentScanRead) { meterData.assetMeter.currentScanRead = assetMeter.previousScanRead || 0; }
            this.add.next(meterData);
        }
    }

    /**
     * This will bind the form control value
     * @param userFormGroup is the form group containing all the controls
     * @param meterRead is the object storing all the values  
     */
    public bindControlValue(formGroup: FormGroup, meterRead: MeterRead): FormGroup {
        const ratesForm: FormGroup = formGroup.get('rates') as FormGroup;
        const assetMeterForm: FormGroup = formGroup.get('assetMeter') as FormGroup;
        if (meterRead) {
            // formGroup.patchValue(meterRead);
            ratesForm.patchValue(meterRead.rates);
            this.disableRates(formGroup);    // if already added
            if (meterRead.assetMeter) {
                const { previousColorRead, previousBwRead, previousScanRead }: any = meterRead.assetMeter;
                assetMeterForm.reset();
                assetMeterForm.patchValue({ previousColorRead, previousBwRead, previousScanRead, requestType: 'Client' });
                this.bindMissingRepeatControl(formGroup);
            }
            assetMeterForm.get('readingDate').setValue(new Date());
        }
        return formGroup;
    }

    /** bindMissingControl */
    public bindMissingControl(formGroup: FormGroup, missingRecord: [AssetMeter, AssetMeter]): FormGroup {
        if (missingRecord[0] && missingRecord[1]) {
            const assetMeterForm: FormGroup = formGroup.get('assetMeter') as FormGroup;
            const { currentColorRead, currentBwRead, currentScanRead }: any = missingRecord[0];
            assetMeterForm.reset();
            assetMeterForm.addControl('upAssetMeterId', new FormControl(missingRecord[0].upAssetMeterId));
            assetMeterForm.addControl('downAssetMeterId', new FormControl(missingRecord[0].downAssetMeterId));
            assetMeterForm.patchValue({
                previousColorRead: currentColorRead,
                previousBwRead: currentBwRead,
                previousScanRead: currentScanRead,
                requestType: 'Client', readingDate: new Date(missingRecord[0].readingDate)
            })
            this.bindMissingRepeatControl(formGroup, missingRecord[1]);
        }
        return formGroup;
    }

    /** set validation for missing meter read entry */
    private bindMissingRepeatControl(formGroup: FormGroup, currentRecord?: AssetMeter): void {
        const assetMeter: AssetMeter = ({ ...formGroup.getRawValue() } as MeterRead).assetMeter;
        const { previousColorRead, previousBwRead, previousScanRead }: any = (formGroup.get('assetMeter') as FormGroup).controls;
        const previousColorReadValidations: ValidatorFn[] = [Validators.required, Validators.min(assetMeter.previousColorRead), Validators.maxLength(9)];
        const previousBwReadValidations: ValidatorFn[] = [Validators.required, Validators.min(assetMeter.previousBwRead), Validators.maxLength(9)];
        const previousScanReadValidations: ValidatorFn[] = [Validators.required, Validators.min(assetMeter.previousScanRead), Validators.maxLength(9)];
        if (currentRecord) {
            previousColorReadValidations.push(Validators.max(currentRecord.previousColorRead));
            previousBwReadValidations.push(Validators.max(currentRecord.previousBwRead));
            previousScanReadValidations.push(Validators.max(currentRecord.previousScanRead));
        }
        previousColorRead.setValidators(previousColorReadValidations);
        previousBwRead.setValidators(previousBwReadValidations);
        previousScanRead.setValidators(previousScanReadValidations);
        this.setMinMaxValidation(formGroup, currentRecord);
        this.updateControlAndValue(formGroup);
    }

    /** set min and max validation */
    private setMinMaxValidation(formGroup: FormGroup, currentRecord?: AssetMeter): void {
        const { previousColorRead, previousBwRead, previousScanRead, currentColorRead, currentBwRead, currentScanRead }: any = (formGroup.get('assetMeter') as FormGroup).controls;
        const previousColorReadValidations: ValidatorFn[] = [Validators.min(previousColorRead.value), Validators.maxLength(9)];
        const previousBwReadValidations: ValidatorFn[] = [Validators.min(previousBwRead.value), Validators.maxLength(9)];
        const previousScanReadValidations: ValidatorFn[] = [Validators.min(previousScanRead.value), Validators.maxLength(9)];
        if (currentRecord) {
            previousColorReadValidations.push(Validators.max(currentRecord.previousColorRead));
            previousBwReadValidations.push(Validators.max(currentRecord.previousBwRead));
            previousScanReadValidations.push(Validators.max(currentRecord.previousScanRead));
        }
        currentColorRead.setValidators(previousColorReadValidations);
        currentBwRead.setValidators(previousBwReadValidations);
        currentScanRead.setValidators(previousScanReadValidations);
    }

    /** updateControlAndValue */
    private updateControlAndValue(formGroup: FormGroup): void {
        const { previousColorRead, previousBwRead, previousScanRead, currentColorRead, currentBwRead, currentScanRead }: any = (formGroup.get('assetMeter') as FormGroup).controls;
        previousColorRead.updateValueAndValidity();
        previousBwRead.updateValueAndValidity();
        previousScanRead.updateValueAndValidity();
        currentColorRead.updateValueAndValidity();
        currentBwRead.updateValueAndValidity();
        currentScanRead.updateValueAndValidity();
    }

    /** disable rates if greater than 0 */
    private disableRates(formGroup: FormGroup): void {
        const ratesForm: FormGroup = formGroup.get('rates') as FormGroup;
        ratesForm.get('colorRate').value > 0 && ratesForm.get('colorRate').disable();
        ratesForm.get('bwRate').value > 0 && ratesForm.get('bwRate').disable();
        ratesForm.get('scanRate').value > 0 && ratesForm.get('scanRate').disable();
        ratesForm.get('colorTenantRate').value > 0 && ratesForm.get('colorTenantRate').disable();
        ratesForm.get('bwTenantRate').value > 0 && ratesForm.get('bwTenantRate').disable();
        ratesForm.get('scanTenantRate').value > 0 && ratesForm.get('scanTenantRate').disable();
    }

}



