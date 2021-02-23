import { Inject, Input, NgZone } from '@angular/core';
import { ClientMaster, StatusMaster, UsersMaster } from '../model/common.model';
import { BaseCloseSelectDropdown } from './base-close-select-dropdown';

/** CopyItBookItBase */
export class CopyItBookItBase extends BaseCloseSelectDropdown {

    /** List of clients */
  @Input() public set clients(list: ClientMaster[]) {
    if (list) {
      this._clients = [...list];
    }
  }
  public get clients(): ClientMaster[] {
    return this._clients;
  }

  /** List of Requestors AssignedTo and Statuses Based On ClientId */
  @Input() public set requestorsAssignedToStatusesBasedOnClientId(value: any) {
    if (value) {
      this._requestorsAssignedToStatusesBasedOnClientId = value;
      this.assignedTo = value.assignedTo;
      this.requestors = value.requestors;
      this.statuses = value.statuses;
    }
  }
  public get requestorsAssignedToStatusesBasedOnClientId(): any {
    return this._requestorsAssignedToStatusesBasedOnClientId;
  }

  /** AssignedTo List for filter */
  public assignedTo: UsersMaster[];
  /** Requestor List for filter */
  public requestors: UsersMaster[];
  /** Status List for filter */
  public statuses: StatusMaster[];
  
  /** list of clients */
  protected _clients: ClientMaster[];

  /** To-Do */
  private _requestorsAssignedToStatusesBasedOnClientId: any;

 

  constructor(
    @Inject('Window') window: Window,
    zone: NgZone
  ) {
  super(window, zone);
  this.window = window as Window;  
  }
}