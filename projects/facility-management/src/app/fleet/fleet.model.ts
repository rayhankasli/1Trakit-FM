
/**
 * @author Ronak Patel.
 * @description
 */
import { InjectionToken } from '@angular/core';
import { SortingOrder } from 'common-libs';

/** model class for Fleet */
export class AssetRates {
	public colorRate: number;
	public bwRate: number;
	public scanRate: number;
	public colorTenantRate: number;
	public bwTenantRate: number;
	public scanTenantRate: number;
	constructor(
		colorRate?: number,
		bwRate?: number,
		scanRate?: number,
		colorTenantRate?: number,
		bwTenantRate?: number,
		scanTenantRate?: number,
	) {
		this.colorRate = colorRate;
		this.bwRate = bwRate;
		this.scanRate = scanRate;
		this.colorTenantRate = colorTenantRate;
		this.bwTenantRate = bwTenantRate;
		this.scanTenantRate = scanTenantRate;
	}
}
/** model class for FleetResponse */
export class FleetResponse {
	/** assetType. */
	public assetType: string;
	/** assetCategory. */
	public assetCategory: string;
	/** assetNo. */
	public assetNo: string;
	/** manufacturer. */
	public manufacturer: string;
	/** modelNo. */
	public modelNo: string;
	/** serialNo. */
	public serialNo: string;
	/** serviceTagNo. */
	public serviceTagNo: string;
	/** client. */
	public client: string;
	/** location. */
	public location: string;
	/** name. */
	public name: string;
	/** phoneNo. */
	public phoneNo: number;
	/** email. */
	public email: string;
	/** date. */
	public date: string;
	/** previousReading. */
	public previousReading: Reading;
	/** currentReading. */
	public currentReading: Reading;
	/** clientRates. */
	public clientRates: Reading;
	/** tenantRates. */
	public tenantRates: Reading;

	constructor(
		assetType?: string,
		assetCategory?: string,
		assetNo?: string,
		manufacturer?: string,
		modelNo?: string,
		serialNo?: string,
		serviceTagNo?: string,
		client?: string,
		location?: string,
		name?: string,
		phoneNo?: number,
		email?: string,
		date?: string,
		previousReading?: Reading,
		currentReading?: Reading,
		clientRates?: Reading,
		tenantRates?: Reading,
	) {
		this.assetType = assetType;
		this.assetCategory = assetCategory;
		this.assetNo = assetNo;
		this.manufacturer = manufacturer;
		this.modelNo = modelNo;
		this.serialNo = serialNo;
		this.serviceTagNo = serviceTagNo;
		this.client = client;
		this.location = location;
		this.name = name;
		this.phoneNo = phoneNo;
		this.email = email;
		this.date = date;
		this.previousReading = previousReading;
		this.currentReading = currentReading;
		this.clientRates = clientRates;
		this.tenantRates = tenantRates;
	}

}

/** model class for Reading */
export class Reading {
	/** color. */
	public color: number;
	/** bandW. */
	public bandW: number;
	/** scan. */
	public scan: number;

	constructor(
		color?: number,
		bandW?: number,
		scan?: number,
	) {
		this.color = color;
		this.bandW = bandW;
		this.scan = scan;
	}

}

/** model class for AssetTicket */
export class AssetTicket {
	/** id of assetTicket */
	public id: number;
	/** ticketDate of assetTicket */
	public ticketDate: any;
	/** ticketTime of assetTicket */
	public ticketTime: string;
	/** assetTicketCategoryId of assetTicket */
	public assetTicketCategoryId: number;
	/** assetTicketCategory of assetTicket */
	public assetTicketCategory: string;
	/** priorityId of assetTicket */
	public priorityId: number;
	/** priority  of assetTicket */
	public priority: string;
	/** statusId of assetTicket */
	public statusId: number;
	/** status of assetTicket */
	public status: string;
	/** description of assetTicket */
	public description: string;

	constructor(
		id?: number,
		ticketDate?: any,
		ticketTime?: string,
		assetTicketCategoryId?: number,
		assetTicketCategory?: string,
		priorityId?: number,
		priority?: string,
		statusId?: number,
		status?: string,
		description?: string,
	) {
		this.id = id;
		this.ticketDate = ticketDate;
		this.ticketTime = ticketTime;
		this.assetTicketCategoryId = assetTicketCategoryId;
		this.assetTicketCategory = assetTicketCategory;
		this.priorityId = priorityId;
		this.priority = priority;
		this.statusId = statusId;
		this.status = status;
		this.description = description;
	}

}

/** model class for MeterRead */
export class MeterRead {
	/** rates of MeterRead */
	public rates: AssetRates;
	/** assetMeter of MeterRead */
	public assetMeter: AssetMeter;
	public isMissingEntry: boolean;
	public addMeterRead: boolean;
	constructor(
		assertMeter?: AssetMeter,
		rates?: AssetRates,
		addMeterRead?: boolean
	) {
		this.assetMeter = assertMeter;
		this.rates = rates;
		this.addMeterRead = addMeterRead;
	}

}

/** Model class of MeterReadRequest */
export class MeterReadRequest {
	/** rates of MeterRead */
	public rates: AssetRates;
	/** assetMeter of MeterRead */
	public assetMeter: AssetMeterRequest;
	constructor(
		assertMeter?: AssetMeterRequest,
		rates?: AssetRates,
	) {
		this.assetMeter = assertMeter;
		this.rates = rates;
	}

}

/** Model class of AssetType */
export class AssetType {
	public assetTypeId: number;
	public assetType: string;
}

/** Model class of AssetCategory */
export class AssetCategory {
	public assetCategoryId: number;
	public assetCategory: string;
}

/** Model class of AssetTicketCategory */
export class AssetTicketCategory {
	public assetTicketCategoryId: number;
	public assetTicketCategory: string;
}

/** Model class of AssetTicketStatus */
export class AssetTicketStatus {
	public assetTicketStatusId: number;
	public assetTicketStatus: string;
}

/** Model class of AssetPriority */
export class AssetPriority {
	public priorityId: number;
	public priority: string;
}

/** Model class of MasterDataTicket */
export class MasterDataTicket {
	public ticketCategory: AssetTicketCategory[];
	public ticketStatus: AssetTicketStatus[];
	public priority: AssetPriority[];
}

/** Model class of AssetResult */
export class AssetResult {
	public total: number;
	public assetList: AssetList[]
}

/** Model class of AssetTicketResult */
export class AssetTicketResult {
	public total: number;
	public assetTickets: AssetTicket[]
}


/** Model class of AssetMeterReadResult */
export class AssetMeterReadResult {
	public total: number;
	public assetMeterList: AssetMeter[] = [];
}
//************************************************************************************************************************************************************************** */
/** Model class of AssetList */
export class AssetList {
	/** assetId: of AssetList */
	public assetId: number;
	/** assetNumber of AssetList */
	public assetNumber: number;
	/** assetNo: of AssetList */
	public assetNo: string;
	/** clientId of AssetList */
	public clientId: number;
	/** clientName of AssetList */
	public clientName: string;
	/** assetTypeId of AssetList */
	public assetTypeId: number;
	/** assetType of AssetList */
	public assetType: string;
	/** manufacturer of AssetList */
	public manufacturer: string;
	/** modelNumber of AssetList */
	public modelNumber: string;
	/** serialNo of AssetList */
	public serialNo: string;
	/** serviceTagNo of AssetList */
	public serviceTagNo: string;
	/** location of AssetList */
	public location: string;
	/** openTicket of AssetList */
	public openTicket: number;
	/** isDelete of AssetList */
	public isDelete: boolean;
	public ticketDate: Date;
	public ticketTime: string;
	public dueDateTime: Date;
	constructor(
		assetId?: number,
		assetNumber?: number,
		assetNo?: string,
		clientId?: number,
		clientName?: string,
		assetTypeId?: number,
		assetType?: string,
		manufacturer?: string,
		modelNumber?: string,
		serialNo?: string,
		serviceTagNo?: string,
		location?: string,
		openTicket?: number,
		isDelete?: boolean,
		dueDateTime?: Date
	) {
		this.assetId = assetId;
		this.assetNumber = assetNumber;
		this.assetNo = assetNo;
		this.clientId = clientId;
		this.clientName = clientName;
		this.assetTypeId = assetTypeId;
		this.assetType = assetType;
		this.manufacturer = manufacturer;
		this.modelNumber = modelNumber;
		this.serialNo = serialNo;
		this.serviceTagNo = serviceTagNo;
		this.location = location;
		this.openTicket = openTicket;
		this.isDelete = isDelete;
		this.dueDateTime = dueDateTime;
	}
}

/** Model class of AssetMaster */
export class AssetMaster {
	/** assetId  of Asset */
	public assetId: number;
	/** assetTypeId of Asset */
	public assetTypeId: number;
	/** assetCategoryId of Asset */
	public assetCategoryId: number;
	/** assetNo  of Asset */
	public assetNo: string;
	/** manufacturer of Asset */
	public manufacturer: string;
	/** modelNo of Asset */
	public modelNo: string;
	/** serialNo  of Asset */
	public serialNo: string;
	/** assetTagNo of Asset */
	public assetTagNo: string;
	/** clientId of Asset */
	public clientId: number;
	/** location of Asset */
	public location: string;
	/** description of Asset */
	public description: string;
	/** thirdPartyname of Asset */
	public thirdPartyName: string;
	/** phoneNo of Asset */
	public phoneNo: string;
	/** emailAddress of Asset */
	public emailAddress: string;
	/** rates of Asset */
	public rates: AssetRates;
	/** assetMeter of Asset */
	public assetMeter: AssetMeter | AssetMeterRequest;
	public assetType: string;
	constructor(
		assetTypeId?: number,
		assetCategoryId?: number,
		assetNo?: string,
		manufacturer?: string,
		modelNo?: string,
		serialNo?: string,
		assetTagNo?: string,
		clientId?: number,
		location?: string,
		description?: string,
		thirdPartyName?: string,
		phoneNo?: string,
		emailAddress?: string,
		assetType?: string,
		rates?: AssetRates,
		assetMeter?: AssetMeter | AssetMeterRequest,
		assetId?: number
	) {
		this.assetType = assetType;
		this.assetTypeId = assetTypeId;
		this.assetCategoryId = assetCategoryId;
		this.assetNo = assetNo;
		this.manufacturer = manufacturer;
		this.modelNo = modelNo;
		this.serialNo = serialNo;
		this.assetTagNo = assetTagNo;
		this.clientId = clientId;
		this.location = location;
		this.description = description;
		this.thirdPartyName = thirdPartyName;
		this.phoneNo = phoneNo;
		this.emailAddress = emailAddress;
		this.rates = rates;
		this.assetMeter = assetMeter;
		this.assetId = assetId;
	}


}

/** Model class of Asset */
export class Asset extends AssetMaster {
	/** assetTypeId of Asset */
	public assetTypeId: number;
	/** assetCategoryId of Asset */
	public assetCategoryId: number;
	/** assetNo  of Asset */
	public assetNo: string;
	/** manufacturer of Asset */
	public manufacturer: string;
	/** modelNo of Asset */
	public modelNo: string;
	/** serialNo  of Asset */
	public serialNo: string;
	/** assetTagNo of Asset */
	public assetTagNo: string;
	/** clientId of Asset */
	public clientId: number;
	/** location of Asset */
	public location: string;
	/** description of Asset */
	public description: string;
	/** thirdPartyname of Asset */
	public thirdPartyName: string;
	/** phoneNo of Asset */
	public phoneNo: string;
	/** emailAddress of Asset */
	public emailAddress: string;
	/** rates of Asset */
	public rates: AssetRates;
	/** assetMeter of Asset */
	public assetMeter: AssetMeter;
	public assetType: string;
	constructor(
		assetTypeId?: number,
		assetCategoryId?: number,
		assetNo?: string,
		manufacturer?: string,
		modelNo?: string,
		serialNo?: string,
		assetTagNo?: string,
		clientId?: number,
		location?: string,
		description?: string,
		thirdPartyName?: string,
		phoneNo?: string,
		emailAddress?: string,
		assetType?: string,
		rates?: AssetRates,
		assetMeter?: AssetMeter,
		assetId?: number
	) {
		super(assetTypeId, assetCategoryId, assetNo, manufacturer, modelNo, serialNo, assetTagNo, clientId, location,
			description, thirdPartyName, phoneNo, emailAddress, assetType, rates, assetMeter, assetId)

	}

}

/** AssetRequest */
export class AssetRequest extends AssetMaster {
	/** assetTypeId of Asset */
	public assetTypeId: number;
	/** assetCategoryId of Asset */
	public assetCategoryId: number;
	/** assetNo  of Asset */
	public assetNo: string;
	/** manufacturer of Asset */
	public manufacturer: string;
	/** modelNo of Asset */
	public modelNo: string;
	/** serialNo  of Asset */
	public serialNo: string;
	/** assetTagNo of Asset */
	public assetTagNo: string;
	/** clientId of Asset */
	public clientId: number;
	/** location of Asset */
	public location: string;
	/** description of Asset */
	public description: string;
	/** thirdPartyname of Asset */
	public thirdPartyName: string;
	/** phoneNo of Asset */
	public phoneNo: string;
	/** emailAddress of Asset */
	public emailAddress: string;
	/** rates of Asset */
	public rates: AssetRates;
	/** assetMeter of Asset */
	public assetMeter: AssetMeterRequest;
	/** assetType */
	public assetType: string;

	constructor(
		assetTypeId?: number,
		assetCategoryId?: number,
		assetNo?: string,
		manufacturer?: string,
		modelNo?: string,
		serialNo?: string,
		assetTagNo?: string,
		clientId?: number,
		location?: string,
		description?: string,
		thirdPartyName?: string,
		phoneNo?: string,
		emailAddress?: string,
		assetType?: string,
		rates?: AssetRates,
		assetMeter?: AssetMeterRequest,
	) {
		super(assetTypeId, assetCategoryId, assetNo, manufacturer, modelNo, serialNo, assetTagNo, clientId, location,
			description, thirdPartyName, phoneNo, emailAddress, assetType, rates, assetMeter)

	}

}

/** Model class of AssetMeter */
export class AssetMeter {
	/** assetMeterId of AssetMeter */
	public copyItId?: number;
	/** assetMeterId of AssetMeter */
	public assetMeterId: number;
	/** readingDate of AssetMeter */
	public readingDate: Date;
	/** previousColorRead of AssetMeter */
	public previousColorRead: number;
	/** previousBWRead of AssetMeter */
	public previousBwRead: number;
	/** previousScanRead of AssetMeter */
	public previousScanRead: number;
	/** currentColorRead of AssetMeter */
	public currentColorRead: number;
	/** currentBWRead of AssetMeter */
	public currentBwRead: number;
	/** currentScanRead of AssetMeter */
	public currentScanRead: number;
	/** colorRate of AssetMeter */
	public colorRate: number;
	/** bwRate of AssetMeter */
	public bwRate: number;
	/** scanRate of AssetMeter */
	public scanRate: number;
	public assetCreatedDate: Date;
	public tenantRates: any;
	public upAssetMeterId: number;
	public downAssetMeterId: number;
	public isMissingEntry: boolean;
	public requestType?: string;
	constructor(
		tenantRates?: any,
		readingDate?: Date,
		assetCreatedDate?: Date,
		previousColorRead?: number,
		previousBwRead?: number,
		previousScanRead?: number,
		currentColorRead?: number,
		currentBwRead?: number,
		currentScanRead?: number,
		colorRate?: number,
		bwRate?: number,
		scanRate?: number,
		assetMeterId?: number,
		copyItId?: number,
	) {
		this.tenantRates = tenantRates;
		this.assetMeterId = assetMeterId;
		this.readingDate = readingDate;
		this.assetCreatedDate = assetCreatedDate;
		this.previousColorRead = previousColorRead;
		this.previousBwRead = previousBwRead;
		this.previousScanRead = previousScanRead;
		this.currentColorRead = currentColorRead;
		this.currentBwRead = currentBwRead;
		this.currentScanRead = currentScanRead;
		this.colorRate = colorRate;
		this.bwRate = bwRate;
		this.scanRate = scanRate;
		this.copyItId = copyItId;
	}
}

/** Model class of AssetMeterRequest */
export class AssetMeterRequest {
	/** assetMeterId of AssetMeter */
	public assetMeterId: number;
	/** readingDate of AssetMeter */
	public readingDate: string;
	/** previousColorRead of AssetMeter */
	public previousColorRead: number;
	/** previousBWRead of AssetMeter */
	public previousBwRead: number;
	/** previousScanRead of AssetMeter */
	public previousScanRead: number;
	/** currentColorRead of AssetMeter */
	public currentColorRead: number;
	/** currentBWRead of AssetMeter */
	public currentBwRead: number;
	/** currentScanRead of AssetMeter */
	public currentScanRead: number;
	/** colorRate of AssetMeter */
	public colorRate: number;
	/** bwRate of AssetMeter */
	public bwRate: number;
	/** scanRate of AssetMeter */
	public scanRate: number;
	public tenantRates: any;
	public upAssetMeterId: number;
	public downAssetMeterId: number;
	public isMissingEntry: boolean;

	constructor(
		tenantRates?: any,
		readingDate?: string,
		previousColorRead?: number,
		previousBwRead?: number,
		previousScanRead?: number,
		currentColorRead?: number,
		currentBwRead?: number,
		currentScanRead?: number,
		colorRate?: number,
		bwRate?: number,
		scanRate?: number,
		assetMeterId?: number,
		upAssetMeterId?: number,
		downAssetMeterId?: number
	) {
		this.tenantRates = tenantRates;
		this.assetMeterId = assetMeterId;
		this.readingDate = readingDate;
		this.previousColorRead = previousColorRead;
		this.previousBwRead = previousBwRead;
		this.previousScanRead = previousScanRead;
		this.currentColorRead = currentColorRead;
		this.currentBwRead = currentBwRead;
		this.currentScanRead = currentScanRead;
		this.colorRate = colorRate;
		this.bwRate = bwRate;
		this.scanRate = scanRate;
		this.upAssetMeterId = upAssetMeterId;
		this.downAssetMeterId = downAssetMeterId;
	}
}

/** Active/Inactive asset */
export class AssetToggleStatusRequest {
	public isActive: boolean;
	constructor(isActive?: boolean) {
		this.isActive = isActive;
	}
}

/** Asset list filter model */
export class AssetFilter {
	public clientId: number;
	public isActive: boolean;
	constructor({ clientId, isActive }: any) {
		this.clientId = clientId;
		this.isActive = isActive;
	}
}

/** asset status list model */
export class AssetStatusList {
	public statusKey: string;
	public statusValue: boolean;
}

/** to create asset status list */
export const ASSET_STATUS_OPTION: AssetStatusList[] = [
	{
		statusKey: 'Active',
		statusValue: true
	},
	{
		statusKey: 'Inactive',
		statusValue: false
	}
]

/** list of asset type options */
export enum AssetTypeOption {
	COPIER = 1,
	PRINTER = 2,
	OTHER = 3
}