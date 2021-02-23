/** Model Class for CopyIt Over Sized Copies */
export class CopyItOversizedCopies {
    public copyItOverSizedCopyId?: number;
    public clientConfigureDefaultId?: number;
    public quantity?: number;
    public instruction?: string;


}

/** Model Class for CopyIt Detail Oversized Copies */
export class CopyItDetailOversizedCopies extends CopyItOversizedCopies {
    public defaultClientRate?: number;
    public defaultTenantRate?: number;
    public overSizedCopy?: string;
    public overSizedCopyId?: number;
}

/** Model class for oversized copy in configuration */
export class ClientOverSizedCopy extends CopyItDetailOversizedCopies {
    public isDefault?: boolean;
}
