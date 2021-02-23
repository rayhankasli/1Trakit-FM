/** This class is use to define copyIt config over sized copy property */
export class CopyItConfigOverSizedCopy {
    public clientConfigureDefaultId?: number;
    public overSizedCopyId?: number;
    public overSizedCopy?: string;
    public defaultClientRate?: number;
    public defaultTenantRate?: number;
    public isDefault?: boolean;
    public quantity?: number;
    public instruction?: string;

    constructor(clientConfigureDefaultId?: number, overSizedCopyId?: number, overSizedCopy?: string, defaultClientRate?: number, defaultTenantRate?: number, isDefault?: boolean, quantity?: number, instruction?: string) {
        this.clientConfigureDefaultId = clientConfigureDefaultId;
        this.overSizedCopyId = overSizedCopyId;
        this.overSizedCopy = overSizedCopy;
        this.defaultClientRate = defaultClientRate;
        this.defaultTenantRate = defaultTenantRate;
        this.isDefault = isDefault;
        this.quantity = quantity;
        this.instruction = instruction;
    }
}
/** Oversized copy model */
export class OverSizedCopy extends CopyItConfigOverSizedCopy {
    public isUpdated?: boolean;

    constructor(clientConfigureDefaultId?: number, overSizedCopyId?: number, overSizedCopy?: string, defaultClientRate?: number, defaultTenantRate?: number, isDefault?: boolean, quantity?: number, instruction?: string) {
        super(clientConfigureDefaultId, overSizedCopyId, overSizedCopy, defaultClientRate, defaultTenantRate, isDefault, quantity, instruction);
    }
}