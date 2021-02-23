/** Model class for CopyIt Paper Stocks */
export class CopyItPaperStocks { 
    public copyItPaperStockId?: number;
    public pageId?: number;
    public pageTypeId?: number;
    public clientConfigureDefaultId?: number;
    public quantity?: number;
    public instruction?: string;
}

/** Model Class for CopyIt Detail Paper Stocks */
export class CopyItDetailPaperStocks extends CopyItPaperStocks { 
    public defaultClientRate?: number;
    public defaultTenantRate?: number;
    public paperStock?: string;
}

