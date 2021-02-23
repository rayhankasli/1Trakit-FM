/** Main Class */
export class CostRecoveryDetail {
    /** ID */
    public id?: number;
    /** Title */
    public title?: string;
    /** quantity */
    public quantity?: number;
    /** rate */
    public rate?: number;
    /** charges */
    public charges?: number;

    constructor(
        id?: number,
        title?: string,
        quantity?: number,
        rate?: number,
        charges?: number
    ) {
        this.id = id;
        this.title = title;
        this.quantity = quantity;
        this.rate = rate;
        this.charges = charges;
    }
}

/** Model class for Paper Size Meter Reads */
export class PaperMeterReads {
    public id?: number;
    public assetId?: number;
    public assetNo?: string;
    public manufacturer?: string;
    public modelNo?: string;
    public bwPaperSizeId?: number;
    public bwCurrentRead?: number;
    public bwPrevRead?: number;
    public colorPaperSizeId?: number;
    public colorCurrentRead?: number;
    public colorPrevRead?: number;
    public scanCurrentRead?: number;
    public scanPrevRead?: number;
    public noOfPages?: number;

    constructor(
        id?: number,
        assetId?: number,
        assetNo?: string,
        manufacturer?: string,
        modelNo?: string,
        bwPaperSizeId?: number,
        bwCurrentRead?: number,
        bwPrevRead?: number,
        colorPaperSizeId?: number,
        colorCurrentRead?: number,
        colorPrevRead?: number,
        scanCurrentRead?: number,
        scanPrevRead?: number,
        noOfPages?: number
    ) {
        this.id = id;
        this.assetId = assetId;
        this.assetNo = assetNo;
        this.manufacturer = manufacturer;
        this.modelNo = modelNo;
        this.bwPaperSizeId = bwPaperSizeId;
        this.bwCurrentRead = bwCurrentRead;
        this.bwPrevRead = bwPrevRead;
        this.colorPaperSizeId = colorPaperSizeId;
        this.colorCurrentRead = colorCurrentRead;
        this.colorPrevRead = colorPrevRead;
        this.scanCurrentRead = scanCurrentRead;
        this.scanPrevRead = scanPrevRead;
        this.noOfPages = noOfPages;
    }
}

/** Find Rate and Charge */
export enum FIND_RATE_CHARGES {
    Finishing = 'finishingDetail',
    PaperSize = 'paperSizeDetail',
    PaperStock = 'paperStockDetail',
    Tabs = 'tabsDetail',
    Envelopes = 'envelopeDetail',
    OverSize = 'overSizeDetail',

}
/** Find Rate and Charge */
export enum FIND_MASTER {
    Finishing = 'finishing',
    PaperSize = 'paperSize',
    PaperStock = 'paperStock',
    Tabs = 'tab',
    Envelopes = 'envelope',
    OverSize = 'overSizeCopy',
}

/** Cost Recovery response */
export class CostRecoveryResponse {
    /** Finishing Master */
    public finishing?: Finishing[];
    /** PaperSize Master */
    public paperSize?: PaperSize[];
    /** PaperStock Master */
    public paperStock?: PaperStock[];
    /** Tabs Master */
    public tabs?: Tabs[];
    /** Envelopes Master */
    public envelopes?: Envelopes[];
    /** OverSizes Master */
    public overSize?: OverSize[];
    /** Date */
    public data?: User[];
    /** Total Couunr */
    public totalCount?: number;

    constructor(
        finishing?: Finishing[],
        paperSize?: PaperSize[],
        paperStock?: PaperStock[],
        tabs?: Tabs[],
        envelopes?: Envelopes[],
        overSize?: OverSize[],
        data?: User[],
        totalCount?: number
    ) {
        this.finishing = finishing;
        this.paperSize = paperSize;
        this.paperStock = paperStock;
        this.tabs = tabs;
        this.envelopes = envelopes;
        this.overSize = overSize;
        this.data = data;
        this.totalCount = totalCount;
    }
}

/** Model class for Finishing Master */
export class Finishing {
    /** ID */
    public id?: number;
    /** finishing */
    public finishing?: string;

    constructor(
        id?: number,
        finishing?: string
    ) {
        this.id = id;
        this.finishing = finishing;
    }
}

/** Model class for PaperSize Master */
export class PaperSize {
    /** ID */
    public id?: number;
    /** papersize */
    public paperSize?: string;
    /** type */
    public type?: number;
    /** paperType */
    public paperType?: number;

    constructor(
        id?: number,
        paperSize?: string,
        type?: number,
        paperType?: number
    ) {
        this.id = id;
        this.paperSize = paperSize;
        this.type = type;
        this.paperType = paperType;
    }
}

/** Model class for PaperStock Master */
export class PaperStock {
    /** ID */
    public id?: number;
    /** paperStock */
    public paperStock?: string;

    constructor(
        id?: number,
        paperStock?: string
    ) {
        this.id = id;
        this.paperStock = paperStock;
    }
}

/** Model class for Tabs Master */
export class Tabs {
    /** ID */
    public id?: number;
    /** tabs */
    public tabs?: string;

    constructor(
        id?: number,
        tabs?: string
    ) {
        this.id = id;
        this.tabs = tabs;
    }
}

/** Model class for Envelopes Master */
export class Envelopes {
    /** ID */
    public id?: number;
    /** envelopes */
    public envelopes?: string;

    constructor(
        id?: number,
        envelopes?: string
    ) {
        this.id = id;
        this.envelopes = envelopes;
    }
}

/** Model class for OverSizes Master */
export class OverSize {
    /** ID */
    public id?: number;
    /** overSizes */
    public overSizes?: string;

    constructor(
        id?: number,
        overSizes?: string
    ) {
        this.id = id;
        this.overSizes = overSizes;
    }
}

/** Model class for Scan Details */
export class ScanDetail {
    /** ID */
    public id?: number;
    public assetId?: number;
    public assetNo?: string;
    public manufacturer?: string;
    public modelNo?: string;
    public scanCurrentRead?: number;
    public scanPrevRead?: number;

    constructor(
        id?: number,
        assetId?: number,
        assetNo?: string,
        manufacturer?: string,
        modelNo?: string,
        scanCurrentRead?: number,
        scanPrevRead?: number
    ) {
        this.id = id;
        this.assetId = assetId;
        this.assetNo = assetNo;
        this.manufacturer = manufacturer;
        this.modelNo = modelNo;
        this.scanCurrentRead = scanCurrentRead;
        this.scanPrevRead = scanPrevRead;
    }
}

/** Model class for Paper Size Meter Reads for color, black&white and Normal Paper */
export class PaperSizeMeterReads extends PaperMeterReads { }

/** Model class for Paper Size Meter Reads for Scanning */
export class scanMeterReads extends PaperMeterReads { }

/** Model class for Finishing Detail */
export class FinishingDetail extends CostRecoveryDetail { }

/** Model class for PaperSize Detail */
export class PaperSizeDetail extends CostRecoveryDetail {
    public assetMeterId?: number;
    public paperType?: number;
}

/** Model class for PaperStock Detail */
export class PaperStockDetail extends CostRecoveryDetail { }

/** Model class for Tabs Detail */
export class TabsDetail extends CostRecoveryDetail { }

/** Model class for Envelopes Detail */
export class EnvelopeDetail extends CostRecoveryDetail { }

/** Model class for OverSize Detail */
export class OverSizeDetail extends CostRecoveryDetail { }

/** Model Class for CostRecovery */
export class User {
    public copyItId?: number;
    public clientId?: number;
    public requestorName?: string;
    public description?: string;
    public date?: string | Date;
    public accountBilling?: string;
    public department?: string;
    public jobTicket?: number;
    public printer?: string;
    public dateDue?: string | Date;
    public dateFinished?: string | Date;
    public onTime?: string;
    public productionType?: string;
    public noPages?: number;
    public noCopies?: number;
    public totalCopies?: number;
    public totalCharges?: number;
    public totalAttributeCharges?: number;
    public totalCopiesAndAttrCharges?: number;

    public paperSizeMeterReads?: PaperSizeMeterReads[];
    public scanMeterReads?: scanMeterReads[];
    public scanningDetail?: ScanDetail[];
    public finishingDetail?: FinishingDetail[];
    public paperSizeDetail?: PaperSizeDetail[];
    public paperStockDetail?: PaperStockDetail[];
    public tabsDetail?: TabsDetail[];
    public envelopeDetail?: EnvelopeDetail[];
    public overSizeDetail?: OverSizeDetail[];
}


/** Model Class for CostRecovery */
export class CostRecovery {
    /** Finishing Master */
    public finishing?: Finishing[];
    /** PaperSize Master */
    public paperSize?: PaperSize[];
    /** PaperStock Master */
    public paperStock?: PaperStock[];
    /** Tabs Master */
    public tabs?: Tabs[];
    /** Envelopes Master */
    public envelopes?: Envelopes[];
    /** OverSizes Master */
    public overSize?: OverSize[];
    /** Data */
    public users?: User[];
    /** Total Couunr */
    public totalCount?: number;

    constructor(
        finishing?: Finishing[],
        paperSize?: PaperSize[],
        paperStock?: PaperStock[],
        tabs?: Tabs[],
        envelopes?: Envelopes[],
        overSize?: OverSize[],
        users?: User[],
        totalCount?: number
    ) {
        this.finishing = finishing;
        this.paperSize = paperSize;
        this.paperStock = paperStock;
        this.tabs = tabs;
        this.envelopes = envelopes;
        this.overSize = overSize;
        this.users = users;
        this.totalCount = totalCount;
    }
}

/** Meter Reads */
export class MeterReadsDetail {
    public id?: number;
    public paperSize?: string;
    public meterReads?: MeterRead[];

    constructor(
        id?: number,
        paperSize?: string,
        meterReads?: MeterRead[],
    ) {
        this.id = id;
        this.paperSize = paperSize;
        this.meterReads = meterReads;
    }
}

/** MeterRead Details */
export class MeterRead {
    public id?: number;
    public paperSizeId?: number;
    public assetMeterId?: number;
    public assetId?: number;
    public assetNo?: string;
    public manufacturer?: string;
    public modelNo?: string;
    public prevRead?: number;
    public currentRead?: number;
    public noOfPages?: number;
    public rate?: number;
    public charges?: number;
    public paperType?: number;

    constructor(
        id?: number,
        paperSizeId?: number,
        assetMeterId?: number,
        assetId?: number,
        assetNo?: string,
        manufacturer?: string,
        modelNo?: string,
        prevRead?: number,
        currentRead?: number,
        noOfPages?: number,
        rate?: number,
        charges?: number,
        paperType?: number
    ) {
        this.id = id;
        this.paperSizeId = paperSizeId;
        this.assetMeterId = assetMeterId;
        this.assetId = assetId;
        this.assetNo = assetNo;
        this.manufacturer = manufacturer;
        this.modelNo = modelNo;
        this.prevRead = prevRead;
        this.currentRead = currentRead;
        this.noOfPages = noOfPages;
        this.rate = rate;
        this.charges = charges;
        this.paperType = paperType;
    }
}

/** Filter model */
export class FilterRecord {
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

/** Date Convert */
export class ReportPeriod {
    /** Start Date */
    public startDate: string;
    /** End Date */
    public endDate: string;

    constructor(
        startDate?: string,
        endDate?: string
    ) {
        this.startDate = startDate;
        this.endDate = endDate;
    }
}