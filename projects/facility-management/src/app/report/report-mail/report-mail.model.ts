
/**
 * @author Enter Your Name Here.
 * @description
 */
import { InjectionToken } from '@angular/core';
// ---------------------------------------- //
import { SortingOrder } from 'common-libs';
// ---------------------------------------- //
import { Pictures } from '../../core/model/common.model';

/** model class for MailReport */
export class MailReport {

    /** packageId  of MailReport */
    public packageId: number;

    /** scanId  of MailReport */
    public scanId: number;

    /** recipient  of MailReport */
    public recipient: string;

    /** courierCompany  of MailReport */
    public courierCompany: string;

    /** scannedBy  of MailReport */
    public scannedBy: string;

    /** deliveredTo  of MailReport */
    public deliveredTo: string;

    /** dateTime  of MailReport */
    public dateTime: string | Date;

    /** receivingType  of MailReport */
    public receivingType: string;

    /** pictures  of MailReport */
    public pictures: Pictures[];

    /** status  of MailReport */
    public status: string;

    /** attempts  of MailReport */
    public attempts: number;

    constructor(
        packageId?: number,
        scanId?: number,
        courierCompany?: string,
        scannedBy?: string,
        deliveredTo?: string,
        dateTime?: string | Date,
        receivingType?: string,
        status?: string,
        attempts?: number,
        recipient?: string,
        pictures?: Pictures[],
    ) {
        this.packageId = packageId;
        this.scanId = scanId;
        this.courierCompany = courierCompany;
        this.scannedBy = scannedBy;
        this.deliveredTo = deliveredTo;
        this.dateTime = dateTime;
        this.receivingType = receivingType;
        this.status = status;
        this.attempts = attempts;
        this.recipient = recipient;
        this.pictures = pictures;
    }
}
/** Model class for filterRecord. */
export class MailReportFilterRecord {
    /** ClientID */
    public clientId?: number;
    /** Start Date */
    public startDate?: string | Date;
    /** end Date */
    public endDate?: string | Date;

    constructor({ clientId, startDate, endDate }: any) {
        this.clientId = clientId;
        this.startDate = startDate;
        this.endDate = endDate;
    }
}

export const MAILREPORT_FILTER: InjectionToken<MailReportFilterRecord> = new InjectionToken<MailReportFilterRecord>('mailReportFilter');
/** Model class for sortRecord. */
export class MailReportSortRecord {
    /** This property is use for which type of sorting apply by user. */
    public sortBy: SortingOrder;
    /** This property is used for sort field . */
    public sortColumn: string;
}

export const MAILREPORT_SORT: InjectionToken<MailReportSortRecord> = new InjectionToken<MailReportSortRecord>('mailReportSort');

export const CHART_TYPE_OPTION: ChartType[] = [
    {
        statusKey: 'Daily',
        statusValue: 1
    },
    {
        statusKey: 'Monthly',
        statusValue: 2
    }
]

/** chart data */
export class ChartType {
    public statusKey: string
    public statusValue: number
}

/** interface for chart object */
export interface ChartObject {
    clientId: number;
    chartType: number;
    year?: number;
}


/** Model class for chart model. */
export class MailChartModel {
    /** open */
    public open?: number;
    /** delivered */
    public delivered?: number;
    /** attempted */
    public attempted?: number;
    /** period */
    public period?: string | Date;

    constructor(
        open?: number,
        delivered?: number,
        attempted?: number,
        period?: string | Date
    ) {
        this.open = open;
        this.delivered = delivered;
        this.attempted = attempted;
        this.period = period;
    }
}

/** mail report list response */
export class MailReportListResponse {
    public totalCount: number;
    public data: MailReport[];
}
