
/**
 * @name UserPresenter
 * @author Nitesh Sharma
 * @description This is a presenter service for userwhich contains all logic for presentation component
 */

import { Injectable, TemplateRef } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgSelectComponent } from '@ng-select/ng-select';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
// ---------------------------------------------------- //
import { isArray, isNumber } from 'util';
import { TimezoneMaster } from '../../../core/model/common.model';
import { EMAIL_PATTERN, PHONE_PATTERN, RoleConstants, PASSWORD_PATTERN } from '../../../core/utility/constants';
import { compareTwoValues } from '../../../core/utility/utility';
import { BaseFormPresenter } from '../../../shared/base-presenter/base-form.presenter';
import { User, UserMasterData } from '../../user.model';


/** 
 * UserFormPresenter 
 */
@Injectable()
export class UserFormPresenter extends BaseFormPresenter<User> {

    /** it will used to hide the user name control if user type is employee */
    public isShowUserNamePassword: boolean = true;
    /** This is used for subscribing the value of subject add */
    public add$: Observable<User>;
    /** set it true when form is submitted and form is not valid */
    public isShowError: boolean;
    /** This is used for add camelCaseModelName object */
    private add: Subject<User> = new Subject();

    constructor(private fb: FormBuilder) {
        super();
        this.add$ = this.add.asObservable();
    }
    /**
     * This will create all the controls for the form group
     * @param userFormGroup is the form group
     * @param fb is the form builder which will create the controls
     * @returns It will return the userFromGroup with all the controls
     */
    public buildForm(): FormGroup {
        return this.fb.group(
            {
                firstName: ['', [Validators.required, Validators.maxLength(30)]],
                lastName: ['', [Validators.required, Validators.maxLength(30)]],
                roleId: [null, [Validators.required]],
                clientId: [null, [Validators.required]],
                officeId: [null, [Validators.required]],
                email: ['', [Validators.required, Validators.pattern(EMAIL_PATTERN), Validators.maxLength(50)]],
                departmentName: ['', [Validators.required]],
                floorId: [null, [Validators.required]],
                primaryContactNumber: [null, [Validators.required, Validators.pattern(PHONE_PATTERN)]],
                deskLocation: ['', [Validators.required]],
                mailStop: [''],
                deskContactNumber: [null, [Validators.pattern(PHONE_PATTERN)]],
                timezoneId: [null, [Validators.required]],
                priority: ['', [Validators.min(1), Validators.maxLength(5), Validators.pattern(/^[0-9]*$/)]],
                userName: ['', [Validators.required, Validators.maxLength(50)]],
                deskExtensionNumber: ['', [Validators.pattern(/^[0-9]*$/), Validators.maxLength(6), Validators.minLength(3)]],
                password: [null, [Validators.minLength(8), Validators.maxLength(20), Validators.pattern(PASSWORD_PATTERN)]],
                confirmPassword: [null]
            },
            { validators: compareTwoValues('password', 'confirmPassword') });
    }

    /** when user changes the role from dropdown */
    public checkManagerRole(
        userFormGroup: FormGroup, client: NgSelectComponent, user: User,
        optionTemplateRef: TemplateRef<any>, multiLabelTemplateRef: TemplateRef<any>): void {

        const clientIdControl: AbstractControl = userFormGroup.get('clientId');
        const roleId: number = userFormGroup.get('roleId').value;
        const clientIds: number[] = clientIdControl.value;
        
        if (roleId === RoleConstants.MANAGER) {
            client.multiple = true;
            client.closeOnSelect = false;
            client.optionTemplate = optionTemplateRef;
            client.multiLabelTemplate = multiLabelTemplateRef;

            if (clientIds && isArray(clientIds) && clientIds[0]) {
                clientIdControl.setValue(clientIds);
            } else if (clientIds && isNumber(clientIds)) {
                clientIdControl.setValue([clientIds]);
            } else if (user) {
                clientIdControl.setValue(user.clientId);
            } else {
                clientIdControl.setValue(null);
            }
        } else {
            client.multiple = false;
            client.closeOnSelect = true;
            client.optionTemplate = null;
            client.multiLabelTemplate = null;

            if (isArray(clientIds) && clientIds && clientIds[0]) {
                clientIdControl.setValue(clientIds[0]);
            } else if (isNumber(clientIds)) {
                clientIdControl.setValue(clientIds);
            } else if (user && user.clientId && user.clientId[0]) {
                clientIdControl.setValue(user.clientId[0]);
            } else {
                clientIdControl.setValue(null);
            }
        }
        client.detectChanges();
    }

    /**
     * This will bind the form control value
     * @param userFormGroup is the form group containing all the controls
     * @param useris the object storing all the values  
     */
    public bindControlValue(userFormGroup: FormGroup, data: User): FormGroup {
        if (data) {
            userFormGroup.patchValue(data);
            userFormGroup.get('clientId').disable();
            userFormGroup.get('roleId').disable();
            userFormGroup.get('userName').disable();
            this.onUserTypeChange(userFormGroup);
        }
        return userFormGroup;
    }

    /** it will called on user type change */
    public onUserTypeChange(formGroup: FormGroup): void {
        const userType: number = formGroup.get('roleId').value;
        if (userType === RoleConstants.EMPLOYEE) {
            this.isShowUserNamePassword = false;
            formGroup.get('userName').setValue(null);
            formGroup.get('userName').clearValidators();
            formGroup.get('userName').updateValueAndValidity();
            formGroup.get('password').setValue(null);
            formGroup.get('password').clearValidators();
            formGroup.get('password').updateValueAndValidity();
            formGroup.get('confirmPassword').setValue(null);
            formGroup.get('confirmPassword').updateValueAndValidity();
            formGroup.clearValidators();
            formGroup.updateValueAndValidity();
        } else {
            this.isShowUserNamePassword = true;
            formGroup.get('userName').setValidators([Validators.required, Validators.maxLength(30)]);
            formGroup.get('userName').updateValueAndValidity();
            formGroup.get('password').setValidators([Validators.minLength(8), Validators.maxLength(20), Validators.pattern(PASSWORD_PATTERN)]);
            formGroup.get('password').updateValueAndValidity();
            formGroup.setValidators([compareTwoValues('password', 'confirmPassword')]);
            formGroup.updateValueAndValidity();
        }
    }

    /** Set Time Zone */
    public setTimeZone(userFormGroup: FormGroup, user: User): void {
        userFormGroup.patchValue({
            roleId: user.roleId,
            clientId: user.clientId,
            timezoneId: user.timezoneId,
        })
    }

    /** Set Est Time Zone */
    public setESTTimeZone(userFormGroup: FormGroup, userMasterData: UserMasterData): void {
        const estTimeZones: TimezoneMaster[] = userMasterData.timezones.filter((timezone: TimezoneMaster) =>
            timezone.abbreviation === 'EDT');
        if (estTimeZones && estTimeZones.length === 1) {
            userFormGroup.patchValue({
                timezoneId: estTimeZones[0].timezoneId,
            });
        } else if (estTimeZones && estTimeZones.length > 1)
            userFormGroup.patchValue({
                timezoneId: estTimeZones[1].timezoneId,
            });
    }

}



