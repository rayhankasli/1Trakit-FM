/**
 * @author Enter Your Name Here.
 * @description
 */
import {
  ClientOverSizedCopy, ClientPaperColor, ClientPaperSizes, ConfigEnvelop, CopyItConfigFinishing, CopyItConfigPaperStock,
  CopyItConfigReproductionType, CopyItConfigRequestorSection, CopyItConfigShippingMethod, CopyItConfigTabs,
  DefaultCopyItConfiguration, Envelope, Finishing, OverSizedCopy, PaperColor, PaperSize, PaperStock, ReproductionType
} from '../shared/modules/copy-it-print-details/models/copyit-info';

/** model class for CopyitOptions */
export class CopyitOptions {
  /** paperSize  of CopyitOptions */
  public paperSizes: PaperSize[];

  /** envelops   of CopyitOptions */
  public envelopes: Envelope[];

  /** paperColor  of CopyitOptions */
  public paperColors: PaperColor[];

  /** paperStock  of CopyitOptions */
  public paperStocks: PaperStock[];

  /** finishing  of CopyitOptions */
  public finishings: Finishing[];

  /** tabs  of CopyitOptions */
  public tabs: CopyItConfigTabs[];

  /** reproductionType  of CopyitOptions */
  public reproductionTypes: ReproductionType[];

  /** overSizeCopy  of CopyitOptions */
  public overSizedCopies: OverSizedCopy[];

  /** requestorSection  of CopyitOptions */
  public requestorSections: CopyItConfigRequestorSection[];

  /** shippingService  of CopyitOptions */
  public shippingServices: CopyItConfigShippingMethod[];

  constructor(
    paperSizes?: PaperSize[],
    envelopes?: Envelope[],
    paperColors?: PaperColor[],
    paperStocks?: PaperStock[],
    finishings?: Finishing[],
    tabs?: CopyItConfigTabs[],
    reproductionTypes?: ReproductionType[],
    overSizedCopies?: OverSizedCopy[],
    requestorSections?: CopyItConfigRequestorSection[],
    shippingServices?: CopyItConfigShippingMethod[]
  ) {
    this.paperSizes = paperSizes;
    this.envelopes = envelopes;
    this.paperColors = paperColors;
    this.paperStocks = paperStocks;
    this.finishings = finishings;
    this.tabs = tabs;
    this.reproductionTypes = reproductionTypes;
    this.overSizedCopies = overSizedCopies;
    this.requestorSections = requestorSections;
    this.shippingServices = shippingServices;
  }
}



/** Copyit default values */
export class CopyitDefaultValues extends DefaultCopyItConfiguration {
  public totalAmount: number;

  constructor(
    requestForId?: number,
    requestorName?: string,
    emailAddress?: string,
    phoneNumber?: string,
    jobname?: string,
    isPriceQuote?: number,
    isProof?: number,
    priorityId?: number,
    noOfPages?: number,
    noOfCopies?: number,
    shippingServiceId?: number,
    shippingService?: string,
    shippingOptionId?: number,
    shippingOptionValue?: string,
    deliveredTo?: string,
    paperSizes?: ClientPaperSizes[],
    paperColors?: ClientPaperColor[],
    envelopes?: ConfigEnvelop[],
    paperStocks?: CopyItConfigPaperStock[],
    finishings?: CopyItConfigFinishing[],
    tab?: CopyItConfigTabs,
    reproductionTypes?: CopyItConfigReproductionType[],
    overSizedCopies?: ClientOverSizedCopy[],
    requestorSections?: CopyItConfigRequestorSection[],
    shippingServices?: CopyItConfigShippingMethod[]
  ) {
    super();
    this.requestForId = requestForId;
    this.requestorName = requestorName;
    this.emailAddress = emailAddress;
    this.phoneNumber = phoneNumber;
    this.jobname = jobname;
    this.isPriceQuote = isPriceQuote;
    this.isProof = isProof;
    this.priorityId = priorityId;
    this.noOfPages = noOfPages;
    this.noOfCopies = noOfCopies;
    this.shippingServiceId = shippingServiceId;
    this.shippingService = shippingService;
    this.shippingOptionId = shippingOptionId;
    this.shippingOptionValue = shippingOptionValue;
    this.deliveredTo = deliveredTo;
    this.paperSizes = paperSizes;
    this.paperColors = paperColors;
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

/** AssignTo */
export class AssignTo {
  /** userId */
  public userId: number;
  /** userName */
  public userName: string;
}
