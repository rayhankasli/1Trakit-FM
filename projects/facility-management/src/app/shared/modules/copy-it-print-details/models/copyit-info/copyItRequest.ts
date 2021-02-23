import { CopyItEnvelopes } from './copyItEnvelopes';
import { CopyItFinishings } from './copyItFinishings';
import { CopyItOversizedCopies } from './copyItOversizedCopies';
import { CopyItPaperColors } from './copyItPaperColors';
import { CopyItPaperSizes } from './copyItPaperSizes';
import { CopyItPaperStocks } from './copyItPaperStocks';
import { CopyItReproductionTypes } from './copyItReproductionTypes';
import { CopyItPickAsset, CopyItAsset } from './copyit-asset';
import { Tab } from './copyitConfigTabs';


/** Model class for CopyItRequest */
export class CopyItRequest {
     public copyItNumber?: number;
     public clientId?: number;
     public requestForId?: number;
     public emailAddress?: string;
     public phoneNumber?: string;
     public clientAccountId?: number;
     public accountNo?: string;
     public isPrepopulateAccountNumber?: boolean;
     public departmentName?: string;
     public jobname?: string;
     public isPriceQuote?: boolean;
     public isProof?: boolean;
     public dueDate?: string | Date;
     public dueTime?: string;
     public noOfPages?: number;
     public noOfCopies?: number;
     public reproductionTypes?: CopyItReproductionTypes[];
     public tab?: Tab;
     public finishings?: CopyItFinishings[];
     public envelopes?: CopyItEnvelopes[];
     public oversizedCopies?: CopyItOversizedCopies[];
     public paperSizes?: CopyItPaperSizes[];
     public paperColors?: CopyItPaperColors[];
     public paperStocks?: CopyItPaperStocks[];
     public rateRequestTypeId?: number;
     public deliveredTo?: string;
     public shippingServiceId?: number;
     public shippingService?: string;
     public shippingOptionId?: number;
     public shippingOptionValue?: string;
     public fileOptionId?: number;
     public shareFilePath?: string;
     public priorityId?: number;
     public completedDate?: string;
     public completedTime?: string;
     public isQualityCheck?: boolean;
     public pickAssets: CopyItPickAsset[];
     public assets: CopyItAsset[];
     
     constructor(
          clientId?: number,
          requestForId?: number,
          emailAddress?: string,
          phoneNumber?: string,
          clientAccountId?: number,
          accountNo?: string,
          departmentName?: string,
          jobname?: string,
          isPriceQuote?: boolean,
          isProof?: boolean,
          dueDate?: string,
          dueTime?: string,
          noOfPages?: number,
          noOfCopies?: number,
          reproductionTypes?: CopyItReproductionTypes[],
          tab?: Tab,
          finishings?: CopyItFinishings[],
          envelopes?: CopyItEnvelopes[],
          oversizedCopies?: CopyItOversizedCopies[],
          paperSizes?: CopyItPaperSizes[],
          paperColors?: CopyItPaperColors[],
          paperStocks?: CopyItPaperStocks[],
          rateRequestTypeId?: number,
          deliveredTo?: string,
          shippingServiceId?: number,
          shippingOptionId?: number,
          shippingOptionValue?: string,
          fileOptionId?: number,
          shareFilePath?: string,
          priorityId?: number,
          completedDate?: string,
          completedTime?: string,
          isQualityCheck?: boolean,
          pickAssets?: CopyItPickAsset[]
     ) {
          this.clientId = clientId;
          this.requestForId = requestForId;
          this.emailAddress = emailAddress;
          this.phoneNumber = phoneNumber;
          this.clientAccountId = clientAccountId;
          this.accountNo = accountNo;
          this.departmentName = departmentName;
          this.jobname = jobname;
          this.isPriceQuote = isPriceQuote;
          this.isProof = isProof;
          this.dueDate = dueDate;
          this.dueTime = dueTime;
          this.noOfPages = noOfPages;
          this.noOfCopies = noOfCopies;
          this.reproductionTypes = reproductionTypes;
          this.tab = tab;
          this.finishings = finishings;
          this.envelopes = envelopes;
          this.oversizedCopies = oversizedCopies;
          this.paperSizes = paperSizes;
          this.paperColors = paperColors;
          this.paperStocks = paperStocks;
          this.rateRequestTypeId = rateRequestTypeId;
          this.deliveredTo = deliveredTo;
          this.shippingServiceId = shippingServiceId;
          this.shippingOptionId = shippingOptionId;
          this.shippingOptionValue = shippingOptionValue;
          this.fileOptionId = fileOptionId;
          this.shareFilePath = shareFilePath;
          this.priorityId = priorityId;
          this.completedDate = completedDate;
          this.completedTime = completedTime;
          this.isQualityCheck = isQualityCheck;
          this.pickAssets = pickAssets
     }
}
