/** 
 * @author Ronak Patel.
 * @description Office presenter service for Office presentation component.
 */

import { Injectable, NgZone, QueryList, Renderer2 } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
// ---------------------------------------------- //
import { ConfirmationModalComponent, ConfirmationModalService, SortingOrder, SortingOrderDirective, TableProperty } from 'common-libs';
// ---------------------------------------------- //
import { BasePresentation } from '../../../../core/base-classes/base.presentation';
import { getTableProperty, onSorting, pageSizeChange } from '../../../../core/utility/utility';
import { Office, Status } from '../../office.model';

/**
 * OfficeListPresenter
 */
@Injectable()
export class OfficeListPresenter extends BasePresentation {

  /** This property is used for subscribing the value of subject setTableProp */
  public setTableProp$: Observable<TableProperty>;

  /** This is used for user info object */
  public setTableProp: BehaviorSubject<TableProperty>;

  /** This property is used for subscribe the value of subject deleteOffice */
  public deleteOffice$: Observable<Office>;
  /** This property is used for subscribe the value of subject  isCheckAll */
  public isCheckAll$: Observable<boolean>;

  /** Table prop$ of office list presenter */
  public tableProp$: Observable<TableProperty>;

  /** This boolean is used to indicate whether all rows are selected or not */
  public isCheckAll: Subject<boolean>;

  /** This property is used to store the Offices that has been retrieved from the API. */
  public offices: Office[];

  /** This property is used to store Office  of the selected Offices */
  public selectedOffices: Set<Office>;

  /** This property is used to store the criteria that are selected by the user */
  public tableProperty: TableProperty;

  /** Stores the current sorting order */
  public isAscending: boolean;

  /** The message that will be shown in template when no record found */
  public message: string;

  /** Stores the ID of the Office that needs to be deleted */
  public officeId: number;

  /** This property is sue to store selected items. */
  public selectedItems: string[];

  /** This property is used to store searchText . */
  public searchText: string;

  /** This property for store filter record */
  public filterRecord: Status;
  /** This property is used for emit when delete Office.  */
  private deleteOffice: Subject<Office>;

  /** Table prop of Office list presenter */
  private tableProp: Subject<TableProperty>;
  /** Office data of office list presenter */
  private officeData: Subject<Office[]>;
  constructor(
    private ngZone: NgZone,
    private modalService: ConfirmationModalService,
    private renderer: Renderer2,
  ) {
    super();
    this.initProperty();
  }

  /** This method is invoke when data successfully get */
  public getTableProperty(tableProperty: TableProperty, length: number): TableProperty {
    this.tableProperty = tableProperty;
    this.tableProperty = getTableProperty(tableProperty, length);
    return this.tableProperty;
  }

  /** This method is invoke when table property change. */
  public setTableProperty(tableProperty: TableProperty): void {
    this.tableProperty = tableProperty;
    this.tableProperty.filter = this.filterRecord;
    this.setTableProp.next(this.tableProperty);
  }

  /**
   * Sets table data
   */
  public setTableData(): void {
    if (this.tableProperty.pageNumber > 0 && this.offices.length === 0) {
      return;
    } else if (this.offices.length === 0) {
      this.tableProperty.pageNumber = 0;
    }
    const officeLength: number = this.offices.length;
    this.officeData.next(this.offices);
    this.tableProperty = this.getTableProperty(this.tableProperty, officeLength);
    this.tableProp.next(this.tableProperty);
  }

  /**
   * This method is invoked when the user performs a global search. It resets the selected rows, updates the criteria
   * and then gets the new list of Floor based on updated criteria.
   * @param searchTerm The search string that has been searched by the user
   */
  public onSearch(searchTerm: string): void {

    const newTableProperty: TableProperty = new TableProperty()

    if (searchTerm) {
      this.tableProperty = newTableProperty;
      this.tableProperty.search = searchTerm;
    } else {
      this.tableProperty = newTableProperty;
    }
    if (this.searchText === searchTerm) { return; }
    this.searchText = searchTerm;
    this.setTableProperty(this.tableProperty);
  }

  /**
   * This method is invoked when the user changes the current page size.
   * @param pageSize The page number that needs to be set.
   */
  public onPageSizeChange(pageSize: number): void {
    this.tableProperty = pageSizeChange(this.tableProperty, pageSize);
    this.selectedOffices = new Set();
    this.isCheckAll.next(false);
    this.setTableProperty(this.tableProperty);
  }

  /**
   * This method is invoked when the user changes the page number from the pagination toolbar.
   * @param pageNumber The number to which the table should switch to
   */
  public onPageChange(pageNumber: number): void {
    this.tableProperty.pageNumber = pageNumber;
    this.selectedOffices = new Set();
    this.isCheckAll.next(false);
    this.setTableProperty(this.tableProperty);
  }

  /**
   * This method is invoked when the user clicks on sorting icons. It sets the sort related criteria and queries the server
   * to get the updated list of Offices.
   * @param column The column on which sorting needs to be performed. 
   * @param sortingOrder The sort order by which the column needs to be sorted.
   */
  public onSortOrder(column: string, sortingOrder: SortingOrder, sortingColumns: QueryList<SortingOrderDirective>): void {
    this.selectedOffices = new Set();
    this.tableProperty = new TableProperty();
    this.tableProperty = onSorting(this.tableProperty, column, sortingOrder, sortingColumns, this.ngZone, this.renderer)
    this.setTableProperty(this.tableProperty);
  }

  /** create for open modal when action perform */
  public openModal(office: Office): void {
    const modalInstance: ConfirmationModalComponent = this.modalService.openModal();
    modalInstance.confirmModal.subscribe((value: boolean) => {
      (value) ? this.onDelete(office) : console.log('decline conformations');
      this.modalService.closeModal();
    });
  }

  /**
   * create for delete record base on id.
   */
  public onDelete(office: Office): void {
    this.modalService.closeModal();
    this.selectedOffices = new Set()
    this.isCheckAll.next(false);
    this.deleteOffice.next(office);
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

  /** 
   * This Method is used for close the inline form
   * @param offices - list of all office
   * @param office - selected office 
   */
  public closeForm(offices: Office[], office?: Office): Office[] {
    offices && offices.filter((value: Office) => {
      if (value.isEditable) {
        value.isEditable = false;
      }
      if (office === value) {
        value.isEditable = true;
      }
    });
    return offices;
  }

  /** This methods is used for filter record base on status  */
  public onStatusChange(status: string): void {
    this.filterRecord = { status: status === 'active' ? true : false };
    this.setTableProperty(this.tableProperty);
  }

  /** Initializes default properties for the component */
  private initProperty(): void {
    this.offices = [];
    this.selectedOffices = new Set();
    this.isAscending = false;
    this.tableProperty = new TableProperty();
    this.tableProperty.filter = { status: true };
    this.filterRecord = this.tableProperty.filter;
    this.selectedItems = [];
    this.searchText = '';
    this.isCheckAll = new Subject();
    this.tableProp = new Subject();
    this.officeData = new Subject();
    this.setTableProp = new BehaviorSubject(this.tableProperty);
    this.setTableProp$ = this.setTableProp.asObservable();
    this.deleteOffice = new Subject();
    this.deleteOffice$ = this.deleteOffice.asObservable();
    this.isCheckAll$ = this.isCheckAll.asObservable();
    this.tableProp$ = this.tableProp.asObservable();
  }
}

