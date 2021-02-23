/** Model class for CopyIt Reproduction Types */
export class CopyItReproductionTypes { 
    public copyItReproductionTypeId?: number;
    public clientConfigureDefaultId?: number;
    public instruction?: string;
    public reproductionTypeId: number;
}

/** Model Class for CopyIt Detail Reproduction Types */
export class CopyItDetailReproductionTypes extends CopyItReproductionTypes {
    public reproductionType?: string;
    public defaultClientRate?: number;
    public defaultTenantRate?: number;
}
