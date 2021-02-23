
/**
 * @author Enter Your Name Here.
 * @description
 */
import { InjectionToken } from '@angular/core';
// ----------------------------------------------- //
import { SortingOrder } from 'common-libs';

/** Model Class of ClientListResult */
export class ClientListResult {
    public total: number;
    public clientList: Client[];
}

/** model class for Client */
export class Client {
    /** clientId of Client */
    public clientId?: number;
    /** companyName of Client */
    public companyName?: string;
    /** contactPerson of Client */
    public contactPerson?: string;
    /** contactNumber of Client */
    public contactNumber?: string;
    /** createdDate of Client */
    public createdDate?: string | Date;
    /** isActive of Client */
    public isActive?: boolean;
    /** copyIt of Client */
    public copyIt?: boolean;
    /** mail of Client */
    public mail?: boolean;
    /** workflow of Client */
    public workflow?: boolean;
    /** bookIt of Client */
    public bookIt?: boolean;
    /** fleetIt of Client */
    public fleetIt?: boolean;
    /** visitorLog of Client */
    public visitorLog?: boolean;
}

/** model class for ClientResponse */
export class ClientDetailsResponse {
    /** clientId of ClientDetailsResponse */
    public clientId?: number;
    /** companyName of ClientDetailsResponse */
    public companyName?: string;
    /** contactPerson of ClientDetailsResponse */
    public contactPerson?: string;
    /** contactNumber of ClientDetailsResponse */
    public contactNumber?: string;
    /** emailAddress of ClientDetailsResponse */
    public emailAddress?: string;
    /** website of ClientDetailsResponse */
    public website?: string;
    /** logoFileNameSmall of ClientDetailsResponse */
    public logoFileNameSmall?: string;
    /** logoFileNameLarge of ClientDetailsResponse */
    public logoFileNameLarge?: string;
    /** tenants of ClientDetailsResponse */
    public tenants?: boolean;
    /** notifications of ClientDetailsResponse */
    public notifications?: boolean;
    /** accountNumber of ClientDetailsResponse */
    public accountNumber?: boolean;
    /** copyIt of ClientDetailsResponse */
    public copyIt?: boolean;
    /** mail of ClientDetailsResponse */
    public mail?: boolean;
    /** workflow of ClientDetailsResponse */
    public workflow?: boolean;
    /** bookIt of ClientDetailsResponse */
    public bookIt?: boolean;
    /** visitorLog of ClientDetailsResponse */
    public visitorLog?: boolean;
    /** copyItSlaTimeLimit of ClientDetailsResponse */
    public copyItSlaTimeLimit?: string | number;
    /** fleetItSlaTimeLimit of ClientDetailsResponse */
    public fleetItSlaTimeLimit?: string | number;
    /** bookItSlaTimeLimit of ClientDetailsResponse */
    public bookItSlaTimeLimit?: string | number;
    /** originalLogoSmall of ClientDetailsResponse */
    public originalLogoSmall?: string;
    /** logoSmall of ClientDetailsResponse */
    public logoSmall?: string;
    /** logoSmallExtension of ClientDetailsResponse */
    public logoSmallExtension?: string;
    /** originalLogoLarge of ClientDetailsResponse */
    public originalLogoLarge?: string;
    /** logoLarge of ClientDetailsResponse */
    public logoLarge?: string;
    /** logoLargeExtension of ClientDetailsResponse */
    public logoLargeExtension?: string;
    /** contactEmail of ClientDetailsResponse */
    public contactEmail?: string;
    /** contactPhoneNumber of ClientDetailsResponse */
    public contactPhoneNumber?: string;
}
/** Client Detail used to create client form */
export class ClientDetails extends ClientDetailsResponse {
    /** logoFileNameSmall of ClientDetailsResponse */
    public _logoFileNameSmall: File;
    /** logoFileNameLarge of ClientDetailsResponse */
    public _logoFileNameLarge: File;
    /** logoLarge of ClientDetailsResponse */
    public _logoLarge?: string;
    /** logoSmall of ClientDetailsResponse */
    public _logoSmall?: string;
}

/** List of available workflows */
export class ClientProductLicensing {
    /** Id */
    public id: number;
    /** Name */
    public name: string;
    /** Checked flag */
    public checked: boolean = false;
    constructor({ id, name, checked }: any) {
        this.id = id;
        this.name = name;
        this.checked = checked || false;
    }
}

/** Model class for filterRecord. */
export class ClientFilterRequest {
    /** isActive of ClientFilterRequest */
    public isActive?: boolean;
    constructor(isActive?: boolean) {
        this.isActive = isActive;
    }
}

/** Available Client list status */
export class ClientListStatus {
    /** statusKey */
    public statusKey: string;
    /** statusValue */
    public statusValue: boolean;
}

export const CLIENT_FILTER: InjectionToken<ClientFilterRequest> = new InjectionToken<ClientFilterRequest>('clientFilter');
/** Model class for sortRecord. */
export class ClientSortRecord {
    /** This property is use for which type of sorting apply by user. */
    public sortBy: SortingOrder;
    /** This property is used for sort field . */
    public sortColumn: string;
}

export const CLIENT_SORT: InjectionToken<ClientSortRecord> = new InjectionToken<ClientSortRecord>('clientSort');



