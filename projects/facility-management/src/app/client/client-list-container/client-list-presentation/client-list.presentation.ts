
/**
 * @author YOUR_NAME_HERE
 * @description This is data table presentation component.To represent get data from container component and render to dom.
 */
import {
  Component, OnInit, ViewChildren, QueryList, Input, Output, EventEmitter, ChangeDetectionStrategy, OnDestroy,
  ViewContainerRef, ViewChild, ChangeDetectorRef, HostBinding, NgZone, Inject
} from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { takeUntil } from 'rxjs/operators/takeUntil';
import { BreakpointState } from '@angular/cdk/layout';
// ---------------------------------------------------------- //
import { TableProperty, SortingOrderDirective, pageCount } from 'common-libs';
import { Client, ClientFilterRequest, ClientListStatus, ClientListResult } from '../../client.model';
import { CLIENT_STATUS_OPTION, } from '../../client.constant';
import { ClientListPresenter } from '../client-list-presenter/client-list.presenter';
import { ClientListPresentationBase } from '../client-list-presentation-base/client-list.presentation.base';
import { Permission, PolicyRoles } from '../../../core/enums/role-permissions.enum';
import { AuthPolicyService } from 'auth-policy';


/**
 * ClientListPresentationComponent
 */
@Component({
  selector: 'app-client-list-ui',
  templateUrl: './client-list.presentation.html',
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [ClientListPresenter]
})
export class ClientListPresentationComponent extends ClientListPresentationBase implements OnInit, OnDestroy {

  @HostBinding('class') public class: string;
  /** This property is used for get data from container component */
  @Input() public set baseResponse(baseResponse: ClientListResult) {
    if (baseResponse) {
      this._baseResponse = baseResponse;
      this.setTableData();
    }
  };
  public get baseResponse(): ClientListResult {
    return this._baseResponse;
  }

  /** This property is used for get delete record or not. */
  @Input() public set isDeleted(deleteResponse: boolean) {
    if (deleteResponse) {
      this.getClient.emit(this.tableProperty);
    }

  }
  /** This property is used for get delete record or not. */
  @Input() public set isUpdated(updateResponse: boolean) {
    if (updateResponse) {
      this.getClient.emit(this.tableProperty);
    }

  }

  /**
   * This enum is return clients enum props.
   */
  public get clientsEnum(): typeof Permission.Client {
    return Permission.Client;
  }

  /** This property is used for emit data to container component */
  @Output() public getClient: EventEmitter<TableProperty<ClientFilterRequest>>;

  /** This property is used for emit data to container component */
  @Output() public deleteClient: EventEmitter<Client>;

  /** This property is used for emit filter data to container component */
  // @Output() public filterClient: EventEmitter<TableProperty<ClientFilterRequest>>;

  /** This property is used for emit updated client status */
  @Output() public setClientStatus: EventEmitter<Client>;

  /** This property is used for emit download sample file event */

  /**
   * View child of customer list presentation component
   */
  @ViewChild('container', { read: ViewContainerRef, static: true }) public container: ViewContainerRef;

  /** This property is used to store QueryList of SortingOrderDirective */
  @ViewChildren(SortingOrderDirective) public sortingColumns: QueryList<SortingOrderDirective>;

  /** This property is used to store the selected Clients */
  public selectedClients: Set<Client>;

  /** This property is used to store the criteria that are selected by the user */
  public tableProperty: TableProperty<ClientFilterRequest>;

  /** This property is used to store the options that are available in the Page Size selection drawdown */
  public pageSize: number[];

  /** This boolean is used to indicate whether all rows are selected or not  */
  public isCheckAll: boolean;

  /** Table prop of customer list presentation component */
  public tableProp: Subject<TableProperty<ClientFilterRequest>>;

  /** isMobile property for mobile screen or not */
  public isMobile: Observable<BreakpointState>;

  /** This property is used for checking filter applied or not. */
  public isFilterApply: boolean;

  /** This property is used for checking sort applied or not. */
  public isSortApply: boolean;

  /** Client status */
  public status: ClientListStatus[] = CLIENT_STATUS_OPTION;
  /** Status dropdown model */
  public statusOption: boolean;
  /** User role is super user */
  public isSuperUser: boolean;

  /** create for getter setter */
  private _baseResponse: ClientListResult;

  constructor(
    public clientPresenter: ClientListPresenter,
    public changeDetection: ChangeDetectorRef,
    private policy: AuthPolicyService,
    @Inject('Window') window: Window,
    zone: NgZone
  ) {
    super(clientPresenter, changeDetection, window, zone);
    this.initProperty();
    this.isSuperUser = this.policy.isInRole(PolicyRoles.superUser);
    this.class = 'd-flex flex-column h-100 overflow-hidden';
  }

  public ngOnInit(): void {
    this.clientPresenter.setTableProp$.pipe(takeUntil(this.destroy)).subscribe((tableProperty: TableProperty<ClientFilterRequest>) => {
      this.getClient.emit(tableProperty);
      this.tableProperty = tableProperty;
      this.statusOption = tableProperty.filter.isActive;

    });
    this.clientPresenter.deleteRecord$.pipe(takeUntil(this.destroy)).subscribe((client: Client) => { this.deleteClient.emit(client) });
    this.clientPresenter.tableProp$.subscribe((value: TableProperty<ClientFilterRequest>) => {
      this.tableProperty = value;
    });
  }

  /**
   * Sets table data
   */
  public setTableData(): void {
    this.isFilterApply = this.clientPresenter.filterApply(this.tableProperty.filter);
    this.isSortApply = this.clientPresenter.sortApply(this.tableProperty.sort);
    this.clientPresenter.clients = [...this.baseResponse.clientList];
    this.clientPresenter.setTableData();
  }

  /**
   * Filter status on client list
   * @param status Filter status
   */
  public onStatusChange(status: ClientListStatus): void {
    this.clientPresenter.onStatusChange(status.statusValue);
  }

  /** Initializes default properties for the component */
  private initProperty(): void {
    this.selectedClients = new Set();
    this.isCheckAll = false;
    this.tableProp = new Subject();
    this.tableProperty = new TableProperty();
    this.pageSize = pageCount;
    this.destroy = new Subject();
    this.getClient = new EventEmitter<TableProperty<ClientFilterRequest>>(true);
    this.deleteClient = new EventEmitter<Client>();
    // this.filterClient = new EventEmitter<TableProperty<ClientFilterRequest>>();
    this.setClientStatus = new EventEmitter<Client>();
  }
}
