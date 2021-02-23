

/**
 * @author Rayhan Kasli.
 * @description This is adapter service use for transforming data base user requirement. 
 */

import { Injectable } from '@angular/core';
import { NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
// -------------------------------------------- //
import { Adapter, NgbTimeStringAdapter } from 'common-libs';
import { ScanType } from '../../core/utility/enums';
import { getLocaleDate, getLocaleTime } from '../../core/utility/utility';
import { DeliveryService, PackageFilterRecord, Packages, PackagesRequest, Slot, UserDetails } from '../packages.model';

@Injectable()
export class PackagesAdapter implements Adapter<Packages> {

    /** This method is used to transform response object into T object. */
    public toResponse(item: Packages): Packages {
        const packages: Packages = new Packages(
            item.packageId,
            item.clientId,
            item.clientName,
            item.upiNumber,
            item.barcode,
            item.toUserId,
            item.toUserName,
            item.packageFrom,
            item.deliveryServiceId,
            item.deliveryServiceFrom,
            item.building,
            item.floor,
            item.deskLocation,
            item.slotId,
            getLocaleTime(item.slotTime),
            `${getLocaleDate(item.slotDate)}`,
            `${getLocaleDate(item.deliveryDate)}`,
            item.status,
            item.priority > 0 ? item.priority : 0,
            item.scanImage,
            item.actualScanImageName,
            item.scanImageExtension,
            item.scanType,
            item.officeId,
            item.isDelivered
        );
        return packages;
    }

    /** This method is used to transform T object into request object. */
    public toRequest(item: Packages): PackagesRequest {
        const packages: PackagesRequest = new PackagesRequest(
            item.clientId,
            item.upiNumber,
            item.barcode,
            item.toUserId,
            item.packageFrom,
            item.deliveryServiceId,
            item.deliveryServiceFrom,
            item.slotId,
            // changing to convert to UTC date-time same as Mobile App
            new Date().toUTCString(), // new Date(item.deliveryDate).toLocaleString()
            // item.scanImage,
            // item.actualScanImageName,
            // item.scanImageExtension,
            ScanType.Web,
        );
        return packages;
    }
}

@Injectable()
export class PackagesFilterAdapter implements Adapter<PackageFilterRecord> {
    /** This method is used to transform T object into request object. */
    public toRequest(item: PackageFilterRecord): PackageFilterRecord {
        const packages: PackageFilterRecord = new PackageFilterRecord();
        packages.clientId = item.clientId;
        return packages;
    }
}

@Injectable()
export class UserListAdapter implements Adapter<UserDetails> {
    /** This method is used to transform T object into request object. */
    public toResponse(item: UserDetails): UserDetails {
        const userDetails: UserDetails = new UserDetails(
            item.userId,
            item.officeId,
            item.officeName,
            item.floorId,
            item.floor,
            item.firstName,
            item.lastName,
            item.deskLocation,
            item.officeName,
            item.userName,
            item.roleId,
            item.priority,
            item.firstName + ' ' + item.lastName
        );
        return userDetails;
    }
}

@Injectable()
export class UserDetailsAdapter implements Adapter<UserDetails> {
    /** This method is used to transform T object into request object. */
    public toResponse(item: UserDetails): UserDetails {
        const userDetails: UserDetails = new UserDetails(
            item.userId,
            item.officeId,
            item.officeName,
            item.floorId,
            item.floor,
            item.firstName,
            item.lastName, item.deskLocation,
            item.officeName
        );
        return userDetails;
    }
}

@Injectable()
export class DeliveryServiceAdapter implements Adapter<DeliveryService> {
    /** This method is used to transform T object into request object. */
    public toResponse(item: DeliveryService): DeliveryService {
        const deliveryService: DeliveryService = new DeliveryService(
            item.deliveryServiceId,
            item.deliveryServiceName,
            item.isOther,
        );
        return deliveryService;
    }
}

@Injectable()
export class SlotAdapter {
    constructor(private ngbTimeAdapter: NgbTimeStringAdapter) { }

    /**
     * filter response based on delivery-date given
     * @param items Slot[]
     * @param deliveryDate string | Date
     */
    public toResponse(items: Slot[], deliveryDate: string | Date): Slot[] {
        const today: Date = new Date(new Date().setHours(0, 0, 0, 0));
        const selectedDeliveryDate: Date = new Date(new Date(deliveryDate).setHours(0, 0, 0, 0));
        if (today >= selectedDeliveryDate) {
            const time: string = new Date().toLocaleTimeString('en', { hour12: false });
            const currentMinutes: number = this.convertToMinutes(time);
            return items.filter((slot: Slot) => {
                const slotMinutes: number = this.convertToMinutes(slot.slotTime);
                if (slotMinutes > currentMinutes) {
                    return slot;
                }
            })
        }
        return items;
    }

    /** convert time to minutes */
    private convertToMinutes(timeData: string): number {
        const time: NgbTimeStruct = this.ngbTimeAdapter.fromModel(timeData);
        const totalMinutes: number = time && time.minute + (time.hour * 60);
        return totalMinutes;
    }
}
