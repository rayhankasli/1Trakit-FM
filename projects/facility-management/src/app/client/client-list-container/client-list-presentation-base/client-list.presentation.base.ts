
/**
 * @author Enter Your Name Here.
 * @description This is base class to represent the common members of desktop and mobile component.
 */

import { ChangeDetectorRef, EventEmitter, Inject, Input, NgZone, Output } from '@angular/core';
// --------------------------------------------- //
import { TableProperty } from 'common-libs';
import { BasePresentation } from '../../../core/base-classes/base.presentation';
import { Client, ClientListStatus } from '../../client.model';
import { CLIENT_STATUS_OPTION } from '../../client.constant';
import { ClientListPresenter } from '../client-list-presenter/client-list.presenter';
import { BaseCloseSelectDropdown } from '../../../core/base-classes/base-close-select-dropdown';

/**
 * client list presentation base
 */
export class ClientListPresentationBase extends BaseCloseSelectDropdown {

  /** This property is used to store the clients that has been retrieved from the API. */
  @Input() public set clients(value: Client[]) {
    if (value) {
      this._clients = value;
    }
  };
  public get clients(): Client[] {
    return this._clients;
  }

  /** This property is used for emit download sample file event */
  @Output() public setClientStatus: EventEmitter<Client>;
  /** This property is used for emit download sample file event */
  @Output() public openBookItConfig: EventEmitter<Client>;
  /** This property is used for emit download sample file event */
  @Output() public openCopyItConfig: EventEmitter<Client>;
  /** This property is used for emit download sample file event */
  @Output() public openMailConfig: EventEmitter<Client>;
  /** This property is used for emit download sample file event */
  @Output() public openWorkflowConfig: EventEmitter<Client>;

  /** This boolean is used to indicate whether all rows are selected or not  */
  public isCheckAll: boolean;

  /** This property is used for filter apply or not. */
  public isFilterApply: boolean;

  /** Client list status */
  public status: ClientListStatus[] = CLIENT_STATUS_OPTION;

  /** Clients of client list presentation base */
  private _clients: Client[];

  constructor(
    public clientPresenter: ClientListPresenter,
    public changeDetection: ChangeDetectorRef,
    @Inject('Window') window: Window,
    zone: NgZone
  ) {
    super(window, zone);
    this.window = window as Window;
    this.setClientStatus = new EventEmitter();
    this.openBookItConfig = new EventEmitter();
    this.openCopyItConfig = new EventEmitter();
    this.openMailConfig = new EventEmitter();
    this.openWorkflowConfig = new EventEmitter();
  }

  /**
   * This method is invoked when the user changes the current page size.
   * @param pageSize The page number that needs to be set.
   */
  public onPageSizeChange(pageSize: number): void {
    this.clientPresenter.onPageSizeChange(pageSize);
  }

  /**
   * This method is invoked when the user changes the page number from the pagination toolbar.
   * @param pageNumber The number to which the table should switch to
   */
  public onPageChange(pageNumber: number): void {
    this.clientPresenter.onPageChange(pageNumber);
  }

  /** create for open modal when action perform */
  public clearFilter(): void {
    this.isFilterApply = false;
    this.clientPresenter.setTableProperty(new TableProperty());
  }

  /**
   * This method is invoked when the user performs a global search. It resets the selected rows, updates the criteria
   * and then gets the new list of Client based on updated criteria.
   * @param searchTerm The search string that has been searched by the user
   */
  public onSearch(searchTerm: string): void {
    this.clientPresenter.onSearch(searchTerm);
  }


  /** create for open modal when action perform */
  public openModal(client: Client): void {
    this.clientPresenter.openModal(client);
  }

  /**
   * Set client status active/inactive
   * @param status status to be changed
   * @param client client detail
   */
  public setStatus(status: ClientListStatus, client: Client): void {
    this.onSetStatus({ ...client, isActive: status.statusValue });
  }

  /**
   * On client status change
   * @param client Client
   */
  public onSetStatus(client: Client): void {
    this.setClientStatus.emit(client);
  }

  /** Open BookIt Config for client */
  public onOpenBookItConfig(client: Client): void {
    this.openBookItConfig.emit(client);
  }
  /** Open CopyIt Config for client */
  public onOpenCopyItConfig(client: Client): void {
    this.openCopyItConfig.emit(client);
  }
  /** Open Mail Config for client */
  public onOpenMailConfig(client: Client): void {
    this.openMailConfig.emit(client);
  }
  /** Open Workflow Config for client */
  public onOpenWorkflowConfig(client: Client): void {
    this.openWorkflowConfig.emit(client);
  }
}
