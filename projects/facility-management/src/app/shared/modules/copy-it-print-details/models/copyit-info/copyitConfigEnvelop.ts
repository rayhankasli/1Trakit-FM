/** This class is use to define copyIt config envelop property */
export class CopyItConfigEnvelop { 
    public clientConfigureDefaultId?: number;
    public envelopeId?: number;
    public envelope?: string;
    public defaultClientRate?: number;
    public defaultTenantRate?: number;
    public isDefault?: boolean;
    public quantity?: number;
    public instruction?: string;
    
    constructor(
        clientConfigureDefaultId?: number, 
        envelopeId?: number, 
        envelope?: string,
        defaultClientRate?: number,
        defaultTenantRate?: number,
        isDefault?: boolean,
        quantity?: number,
        instruction?: string
        ) {
        this.clientConfigureDefaultId = clientConfigureDefaultId;
        this.envelopeId = envelopeId;
        this.envelope = envelope;
        this.defaultClientRate = defaultClientRate;
        this.defaultTenantRate = defaultTenantRate;
        this.isDefault = isDefault;
        this.quantity = quantity;
        this.instruction = instruction;
    }
}