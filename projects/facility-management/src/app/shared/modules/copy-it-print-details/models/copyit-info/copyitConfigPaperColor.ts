/** Base copyit configuration for paper color */
export class BaseCopyItConfigPaperColor {
  public clientConfigureDefaultId?: number;
  public defaultClientRate?: number;
  public defaultTenantRate?: number;
  public isDefault?: boolean;
  public quantity?: number;
  public instruction?: string;
}

/** This class is use define client copy it paper color property */
export class CopyItConfigPaperColor extends BaseCopyItConfigPaperColor {
  public paperColorTypeId?: number;
  public paperColor?: string;

  constructor(
    clientConfigureDefaultId: number,
    paperColorTypeId?: number,
    paperColor?: string,
    defaultClientRate?: number,
    defaultTenantRate?: number,
    isDefault?: boolean,
    quantity?: number,
    instruction?: string
  ) {
    super();
    this.clientConfigureDefaultId = clientConfigureDefaultId;
    this.paperColorTypeId = paperColorTypeId;
    this.paperColor = paperColor;
    this.defaultClientRate = defaultClientRate;
    this.defaultTenantRate = defaultTenantRate;
    this.isDefault = isDefault;
    this.quantity = quantity;
    this.instruction = instruction;
  }
}

/** This class is use define client copy it paper color property */
export class ClientPaperColor extends BaseCopyItConfigPaperColor {
  public colorId?: number;
  public color?: string;
}

/** 
 * paper color model
 * used in copyit-configurations
 */
export class PaperColor extends ClientPaperColor {
  public isOther?: number;
  public pageId?: number;
  public pageTypeId?: number;
}