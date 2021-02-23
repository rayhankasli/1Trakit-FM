import { CopyItConfigFinishingSubItem } from './copyitConfigFinishingSubItem';

/** This class is use to define copyIt config finishing items property */
export class CopyItConfigFinishing {
    public clientConfigureDefaultId?: number;
    public finishingId?: number;
    public finishing?: string;
    public isOther?: boolean;
    public finishingSubItems?: CopyItConfigFinishingSubItem[];
    public defaultClientRate?: number;
    public defaultTenantRate?: number;
    public isDefault?: boolean;
    public quantity?: number;
    public instruction?: string;

    constructor(
        clientConfigureDefaultId?: number,
        finishingId?: number,
        finishing?: string,
        isOther?: boolean,
        finishingSubItems?: CopyItConfigFinishingSubItem[],
        defaultClientRate?: number,
        defaultTenantRate?: number,
        isDefault?: boolean,
        quantity?: number,
        instruction?: string
    ) {
        this.clientConfigureDefaultId = clientConfigureDefaultId;
        this.finishingId = finishingId;
        this.finishing = finishing;
        this.isOther = isOther;
        this.finishingSubItems = finishingSubItems;
        this.defaultClientRate = defaultClientRate;
        this.defaultTenantRate = defaultTenantRate;
        this.isDefault = isDefault;
        this.quantity = quantity;
        this.instruction = instruction;
    }
}
