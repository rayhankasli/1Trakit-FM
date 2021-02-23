
/**
 * @name PackagesPresenter
 * @author Rayhan Kasli | Mitul Patel
 * @description This is a presenter service for packageswhich contains all logic for presentation component
 */

import { Injectable, OnDestroy } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';
//---------------------------------------------------------------------//
import { CoreDataService } from '../../../core/services/core-data.service';
import { DeliveryService, Packages, Slot, SlotParam, UserDetails } from '../../packages.model';


/** 
 * PackagesFormPresenter 
 */
@Injectable()
export class PackagesFormPresenter implements OnDestroy {

    /** This is used for subscribing the value of subject add */
    public add$: Observable<Packages>;
    /** to raise user-search event */
    public userSearch$: Observable<string>;
    /** This is used for add camelCaseModelName object */
    private add: Subject<Packages> = new Subject();
    /** selected client id */
    private clientId: number;
    /** to preserve user-search data */
    private userSearch: Subject<string>;
    /** to unsubscribe the stream */
    private destroy: Subject<void>;

    constructor(
        private fb: FormBuilder,
        private coreDataService: CoreDataService
    ) {
        this.add$ = this.add.asObservable();
        this.destroy = new Subject();
        this.userSearch = new Subject();
        this.userSearch$ = this.userSearch.asObservable();
        this.coreDataService.globalClientId$.pipe(takeUntil(this.destroy))
            .subscribe((clientId: number) => this.clientId = clientId);
    }
    /**
     * This will create all the controls for the form group
     * @param packagesFormGroup is the form group
     * @param fb is the form builder which will create the controls
     * @returns It will return the packagesFromGroup with all the controls
     */
    public buildForm(): FormGroup {
        return this.fb.group({
            packageId: [{ value: null, disabled: true }],
            clientId: [{ value: this.clientId, disabled: true }],
            barcode: ['', [Validators.required, Validators.maxLength(50)]],
            upiNumber: ['', [Validators.required, Validators.maxLength(30)]],
            toUserId: [null, [Validators.required]],
            packageFrom: ['', [Validators.required]],
            deliveryServiceId: [null, [Validators.required]],
            deliveryServiceFrom: [null, [Validators.required]],
            deliveryDate: [{ value: new Date(), disabled: true }],
            building: [{ value: '', disabled: true }],
            floor: [{ value: '', disabled: true }],
            deskLocation: [{ value: '', disabled: true }],
            slotId: [null, [Validators.required]],
            // scanned from mobile(1) or web(2)
            scanType: [{ value: 2, disabled: true }]
        })
    };

    /**
     * reset package form with default values
     * @param packageForm FormGroup
     */
    public resetForm(packageForm: FormGroup): void {
        const defaultData: Packages = { ...new Packages(), ...{ clientId: this.clientId, deliveryDate: new Date(), scanType: 2 } };
        packageForm.reset(defaultData);
    }

    /**
     * This method will validate the form
     * If form is valid then it will 
     * @param packagesFormGroup 
     */
    public savePackages(packagesFormGroup: FormGroup): void {
        if (packagesFormGroup.valid) {
            let packages: Packages = packagesFormGroup.getRawValue();
            this.add.next(packages);
        }
    }

    /**
     * This will bind the form control value
     * @param userFormGroup is the form group containing all the controls
     * @param packagesis the object storing all the values  
     */
    public bindControlValue(packagesFormGroup: FormGroup, packages: Packages): FormGroup {
        if (packages) {
            packagesFormGroup.patchValue(packages);
            packagesFormGroup.get('barcode').disable();
            packagesFormGroup.get('upiNumber').disable();
        }
        return packagesFormGroup;
    }

    /**
     * to patch data to form controls
     * @param packagesFormGroup form group
     * @param userDetails user details
     */
    public bindUserValue(packagesFormGroup: FormGroup, userDetails: UserDetails): void {
        if (userDetails) {
            const { building, floor, deskLocation }: any = userDetails;
            packagesFormGroup.patchValue({ building, floor, deskLocation });
            packagesFormGroup.updateValueAndValidity();
        }
    }

    /**
     * update delivery date based on available slot selection
     * @param packagesFormGroup Form group
     * @param param1 delivery date of package
     */
    public bindDeliveryDate(packagesFormGroup: FormGroup, { deliveryDate }: SlotParam): void {
        packagesFormGroup.patchValue({ deliveryDate });
    }

    /** disableUpiNumber */
    public disableControl(value: string, packagesFormGroup: FormGroup, controlName: string): void {
        if (value) {
            packagesFormGroup.get(controlName).reset();
            packagesFormGroup.get(controlName).disable({ emitEvent: false });
            packagesFormGroup.get(controlName).setValidators([]);
        }
        else {
            packagesFormGroup.get(controlName).enable({ emitEvent: false });
            if (controlName === 'upiNumber') {
                packagesFormGroup.get(controlName).setValidators([Validators.required, Validators.maxLength(30)]);
            } else if (controlName === 'barcode') {
                packagesFormGroup.get(controlName).setValidators([Validators.required, Validators.maxLength(50)]);
            }
        }
    }

    /**
     * toggle control for custom delivery service name
     * @param selectedService DeliveryService
     */
    public showDeliveryCompanyName(selectedService: DeliveryService, control: AbstractControl): boolean {
        if (!selectedService.isOther) {
            control.reset(null, { emitEvent: false });
            control.disable();
        } else {
            control.enable();
        }
        return selectedService.isOther;
    }

    /**
     * on user search raise event
     * @param search string
     */
    public onUserSearch(search: string): void {
        this.userSearch.next(search);
    }

    /** get slot parameters */
    public getSlotParameters({ officeId, deliveryDate }: SlotParam): SlotParam {
        const today: Date = new Date();
        const packageDate: Date = deliveryDate ? new Date(deliveryDate) : today;

        const todayDate: number = new Date(today).setHours(0, 0, 0, 0);
        const packageDeliveryDate: number = new Date(packageDate).setHours(0, 0, 0, 0);
        // if package scheduled for future date, load future slots
        // else load today's slots
        const greaterDate: Date = (packageDeliveryDate > todayDate) ? packageDate : today;
        return new SlotParam(officeId, new Date(greaterDate));
    }

    /**
     * set slots from package
     * show previously selected slot if list is not present
     * @param slots Slot[]
     * @param packages Packages
     */
    public setSlots(slots: Slot[], packages: Packages): Slot[] {
        const { slotId, slotTime }: Slot = packages;
        // find selected slot
        const selectedSlot: Slot = slotId && slots.find((slot: Slot) => slot.slotId === slotId);
        // add missing selected slot to master list
        const combinedSlots: Slot[] = selectedSlot ? slots : [{ slotId, slotTime }, ...slots];
        return combinedSlots;
    }

    public ngOnDestroy(): void {
        this.destroy.next();
        this.destroy.complete();
    }
}



