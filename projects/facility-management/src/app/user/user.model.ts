
/**
 * @author Nitesh Sharma.
 * @description
 */
import { InjectionToken } from '@angular/core';
// -------------------------------------------------- //
import { SortingOrder } from 'common-libs';
// -------------------------------------------------- //
import { RoleMaster, TimezoneMaster, ClientMaster } from '../core/model/common.model';

/** Model class for UserListResult */
export class UserListResult {
    public total: number;
    public userList: User[];
}

/** Modal class of User Base */
export class UserBase {
    /** firstName */
    public firstName?: string;
    /** lastName */
    public lastName?: string;
    /** clientId */
    public clientId?: string | number | number[];
    /** email */
    public email?: string;
    /** roleId */
    public roleId?: number;
    /** officeId */
    public officeId?: number;
    /** floorId */
    public floorId?: number;
    /** deskLocation */
    public deskLocation?: string;
    /** mailStop */
    public mailStop?: string;
    /** priority */
    public priority?: number;
    /** timezoneId */
    public timezoneId?: number;
    /** primaryContactNumber */
    public primaryContactNumber?: string;
    /** deskContactNumber */
    public deskContactNumber?: string;
    /** departmentName */
    public departmentName?: string;
    /** userName */
    public userName?: string;
    /** deskExtensionNumber */
    public deskExtensionNumber?: string;

    constructor({
        firstName, lastName, clientId, email, roleId, officeId, floorId, deskLocation, mailStop, priority,
        timezoneId, primaryContactNumber, deskContactNumber, departmentName, userName, deskExtensionNumber
    }: any) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.clientId = clientId;
        this.email = email;
        this.roleId = roleId;
        this.officeId = officeId;
        this.floorId = floorId;
        this.deskLocation = deskLocation;
        this.mailStop = mailStop;
        this.priority = priority;
        this.timezoneId = timezoneId;
        this.primaryContactNumber = primaryContactNumber;
        this.deskContactNumber = deskContactNumber;
        this.departmentName = departmentName;
        this.userName = userName;
        this.deskExtensionNumber = deskExtensionNumber;
    }
}

/** model class for User */
export class UserResponse extends UserBase {
    /** userId */
    public userId?: number;
    /** clientName */
    public clientName?: string;
    /** role */
    public role?: string;
    /** office */
    public office?: string;
    /** floor */
    public floor?: string;
    /** timezone */
    public timezone?: string;
    /** isActive */
    public isActive?: boolean;
    /** isEdit */
    public isEdit?: boolean;

    constructor({
        userId, firstName, lastName, clientId, clientName, email,
        roleId, role, officeId, office, floorId, floor, deskLocation, mailStop, priority,
        timezoneId, timezone, primaryContactNumber, deskContactNumber, departmentName, userName,
        isActive, deskExtensionNumber, isEdit
    }: any) {
        super({
            firstName, lastName, clientId, email, roleId, officeId, floorId, deskLocation, mailStop, priority,
            timezoneId, primaryContactNumber, deskContactNumber, departmentName, userName, deskExtensionNumber
        });
        this.userId = userId;
        this.clientName = clientName;
        this.role = role;
        this.office = office;
        this.floor = floor;
        this.timezone = timezone;
        this.isActive = isActive;
        this.isEdit = isEdit || false;
    }
}

/** model class for User */
export class User extends UserResponse {
    /** password */
    public password?: string;

    constructor({
        userId, firstName, lastName, clientId, clientName, email,
        roleId, role, officeId, office, floorId, floor, deskLocation, mailStop, priority,
        timezoneId, timezone, primaryContactNumber, deskContactNumber, departmentName, userName,
        isActive, deskExtensionNumber, isEdit
    }: any) {
        super({
            userId, firstName, lastName, clientId, clientName, email,
            roleId, role, officeId, office, floorId, floor, deskLocation, mailStop, priority,
            timezoneId, timezone, primaryContactNumber, deskContactNumber, departmentName, userName,
            isActive, deskExtensionNumber, isEdit
        });
        // this.password = password;
    }
}

/** model class for NewUser */
export class NewUser extends UserBase {
    /** password for user */
    public password?: string;

    constructor({
        firstName, lastName, clientId, email, roleId, officeId, floorId, deskLocation, mailStop, priority,
        timezoneId, primaryContactNumber, deskContactNumber, departmentName, deskExtensionNumber, userName
    }: any) {
        super({
            firstName, lastName, clientId, email, roleId, officeId, floorId, deskLocation, mailStop, priority,
            timezoneId, primaryContactNumber, deskContactNumber, departmentName, deskExtensionNumber, userName
        });
        // this.password = password;
    }
}

/** Model class for sortRecord. */
export class UserSortRecord {
    /** This property is use for which type of sorting apply by user. */
    public sortBy: SortingOrder;
    /** This property is used for sort field . */
    public sortColumn: string;
}

export const USER_SORT: InjectionToken<UserSortRecord> = new InjectionToken<UserSortRecord>('userSort');

/** Model class for filterRecord. */
export class UserFilterRecord {
    /** isActive */
    public isActive?: boolean;
    /** clientId. */
    public clientId?: number;

    constructor(
        isActive?: boolean,
        clientId?: number
    ) {
        this.isActive = isActive;
        this.clientId = clientId;
    }
}

export const USER_FILTER: InjectionToken<UserFilterRecord> = new InjectionToken<UserFilterRecord>('userFilter');

/** UserMasterData */
export class UserMasterData {
    /** roles */
    public roles: RoleMaster[];
    /** timezones */
    public timezones: TimezoneMaster[];
    /** clients */
    public clients?: ClientMaster[];
}

/** Available Client list status */
export enum CustomerListStatus {
    Active = 'active',
    Inactive = 'inactive',
}

/** Model class for CustomerStatusList */
export class CustomerStatusList {
    /** statusKey */
    public statusKey: string;
    /** statusValue */
    public statusValue: boolean;
}

export const customerStatusList: CustomerStatusList[] = [
    {
        statusKey: 'Active',
        statusValue: true
    },
    {
        statusKey: 'Inactive',
        statusValue: false
    }
]

/**
 * Model for Bulk upload users
 */
export class BulkUploadUser {
    /** clientId of Bulk upload */
    public clientId: number;
    /** userImportFile of Bulk upload */
    public userImportFile: File;
}

/** Bulk upload response model */
export class BulkUploadUserResponse {
    /** message of Bulk upload response */
    public message: string;
    /** file of Bulk upload response */
    public file: string;
    constructor({ message, file }: BulkUploadUserResponse) {
        this.message = message;
        this.file = file;
    }
}

