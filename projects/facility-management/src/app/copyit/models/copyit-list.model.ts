import { SortingOrder } from 'common-libs';

/**
 * This model is used to present copyit-list response
 * total: number
 * copyItList: Array<CopyItList>
 */
export class CopyItListResult {
    public total: number;
    public copyItList: CopyItList[];
}

/** 
 * model class for CopyItList 
 * replacement for CopyItResponseModel
 */
export class CopyItList {
    /** copyItId */
    public copyItId: number;
    /** copyItNumber */
    public copyItNumber: number;
    /** clientId */
    public clientId: number;
    /** companyName */
    public companyName: string;
    /** jobname */
    public jobname: string;
    /** accountNo */
    public accountNo: string;
    /** requestedById */
    public requestedById: number;
    /** requestedBy */
    public requestedBy: string;
    /** dueDate */
    public dueDate: Date;
    /** dueTime */
    public dueTime: string;
    /** associateId */
    public associateId: number;
    /** associateName */
    public associateName: string;
    /** copyItStatusId */
    public copyItStatusId: number;
    /** copyItStatus */
    public copyItStatus: string;
    /** due date & time for copyit request */
    public dueDateTime: Date;

    constructor(
        copyItId?: number,
        copyItNumber?: number,
        clientId?: number,
        companyName?: string,
        jobname?: string,
        accountNo?: string,
        requestedById?: number,
        requestedBy?: string,
        dueDate?: Date,
        dueTime?: string,
        associateId?: number,
        associateName?: string,
        copyItStatusId?: number,
        copyItStatus?: string
    ) {
        this.copyItId = copyItId;
        this.copyItNumber = copyItNumber;
        this.clientId = clientId;
        this.companyName = companyName;
        this.jobname = jobname;
        this.accountNo = accountNo;
        this.requestedById = requestedById;
        this.requestedBy = requestedBy;
        this.dueDate = dueDate;
        this.dueTime = dueTime;
        this.associateId = associateId;
        this.associateName = associateName;
        this.copyItStatusId = copyItStatusId;
        this.copyItStatus = copyItStatus;

        this.dueDateTime = dueDate
    }
}

/** Model class for sortRecord. */
export class CopyItListSortRecord {
    /** This property is use for which type of sorting apply by user. */
    public sortBy: SortingOrder;
    /** This property is used for sort field . */
    public sortColumn: string;
}

/** CopyIt filter record request */
export class CopyItFilterRecordRequest {
    /** clientId. */
    public clientId?: number;
    /** requestedById. */
    public requestedById?: number[];
    /** assignedToId. */
    public associateId?: number[];
    /** copyItStatusId. */
    public copyItStatusId?: number[];
}