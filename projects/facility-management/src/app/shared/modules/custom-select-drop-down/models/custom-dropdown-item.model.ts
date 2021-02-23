/** Model Class for Custom Drop Down Item */
export class CustomDropDownItem {
    /** to-do */
    public value?: any;
    public label?: any;
    public quantity?: any;
    public primaryKeyField: any;
    public selected?: boolean;
    /** to-do */
    public isOther?: boolean;
    public instruction?: any;
    public isHideQuantity?: boolean;
    public finishingSubItemId?: any;
    public finishingSubItemValue?: any;
    public finishingSubItems?: CustomDropDownItemOption[];
    public defaultTenantRate?: number;
    public defaultClientRate?: number;
    public reproductionTypeId?: number;
}

/** Model Class for Custom Paper Size DropDown Item */
export class CustomPaperSizeDropDownItem {
    public paperSize?: string;
    public paperSizeId?: number;
    public clientConfigureDefaultId?: number;
    public subItem?: PaperSizeSubItems;
    public instruction?: string;
    public isOther?: boolean;
    public paperColorTypeId?: number;
    public paperSideTypeId?: number;
    public selected?: boolean;
    public paperColorType?: string;
    public paperSideType?: string;
    public defaultTenantRate?: number
    public defaultClientRate?: number;
    public primaryKeyField?: any;
}


/** Model Class for Custom DropDown Item Option */
export class CustomDropDownItemOption {
    /** to-do */
    public finishingSubItemId?: any;
    public finishingSubItem?: any;
    public finishingSubItemValue?: any;
}


/** Model Class for Paper Size Sub-Items */
export class PaperSizeSubItems {
    public paperColors: PaperColor[];
    public paperSides: PaperSide[];
}

/** Model Class for Paper Color */
export class PaperColor {
    public paperColorId: number;
    public paperColor: string;
    public selected: boolean;
}

/** Model Class for Paper Side */
export class PaperSide {
    public paperSideId: number;
    public paperSide: string;
    public selected: boolean;
}