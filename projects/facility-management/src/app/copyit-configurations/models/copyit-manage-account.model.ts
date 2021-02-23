import { SortingOrder } from 'common-libs';
import { CopyItUserList } from '../../shared/modules/copyit-shared/copyit-shared.model';

/** model class for CopyitManageAccounListResult */
export class CopyitManageAccounListResult {
    public total: number;
    public accountList: CopyitManageAccount[];
}

/** model class for CopyitManageAccount */
export class CopyitManageAccount {
    /** id  of CopyitManageAccount */
    public clientAccountId: number;
    /** departmentName  of CopyitManageAccount */
    public departmentName: string;
    /** accountNumber  of CopyitManageAccount */
    public accountNo: string;
    /** type  of CopyitManageAccount */
    public isActive: boolean;
    /** assignToRequestor  of CopyitManageAccount */
    public assignToRequestors: CopyItUserList[] | number[];
    /** assignToAssociate  of CopyitManageAccount */
    public assignToAssociates: CopyItUserList[] | number[];
    /** client Id */
    public clientId?: number;
    /** is in Editable mode or not */
    public isEditable: boolean;
    constructor(
        clientAccountId?: number,
        departmentName?: string,
        accountNo?: string,
        isActive?: boolean,
        assignToRequestors?: CopyItUserList[] | number[],
        assignToAssociates?: CopyItUserList[] | number[],
        clientId?: number,
    ) {
        this.clientAccountId = clientAccountId;
        this.departmentName = departmentName;
        this.accountNo = accountNo;
        this.isActive = isActive;
        this.assignToRequestors = assignToRequestors;
        this.assignToAssociates = assignToAssociates;
        this.clientId = clientId;
    }
}

/** model class for Request CopyIt Manage Account */
export class RequestCopyitManageAccount {
    /** departmentName  of CopyitManageAccount */
    public departmentName: string;
    /** accountNumber  of CopyitManageAccount */
    public accountNo: string;
    /** type  of CopyitManageAccount */
    public isActive: boolean;
    /** assignToRequestor  of CopyitManageAccount */
    public assignToRequestors: CopyItUserList[] | number[];
    /** assignToAssociate  of CopyitManageAccount */
    public assignToAssociates: CopyItUserList[] | number[];
    /** client Id */
    public clientId?: number;
    constructor(
        departmentName?: string,
        accountNo?: string,
        isActive?: boolean,
        assignToRequestors?: CopyItUserList[] | number[],
        assignToAssociates?: CopyItUserList[] | number[],
        clientId?: number,
    ) {
        this.departmentName = departmentName;
        this.accountNo = accountNo;
        this.isActive = isActive;
        this.assignToRequestors = assignToRequestors;
        this.assignToAssociates = assignToAssociates;
        this.clientId = clientId;
    }
}

/** Model class for sortRecord. */
export class CopyitManageAccountSortRecord {
    /** This property is use for which type of sorting apply by user. */
    public sortBy: SortingOrder;
    /** This property is used for sort field . */
    public sortColumn: string;
}