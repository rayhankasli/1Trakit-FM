/** Model class for Shipping Method */
export class ShippingMethod {
    public shippingServiceId?: number;
    public shippingService?: string;
    public shippingServiceParentId?: number;
}

/** This class is use to define client shipping method */
export class CopyItConfigShippingMethod extends ShippingMethod {
    public clientConfigureDefaultId?: number;
    public defaultClientRate?: number;
    public defaultTenantRate?: number;
    public isDefault?: boolean;
    public quantity?: number;
    public instruction?: string;

    constructor(
        clientConfigureDefaultId?: number,
        shippingServiceId?: number,
        shippingService?: string,
        defaultClientRate?: number,
        defaultTenantRate?: number,
        isDefault?: boolean,
        quantity?: number,
        instruction?: string,
    ) {
        super();
        this.clientConfigureDefaultId = clientConfigureDefaultId;
        this.shippingServiceId = shippingServiceId;
        this.shippingService = shippingService;
        this.defaultClientRate = defaultClientRate;
        this.defaultTenantRate = defaultTenantRate;
        this.isDefault = isDefault;
        this.quantity = quantity;
        this.instruction = instruction;
    }
}

/** Model class for Shipping Option */
export class ShippingOption {
    public shippingOptionId?: number;
    public shippingOption?: string;
}
