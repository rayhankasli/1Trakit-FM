import { CopyItConfigFinishing } from '../copyit-info/copyitConfigFinishing';
import { ClientPaperColor } from '../copyit-info/copyitConfigPaperColor';
import { ClientPaperSizes } from '../copyit-info/copyItConfigPaperSizes';
import { CopyItConfigPaperStock } from '../copyit-info/copyitConfigPaperStocks';
import { CopyItConfigReproductionType } from '../copyit-info/copyitConfigReproductionType';
import { CopyItConfigRequestorSection } from '../copyit-info/copyitConfigRequestorSection';
import { CopyItConfigShippingMethod } from '../copyit-info/copyitConfigShippingMethod';
import { ConfigEnvelop } from '../copyit-info/copyItEnvelopes';
import { ClientOverSizedCopy } from '../copyit-info/copyItOversizedCopies';
import { CopyItDetailPaperColors } from '../copyit-info/copyItPaperColors';
import { CopyItDetailPaperSizes } from '../copyit-info/copyItPaperSizes';
import { CopyItDetailPaperStocks } from '../copyit-info/copyItPaperStocks';
import { CopyItConfigTabs } from './copyitConfigTabs';

/** This class is use to define default copyIt configuration response */
export class BaseDefaultCopyItConfiguration {
    public requestForId?: number;
    public requestorName?: string;
    public emailAddress?: string;
    public phoneNumber?: string;
    public jobname?: string;
    public isPriceQuote?: boolean | number;
    public noOfPages?: number;
    public noOfCopies?: number;
    public isProof?: boolean | number;
    public priorityId?: number;
    public shippingServiceId?: number;
    public shippingService?: string;
    public shippingOptionId?: number;
    public shippingOptionValue?: string;
    public deliveredTo?: string;

    public paperSizes?: ClientPaperSizes[];
    public paperColors?: ClientPaperColor[];
    public envelopes?: ConfigEnvelop[];
    public paperStocks?: CopyItConfigPaperStock[];
    public finishings?: CopyItConfigFinishing[];
    public tab?: CopyItConfigTabs;
    public reproductionTypes?: CopyItConfigReproductionType[];
    public overSizedCopies?: ClientOverSizedCopy[];
    public requestorSections?: CopyItConfigRequestorSection[];
    public shippingServices?: CopyItConfigShippingMethod[];
}
/** Default CopyIt Configuration model used in code */
export class DefaultCopyItConfiguration extends BaseDefaultCopyItConfiguration {
    public isPriceQuote?: number;
    public isProof?: number;
    public deliveredTo?: string;

    public frontCoverPageType: number;
    public frontCoverPageSize: CopyItDetailPaperSizes;
    public frontCoverPageColor: CopyItDetailPaperColors;
    public frontCoverPageWeight: CopyItDetailPaperStocks[];
    public middlePageSize: CopyItDetailPaperSizes;
    public middlePageColor: CopyItDetailPaperColors;
    public middlePageWeight: CopyItDetailPaperStocks[];
}
