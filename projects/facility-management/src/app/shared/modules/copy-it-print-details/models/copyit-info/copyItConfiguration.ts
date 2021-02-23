import { CopyItConfigFinishing } from '../copyit-info/copyitConfigFinishing';
import { ClientPaperColor } from '../copyit-info/copyitConfigPaperColor';
import { ClientPaperSizes } from '../copyit-info/copyItConfigPaperSizes';
import { CopyItConfigPaperStock } from '../copyit-info/copyitConfigPaperStocks';
import { CopyItConfigReproductionType } from '../copyit-info/copyitConfigReproductionType';
import { CopyItConfigRequestorSection } from '../copyit-info/copyitConfigRequestorSection';
import { CopyItConfigShippingMethod } from '../copyit-info/copyitConfigShippingMethod';
import { ConfigEnvelop } from '../copyit-info/copyItEnvelopes';
import { ClientOverSizedCopy } from '../copyit-info/copyItOversizedCopies';
import { CopyItConfigTabs } from './copyitConfigTabs';

/** This class is define client copyit configuration item */
export class CopyItConfiguration {
    public paperSizes?: ClientPaperSizes[];
    public paperColors?: ClientPaperColor[];
    public envelopes?: ConfigEnvelop[];
    public paperStocks?: CopyItConfigPaperStock[];
    public finishings?: CopyItConfigFinishing[];
    public tabs?: CopyItConfigTabs[];
    public reproductionTypes?: CopyItConfigReproductionType[];
    public overSizedCopies?: ClientOverSizedCopy[];
    public requestorSections?: CopyItConfigRequestorSection[];
    public shippingServices?: CopyItConfigShippingMethod[];
}
