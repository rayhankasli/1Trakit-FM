/**
 * @author Ronak Patel
 * @description This is data table presentation component.To represent get data from container component and render to dom.
 */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, HostBinding, Inject, Input, NgZone, OnDestroy, OnInit, Output, QueryList, ViewChild, ViewChildren, ViewContainerRef } from '@angular/core';
// ---------------------------------------------------------- //
import { pageCount, SortingOrder, SortingOrderDirective, TableProperty } from 'common-libs';
import { takeUntil } from 'rxjs/operators/takeUntil';
import { Subject } from 'rxjs/Subject';
import { BaseCloseSelectDropdown } from '../../../core/base-classes/base-close-select-dropdown';
// ---------------------------------------------------------- //
import { Permission } from '../../../core/enums/role-permissions.enum';
import { AssignTo } from '../../copyit-configurations.model';
import { CopyitManageAccounListResult, CopyitManageAccount } from '../../models/copyit-manage-account.model';
import { CopyitManageAccountListPresenter } from '../copyit-manage-account-list-presenter/copyit-manage-account-list.presenter';

/**
 * CopyitManageAccountListPresentationComponent
 */
@Component({
  selector: 'app-copyit-manage-account-list-ui',
  templateUrl: './copyit-manage-account-list.presentation.html',
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [CopyitManageAccountListPresenter],
})
export class CopyitManageAccountListPresentationComponent extends BaseCloseSelectDropdown implements OnInit, OnDestroy {

  @HostBinding('class') public class: string;

  /** This property is used for get data from container component */
  @Input() public set baseResponse(value: CopyitManageAccounListResult) {
    if (value) {
      this._baseResponse = { ...value, ...{ accountList: value.accountList } };
      this.setTableData();
    }
  }
  public get baseResponse(): CopyitManageAccounListResult {
    return this._baseResponse;
  }

  /** This property is used for get data from container component */
  @Input() public set assignToRequestor(assignToRequestor: AssignTo[]) {
    if (assignToRequestor) {
      this._assignToRequestor = assignToRequestor;
    }
  }
  public get assignToRequestor(): AssignTo[] {
    return this._assignToRequestor;
  }

  /** This property is used for get data from container component */
  @Input() public set assignToAssociate(assignToAssociate: AssignTo[]) {
    if (assignToAssociate) {
      this._assignToAssociate = assignToAssociate;
    }
  }
  public get assignToAssociate(): AssignTo[] {
    return this._assignToAssociate;
  }

  /** This property is used for emit data to container component */
  @Output() public getCopyitManageAccount: EventEmitter<TableProperty>;

  /** This property is used for emit data to container component */
  @Output() public deleteCopyitManageAccount: EventEmitter<CopyitManageAccount>;

  /** This property is used for emit data to container component */
  @Output() public add: EventEmitter<CopyitManageAccount>;

  /** This property is used for emit data to container component */
  @Output() public update: EventEmitter<CopyitManageAccount>;

  /**
   * View child of customer list presentation component
   */
  @ViewChild('container', { read: ViewContainerRef, static: false }) public container: ViewContainerRef;

  /** This property is used to store QueryList of SortingOrderDirective */
  @ViewChildren(SortingOrderDirective) public sortingColumns: QueryList<SortingOrderDirective>;

  /**
   * This enum is return offices enum props.
   */
  public get manageAccountEnum(): typeof Permission.CopyItManageAccount {
    return Permission.CopyItManageAccount;
  }

  /** This property is used to store the selected CopyitManageAccounts */
  public selectedCopyitManageAccounts: Set<CopyitManageAccount>;
  /** This property is used to store the criteria that are selected by the user */
  public tableProperty: TableProperty;
  /** This property is used to store the options that are available in the Page Size selection drawdown */
  public pageSize: number[];
  /** This boolean is used to indicate whether all rows are selected or not  */
  public isCheckAll: boolean;
  /** Table prop of customer list presentation component */
  public tableProp: Subject<TableProperty>;
  /** This property is used for checking sort applied or not. */
  public isSortApply: boolean;
  /** This property is used for form open or note */
  public formOpen: boolean;
  /** This property is used for status dropdown */
  public status = ['active', 'inactive'];
  /** This property is used for status dropdown */
  public accountStatus: string;


  /** create for getter setter */
  private _baseResponse: CopyitManageAccounListResult;
  /** create for getter setter */
  private _assignToRequestor: AssignTo[];
  /** create for getter setter */
  private _assignToAssociate: AssignTo[];
  

  constructor(
    public copyitManageAccountPresenter: CopyitManageAccountListPresenter,
    public changeDetection: ChangeDetectorRef,
    @Inject('Window') window: Window,
    zone: NgZone
  ) {
    super(window, zone);
    this.window = window as Window;  
    this.initProperty();
    this.class = 'd-flex flex-column h-100 overflow-hidden';
  }

  public ngOnInit(): void {
    this.copyitManageAccountPresenter.setTableProp$
      .pipe(takeUntil(this.destroy))
      .subscribe((tableProperty: TableProperty) => {
        this.getCopyitManageAccount.emit(tableProperty);
        this.tableProperty = tableProperty;
      });
    this.copyitManageAccountPresenter.deleteRecord$
      .pipe(takeUntil(this.destroy))
      .subscribe((copyitManageAccount: CopyitManageAccount) => {
        this.deleteCopyitManageAccount.emit(copyitManageAccount);
      });
    this.copyitManageAccountPresenter.tableProp$.subscribe(
      (value: TableProperty) => {
        this.tableProperty = value;
      }
    );
  }

  /**
   * This method is invoked when the user clicks on sorting icons. It sets the sort related criteria and queries the server
   * to get the updated list of copyitManageAccounts.
   * @param column The column on which sorting needs to be performed.
   * @param sortingOrder The sort order by which the column needs to be sorted.
   */
  public onSortOrder(column: string, sortingOrder: SortingOrder): void {
    this.copyitManageAccountPresenter.onSortOrder(
      column,
      sortingOrder,
      this.sortingColumns
    );
  }

  /**
   * This method is invoked when the user performs a global search. It resets the selected rows, updates the criteria
   * and then gets the new list of CopyitManageAccount based on updated criteria.
   * @param searchTerm The search string that has been searched by the user
   */
  public onSearch(searchTerm: string): void {
    this.copyitManageAccountPresenter.onSearch(searchTerm);
  }

  /** create for open modal when action perform */
  public openModal(copyitManageAccount: CopyitManageAccount): void {
    this.copyitManageAccountPresenter.openModal(copyitManageAccount);
  }

  /**
   * This method is invoked when the user changes the current page size.
   * @param pageSize The page number that needs to be set.
   */
  public onPageSizeChange(pageSize: number): void {
    this.copyitManageAccountPresenter.onPageSizeChange(pageSize);
  }

  /**
   * This method is invoked when the user changes the page number from the pagination toolbar.
   * @param pageNumber The number to which the table should switch to
   */
  public onPageChange(pageNumber: number): void {
    this.copyitManageAccountPresenter.onPageChange(pageNumber);
  }

  /**
   * Sets table data
   */
  public setTableData(): void {
    this.isSortApply = this.copyitManageAccountPresenter.sortApply(
      this.tableProperty.sort
    );
    this.copyitManageAccountPresenter.copyitManageAccounts = this._baseResponse.accountList;
    this.copyitManageAccountPresenter.setTableData();
  }

  /** This method is used for add form  */
  public addForm(): void {
    this.formOpen = !this.formOpen;
    this.closeEditForm();
  }

  /** This method is used for edit form  */
  public openEditForm(copyitManageAccount: CopyitManageAccount): void {
    this.formOpen = false;
    this._baseResponse.accountList = this.copyitManageAccountPresenter.closeForm(
      this._baseResponse.accountList,
      copyitManageAccount
    );
  }

  /** This method is used for close edit form */
  public closeEditForm(): void {
    this._baseResponse.accountList = this.copyitManageAccountPresenter.closeForm(
      this._baseResponse.accountList
    );
  }

  /** This method is used for get CopyitManageAccount from form presenter and pass to container */
  public onAdd(value: CopyitManageAccount): void {
    this.formOpen = false;
    this.add.emit(value);
  }

  /** This method is used for update the CopyitManageAccount */
  public onUpdate(value: CopyitManageAccount): void {
    this._baseResponse.accountList = this.copyitManageAccountPresenter.closeForm(
      this._baseResponse.accountList
    );
    this.update.emit(value);
  }

  /** This Method is used for change the status */
  public onStatusChange(status: string): void {
    this.copyitManageAccountPresenter.onStatusChange(status);
  }

  /** Initializes default properties for the component */
  private initProperty(): void {
    this.selectedCopyitManageAccounts = new Set();
    this.isCheckAll = false;
    this.tableProp = new Subject();
    this.tableProperty = new TableProperty();
    this.pageSize = pageCount;
    this.destroy = new Subject();
    this.add = new EventEmitter();
    this.update = new EventEmitter();
    this.getCopyitManageAccount = new EventEmitter<TableProperty>();
    this.deleteCopyitManageAccount = new EventEmitter<CopyitManageAccount>();
    this.accountStatus = 'active';
  }
}
