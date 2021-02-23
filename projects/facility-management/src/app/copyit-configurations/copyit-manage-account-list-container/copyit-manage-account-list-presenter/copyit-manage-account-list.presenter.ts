/**
 * @author Ronak Patel.
 * @description CopyitManageAccountpresenter service for CopyitManageAccountpresentation component.
 */

import { Injectable, Renderer2, NgZone } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
// ---------------------------------------------- //
import { ConfirmationModalService, TableProperty } from 'common-libs';
// ---------------------------------------------- //
import { CopyitManageAccount } from '../../models/copyit-manage-account.model';
import { BaseTablePresenter } from '../../../shared/base-presenter/base-table.presenter';
import { getTableProperty, pageSizeChange } from '../../../core/utility/utility';

/**
 * CopyitManageAccountListPresenter
 */
@Injectable()
export class CopyitManageAccountListPresenter extends BaseTablePresenter<TableProperty | CopyitManageAccount> {

  /** This property is used for subscribe the value of subject  isCheckAll */
  public isCheckAll$: Observable<boolean>;

  /** Table prop$ of copyitManageAccount list presenter */
  public tableProp$: Observable<TableProperty>;

  /** This boolean is used to indicate whether all rows are selected or not */
  public isCheckAll: Subject<boolean>;

  /** This property is used to store the CopyitManageAccounts that has been retrieved from the API. */
  public copyitManageAccounts: CopyitManageAccount[];

  /** This property is used to store CopyitManageAccount  of the selected CopyitManageAccounts */
  public selectedCopyitManageAccounts: Set<CopyitManageAccount>;

  /** This property is used to store the criteria that are selected by the user */
  public tableProperty: TableProperty;

  /** Stores the current sorting order */
  public isAscending: boolean;

  /** The message that will be shown in template when no record found */
  public message: string;

  /** Stores the ID of the CopyitManageAccount that needs to be deleted */
  public copyitManageAccountId: number;

  /** This property is sue to store selected items. */
  public selectedItems: string[];

  /** This property is used to store searchText . */
  public searchText: string;

  /** This property for store filter record */
  public filterRecord: any;

  /** Table prop of CopyitManageAccountlist presenter */
  private tableProp: Subject<TableProperty>;

  /** CopyitManageAccount data of copyitManageAccount list presenter */
  private copyitManageAccountData: Subject<CopyitManageAccount[]>;

  constructor(
    public renderer: Renderer2,
    public ngZone: NgZone,
    public modalService: ConfirmationModalService,
  ) {
    super(modalService, renderer, ngZone)
    this.initProperty();
  }

  /** This method is invoke when table property change. */
  public setTableProperty(tableProperty: TableProperty): void {
    this.tableProperty = tableProperty;
    this.tableProperty.filter = this.filterRecord;
    this.setTableProp.next(this.tableProperty);
  }

  /** This method is invoke when data successfully get */
  public getTableProperty(tableProperty: TableProperty, length: number): TableProperty {
    this.tableProperty = tableProperty;
    this.tableProperty = getTableProperty(tableProperty, length);
    return this.tableProperty;
  }

  /**
   * This method is invoked when the user changes the current page size.
   * @param pageSize The page number that needs to be set.
   */
  public onPageSizeChange(pageSize: number): void {
    this.tableProperty = pageSizeChange(this.tableProperty, pageSize);
    this.setTableProperty(this.tableProperty);
  }

  /**
   * This method is invoked when the user changes the page number from the pagination toolbar.
   * @param pageNumber The number to which the table should switch to
   */
  public onPageChange(pageNumber: number): void {
    this.tableProperty.pageNumber = pageNumber;
    this.setTableProperty(this.tableProperty);
  }

  /**
   * Sets table data
   */
  public setTableData(): void {
    if (this.tableProperty.pageNumber > 0 && this.copyitManageAccounts.length === 0) {
      // this.toaster.info('No more records found', 'alert');
      return;
    } else if (this.copyitManageAccounts.length === 0) {
      this.tableProperty.pageNumber = 0;
    }
    const copyitManageAccountLength: number = this.copyitManageAccounts.length;
    this.copyitManageAccountData.next(this.copyitManageAccounts);
    this.tableProperty = this.getTableProperty(this.tableProperty, copyitManageAccountLength);
    this.tableProp.next(this.tableProperty);
  }

  /**
   * This Method is used for close the inline form
   * @param copyitManageAccount - list of all workflowTask
   * @param workflowTask - selected workflowTask
   */
  public closeForm(copyitManageAccount: CopyitManageAccount[], workflowTask?: CopyitManageAccount): CopyitManageAccount[] {
    copyitManageAccount && copyitManageAccount.map((value: CopyitManageAccount) => {
      if (value.isEditable) {
        value.isEditable = false;
      }
      if (workflowTask === value) {
        value.isEditable = true;
      }
    });
    copyitManageAccount = copyitManageAccount && copyitManageAccount.filter((value: CopyitManageAccount) => value.clientAccountId !== 0);
    return copyitManageAccount;
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

  /** This methods is used for filter record base on status  */
  public onStatusChange(status: string): void {
    this.filterRecord = { isActive: status === 'active' ? true : false }
    this.setTableProperty(this.tableProperty);
  }

  /** Initializes default properties for the component */
  private initProperty(): void {
    this.copyitManageAccounts = [];
    this.selectedCopyitManageAccounts = new Set();
    this.isAscending = false;
    this.tableProperty.filter = { isActive: true };
    this.filterRecord = this.tableProperty.filter;
    this.selectedItems = [];
    this.searchText = '';
    this.isCheckAll = new Subject();
    this.tableProp = new Subject();
    this.copyitManageAccountData = new Subject();
    this.isCheckAll$ = this.isCheckAll.asObservable();
    this.tableProp$ = this.tableProp.asObservable();
  }
}

