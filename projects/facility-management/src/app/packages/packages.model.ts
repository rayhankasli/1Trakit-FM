
/**
 * @author Rayhan Kasli.
 * @description This is the model of Packages module.
 */
import { InjectionToken } from '@angular/core';
import { SortingOrder } from 'common-libs';

/** model class for Packages */
export class Packages {

    /** packageId  of Packages */
    public packageId: number;
    /** clientId  of Packages */
    public clientId: number;
    /** clientName  of Packages */
    public clientName: string;
    /** upiNumber  of Packages */
    public upiNumber: string;
    /** barcode  of Packages */
    public barcode: string;
    /** toUserId  of Packages */
    public toUserId: number;
    /** toUserName  of Packages */
    public toUserName: string;
    /** packageFrom  of Packages */
    public packageFrom: string;
    /** deliveryServiceId  of Packages */
    public deliveryServiceId: number;
    /** deliveryServiceFrom  of Packages */
    public deliveryServiceFrom: string;
    /** building  of Packages */
    public building: string;
    /** floor number of Packages */
    public floor: number;
    /** deskLocation  of Packages */
    public deskLocation: string;
    /** slotId  of Packages */
    public slotId: number;
    /** slotTime  of Packages */
    public slotTime: string;
    /** slotDate  of Packages */
    public slotDate: string;
    /** deliveryDate  of Packages */
    public deliveryDate: Date | string;
    /** status  of Packages */
    public status: string;
    /** priority  of Packages */
    public priority: number;
    /** scanImage  of Packages */
    public scanImage: string;
    /** actualScanImageName  of Packages */
    public actualScanImageName: string;
    /** scanImageExtension  of Packages */
    public scanImageExtension: string;
    /** scanType  of Packages */
    public scanType: number;
    /** selected office */
    public officeId: number;
    /** if package is delivered */
    public isDelivered: boolean;

    /** isEdit */
    public isEdit: boolean;

    constructor(
        packageId?: number,
        clientId?: number,
        clientName?: string,
        upiNumber?: string,
        barcode?: string,
        toUserId?: number,
        toUserName?: string,
        packageFrom?: string,
        deliveryServiceId?: number,
        deliveryServiceFrom?: string,
        building?: string,
        floor?: number,
        deskLocation?: string,
        slotId?: number,
        slotTime?: string,
        slotDate?: string,
        deliveryDate?: string,
        status?: string,
        priority?: number,
        scanImage?: string,
        actualScanImageName?: string,
        scanImageExtension?: string,
        scanType?: number,
        officeId?: number,
        isDelivered?: boolean,
        isEdit: boolean = false
    ) {
        this.packageId = packageId;
        this.clientId = clientId;
        this.clientName = clientName;
        this.upiNumber = upiNumber;
        this.barcode = barcode;
        this.toUserId = toUserId;
        this.toUserName = toUserName;
        this.packageFrom = packageFrom;
        this.deliveryServiceId = deliveryServiceId;
        this.deliveryServiceFrom = deliveryServiceFrom;
        this.building = building;
        this.floor = floor;
        this.deskLocation = deskLocation;
        this.slotId = slotId;
        this.slotTime = slotTime;
        this.slotDate = slotDate;
        this.deliveryDate = deliveryDate;
        this.status = status;
        this.priority = priority;
        this.scanImage = scanImage;
        this.actualScanImageName = actualScanImageName;
        this.scanImageExtension = scanImageExtension;
        this.scanType = scanType;
        this.officeId = officeId;
        this.isDelivered = isDelivered;
        this.isEdit = isEdit;
    }
}
/** Model class for sortRecord. */
export class PackagesSortRecord {
    /** This property is use for which type of sorting apply by user. */
    public sortBy: SortingOrder;
    /** This property is used for sort field . */
    public sortColumn: string;
}

export const PACKAGES_SORT: InjectionToken<PackagesSortRecord> = new InjectionToken<PackagesSortRecord>('packagesSort');


/** model class for PackagesRequest */
export class PackagesRequest {
    /** clientId. */
    public clientId: number;
    /** upiNumber. */
    public upiNumber: string;
    /** barcode. */
    public barcode: string;
    /** toUserId. */
    public toUserId: number;
    /** packageFrom. */
    public packageFrom: string;
    /** deliveryServiceId. */
    public deliveryServiceId: number;
    /** deliveryServiceFrom. */
    public deliveryServiceFrom: string;
    /** slotId. */
    public slotId: number;
    /** deliveryDate. */
    public deliveryDate: Date | string;
    /** scanImage. */
    public scanImage: string;
    /** actualScanImageName. */
    public actualScanImageName: string;
    /** scanImageExtension. */
    public scanImageExtension: string;
    /** scanType. */
    public scanType: number;

    constructor(
        clientId?: number,
        upiNumber?: string,
        barcode?: string,
        toUserId?: number,
        packageFrom?: string,
        deliveryServiceId?: number,
        deliveryServiceFrom?: string,
        slotId?: number,
        deliveryDate?: Date | string,
        // scanImage?: string,
        // actualScanImageName?: string,
        // scanImageExtension?: string,
        scanType?: number,
    ) {
        this.clientId = clientId;
        this.upiNumber = upiNumber;
        this.barcode = barcode;
        this.toUserId = toUserId;
        this.packageFrom = packageFrom;
        this.deliveryServiceId = deliveryServiceId;
        this.deliveryServiceFrom = deliveryServiceFrom;
        this.slotId = slotId;
        this.deliveryDate = deliveryDate;
        // this.scanImage = scanImage;
        // this.actualScanImageName = actualScanImageName;
        // this.scanImageExtension = scanImageExtension;
        this.scanType = scanType;
    }

}

/** Model class for filterRecord. */
export class PackageFilterRecord {

    /** ClientID */
    public clientId?: number;
    /** Start Date */
    public startDate?: Date;
    /** end Date */
    public endDate?: Date;

    constructor(
        clientId?: number,
        startDate?: Date,
        endDate?: Date
    ) {
        this.clientId = clientId;
        this.startDate = startDate;
        this.endDate = endDate;
    }

}

/** Model class for filterRecord. */
export class UserDetails {

    /** userId */
    public userId: number;
    /** officeId */
    public officeId: number;
    /** officeName */
    public officeName: string;
    /** floorId */
    public floorId: number;
    /** floor */
    public floor: string;
    /** firstName */
    public firstName: string;
    /** lastName */
    public lastName: string;
    /** deskLocation */
    public deskLocation: string;
    /** building */
    public building: string;
    /** userName */
    public userName?: string;
    /** building */
    public roleId?: number;
    /** building */
    public priority?: number;
    /** building */
    public fullName?: string;

    constructor(
        userId: number,
        officeId: number,
        officeName: string,
        floorId: number,
        floor: string,
        firstName: string,
        lastName: string,
        deskLocation: string,
        building: string,
        userName?: string,
        roleId?: number,
        priority?: number,
        fullName?: string,
    ) {
        this.userId = userId;
        this.officeId = officeId;
        this.officeName = officeName;
        this.floorId = floorId;
        this.floor = floor;
        this.firstName = firstName;
        this.lastName = lastName;
        this.deskLocation = deskLocation
        this.building = building;
        this.userName = userName;
        this.roleId = roleId;
        this.priority = priority;
        this.fullName = fullName;
    }

}

/** Model class for DeliveryService. */
export class DeliveryService {
    /** deliveryServiceId */
    public deliveryServiceId: number;
    /** deliveryServiceName */
    public deliveryServiceName: string;
    /** isOther */
    public isOther: boolean;

    constructor(
        deliveryServiceId?: number, deliveryServiceName?: string, isOther?: boolean) {
        this.deliveryServiceId = deliveryServiceId;
        this.deliveryServiceName = deliveryServiceName;
        this.isOther = isOther;
    }
}

/** Model class for Package slots */
export class Slot {
    public slotId?: number;
    public slot?: string;
    public slotTime?: string;
}

/** Model for slot parameters */
export class SlotParam {
    /** selected office */
    public officeId?: number;
    /** deliveryDate  of Packages */
    public deliveryDate?: Date | string;

    constructor(officeId?: number, deliveryDate?: Date | string) {
        this.officeId = officeId;
        this.deliveryDate = deliveryDate;
    }
}
