/** Model class for Tab */
export class Tab {
    public copyItTabId?: number;
    public clientConfigureDefaultId?: number;
    public quantity?: number;
    public instruction?: string;
}

/** Model class for Tab Response */
export class TabResponse extends Tab {
    public tab?: string;
    public defaultClientRate?: number;
    public defaultTenantRate?: number;
}

/** This class is shared bitween copyit config and copyit form */
export class BaseCopyitTab extends TabResponse {
    public tabId?: number;
    public isOther?: boolean;
    public isDefault?: boolean;

    constructor(
        clientConfigureDefaultId?: number,
        tabId?: number,
        tab?: string,
        isOther?: boolean,
        defaultClientRate?: number,
        defaultTenantRate?: number,
        isDefault?: boolean,
        quantity?: number,
        instruction?: string,
    ) {
        super();
        this.clientConfigureDefaultId = clientConfigureDefaultId;
        this.tabId = tabId;
        this.tab = tab;
        this.isOther = isOther;
        this.defaultClientRate = defaultClientRate;
        this.defaultTenantRate = defaultTenantRate;
        this.isDefault = isDefault;
        this.quantity = quantity;
        this.instruction = instruction;
    }
}

/** This class is use to define copyIt config tabs */
export class CopyItConfigTabs extends BaseCopyitTab {
    public isUpdated?: boolean;
}