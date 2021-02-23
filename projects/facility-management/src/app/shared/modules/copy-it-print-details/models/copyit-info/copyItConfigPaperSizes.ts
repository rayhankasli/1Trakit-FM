import { InnerItems } from '../../copyits.model';

/** Base copyit configuration paper size */
export class BaseCopyItConfigPaperSizes {
    public clientConfigureDefaultId?: number;
    public paperSizeColorSideId?: number;
    public paperSizeId?: number;
    public paperSize?: string;
    public priority?: number;
    public isOther?: boolean;
    public paperColorTypeId?: number;
    public defaultClientRate?: number;
    public defaultTenantRate?: number;
    public isDefault?: boolean;
    public quantity?: number;
    public instruction?: string;
    public paperSideTypeId?: number;
}
/** This class is use to define copy it config paper sizes property */
export class CopyItConfigPaperSizes extends BaseCopyItConfigPaperSizes {

    public paperColorType?: string;
    public paperSideType?: string;
    public subItems?: InnerItems;

    constructor(
        clientConfigureDefaultId: number,
        paperSizeColorSideId?: number,
        paperSizeId?: number,
        paperSize?: string,
        priority?: number,
        isOther?: boolean,
        paperColorTypeId?: number,
        paperColorType?: string,
        paperSideTypeId?: number,
        paperSideType?: string,
        defaultClientRate?: number,
        defaultTenantRate?: number,
        isDefault?: boolean,
        quantity?: number,
        instruction?: string,
        subItems?: InnerItems
    ) {
        super();
        this.clientConfigureDefaultId = clientConfigureDefaultId;
        this.paperSizeColorSideId = paperSizeColorSideId;
        this.paperSizeId = paperSizeId;
        this.paperSize = paperSize;
        this.priority = priority;
        this.isOther = isOther;
        this.paperColorTypeId = paperColorTypeId;
        this.paperColorType = paperColorType;
        this.paperSideTypeId = paperSideTypeId;
        this.paperSideType = paperSideType;
        this.defaultClientRate = defaultClientRate;
        this.defaultTenantRate = defaultTenantRate;
        this.isDefault = isDefault;
        this.quantity = quantity;
        this.instruction = instruction;
        this.subItems = subItems
    }
}

/** This class is use to define client paper sizes property */
export class ClientPaperSizes extends BaseCopyItConfigPaperSizes {
    public paperColor?: string;
    public paperSide?: string;
}

/** 
 * papersize model
 * used in copyit-configurations
 */
export class PaperSize extends ClientPaperSizes {
    public isUpdated: boolean;
    public pape?: string;
    public pageId?: number;
    public pageTypeId?: number;
}


