/** Model Class for CopyIt Paper Color */
export class CopyItPaperColors { 
    public copyItColorId?: number;
    public pageId?: number;
    public pageTypeId?: number;
    public clientConfigureDefaultId?: number;
    public quantity?: number;
    public instruction?: string;
}

/** Model Class for CopyIt Detail Paper Colors */
export class CopyItDetailPaperColors extends CopyItPaperColors {
    public defaultClientRate?: number;
    public defaultTenantRate?: number;
    public color?: string;
}
