/** Model Class for CopyIt Envelopes */
export class CopyItEnvelopes {
    public copyItEnvelopeId?: number;
    public clientConfigureDefaultId?: number;
    public quantity?: number;
    public instruction?: string;
}

/** Model Class for CopyIt Detail Envelopes */
export class CopyItDetailEnvelopes extends CopyItEnvelopes {
    public defaultClientRate?: number;
    public defaultTenantRate?: number;
    public envelope?: string;
}

/** This class is use to define client envelop property */
export class ConfigEnvelop extends CopyItDetailEnvelopes {
    public envelopeId?: number;
    public isDefault?: boolean;
}

/** Model class for Envelope Request */
export class Envelope extends ConfigEnvelop {
    public isUpdated: boolean;
}