
/**
 * @name VisitorLogPresenter
 * @author Rayhan Kasli.
 * @description This is a presenter service for visitor-logwhich contains all logic for presentation component
 */

import { Injectable } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
//---------------------------------------------------------------------//
import { VisitorLog, VisitorLogStatus } from '../../../../visitor-log.model';

/** 
 * VisitorLogFormPresenter 
 */
@Injectable()
export class VisitorLogFormPresenter {

    /** This is used for subscribing the value of subject add */
    public add$: Observable<VisitorLog>;
    /** This is used for add camelCaseModelName object */
    private add: Subject<VisitorLog> = new Subject();

    constructor(private fb: FormBuilder) {
        this.add$ = this.add.asObservable();
    }
    /**
     * This will create all the controls for the form group
     * @param visitorLogFormGroup is the form group
     * @param fb is the form builder which will create the controls
     * @returns It will return the visitorLogFromGroup with all the controls
     */
    public buildForm(): FormGroup {
        return this.fb.group({
            visitorId: [null],
            visitorName: ['', [Validators.required, Validators.maxLength(30)]],
            identificationProofId: [null, [Validators.required]],
            employeeId: ['', [Validators.required]],
            checkInDate: [null, [Validators.required]],
            checkInTime: ['', [Validators.required]],
            checkOutDate: [null],
            checkOutTime: [''],
            badgeNo: ['', [Validators.maxLength(6)]],
            statusId: [null, [Validators.required]],
            purposeOfVisit: ['', [Validators.required, Validators.maxLength(50)]],
            clientId: [null]
        })
    };

    /**
     * This method will validate the form
     * If form is valid then it will 
     * @param visitorLogFormGroup 
     */
    public saveVisitorLog(visitorLogFormGroup: FormGroup): void {
        if (visitorLogFormGroup.valid) {
            let visitorLog: VisitorLog = visitorLogFormGroup.getRawValue();
            this.add.next(visitorLog);
        }
        else {
            // show any custom validation here 
        }
    }

    /**
     * This will bind the form control value
     * @param userFormGroup is the form group containing all the controls
     * @param visitorLogis the object storing all the values  
     */
    public bindControlValue(visitorLogFormGroup: FormGroup, visitorLog: VisitorLog): FormGroup {
        if (visitorLog) {
            visitorLogFormGroup.patchValue(visitorLog);
            visitorLogFormGroup.get('checkInDate').setValue(new Date(visitorLog.checkInDate));
            if (visitorLog.checkOutDate) {
                visitorLogFormGroup.get('checkOutDate').setValue(new Date(visitorLog.checkOutDate));
            }
        }
        return visitorLogFormGroup;
    }

    /** setTime */
    public setDate(date: string): Date {
        let newDate: Date = new Date(date);
        const newTime: Date = new Date();
        newDate.setHours(newTime.getHours());
        newDate.setMinutes(newTime.getMinutes());
        return newDate;
    }

    /** setTime */
    public setTime(dateTime: string): string {
        let newDateTime: Date = new Date(dateTime);
        let time: string = `${newDateTime.getHours() + ':' + newDateTime.getMinutes()}`
        return time;
    }

    /** Set Date and Time */
    public setDateAndTime(visitorLogFormGroup: FormGroup, date, time): void {
        visitorLogFormGroup.get('checkInDate').patchValue(new Date(date), { emitEvent: false });
        visitorLogFormGroup.get('checkInTime').patchValue(time, { emitEvent: false });
        visitorLogFormGroup.get('checkOutDate').patchValue('', { emitEvent: false });
        visitorLogFormGroup.get('checkOutTime').patchValue('', { emitEvent: false });
    }

    /** Set Date Out and In */
    public setCheckOutDateAndTime(visitorLogFormGroup: FormGroup, date: any, time: any): void {
        visitorLogFormGroup.get('checkOutDate').patchValue(new Date(date), { emitEvent: false });
        visitorLogFormGroup.get('checkOutTime').patchValue(time, { emitEvent: false });
    }

    /**
     * changeTimeDatePicker
     * @param time
     * @param date 
     */
    public changeTimeDatePicker(time: string, date: Date): Date {
        let newDateTime: Date = date ? date : new Date();
        const timeSting = this.getTime(time);
        newDateTime.setHours(timeSting.h);
        newDateTime.setMinutes(timeSting.m);
        return newDateTime;
    }

    /** timeValidation */
    public timeValidation(isFormSubmitted: boolean, visitorLogFormGroup: FormGroup, checkIndate: Date, checkOutDate: Date): boolean {
        if (isFormSubmitted || checkIndate && checkOutDate && checkIndate.getDate() === checkOutDate.getDate() && checkIndate.getMonth() === checkOutDate.getMonth() && checkIndate.getFullYear() === checkOutDate.getFullYear()) {
            if (checkIndate.getTime() > checkOutDate.getTime()) {
                visitorLogFormGroup.get('checkOutTime').setErrors({ 'invalid': true });
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    /** set log status on date-time changed */
    public setLogStatusAuto(statusId: VisitorLogStatus, visitorLogFormGroup: FormGroup): void {
        const ctrl: AbstractControl = visitorLogFormGroup.get('statusId');
        if (ctrl.pristine && ctrl.value !== statusId) {
            ctrl.patchValue(statusId); // set status to checked-in/checked-out according to date selected
            ctrl.markAsDirty();
        }
    }

    /** changeTime  */
    public changeTime(visitorLogFormGroup: FormGroup, time: string, controlDate: Date, controlName: string): void {
        let newCheckDateDate: Date;
        newCheckDateDate = this.changeTimeDatePicker(time, controlDate);
        if (controlName.toLowerCase() === 'checkintime') {
            visitorLogFormGroup.get('checkInDate').patchValue(new Date(newCheckDateDate), { emitEvent: false });
        }
        if (controlName.toLowerCase() === 'checkouttime') {
            visitorLogFormGroup.get('checkOutDate').patchValue(new Date(newCheckDateDate), { emitEvent: false });
        }
    }

    /** convert time */
    private getTime(timeString: string): { h: number, m: number } {
        const time: { h: number, m: number } = { h: 0, m: 0 };
        const splitStr: string[] = timeString.split(':');
        time.h = Math.abs(+splitStr[0]);
        time.m = Math.abs(+splitStr[1]);
        return time;
    }

}



