
/**
 * @author Nitesh Sharma | Rayhan Kasli.
 * @description
 */
import { InjectionToken } from '@angular/core';
// --------------------------------------- //
import { SortingOrder } from 'common-libs';

/** VisitorLogListResult */
export class VisitorLogListResult {
    public total: number;
    public visitorlogList: VisitorLog[];
  }

/** model class for VisitorLog */
export class VisitorLog {

    /** visitorLogIf  of VisitorLog */
    public clientId: number;

    /** visitorLogIf  of VisitorLog */
    public visitorId: number;

    /** visitorName  of VisitorLog */
    public visitorName: string;

    /** identificationType  of VisitorLog */
    public identificationProofId: number;

    /** identificationType  of VisitorLog */
    public identificationProofType: string;

    /** employeeName  of VisitorLog */
    public employeeId: number;

    /** employeeName  of VisitorLog */
    public employeeName: string;

    /** checkInDate  of VisitorLog */
    public checkInDate: any;

    /** checkInDate  of VisitorLog */
    public checkInTime: string;

    /** checkOutDate  of VisitorLog */
    public checkOutDate: string;

    /** checkOutDate  of VisitorLog */
    public checkOutTime: string;

    /** badgeNo  of VisitorLog */
    public badgeNo: string;

    /** status  of VisitorLog */
    public statusId: number;
    /** status  of VisitorLog */
    public status: string;

    /** purpose  of VisitorLog */
    public purposeOfVisit: string;
    /** purpose  of VisitorLog */
    public actualImageName: string;
    /** purpose  of VisitorLog */
    public imageName: string;
    /** purpose  of VisitorLog */
    public createdAt: Date;
    /** isEdit */
    public isEdit: boolean;

    constructor(
        clientId?: number,
        visitorId?: number,
        visitorName?: string,
        identificationProofId?: number,
        identificationProofType?: string,
        employeeId?: number,
        employeeName?: string,
        checkInDate?: any,
        checkInTime?: string,
        checkOutDate?: string,
        checkOutTime?: string,
        badgeNo?: string,
        statusId?: number,
        status?: string,
        purposeOfVisit?: string,
        actualImageName?: string,
        imageName?: string,
        createdAt?: Date,
        isEdit: boolean = false
    ) {
        this.clientId = clientId;
        this.visitorId = visitorId;
        this.visitorName = visitorName;
        this.identificationProofId = identificationProofId;
        this.identificationProofType = identificationProofType;
        this.employeeId = employeeId;
        this.employeeName = employeeName;
        this.checkInDate = checkInDate;
        this.checkInTime = checkInDate;
        this.checkOutDate = checkOutDate;
        this.checkOutTime = checkOutTime;
        this.badgeNo = badgeNo;
        this.statusId = statusId;
        this.status = status;
        this.purposeOfVisit = purposeOfVisit;
        this.actualImageName = actualImageName;
        this.imageName = imageName;
        this.createdAt = createdAt;
        this.isEdit = isEdit;
    }
}
/** model class for NewVisitorLog */
export class NewVisitorLog {

    /** visitorLogId  of NewVisitorLog */
    public clientId: number;

    /** visitorName  of NewVisitorLog */
    public visitorName: string;

    /** identificationType  of NewVisitorLog */
    public identificationProofId: number;

    /** employeeName  of NewVisitorLog */
    public employeeId: number;

    /** checkInDate  of NewVisitorLog */
    public checkInDateTime: string;

    /** checkOutDate  of NewVisitorLog */
    public checkOutDateTime: string;

    /** badgeNo  of NewVisitorLog */
    public badgeNo: string;

    /** status  of NewVisitorLog */
    public statusId: number;

    /** purpose  of NewVisitorLog */
    public purposeOfVisit: string;

    constructor(
        clientId?: number,
        visitorName?: string,
        identificationProofId?: number,
        employeeId?: number,
        checkInDateTime?: string,
        checkOutDateTime?: string,
        badgeNo?: string,
        statusId?: number,
        purposeOfVisit?: string,
    ) {
        this.clientId = clientId;
        this.visitorName = visitorName;
        this.identificationProofId = identificationProofId;
        this.employeeId = employeeId;
        this.checkInDateTime = checkInDateTime;
        this.checkOutDateTime = checkOutDateTime;
        this.badgeNo = badgeNo;
        this.statusId = statusId;
        this.purposeOfVisit = purposeOfVisit;
    }
}
/** model class for VisitorLogResponse */
export class VisitorLogResponse {

    /** visitorLogIf  of VisitorLog */
    public clientId: number;

    /** visitorLogIf  of VisitorLog */
    public visitorId: number;

    /** visitorName  of VisitorLog */
    public visitorName: string;

    /** identificationType  of VisitorLog */
    public identificationProofId: number;

    /** identificationType  of VisitorLog */
    public identificationProofType: string;

    /** employeeName  of VisitorLog */
    public employeeId: number;

    /** employeeName  of VisitorLog */
    public employeeName: string;

    /** checkInDate  of VisitorLog */
    public checkInDateTime: string;

    /** checkOutDate  of VisitorLog */
    public checkOutDateTime: string;

    /** badgeNo  of VisitorLog */
    public badgeNo: string;

    /** status  of VisitorLog */
    public statusId: number;
    /** status  of VisitorLog */
    public status: string;

    /** purpose  of VisitorLog */
    public purposeOfVisit: string;
    /** purpose  of VisitorLog */
    public actualImageName: string;
    /** purpose  of VisitorLog */
    public imageName: string;
    /** purpose  of VisitorLog */
    public createdAt: string;

    constructor(
        clientId?: number,
        visitorId?: number,
        visitorName?: string,
        identificationProofId?: number,
        identificationProofType?: string,
        employeeId?: number,
        employeeName?: string,
        checkInDateTime?: string,
        checkOutDateTime?: string,
        badgeNo?: string,
        statusId?: number,
        status?: string,
        purposeOfVisit?: string,
        actualImageName?: string,
        imageName?: string,
        createdAt?: string
    ) {
        this.clientId = clientId;
        this.visitorId = visitorId;
        this.visitorName = visitorName;
        this.identificationProofId = identificationProofId;
        this.identificationProofType = identificationProofType;
        this.employeeId = employeeId;
        this.employeeName = employeeName;
        this.checkInDateTime = checkInDateTime;
        this.checkOutDateTime = checkOutDateTime;
        this.badgeNo = badgeNo;
        this.statusId = statusId;
        this.status = status;
        this.purposeOfVisit = purposeOfVisit;
        this.actualImageName = actualImageName;
        this.imageName = imageName;
        this.createdAt = createdAt;
    }
}
/** Model class for sortRecord. */
export class VisitorLogSortRecord {
    /** This property is use for which type of sorting apply by user. */
    public sortBy: SortingOrder;
    /** This property is used for sort field . */
    public sortColumn: string;
}

export const VISITORLOG_SORT: InjectionToken<VisitorLogSortRecord> = new InjectionToken<VisitorLogSortRecord>('visitorLogSort');

/** Model class for filterRecord. */
export class VisitorLogFilterRecord {
    /** isActive */
    public isActive?: boolean;
    /** clientId. */
    public clientId?: number;
    /** This property is used for filter record. */
    public fromPeriod?: string;
    /** This property is used for filter record. */
    public toPeriod?: string;
    /** This property is used for filter record. */
    public isHistory?: boolean;

    constructor(
        fromPeriod?: string,
        toPeriod?: string,
        clientId?: number,
        isHistory?: boolean,
        isActive?: boolean,
    ) {
        this.fromPeriod = fromPeriod;
        this.toPeriod = toPeriod;
        this.isHistory = isHistory;
        this.clientId = clientId;
        this.isActive = isActive;
    }
}

export const VISITORLOG_FILTER: InjectionToken<VisitorLogFilterRecord> = new InjectionToken<VisitorLogFilterRecord>('visitorLogFilter');

/**
 * IdentificationProof
 */
export class IdentificationProof {

    /** identificationProofId */
    public identificationProofId: number;
    /** identificationProof */
    public identificationProof: string;

    constructor(
        identificationProofId?: number,
        identificationProof?: string
    ) {
        this.identificationProofId = identificationProofId;
        this.identificationProof = identificationProof;
    }
}
/**
 * VisitorStatus
 */
export class VisitorStatus {
    /** visitorStatusId */
    public visitorStatusId: number;
    /** visitorStatus */
    public visitorStatus: string;

    constructor(
        visitorStatusId?: number,
        visitorStatus?: string
    ) {
        this.visitorStatusId = visitorStatusId;
        this.visitorStatus = visitorStatus;
    }
}
/** VisitorMaster */
export class VisitorMaster {
    /** identificationProofs */
    public identificationProofs: IdentificationProof[];
    /** visitorStatus */
    public visitorStatus: VisitorStatus[];
    /** employeeList */
    public employeeList: Employee[]
}

/** UploadPicture */
export class UploadPicture {
    public visitorId: number;
    public actualImageName?: string;
    public imageName?: any;
    public imageExtension?: string;
    public uploadPicture?: File;

    constructor(
        actualImageName?: string,
        imageName?: string,
        imageExtension?: string,
    ) {
        this.actualImageName = actualImageName;
        this.imageName = imageName;
        this.imageExtension = imageExtension;
    }
}
/** Employee  */
export class Employee {

    /** userId */
    public userId: number;
    /** roleId */
    public roleId: number;
    /** roleName */
    public roleName: string;
    /** firstName */
    public firstName: string;
    /** lastName */
    public lastName: string;
    /** employeeName */
    public employeeName: string;
    /** deskLocation */
    public deskLocation: string;
    /** priority */
    public priority: number;

    constructor(
        userId?: number,
        roleId?: number,
        roleName?: string,
        employeeName?: string,
        deskLocation?: string,
        priority?: number,
        firstName?: string,
        lastName?: string
    ) {
        this.userId = userId;
        this.roleId = roleId;
        this.roleName = roleName;
        this.firstName = firstName;
        this.lastName = lastName;
        this.employeeName = employeeName;
        this.deskLocation = deskLocation;
        this.priority = priority;
    }
}

/** Visitor log available status */
export enum VisitorLogStatus {
    preRegister = 1,
    checkedIn = 2,
    badgeNotReturned = 3,
    checkedOut = 4
}

/** Visitor log file upload info for toster */
export enum File_Upload_Info {
    File_Type = 'Please select PNG or JPEG or JPG file.',
    File_Size = 'Picture should not be larger than 2mb.',
}