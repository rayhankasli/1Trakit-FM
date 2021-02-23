/**
 * @author Enter Your Name Here.
 * @description CopyItListpresenter service for CopyItListpresentation component.
 */

import {
  Injectable, QueryList, Renderer2, NgZone, ComponentRef,
  TemplateRef, ViewContainerRef, ComponentFactoryResolver, Type
} from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { CdkPortalOutlet, TemplatePortal } from '@angular/cdk/portal';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
// ----------------------------------------------------------------------- //
import { ConfirmationModalService, TableProperty } from 'common-libs';
// ----------------------------------------------------------------------- //
import { CopyItList, CopyItListSortRecord } from '../../models/copyit-list.model';
import { MultiSelectFilterRecord } from '../../../core/model/common.model';
import { resetTableProps } from '../../../core/utility/utility';
import { BaseTablePresenter } from '../../../shared/base-presenter/base-table.presenter';

/**
 * CopyItListPresenter
 */
@Injectable()
export class CopyItListPresenter extends BaseTablePresenter<TableProperty | TableProperty<MultiSelectFilterRecord> | CopyItList> {

  /** Table prop$ of copyItList list presenter */
  public tableProp$: Observable<TableProperty<MultiSelectFilterRecord>>;
  /** This property is used to store the CopyItLists that has been retrieved from the API. */
  public copyItLists: CopyItList[];
  /** This property is used to store CopyItList  of the selected CopyItLists */
  public selectedCopyItLists: Set<CopyItList>;
  /** This property is used to store the criteria that are selected by the user */
  public tableProperty: TableProperty;
  /** Stores the current sorting order */
  public isAscending: boolean;
  /** Stores the ID of the CopyItList that needs to be deleted */
  public copyItListId: number;
  /** This property is sue to store selected items. */
  public selectedItems: string[];  

  /** This property is used to store sortData.  */
  private sortData: CopyItListSortRecord;
  /** Table prop of CopyItListlist presenter */
  private tableProp: Subject<TableProperty<MultiSelectFilterRecord>>;
  /** Component ref of data table presentation component */
  private componentRef: ComponentRef<any>;
  /** CopyItList data of copyItList list presenter */
  private copyItListData: Subject<CopyItList[]>;
  /** This property is used to store filterData.  */
  private filterData: MultiSelectFilterRecord;

  constructor(
    public renderer: Renderer2,
    public ngZone: NgZone,
    public modalService: ConfirmationModalService,
    private factoryResolver: ComponentFactoryResolver,
    private fb: FormBuilder
  ) {
    super(modalService, renderer, ngZone)
    this.initProperty();
  }

  /** Return the copyIt Filter Form */
  public buildCopyItFilterForm(): FormGroup {
    return this.fb.group(
      {
        requestedById: [[]],
        assignedToId: [[]],
        statusId: [[]],
        clientId: [0]
      })
  };

  /**
   * used to call api for filter
   * @param filterData filter record 
   */
  public onFilterChange(filterData: MultiSelectFilterRecord): void {
    this.filterData = filterData;
    Object.keys(filterData).forEach((key: string) => {
      if (!filterData[key] && filterData[key] !== false || filterData[key] === -1) {
        delete filterData[key];
      }
    });
    this.tableProperty.filter = filterData;
    this.tableProperty = resetTableProps(this.tableProperty);
    this.setTableProperty(this.tableProperty);
  }

  /** onClientChange */
  public onClientChange(client): void {
    this.tableProperty.filter = client.clientId;
  }

  /**
   * Details action
   * @param copyItList
   * @param copyItListIndex
   * @param portalOutlets
   * @param templatePortalContent
   * @param viewContainerRef
   */
  public detailAction(
    copyItList: CopyItList, copyItListIndex: number, portalOutlets: QueryList<CdkPortalOutlet>,
    templatePortalContent: TemplateRef<{ $implicit: CopyItList }>, viewContainerRef: ViewContainerRef
  ): void {
    const portalOutlet: CdkPortalOutlet = portalOutlets.find((item: CdkPortalOutlet, index: number) => index === copyItListIndex);
    if (portalOutlet) {
      if (!portalOutlet.portal) {
        const portal: TemplatePortal = new TemplatePortal(templatePortalContent, viewContainerRef, { $implicit: copyItList });
        portalOutlet.attachTemplatePortal(portal);
      }
      else {
        portalOutlet.detach();
      }
    }
  }

  /**
   * Sets table data
   */
  public setTableData(): void {
    if (this.tableProperty.pageNumber > 0 && this.copyItLists.length === 0) {
      // this.toaster.info('No more records found', 'alert');
      return;
    } else if (this.copyItLists.length === 0) {
      this.tableProperty = resetTableProps(this.tableProperty);
    }
    const copyItListLength: number = this.copyItLists.length;
    this.copyItListData.next(this.copyItLists);
    this.tableProperty = this.getTableProperty(this.tableProperty, copyItListLength);
    this.tableProp.next(this.tableProperty);
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
    this.copyItLists = [];
    this.selectedCopyItLists = new Set();
    this.isAscending = false;
    this.tableProperty.filter = new MultiSelectFilterRecord(null, [], [], []);
    this.sortData = new CopyItListSortRecord();
    this.selectedItems = [];
    this.tableProp = new Subject();
    this.copyItListData = new Subject();
    this.tableProp$ = this.tableProp.asObservable();
  }
}

