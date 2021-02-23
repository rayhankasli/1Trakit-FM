import { Observable } from 'rxjs';
import { CopyItAsset, CopyItPickAsset } from './copyit-asset';
import { TabResponse } from './copyitConfigTabs';
import { CopyItDetailEnvelopes } from './copyItEnvelopes';
import { CopyItDetailFinishings } from './copyItFinishings';
import { CopyItDetailOversizedCopies } from './copyItOversizedCopies';
import { CopyItDetailPaperColors } from './copyItPaperColors';
import { CopyItDetailPaperSizes } from './copyItPaperSizes';
import { CopyItDetailPaperStocks } from './copyItPaperStocks';
import { CopyItDetailReproductionTypes } from './copyItReproductionTypes';
// --------------------------------- //
import { FileResponse } from './fileResponse';

/**
 * Model class for CopyItInfo
 */
export class CopyItInfo {
    public copyItNumber?: number;
    public clientId?: number;
    public companyName?: string;
    public accountNumber?: boolean;
    public isPrepopulateAccountNumber?: boolean;
    public tenants?: boolean;
    public associateId?: number;
    public associateName?: string;
    public requestForId?: number;
    public requestForName?: string;
    public emailAddress?: string;
    public phoneNumber?: string;
    public clientAccountId?: number;
    public accountNo?: string;
    public departmentName?: string;
    public jobname?: string;
    public isPriceQuote?: number;
    public isProof?: number;
    public dueDate?: Date | string;
    public dueTime?: string;
    public noOfPages?: number;
    public noOfCopies?: number;
    public reproductionTypes?: CopyItDetailReproductionTypes[];
    public tab?: TabResponse;
    public finishings?: CopyItDetailFinishings[];
    public envelopes?: CopyItDetailEnvelopes[];
    public overSizedCopies?: CopyItDetailOversizedCopies[];
    public paperSizes?: CopyItDetailPaperSizes[];
    public paperColors?: CopyItDetailPaperColors[];
    public paperStocks?: CopyItDetailPaperStocks[];
    public rateRequestTypeId?: number;
    public rateRequestType: string;
    public deliveredTo?: string;
    public shippingServiceId?: number;
    public shippingService?: string;
    public shippingOptionId?: number;
    public shippingOptionValue?: string;
    public copyItStatusId?: number;
    public copyItStatus?: string;
    public files?: FileResponse[] | File[];
    public uploadedFiles?: FileResponse[];
    public fileName?: string[];
    public fileOptionId?: number;
    public shareFilePath?: string;
    public priorityId?: number;
    public completedDate?: string | Date;
    public completedTime?: string;
    public isQualityCheck?: number;
    public showFrontPageCover$: Observable<boolean>;
    public showMiddlePageCover$: Observable<boolean>;
    public frontCoverPageType: number;
    public frontCoverPageSize: CopyItDetailPaperSizes;
    public frontCoverPageColor: CopyItDetailPaperColors;
    public frontCoverPageWeight: CopyItDetailPaperStocks[];
    public middlePageSize: CopyItDetailPaperSizes;
    public middlePageColor: CopyItDetailPaperColors;
    public middlePageWeight: CopyItDetailPaperStocks[];
    public totalAmount: number;
    public pickAssets: CopyItPickAsset[];
    public assets: CopyItAsset[];
}

/** Copy center info model */
export class CopyCenterInfo {
    public associateName?: string;
    public completedDate?: string | Date;
    public completedTime?: string;
    public isQualityCheck?: boolean;

    constructor(
        { associateName, completedDate, completedTime, isQualityCheck }: any
    ) {
        this.associateName = associateName;
        this.completedDate = completedDate;
        this.completedTime = completedTime;
        this.isQualityCheck = isQualityCheck;
    }
}

/** Request info model */
export class RequestInfo {
    public accountNo: string;
    public isPrepopulateAccountNumber: boolean;
    public clientAccountId: number;
    public clientId: number;
    public copyItNumber: number;
    public departmentName: string;
    public emailAddress: string;
    public fileName: string[];
    public fileOptionId: number;
    public files: FileResponse[] | File[];
    public uploadedFiles: FileResponse[];
    public isPriceQuote: number;
    public isProof: number;
    public jobname: string;
    public phoneNumber: string;
    public priorityId: number;
    public rateRequestTypeId: number;
    public rateRequestType: string;
    public requestForId: number;
    public shareFilePath: string;
    public uploadFile: string;
    constructor(
        { accountNo, isPrepopulateAccountNumber, clientAccountId, clientId, copyItNumber,
            departmentName, emailAddress, fileName, fileOptionId, files, uploadedFiles, isPriceQuote,
            isProof, jobname, phoneNumber, priorityId, rateRequestTypeId, rateRequestType, requestForId, shareFilePath,
            uploadFile }: any
    ) {
        this.accountNo = accountNo;
        this.isPrepopulateAccountNumber = isPrepopulateAccountNumber;
        this.clientAccountId = clientAccountId;
        this.clientId = clientId;
        this.copyItNumber = copyItNumber;
        this.departmentName = departmentName;
        this.emailAddress = emailAddress;
        this.fileName = fileName;
        this.fileOptionId = fileOptionId;
        this.files = files;
        this.uploadedFiles = uploadedFiles;
        this.isPriceQuote = isPriceQuote;
        this.isProof = isProof;
        this.jobname = jobname;
        this.phoneNumber = phoneNumber;
        this.priorityId = priorityId;
        this.rateRequestTypeId = rateRequestTypeId;
        this.rateRequestType = rateRequestType;
        this.requestForId = requestForId;
        this.shareFilePath = shareFilePath;
        this.uploadFile = uploadFile;
    }
}

/** Schedule Info model */
export class ScheduleInfo {
    public dueDate?: string;
    public dueTime?: string;

    constructor(
        { dueDate, dueTime }: any
    ) {
        this.dueDate = dueDate;
        this.dueTime = dueTime;
    }
}

/** Print detail model */
export class PrintDetailInfo {
    public reproductionTypes?: CopyItDetailReproductionTypes[];
    public tab?: TabResponse;
    public finishings?: CopyItDetailFinishings[];
    public envelopes?: CopyItDetailEnvelopes[];
    public overSizedCopies?: CopyItDetailOversizedCopies[];
    public frontCoverPageType: number;
    public frontCoverPageSize: CopyItDetailPaperSizes;
    public frontCoverPageColor: CopyItDetailPaperColors;
    public frontCoverPageWeight: CopyItDetailPaperStocks[];
    public middlePageSize: CopyItDetailPaperSizes;
    public middlePageColor: CopyItDetailPaperColors;
    public middlePageWeight: CopyItDetailPaperStocks[];

    public noOfPages?: number;
    public noOfCopies?: number;

    constructor(
        { reproductionTypes, tab, finishings, envelopes, overSizedCopies, frontCoverPageType,
            frontCoverPageSize, frontCoverPageColor, frontCoverPageWeight, middlePageSize,
            middlePageColor, middlePageWeight, noOfPages, noOfCopies }: any
    ) {
        this.reproductionTypes = reproductionTypes;
        this.tab = tab;
        this.finishings = finishings;
        this.envelopes = envelopes;
        this.overSizedCopies = overSizedCopies;
        this.frontCoverPageType = frontCoverPageType;
        this.frontCoverPageSize = frontCoverPageSize;
        this.frontCoverPageColor = frontCoverPageColor;
        this.frontCoverPageWeight = frontCoverPageWeight;
        this.middlePageSize = middlePageSize;
        this.middlePageColor = middlePageColor;
        this.middlePageWeight = middlePageWeight;

        this.noOfPages = noOfPages;
        this.noOfCopies = noOfCopies;
    }
}

/** Shipping detail model */
export class ShippingDetailInfo {
    public deliveredTo: string;
    public shippingOptionId: number;
    public shippingOptionValue: string;
    public shippingServiceId: number;

    constructor(
        { deliveredTo, shippingOptionId, shippingOptionValue, shippingServiceId }: any
    ) {
        this.deliveredTo = deliveredTo;
        this.shippingOptionId = shippingOptionId;
        this.shippingOptionValue = shippingOptionValue;
        this.shippingServiceId = shippingServiceId;
    }
}