/**
 * @author Rayhan Kasli.
 * @description
 */


/** model class for Reasons */
export class Reasons {

  /** clientId */
  public clientId: number;

  /** reasonId  of Reasons */
  public reasonId?: number;

  /** reasons  of Reasons */
  public reason: string;

  /** reasonDescription  of Reasons */
  public description: string;

  /** description  of Reasons */
  public reasonType?: number;

  /** description  of Reasons */
  public isEditable: boolean;

  constructor(
    clientId?: number,
    reason?: string,
    description?: string,
    reasonType?: number,
    isEditable?: boolean,
  ) {
    this.clientId = clientId;
    this.reason = reason;
    this.description = description;
    this.reasonType = reasonType;
    this.isEditable = isEditable;
  }
}

/**
 * Reasons response
 */
export class ReasonsResponse {
  /** Last reason for not delivered of reasons response */
  public lastReasonNotDelivered: string;
  /** Last reason for not picked of reasons response */
  public lastReasonNotPicked: string;
  /** Reasons  of reasons response */
  public reasons: Reasons[];

  constructor(
    lastReasonNotDelivered?: string,
    lastReasonNotPicked?: string,
    reasons?: Reasons[]
  ) {
    this.lastReasonNotDelivered = lastReasonNotDelivered;
    this.lastReasonNotPicked = lastReasonNotPicked;
    this.reasons = reasons;
  }
}

/**
 * Reason type
 */
export enum ReasonType {
  Reason_Not_Delivered = 1,
  Reason_Not_Picked = 2,
}

/** Common permission model for reason-UI */
export class ReasonPermissions {
  /** VIEW permission for reasons */
  public view?: string;
  /** ADD permission for reasons */
  public add?: string;
  /** UPDATE permission for reasons */
  public update?: string;
  /** DELETE permission for reasons */
  public delete?: string;
}
