

/**
 * @author Rayhan Kasli.
 * @description This is adapter service use for transforming data base user requirement. 
 */

import { Injectable } from '@angular/core';
import { Adapter } from 'common-libs';
// -------------------------------------------- //
import { VisitorLog, VisitorLogResponse, IdentificationProof, VisitorStatus, NewVisitorLog, UploadPicture, VisitorLogFilterRecord, Employee } from '../visitor-log.model';

@Injectable()
export class VisitorLogAdapter implements Adapter<VisitorLog> {

    /** This method is used to transform response object into T object. */
    public toResponse(item: VisitorLogResponse): VisitorLog {
        const visitorLog: VisitorLog = new VisitorLog();
        visitorLog.clientId = item.clientId;
        visitorLog.visitorId = item.visitorId;
        visitorLog.visitorName = item.visitorName;
        visitorLog.identificationProofId = item.identificationProofId;
        visitorLog.identificationProofType = item.identificationProofType;
        visitorLog.employeeId = item.employeeId;
        visitorLog.employeeName = item.employeeName;
        visitorLog.checkInDate = this.dateTimeResponse(item.checkInDateTime);
        visitorLog.checkInTime = this.getTime(item.checkInDateTime);
        visitorLog.checkOutDate = item.checkOutDateTime ? this.dateTimeResponse(item.checkOutDateTime) : '';
        visitorLog.checkOutTime = item.checkOutDateTime ? this.getTime(item.checkOutDateTime) : '';
        visitorLog.badgeNo = item.badgeNo;
        visitorLog.statusId = item.statusId;
        visitorLog.status = item.status;
        visitorLog.purposeOfVisit = item.purposeOfVisit;
        visitorLog.actualImageName = item.actualImageName;
        visitorLog.imageName = item.imageName;
        visitorLog.createdAt = new Date(item.createdAt);
        return visitorLog;
    }

    /** This method is used to transform T object into request object. */
    public toRequest(item: VisitorLog): NewVisitorLog {
        const newVisitorLog: NewVisitorLog = new NewVisitorLog(
            item.clientId,
            item.visitorName,
            item.identificationProofId,
            item.employeeId,
            this.dateTimeRequest(new Date(item.checkInDate), item.checkInTime),
            item.checkOutDate ? this.dateTimeRequest(new Date(item.checkOutDate), item.checkOutTime) : '',
            item.badgeNo,
            item.statusId,
            item.purposeOfVisit,
        );
        return newVisitorLog;
    }
    /** convert time */
    private getTime(timeString: string): string {
        const time: { h: number, m: number } = { h: 0, m: 0 };
        const splitTime: string[] = timeString.split(' ');
        const splitStr: string[] = splitTime[1].split(':');
        time.h = Math.abs(+splitStr[0]);
        time.m = Math.abs(+splitStr[1]);
        const toDay = new Date();
        toDay.setUTCHours(time.h);
        toDay.setUTCMinutes(time.m);
        const timeStr = new Date(toDay).toLocaleTimeString('en', { hour12: false }).split(' ');
        return `${timeStr[0].replace(/[^\x00-\x7F]/g, '').substr(0, 5)}`;
    }
    /** dateTime */
    private dateTimeRequest(dateTime: Date, time: string): string {
        const month: number = dateTime.getMonth() + 1;
        const newDatTime: string = dateTime.getFullYear() + '-' + month + '-' + dateTime.getDate() + ' ' + time;
        return newDatTime;
    }
    /** dateTime */
    private dateTimeResponse(dateTime: string): any {
        const dateTimeString: string = dateTime;
        const dateTimeSplit: string[] = dateTimeString.split(' ');
        const date: string[] = dateTimeSplit[0].split('-');
        const time: string[] = dateTimeSplit[1].split(':');
        const day: number = parseInt(date[2]);
        const month: number = parseInt(date[1]) - 1;
        const year: number = parseInt(date[0]);
        const hours: number = parseInt(time[0]);
        const minutes: number = parseInt(time[1]);
        const newDateTime: Date = new Date(Date.UTC(year, month, day, hours, minutes));
        return newDateTime;
    }
}

@Injectable()
export class IdentificationProofAdapter implements Adapter<IdentificationProof> {

    /** This method is used to transform response object into T object. */
    public toResponse(item: IdentificationProof): IdentificationProof {
        const identificationProof: IdentificationProof = new IdentificationProof(
            item.identificationProofId,
            item.identificationProof
        );
        return identificationProof;
    }

}

@Injectable()
export class VisitorStatusAdapter implements Adapter<VisitorStatus> {

    /** This method is used to transform response object into T object. */
    public toResponse(item: VisitorStatus): VisitorStatus {
        const visitorStatus: VisitorStatus = new VisitorStatus(
            item.visitorStatusId,
            item.visitorStatus
        );
        return visitorStatus;
    }

}
@Injectable()
export class UploadPictureAdapter implements Adapter<UploadPicture> {

    /** This method is used to transform response object into T object. */
    public toRequest(item: UploadPicture): UploadPicture {
        const uploadPicture: UploadPicture = new UploadPicture(
            item.actualImageName,
            this.getBase64StringFromFileData(item.imageName),
            item.imageExtension
        );
        return uploadPicture;
    }

    /**
     * Get encoded base64 string from file data
     * @param data File data
     */
    private getBase64StringFromFileData(data: string): string {
        return data ? data.split('base64,').pop() : null;
    }

}
/** VisitorFilterAdapter */
@Injectable()
export class VisitorFilterAdapter implements Adapter<VisitorLogFilterRecord> {
    /** This method is used to transform T object into request object. */
    public toRequest(item: VisitorLogFilterRecord): VisitorLogFilterRecord {
        const visitorLogFilterRecord: VisitorLogFilterRecord = new VisitorLogFilterRecord();
        if (item.isHistory) {
            visitorLogFilterRecord.fromPeriod = item.fromPeriod && this.getfilterDate(new Date(item.fromPeriod));
            visitorLogFilterRecord.toPeriod = item.toPeriod && this.getfilterDate(new Date(item.toPeriod));
            visitorLogFilterRecord.clientId = item.clientId;
            visitorLogFilterRecord.isHistory = true;
        } else {
            visitorLogFilterRecord.fromPeriod = item.fromPeriod ? this.getfilterDate(new Date(item.fromPeriod)) : this.getfilterDate(new Date());
            visitorLogFilterRecord.toPeriod = item.toPeriod ? this.getfilterDate(new Date(item.toPeriod)) : this.getfilterDate(new Date());
            visitorLogFilterRecord.clientId = item.clientId;
        }
        return visitorLogFilterRecord;
    }

    /** getfilterDate */
    private getfilterDate(filterDate: Date): string {
        const month: number = filterDate.getMonth() + 1;
        return filterDate.getFullYear() + '-' + month + '-' + filterDate.getDate();
    }
}

/** EmployeeAdapter */
@Injectable()
export class EmployeeAdapter implements Adapter<Employee> {
    /** This method is used to transform T object into request object. */
    public toResponse(item: Employee): Employee {
        const employee: Employee = new Employee(
            item.userId,
            item.roleId,
            item.roleName,
            item.firstName + ' ' + item.lastName,
            item.deskLocation,
            item.priority,
            item.firstName,
            item.lastName
        );
        return employee;
    }
}



