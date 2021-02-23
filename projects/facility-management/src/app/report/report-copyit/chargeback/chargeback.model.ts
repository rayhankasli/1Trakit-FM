
/**
 * @author Enter Your Name Here.
 * @description
 */
import { InjectionToken } from '@angular/core';
// ------------------------------------- //
import { SortingOrder } from 'common-libs';

/** Model class of list of Data */
export class MasterData {
    /** ID of ChargeBack */
    public id: number;

    /** job  of ChargeBackList */
    public jobNo: string;

    /** date  of ChargeBackList */
    public date: string | Date;

    /** accountNo  of ChargeBackList */
    public accountNo: string;

    /** department of chargeBackList */
    public department: string;

    /** requestorName  of ChargeBackList */
    public requestorName: string;

    /** description  of ChargeBackList */
    public description: string;

    /** clientId of ChargeBackList */
    public clientId: number;

    /** cost  of ChargeBackList */
    public cost: number;

    /** total  of ChargeBackList */
    public total: number;

    constructor(
        id?: number,
        jobNo?: string,
        date?: string | Date,
        accountNo?: string,
        department?: string,
        requestorName?: string,
        description?: string,
        clientId?: number,
        cost?: number,
        total?: number,
    ) {
        this.id = id;
        this.jobNo = jobNo;
        this.date = date;
        this.accountNo = accountNo;
        this.department = department;
        this.requestorName = requestorName;
        this.description = description;
        this.clientId = clientId;
        this.cost = cost;
        this.total = total;
    }
}

/** Store Chargeback Data list */
export class ChargeBackData extends MasterData { }

/** Modal class for ChargeBackList */
export class ChargeBack {
    /** Total Count */
    public totalCount?: number;
    /** List of Data */
    public chargeBackData?: ChargeBackData[];

    constructor(
        totalCount?: number,
        chargeBackData?: ChargeBackData[]
    ) {
        this.totalCount = totalCount;
        this.chargeBackData = chargeBackData;
    }
}


/** Store Chargeback Data list */
export class Data extends MasterData { }

/** model class for ChargeBackList */
export class ChargeBackResponse {
    /** Total Count */
    public totalCount?: number;
    /** List of Data */
    public data?: Data[];

    constructor(
        totalCount?: number,
        data?: ChargeBackData[]
    ) {
        this.totalCount = totalCount;
        this.data = data;
    }
}

/** Client Job */
export class AccountNumber {
    /** clientId */
    public clientId?: number;
    /** companyName */
    public companyName?: string;
    /** accountDetail */
    public accountDetail?: AccountDetail[];

    constructor(
        clientId?: number,
        companyName?: string,
        accountDetail?: AccountDetail[]
    ) {
        this.clientId = clientId;
        this.companyName = companyName;
        this.accountDetail = accountDetail;
    }
}

/** Account Detail */
export class AccountDetail {
    /** accountNo */
    public accountNo?: string;
}

/** Client Job */
export class Job {
    /** clientId */
    public clientId?: number;
    /** companyName */
    public companyName?: string;
    /** JobDetail */
    public jobDetail?: JobDetail[];

    constructor(
        clientId?: number,
        companyName?: string,
        jobDetail?: JobDetail[]
    ) {
        this.clientId = clientId;
        this.companyName = companyName;
        this.jobDetail = jobDetail;
    }
}

/** JOb Details */
export class JobDetail {
    /** copyItId */
    public copyItId?: number;
    /** jobName */
    public jobName?: string;
}

/** Filter Model */
export class FilterRecord {
    /** ClientID */
    public clientId?: number;
    /** Account Number */
    public accountNo?: string[];
    /** Job */
    public job?: number[];
    /** Start Date */
    public startDate?: string | Date;
    /** End Date */
    public endDate?: string | Date;

    constructor(
        clientId?: number,
        accountNo?: string[],
        job?: number[],
        startDate?: string | Date,
        endDate?: string | Date,
    ) {
        this.clientId = clientId;
        this.accountNo = accountNo;
        this.job = job;
        this.startDate = startDate;
        this.endDate = endDate;
    }
}

/** Model class for sortRecord. */
export class ChargeBackListSortRecord {
    /** This property is use for which type of sorting apply by user. */
    public sortBy: SortingOrder;
    /** This property is used for sort field . */
    public sortColumn: string;
}

export const CHARGEBACKLIST_SORT: InjectionToken<ChargeBackListSortRecord> = new InjectionToken<ChargeBackListSortRecord>('chargeBackListSort');

