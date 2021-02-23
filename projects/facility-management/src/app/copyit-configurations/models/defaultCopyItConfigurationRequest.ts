
import { CopyItConfigRequestorSection } from '../../shared/modules/copy-it-print-details/models/copyit-info/copyitConfigRequestorSection';
import { CopyItConfigShippingMethod } from '../../shared/modules/copy-it-print-details/models/copyit-info/copyitConfigShippingMethod';
import { CopyItConfigTabs } from '../../shared/modules/copy-it-print-details/models/copyit-info/copyitConfigTabs';
import { ConfigEnvelop } from '../../shared/modules/copy-it-print-details/models/copyit-info/copyItEnvelopes';
import { CopyItFinishings } from '../../shared/modules/copy-it-print-details/models/copyit-info/copyItFinishings';
import { CopyItOversizedCopies } from '../../shared/modules/copy-it-print-details/models/copyit-info/copyItOversizedCopies';
import { CopyItPaperColors } from '../../shared/modules/copy-it-print-details/models/copyit-info/copyItPaperColors';
import { CopyItPaperSizes } from '../../shared/modules/copy-it-print-details/models/copyit-info/copyItPaperSizes';
import { CopyItPaperStocks } from '../../shared/modules/copy-it-print-details/models/copyit-info/copyItPaperStocks';
import { CopyItReproductionTypes } from '../../shared/modules/copy-it-print-details/models/copyit-info/copyItReproductionTypes';
import { DefaultCopyItConfigurationRequest as DCCR } from '../../shared/modules/copy-it-print-details/models/copyit-info/defaultCopyItConfigurationRequest';

/** This class is define to derive default copyIt configuration request */
export class DefaultCopyItConfigurationRequest extends DCCR {

    constructor(
        requestForId?: number,
        emailAddress?: string,
        phoneNumber?: string,
        jobname?: string,
        isPriceQuote?: boolean,
        isProof?: boolean,
        priorityId?: number,
        noOfPages?: number,
        noOfCopies?: number,
        shippingServiceId?: number,
        shippingOptionId?: number,
        shippingOptionValue?: string,
        deliveredTo?: string,
        paperSizes?: CopyItPaperSizes[],
        colors?: CopyItPaperColors[],
        envelopes?: ConfigEnvelop[],
        paperStocks?: CopyItPaperStocks[],
        finishings?: CopyItFinishings[],
        tab?: CopyItConfigTabs,
        reproductionTypes?: CopyItReproductionTypes[],
        overSizedCopies?: CopyItOversizedCopies[],
        requestorSections?: CopyItConfigRequestorSection[],
        shippingServices?: CopyItConfigShippingMethod[]
    ) {
        super();
        this.requestForId = requestForId;
        this.emailAddress = emailAddress;
        this.phoneNumber = phoneNumber;
        this.jobname = jobname;
        this.isPriceQuote = isPriceQuote;
        this.isProof = isProof;
        this.priorityId = priorityId;
        this.noOfPages = noOfPages;
        this.noOfCopies = noOfCopies;
        this.shippingServiceId = shippingServiceId;
        this.shippingOptionId = shippingOptionId;
        this.shippingOptionValue = shippingOptionValue;
        this.deliveredTo = deliveredTo;
        this.paperSizes = paperSizes;
        this.paperColors = colors;
        this.envelopes = envelopes;
        this.paperStocks = paperStocks;
        this.finishings = finishings;
        this.tab = tab;
        this.reproductionTypes = reproductionTypes;
        this.overSizedCopies = overSizedCopies;
        this.requestorSections = requestorSections;
        this.shippingServices = shippingServices;
    }
}


