import { ConfigEnvelop, CopyItConfigReproductionType, CopyItConfigShippingMethod, CopyItConfigTabs } from '../copyit-info';
import { CopyItConfigFinishing } from '../copyit-info/copyitConfigFinishing';
import { ClientPaperColor } from '../copyit-info/copyitConfigPaperColor';
import { ClientPaperSizes } from '../copyit-info/copyItConfigPaperSizes';
import { CopyItConfigPaperStock } from '../copyit-info/copyitConfigPaperStocks';
import { CopyItConfigRequestorSection } from '../copyit-info/copyitConfigRequestorSection';
import { ClientOverSizedCopy } from '../copyit-info/copyItOversizedCopies';

/** This class is define to derive default copyIt configuration request */
export class DefaultCopyItConfigurationRequest {
    public requestForId?: number;
    public emailAddress?: string;
    public phoneNumber?: string;
    public jobname?: string;
    public isPriceQuote?: boolean;
    public noOfPages?: number;
    public noOfCopies?: number;
    public isProof?: boolean;
    public priorityId?: number;
    public shippingMethodId?: number;
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

    public shippingServiceId?: number;
    public shippingServices?: CopyItConfigShippingMethod[];
}
