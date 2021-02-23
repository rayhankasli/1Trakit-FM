/** Client Master */
export class BaseClientMaster {
  /** clientId */
  public clientId: number;
  /** client */
  public client: string;
  /** tenants */
  public tenants?: boolean;
  /** Account Number */
  public accountNumber?: boolean;
  /** logo small */
  public logoFileNameSmall?: string;
  /** logo large */
  public logoFileNameLarge?: string;
  /** product licensing for app-features */
  public productLicense?: ProductLicense;
  /** product licensing for app-features */
  public archive?: Archive;
}
/** Product licensing for app-features */
export class ProductLicense {
  public copyIt: boolean;
  public bookIt: boolean;
  public mail: boolean;
  public workflow: boolean;
  public visitorLog: boolean;

  constructor({ copyIt, bookIt, mail, workflow, visitorLog }: any) {
    this.copyIt = copyIt;
    this.bookIt = bookIt;
    this.mail = mail;
    this.workflow = workflow;
    this.visitorLog = visitorLog;
  }
}

/** Archived app-features */
export class Archive {
  public copyIt: boolean;
  public bookIt: boolean;
  public mail: boolean;
  public workflow: boolean;
  public visitorLog: boolean;

  constructor({ copyIt, bookIt, mail, workflow, visitorLog }: any) {
    this.copyIt = copyIt;
    this.bookIt = bookIt;
    this.mail = mail;
    this.workflow = workflow;
    this.visitorLog = visitorLog;
  }
}