
/**
 * @name ClientFormPresenter
 * @author Enter Your Name Here
 * @description This is a presenter service for clientwhich contains all logic for presentation component
 */

import { ChangeDetectorRef, Injectable } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
//---------------------------------------------------------------------//
import { requiredFileType } from 'common-libs';
//---------------------------------------------------------------------//
import { EMAIL_PATTERN, PHONE_PATTERN, URL_PATTERN } from '../../../core/utility/constants';
import { ClientDetails } from '../../client.model';
import { validateSingleFileSize } from '../../../core/utility/validations';
import { convertFileToBase64 } from '../../../core/utility/utility';


/** 
 * ClientFormPresenter 
 */
@Injectable()
export class ClientFormPresenter {

    /** This is used for subscribing the value of subject add */
    public add$: Observable<ClientDetails>;
    /** This is used for subscribing the value of subject save and continue */
    public saveAndContinue$: Observable<ClientDetails>;
    /** This is used for add camelCaseModelName object */
    private add: Subject<ClientDetails> = new Subject();
    /** This is used for add camelCaseModelName object */
    private saveAndContinue: Subject<ClientDetails> = new Subject();

    constructor(private fb: FormBuilder, private cdrRef: ChangeDetectorRef,) {
        this.add$ = this.add.asObservable();
        this.saveAndContinue$ = this.saveAndContinue.asObservable();
    }
    /**
     * This will create all the controls for the form group
     * @param clientFormGroup is the form group
     * @param fb is the form builder which will create the controls
     * @returns It will return the clientFromGroup with all the controls
     */
    public buildForm(): FormGroup {
        return this.fb.group({
            companyName: ['', [Validators.required, Validators.maxLength(30)]],
            contactPerson: ['', [Validators.required, Validators.maxLength(30)]],
            contactNumber: ['', [Validators.required, Validators.pattern(PHONE_PATTERN)]],

            emailAddress: ['', [Validators.required, Validators.pattern(EMAIL_PATTERN), Validators.maxLength(50)]],
            website: [null, [Validators.pattern(URL_PATTERN), Validators.maxLength(50)]],

            _logoFileNameSmall: ['', [validateSingleFileSize(2000), requiredFileType(['png', 'jpeg', 'jpg'])]],
            _logoFileNameLarge: ['', [validateSingleFileSize(2000), requiredFileType(['png', 'jpeg', 'jpg'])]],
            _logoSmall: [null],
            _logoLarge: [null],

            originalLogoSmall: [null, []],
            logoSmall: [null, []],
            logoSmallExtension: [null, []],

            originalLogoLarge: [null, []],
            logoLarge: [null, []],
            logoLargeExtension: [null, []],

            tenants: [false, [Validators.required]],
            notifications: [false, [Validators.required]],
            accountNumber: [false, [Validators.required]],

            copyIt: [false],
            bookIt: [false],
            mail: [false],
            workflow: [false],
            visitorLog: [false],

            copyItSlaTimeLimit: ['', [Validators.required]],
            fleetItSlaTimeLimit: ['', [Validators.required]],
            bookItSlaTimeLimit: ['', [Validators.required]],

            contactEmail: [null, [Validators.required, Validators.pattern(EMAIL_PATTERN), Validators.maxLength(50)]],
            contactPhoneNumber: [null, [Validators.required, Validators.pattern(PHONE_PATTERN)]],

        }, { validators: this.atleastOneReqired() })
    };


    /**
     * This method will validate the form
     * If form is valid then it will 
     * patch selected product licensing list to client details
     * @param clientFormGroup 
     */
    public saveClient(clientFormGroup: FormGroup, saveAndContinue?: boolean): void {
        if (clientFormGroup.valid) {
            let client: ClientDetails = clientFormGroup.getRawValue();
            saveAndContinue ? this.saveAndContinue.next(client) : this.add.next(client);
        }
        else {
            // show any custom validation here 
        }
    }

    /**
     * This will bind the form control value
     * @param userFormGroup is the form group containing all the controls
     * @param clientis the object storing all the values  
     */
    public bindControlValue(clientFormGroup: FormGroup, client: ClientDetails): FormGroup {
        if (client) {
            clientFormGroup.patchValue(client);
            this.setFormControls(clientFormGroup);
        }
        return clientFormGroup;
    }

    /** Convert file to base64 */
    public convertFileToBase64(file: File, clientFormGroup: FormGroup, ctrlLogo: string, ctrlOriginal: string, ctrlExtension: string): void {
        convertFileToBase64(file, clientFormGroup, ctrlLogo, ctrlOriginal, ctrlExtension, this.cdrRef);
    }

    /**
     * Set Enable/Disable Form controls based on value as default
     * @param clientFormGroup Form group
     */
    public setFormControls(clientFormGroup: FormGroup): void {
        const client: ClientDetails = clientFormGroup.getRawValue();
        const tenants: AbstractControl = clientFormGroup.get('tenants');
        const copyItSlaTimeLimit: AbstractControl = clientFormGroup.get('copyItSlaTimeLimit');
        const fleetItSlaTimeLimit: AbstractControl = clientFormGroup.get('fleetItSlaTimeLimit');
        const bookItSlaTimeLimit: AbstractControl = clientFormGroup.get('bookItSlaTimeLimit');
        this.toggleControlAndDefaultValue(client.copyIt, copyItSlaTimeLimit, fleetItSlaTimeLimit, tenants);
        this.toggleControlAndDefaultValue(client.bookIt, bookItSlaTimeLimit);
    }

    /**
     * enable/Disable CopyIt SLA Time
     * @param clientFormGroup Get the form gropup
     * @param flag Get the flag true or false
     */
    public enableDisableCopyItSLATime(clientFormGroup: FormGroup, flag: boolean): void {
        const copyItSlaTimeLimit: AbstractControl = clientFormGroup.get('copyItSlaTimeLimit');
        const fleetItSlaTimeLimit: AbstractControl = clientFormGroup.get('fleetItSlaTimeLimit');
        const tenants: AbstractControl = clientFormGroup.get('tenants');
        this.toggleControlAndDefaultValue(flag, copyItSlaTimeLimit, fleetItSlaTimeLimit, tenants);
    }

    /**
     * enable/Disable BookIt SLA Time
     * @param clientFormGroup Get the form gropup
     * @param flag Get the flag true or false
     */
    public enableDisableBookItSLATime(clientFormGroup: FormGroup, flag: boolean): void {
        const bookItSlaTimeLimit: AbstractControl = clientFormGroup.get('bookItSlaTimeLimit');
        this.toggleControlAndDefaultValue(flag, bookItSlaTimeLimit);
    }

    /**
     * Enable/Disable Controls on copy it
     * @param flag Boolean flag
     * @param clientFormGroup Client form group
     */
    private toggleControlAndDefaultValue(flag: boolean, ...controls: AbstractControl[]): void {
        if (controls.length > -1) {
            if (flag) {
                controls.forEach((control: FormControl) => control.enable())
            } else {
                controls.forEach((control: FormControl) => {
                    const value: string | boolean = typeof control.value === 'boolean' ? false : null;
                    control.patchValue(value, { emitEvent: false });
                    control.disable();
                })
            }
        }
    }

    /**
     * Validate form group to have at least one licensing checked
     */
    private atleastOneReqired(): any {
        return (formGroup: FormGroup): any => {
            const copyIt: AbstractControl = formGroup.controls.copyIt;
            const mail: AbstractControl = formGroup.controls.mail;
            const workflow: AbstractControl = formGroup.controls.workflow;
            const bookIt: AbstractControl = formGroup.controls.bookIt;
            const visitorLog: AbstractControl = formGroup.controls.visitorLog;

            if (copyIt && mail && workflow && bookIt) {
                if (!(copyIt.value || mail.value || workflow.value || bookIt.value || visitorLog.value)) {
                    return { invalid: true };
                }
            }
            return null;
        }
    }
}


