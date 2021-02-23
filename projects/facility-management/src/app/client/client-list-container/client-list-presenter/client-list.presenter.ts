/** 
 * @author Mitul Patel.
 * @description Client presenter service for Client presentation component.
 */

import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentFactoryResolver, ComponentRef, Injectable, Injector, NgZone, Renderer2 } from '@angular/core';
// ---------------------------------------------- //
import { ConfirmationModalService, TableProperty } from 'common-libs';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { BaseTablePresenter } from '../../../shared/base-presenter/base-table.presenter';
import { Client, ClientFilterRequest, ClientSortRecord } from '../../client.model';

/**
 * ClientListPresenter
 */
@Injectable()
export class ClientListPresenter extends BaseTablePresenter<ClientFilterRequest> {

  /** This property is used for subscribe the value of subject  isCheckAll */
  public isCheckAll$: Observable<boolean>;

  /** Table prop$ of client list presenter */
  public tableProp$: Observable<TableProperty<ClientFilterRequest>>;

  /** This boolean is used to indicate whether all rows are selected or not */
  public isCheckAll: Subject<boolean>;

  /** This property is used to store the Clients that has been retrieved from the API. */
  public clients: Client[];

  /** This property is used to store Client  of the selected Clients */
  public selectedClients: Set<Client>;

  /** This property is used to store the criteria that are selected by the user */
  public tableProperty: TableProperty<ClientFilterRequest>;

  /** Stores the current sorting order */
  public isAscending: boolean;

  /** The message that will be shown in template when no record found */
  public message: string;

  /** Stores the ID of the Client that needs to be deleted */
  public clientId: number;

  /** This property is sue to store selected items. */
  public selectedItems: string[];

  /** This property is used to store searchText . */
  public searchText: string;

  /** This property is used for emit when delete Client.  */
  private deleteClient: Subject<Client>;
  /** This property is used to store filterData.  */
  private filterData: ClientFilterRequest;
  /** This property is used to store sortData.  */
  private sortData: ClientSortRecord;

  /** This property is used to store overlayRef. */
  private overlayRef: OverlayRef;

  /** Table prop of Clientlist presenter */
  private tableProp: Subject<TableProperty<ClientFilterRequest>>;

  /** Component ref of data table presentation component */
  private componentRef: ComponentRef<any>;
  /** Client data of client list presenter */
  private clientData: Subject<Client[]>;

  constructor(
    public renderer: Renderer2,
    public ngZone: NgZone,
    public modalService: ConfirmationModalService,
    private overlay: Overlay,
    private injector: Injector,
    private factoryResolver: ComponentFactoryResolver
  ) {
    super(modalService, renderer, ngZone)
    this.initProperty();
  }

  /**
   * This method is invoked when the user performs a global search. It resets the selected rows, updates the criteria
   * and then gets the new list of Clientbased on updated criteria.
   * @param searchTerm The search string that has been searched by the user
   */
  public onSearch(searchTerm: string): void {
    if (this.searchText === searchTerm) { return; }
    this.selectedClients = new Set();
    this.isCheckAll.next(false);
    this.tableProperty.search = searchTerm;
    this.tableProperty.pageNumber = 0;
    this.searchText = searchTerm;
    this.setTableProperty(this.tableProperty);
  }


  /**
   * Manage status dropdown change with filter
   */
  public onStatusChange(isActive: boolean): void {
    this.tableProperty.filter = { ...this.tableProperty.filter, isActive };
    this.setTableProperty({ ...this.tableProperty, pageNumber: 0 });
  }


  /**
   * Sets table data
   */
  public setTableData(): void {
    if (this.tableProperty.pageNumber > 0 && this.clients.length === 0) {
      // this.toaster.info('No more records found', 'alert');
      return;
    } else if (this.clients.length === 0) {
      this.tableProperty.pageNumber = 0;
    }
    const clientLength: number = this.clients.length;
    this.clientData.next(this.clients);
    this.tableProperty = this.getTableProperty(this.tableProperty, clientLength);
    this.tableProp.next(this.tableProperty);
  }

  /**
   * Filters apply
   * @param filter 
   * @returns true if apply 
   */
  public filterApply(filter: ClientFilterRequest): boolean {
    if (filter) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Sorts apply
   * @param sort 
   * @returns true if apply 
   */
  public sortApply(sort: string): boolean {
    if (sort) {
      return true;
    } else {
      return false;
    }
  }

  /** Initializes default properties for the component */
  private initProperty(): void {
    this.clients = [];
    this.selectedClients = new Set();
    this.isAscending = false;
    // this.tableProperty = new TableProperty();
    this.sortData = new ClientSortRecord();
    this.selectedItems = [];
    this.searchText = '';
    this.isCheckAll = new Subject();
    this.tableProp = new Subject();
    this.clientData = new Subject();
    // this.tableProperty = new TableProperty<ClientFilterRequest>();
    this.tableProperty.filter = new ClientFilterRequest(true);
    this.isCheckAll$ = this.isCheckAll.asObservable();
    this.tableProp$ = this.tableProp.asObservable();
  }
}