/** This class is use to define client reproduction type */
export class CopyItConfigReproductionType {
    public clientConfigureDefaultId?: number;
    public reproductionTypeId?: number;
    public reproductionType?: string;
    public defaultClientRate?: number;
    public defaultTenantRate?: number;
    public isDefault?: boolean;
    public quantity?: number;
    public instruction?: string;

    constructor(
        clientConfigureDefaultId?: number,
        reproductionTypeId?: number,
        reproductionType?: string,
        defaultClientRate?: number,
        defaultTenantRate?: number,
        isDefault?: boolean,
        quantity?: number,
        instruction?: string,
    ) {
        this.clientConfigureDefaultId = clientConfigureDefaultId;
        this.reproductionTypeId = reproductionTypeId;
        this.reproductionType = reproductionType;
        this.defaultClientRate = defaultClientRate;
        this.defaultTenantRate = defaultTenantRate;
        this.isDefault = isDefault;
        this.quantity = quantity;
        this.instruction = instruction;
    }
}

/** Model class for  Production type request */
export class ReproductionType extends CopyItConfigReproductionType {
    constructor(
        clientConfigureDefaultId?: number,
        reproductionTypeId?: number,
        reproductionType?: string,
        defaultClientRate?: number,
        defaultTenantRate?: number,
        isDefault?: boolean,
        quantity?: number,
        instruction?: string,
    ) {
        super(clientConfigureDefaultId, reproductionTypeId, reproductionType, defaultClientRate, defaultTenantRate, isDefault, quantity, instruction)
    }
}
