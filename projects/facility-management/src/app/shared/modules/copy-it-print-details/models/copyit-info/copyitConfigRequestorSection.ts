/** Model class for Requestor Section */
export class RequestorSection {
  public requestorSectionId?: number;
  public requestorSection?: string;
}

/** This class is use to define client requestor section property */
export class CopyItConfigRequestorSection extends RequestorSection {
  public clientConfigureDefaultId?: number;
  public defaultClientRate?: number;
  public defaultTenantRate?: number;
  public isDefault?: boolean;
  public quantity?: number;
  public instruction?: string;

  constructor(
    clientConfigureDefaultId?: number,
    requestorSectionId?: number,
    requestorSection?: string,
    defaultClientRate?: number,
    defaultTenantRate?: number,
    isDefault?: boolean,
    quantity?: number,
    instruction?: string,
  ) {
    super();
    this.clientConfigureDefaultId = clientConfigureDefaultId;
    this.requestorSectionId = requestorSectionId;
    this.requestorSection = requestorSection;
    this.defaultClientRate = defaultClientRate;
    this.defaultTenantRate = defaultTenantRate;
    this.isDefault = isDefault;
    this.quantity = quantity;
    this.instruction = instruction;
  }
}
