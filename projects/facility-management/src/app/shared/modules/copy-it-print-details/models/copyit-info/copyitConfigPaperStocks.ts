/** This class is use define client copy it paper stock property */
export class CopyItConfigPaperStock {
  public clientConfigureDefaultId?: number;
  public paperStockId?: number;
  public paperStock?: string;
  public isOther?: boolean;
  public defaultClientRate?: number;
  public defaultTenantRate?: number;
  public isDefault?: boolean;
  public quantity?: number;
  public instruction?: string;

  constructor(
    clientConfigureDefaultId?: number,
    paperStockId?: number,
    paperStock?: string,
    isOther?: boolean,
    defaultClientRate?: number,
    defaultTenantRate?: number,
    isDefault?: boolean,
    quantity?: number,
    instruction?: string,
  ) {
    this.clientConfigureDefaultId = clientConfigureDefaultId;
    this.paperStockId = paperStockId;
    this.paperStock = paperStock;
    this.isOther = isOther;
    this.defaultClientRate = defaultClientRate;
    this.defaultTenantRate = defaultTenantRate;
    this.isDefault = isDefault;
    this.quantity = quantity;
    this.instruction = instruction;
  }
}

/** 
 * paperStock model
 * used in copyit config
 */
export class PaperStock extends CopyItConfigPaperStock {
  public pageId?: number;
  public pageTypeId?: number;
  public isUpdated?: boolean;
}
