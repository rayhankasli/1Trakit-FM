

/**
 * @author Ronak Patel.
 * @description This is adapter service use for transforming data base user requirement. 
 */

import { Injectable } from '@angular/core';
// -------------------------------------------- //
import { Adapter } from 'common-libs';

import { AssetList, Asset, AssetMeter, AssetTicket, AssetMeterRequest, AssetRequest, MeterRead, MeterReadRequest, AssetToggleStatusRequest } from '../fleet.model';
import { DatePipe } from '@angular/common';
import { getLocaleDateTime, getLocaleDate, getLocaleTime } from '../../core/utility/utility';
@Injectable()
export class AssetListAdapter implements Adapter<AssetList> {
    /** This method is used to transform response object into T object. */
    public toResponse(item: AssetList): AssetList {
        const fleet: AssetList = new AssetList(
            item.assetId,
            item.assetNumber,
            item.assetNo,
            item.clientId,
            item.clientName,
            item.assetTypeId,
            item.assetType,
            item.manufacturer,
            item.modelNumber,
            item.serialNo,
            item.serviceTagNo,
            item.location,
            item.openTicket,
            item.isDelete,
            getLocaleDateTime(item.ticketDate, item.ticketTime)
        );
        return fleet;
    }

    /** This method is used to transform T object into request object. */
    public toRequest(item: AssetList): AssetList {
        const fleet: AssetList = new AssetList(
            item.assetId,
            item.assetNumber,
            item.assetNo,
            item.clientId,
            item.clientName,
            item.assetTypeId,
            item.assetType,
            item.manufacturer,
            item.modelNumber,
            item.serialNo,
            item.serviceTagNo,
            item.location,
            item.openTicket,
            item.isDelete,
        );
        return fleet;
    }

    /** This method is used to transform data to asset toggle status request */
    public toggleStatusRequest(flag: boolean): AssetToggleStatusRequest {
        return new AssetToggleStatusRequest(flag);
    }
}

@Injectable()
export class AssetFormAdapter implements Adapter<Asset> {
    constructor(private assetMeterAdapter: AssetMeterAdapter) { }
    /** This method is used to transform response object into T object. */
    public toResponse(item: Asset): Asset {
        const fleet: Asset = new Asset(
            item.assetTypeId,
            item.assetCategoryId,
            item.assetNo,
            item.manufacturer,
            item.modelNo,
            item.serialNo,
            item.assetTagNo,
            item.clientId,
            item.location,
            item.description,
            item.thirdPartyName,
            item.phoneNo,
            item.emailAddress,
            item.assetType,
            item.rates,
            item.assetMeter ? this.assetMeterAdapter.toResponse(item.assetMeter) : item.assetMeter
        );
        return fleet;
    }

    /** This method is used to transform T object into request object. */
    public toRequest(item: any): AssetRequest {
        const fleet: AssetRequest = new AssetRequest(
            item.assetTypeId,
            item.assetCategoryId,
            item.assetNo,
            item.manufacturer,
            item.modelNo,
            item.serialNo,
            item.assetTagNo,
            item.clientId,
            item.location,
            item.description,
            item.thirdPartyName,
            item.phoneNo,
            item.emailAddress,
            item.assetType,
            item.rates,
            item.assetMeter ? this.assetMeterAdapter.toRequest(item.assetMeter) : item.assetMeter
        );
        return fleet;
    }
}

@Injectable()
export class AssetTicketAdapter implements Adapter<AssetTicket> {
    constructor(private datePipe: DatePipe) {
    }
    /** This method is used to transform response object into T object. */
    public toResponse(item: AssetTicket): AssetTicket {
        const fleetTicket: AssetTicket = new AssetTicket(
            item.id,
            getLocaleDateTime(item.ticketDate, item.ticketTime),
            getLocaleTime(item.ticketTime),
            item.assetTicketCategoryId,
            item.assetTicketCategory,
            item.priorityId,
            item.priority,
            item.statusId,
            item.status,
            item.description,
        );
        return fleetTicket;
    }

    /** This method is used to transform T object into request object. */
    public toRequest(item: AssetTicket): AssetTicket {
        const fleetTicket: AssetTicket = new AssetTicket(
            item.id,
            item.ticketDate && this.datePipe.transform(item.ticketDate, 'yyyy-MM-dd'),
            item.ticketTime,
            item.assetTicketCategoryId,
            item.assetTicketCategory,
            item.priorityId,
            item.priority,
            item.statusId,
            item.status,
            item.description,
        );
        return fleetTicket;
    }
}

@Injectable()
export class MeterReadAdapter implements Adapter<MeterRead> {
    constructor(private assertMeterAdapter: AssetMeterAdapter) { }
    /** This method is used to transform response object into T object. */
    public toResponse(item: MeterRead): MeterRead {
        const meterRead: MeterRead = new MeterRead(
            item.assetMeter && this.assertMeterAdapter.toResponse(item.assetMeter),
            item.rates,
            true
        );
        return meterRead;
    }

    /** This method is used to transform T object into request object. */
    public toRequest(item: any): MeterReadRequest {
        const meterRead: MeterReadRequest = new MeterReadRequest(
            item.assetMeter && this.assertMeterAdapter.toRequest(item.assetMeter),
            item.rates,
        );
        return meterRead;
    }
}
@Injectable()
export class AssetMeterAdapter implements Adapter<AssetMeter, AssetMeterRequest, AssetMeter> {
    constructor(private datePipe: DatePipe) {
    }
    /** This method is used to transform T object into request object. */
    public toResponse(item: AssetMeter): AssetMeter {
        const assetMeter: AssetMeter = new AssetMeter(
            item.tenantRates,
            new Date(item.readingDate),
            new Date(item.assetCreatedDate),
            item.previousColorRead,
            item.previousBwRead,
            item.previousScanRead,
            item.currentColorRead,
            item.currentBwRead,
            item.currentScanRead,
            item.colorRate,
            item.bwRate,
            item.scanRate,
            item.assetMeterId,
            item.copyItId
        );
        return assetMeter;

    }
    /** This method is used to transform T object into request object. */
    public toRequest(item: AssetMeter): AssetMeterRequest {
        const assetMeter: AssetMeterRequest = new AssetMeterRequest(
            item.tenantRates,
            // item.readingDate.toDateString(),
            item.readingDate ? this.datePipe.transform(item.readingDate, 'yyyy-MM-dd') : this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
            item.previousColorRead,
            item.previousBwRead,
            item.previousScanRead,
            item.currentColorRead,
            item.currentBwRead,
            item.currentScanRead,
            item.colorRate,
            item.bwRate,
            item.scanRate,
            item.assetMeterId,
            item.upAssetMeterId,
            item.downAssetMeterId
        );
        return assetMeter;
    }
}