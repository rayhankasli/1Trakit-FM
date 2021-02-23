/**
 * @name AssetPresenter
 * @author Ronak Patel.
 * @description This is a presenter service for asset which contains all logic for presentation component
 */

import { Injectable } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
//---------------------------------------------------------------------//
import { EMAIL_PATTERN } from '../../../core/utility/constants';
import { Asset, AssetMeter, AssetTypeOption } from '../../fleet.model';

@Injectable()
export class AssetFormPresenter {
    /** This is used for subscribing the value of subject add */
    public add$: Observable<Asset>;
    public formGroup: FormGroup;
    /** toggle meter read section */
    public openMeterRead: boolean;
    /** This is used for add camelCaseModelName object */
    private add: Subject<Asset> = new Subject();

    /** list of available asset type options */
    private get assetTypeOptions(): typeof AssetTypeOption {
        return AssetTypeOption;
    };

    constructor(private fb: FormBuilder) {
        this.add$ = this.add.asObservable();
        this.openMeterRead = true;
    }
    /**
     * This will create all the controls for the form group
     * @param assetFormGroup is the form group
     * @param fb is the form builder which will create the controls
     * @returns It will return the assetFromGroup with all the controls
     */
    public buildForm(): FormGroup {
        return this.fb.group({
            assetTypeId: [null, [Validators.required]],
            assetCategoryId: [null, [Validators.required]],
            assetNo: ['', [Validators.required, Validators.maxLength(30)]],
            manufacturer: ['', [Validators.required, Validators.maxLength(30)]],
            modelNo: ['', [Validators.required, Validators.maxLength(30)]],
            serialNo: ['', [Validators.required, Validators.maxLength(30)]],
            assetTagNo: ['', [Validators.required, Validators.maxLength(30)]],
            description: [''],
            clientId: ['', [Validators.required]],
            location: ['', [Validators.required]],
            thirdPartyName: ['', [Validators.required, Validators.maxLength(30)]],
            phoneNo: ['', [Validators.required]],
            emailAddress: ['', [Validators.pattern(EMAIL_PATTERN), Validators.maxLength(50)]],
            rates: this.buildRatesForm(),
            assetMeter: this.buildAssetMeterForm()
        })
    };

    /** buildRatesForm */
    public buildRatesForm(): FormGroup {
        return this.fb.group({
            colorRate: ['', [Validators.required]],
            bwRate: ['', [Validators.required]],
            scanRate: ['', [Validators.required]],
            colorTenantRate: ['', [Validators.required]],
            bwTenantRate: ['', [Validators.required]],
            scanTenantRate: ['', [Validators.required]],
        });
    }

    /** buildAssetMeterForm */
    public buildAssetMeterForm(): FormGroup {
        return this.fb.group(
            {
                tenantRates: [''],
                requestType: ['Client'],
                readingDate: [new Date()],
                previousColorRead: ['', [Validators.required, Validators.maxLength(9)]],
                previousBwRead: ['', [Validators.required, Validators.maxLength(9)]],
                previousScanRead: ['', [Validators.required, Validators.maxLength(9)]],
                currentColorRead: ['', [Validators.maxLength(9)]],
                currentBwRead: ['', [Validators.maxLength(9)]],
                currentScanRead: ['', [Validators.maxLength(9)]],
                colorRate: ['', [Validators.required]],
                bwRate: ['', [Validators.required]],
                scanRate: ['', [Validators.required]],
            }
        );
    }

    /**
     * This method will validate the form
     * If form is valid then it will 
     * @param assetFormGroup 
     */
    // tslint:disable-next-line: cyclomatic-complexity
    public saveAsset(assetFormGroup: FormGroup, asset: Asset): void {
        this.formGroup = assetFormGroup;
        // use for asset type set other.
        if ((assetFormGroup.value.assetTypeId === 3) || (asset && asset.assetTypeId === 3)) {
            this.formGroup.valid && this.add.next(this.formGroup.getRawValue());
            return;
        }
        // use for set client rate or tenant rate base on requestType dropdown.
        this.setRatesBasedOnRateRequestType();
        // use for set run time validation 
        this.setRuntimeValidationsForCurrentReads(assetFormGroup.get('assetMeter') as FormGroup);
        if (this.formGroup.valid) {
            if (!asset) {
                // use for add asset form first time.
                this.assetMeter.removeControl('previousColorRead');
                this.assetMeter.removeControl('previousBwRead');
                this.assetMeter.removeControl('previousScanRead');
            }
            const assetData: Asset = this.setCurrentRead(asset)
            this.add.next(assetData);
        }
    }

    /**
     * This will bind the form control value
     * @param userFormGroup is the form group containing all the controls
     * @param asset is the object storing all the values  
     */
    public bindControlValue(assetFormGroup: FormGroup, asset: Asset): FormGroup {
        this.formGroup = assetFormGroup;
        if (asset) {
            // use for asset type set other.
            if (asset.assetTypeId === 3) {
                this.formGroup.patchValue(asset);
                this.formGroup.get('assetTypeId').disable();
                return this.formGroup;
            }
            // use for patch value when first meter read add.
            this.bindControlsBasedonAssetMeter(asset);
            asset.assetMeter && this.setEditTimeValidation(asset.assetMeter);

            this.formGroup.get('assetMeter.requestType').setValue('Client');
        }
        return this.formGroup;
    }

    /**
     * set form controls enable/disable
     * @param assetFormGroup asset form group
     * @param asset asset detail
     * @param isArchived archive mode enabled
     */
    public disabledControls(assetFormGroup: FormGroup, asset?: Asset, isArchived: boolean = false): void {
        if (asset) {
            this.enableControls(assetFormGroup, asset);
        } else {
            this.assetFormDisablecontroll(assetFormGroup);
        }
        if (isArchived) {
            this.assetFormDisablecontroll(assetFormGroup);
        }
    }

    /** onAssetTypeIdChange */
    public onAssetTypeIdChange(assetFormGroup: FormGroup, value: number, asset?: Asset, isArchived: boolean = false): void {
        this.formGroup = assetFormGroup;
        if (value === this.assetTypeOptions.OTHER) {
            this.openMeterRead = false;
            assetFormGroup.removeControl('rates');
            assetFormGroup.removeControl('assetMeter');
        } else {
            assetFormGroup.addControl('rates', this.buildRatesForm());
            assetFormGroup.addControl('assetMeter', this.buildAssetMeterForm());
            this.openMeterRead = true;
            this.disabledControls(assetFormGroup, asset, isArchived);
            this.disableRates();
        }
    }

    /** use for set edit time validation and disabled control */
    private setEditTimeValidation(assetMeter: AssetMeter): void {
        // disable rates if value greater than 0
        this.disableRates();
        this.currentColorRead.setValidators([Validators.min(assetMeter.previousColorRead), Validators.maxLength(9)]);
        this.currentBwRead.setValidators([Validators.min(assetMeter.previousBwRead), Validators.maxLength(9)]);
        this.currentScanRead.setValidators([Validators.min(assetMeter.previousScanRead), Validators.maxLength(9)]);
        this.updateValueAndValidityForPreviousReads();
        this.updateValueAndValidityForCurrentReads();
    }

    /** set runtime validations for the current-reads */
    private setRuntimeValidationsForCurrentReads(assetMeterForm: FormGroup): void {
        const assetMeter: AssetMeter = assetMeterForm.getRawValue();
        assetMeter.currentColorRead && this.currentColorRead.setValidators([Validators.min(assetMeter.previousColorRead), Validators.maxLength(9)]);
        assetMeter.currentBwRead && this.currentBwRead.setValidators([Validators.min(assetMeter.previousBwRead), Validators.maxLength(9)]);
        assetMeter.currentScanRead && this.currentScanRead.setValidators([Validators.min(assetMeter.previousScanRead), Validators.maxLength(9)]);
        this.updateValueAndValidityForCurrentReads();
    }

    /** updateControlAndValue */
    private updateValueAndValidityForPreviousReads(): void {
        this.previousColorRead.updateValueAndValidity();
        this.previousBwRead.updateValueAndValidity();
        this.previousScanRead.updateValueAndValidity();
    }

    /** update value and validity */
    private updateValueAndValidityForCurrentReads(): void {
        this.currentColorRead.updateValueAndValidity();
        this.currentBwRead.updateValueAndValidity();
        this.currentScanRead.updateValueAndValidity();
    }

    /** disable rates if value greater than 0 */
    private disableRates(): void {
        this.rates.get('colorRate').value > 0 && this.rates.get('colorRate').disable();
        this.rates.get('bwRate').value > 0 && this.rates.get('bwRate').disable();
        this.rates.get('scanRate').value > 0 && this.rates.get('scanRate').disable();
        this.rates.get('colorTenantRate').value > 0 && this.rates.get('colorTenantRate').disable();
        this.rates.get('bwTenantRate').value > 0 && this.rates.get('bwTenantRate').disable();
        this.rates.get('scanTenantRate').value > 0 && this.rates.get('scanTenantRate').disable();
    }

    /**
     * bind form controls based on asset-meter
     * @param asset Asset data
     */
    private bindControlsBasedonAssetMeter(asset: Asset): void {
        let previousColorReadValidations: ValidatorFn[] = [Validators.min(this.previousColorRead.value), Validators.maxLength(9)];
        let previousBwReadValidations: ValidatorFn[] = [Validators.min(this.previousBwRead.value), Validators.maxLength(9)];
        let previousScanReadValidations: ValidatorFn[] = [Validators.min(this.previousScanRead.value), Validators.maxLength(9)];
        if (asset.assetMeter) {
            this.formGroup.patchValue(asset);
            previousColorReadValidations.push(Validators.required);
            previousBwReadValidations.push(Validators.required);
            previousScanReadValidations.push(Validators.required);
        } else {
            // use for not meter read present in asset.
            asset.assetMeter = new AssetMeter();
            asset.assetMeter.readingDate = new Date();
            this.formGroup.patchValue(asset);
        }
        this.previousColorRead.setValidators(previousColorReadValidations);
        this.previousBwRead.setValidators(previousBwReadValidations);
        this.previousScanRead.setValidators(previousScanReadValidations);
    }

    /** set rates based on selected rate-request type */
    private setRatesBasedOnRateRequestType(): void {
        if (this.formGroup.value.assetMeter && this.formGroup.value.assetMeter.requestType === 'Client') {
            const { colorRate, bwRate, scanRate }: any = this.rates.getRawValue();
            this.assetMeter.patchValue({ colorRate, bwRate, scanRate, tenantRates: false })
        } else if (this.formGroup.value.assetMeter && this.formGroup.value.assetMeter.requestType === 'Tenant') {
            const { colorTenantRate, bwTenantRate, scanTenantRate }: any = this.rates.getRawValue();
            this.assetMeter.patchValue({ colorRate: colorTenantRate, bwRate: bwTenantRate, scanRate: scanTenantRate, tenantRates: true })
        }
    }

    /**
     * disabledControls
     * @param assetFormGroup 
     * @param asset 
     */
    private enableControls(assetFormGroup: FormGroup, asset: Asset): void {
        assetFormGroup.get('assetMeter.previousColorRead').enable();
        assetFormGroup.get('assetMeter.previousBwRead').enable();
        assetFormGroup.get('assetMeter.previousScanRead').enable();
        asset.rates && assetFormGroup.get('rates').patchValue(asset.rates);
        asset.assetMeter && assetFormGroup.get('assetMeter').patchValue(asset.assetMeter);
    }

    /** assetFormDisablecontroll  */
    private assetFormDisablecontroll(assetFormGroup: FormGroup): void {
        assetFormGroup.get('assetMeter.previousColorRead').disable();
        assetFormGroup.get('assetMeter.previousBwRead').disable();
        assetFormGroup.get('assetMeter.previousScanRead').disable();
    }

    /**
     * set default value for current read
     * @param asset Asset detail
     */
    private setCurrentRead(asset: Asset): Asset {
        const assetData: Asset = { ...this.formGroup.getRawValue() };
        const previousColorRead: number = asset ? assetData.assetMeter.previousColorRead : 0;
        const previousBwRead: number = asset ? assetData.assetMeter.previousBwRead : 0;
        const previousScanRead: number = asset ? assetData.assetMeter.previousScanRead : 0;
        if (!assetData.assetMeter.currentColorRead) { assetData.assetMeter.currentColorRead = previousColorRead || 0; };
        if (!assetData.assetMeter.currentBwRead) { assetData.assetMeter.currentBwRead = previousBwRead || 0; };
        if (!assetData.assetMeter.currentScanRead) { assetData.assetMeter.currentScanRead = previousScanRead || 0; };
        return assetData;
    }

    /** previousColorRead */
    private get previousColorRead(): FormControl {
        return this.formGroup.get('assetMeter.previousColorRead') as FormControl;
    }
    /** currentColorRead */
    private get currentColorRead(): FormControl {
        return this.formGroup.get('assetMeter.currentColorRead') as FormControl;
    }
    /** previousBwRead */
    private get previousBwRead(): FormControl {
        return this.formGroup.get('assetMeter.previousBwRead') as FormControl;
    }
    /** currentBwRead */
    private get currentBwRead(): FormControl {
        return this.formGroup.get('assetMeter.currentBwRead') as FormControl;
    }
    /** previousScanRead */
    private get previousScanRead(): FormControl {
        return this.formGroup.get('assetMeter.previousScanRead') as FormControl;
    }
    /** currentScanRead */
    private get currentScanRead(): FormControl {
        return this.formGroup.get('assetMeter.currentScanRead') as FormControl;
    }
    /** rates */
    private get rates(): FormGroup {
        return this.formGroup.get('rates') as FormGroup;
    }
    /** assetMeter */
    private get assetMeter(): FormGroup {
        return this.formGroup.get('assetMeter') as FormGroup;
    }
}