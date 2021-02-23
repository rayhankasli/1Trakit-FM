/** Model Class for CopyIt Paper Sizes */
export class CopyItPaperSizes {
    public copyItPaperSizeId?: number;
    public pageId?: number;
    public pageTypeId?: number;
    public clientConfigureDefaultId?: number;
    public instruction?: string;
}

/** Model Class for CopyIt Detail Paper Sizes */
export class CopyItDetailPaperSizes extends CopyItPaperSizes {
    public paperSize?: string;
    public paperColorTypeId?: number;
    public paperSideTypeId?: number;
    public defaultClientRate?: number;
    public defaultTenantRate?: number;
    // to show concat paper-size detail
    public paperSizeOptionDetail?: string;
}