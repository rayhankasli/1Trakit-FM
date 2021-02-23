/**
 * @author Enter Your Name Here.
 * @description BookItpresenter service for BookItpresentation component.
 */

import { Injectable, Renderer2, NgZone, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
// ---------------------------------------------- //
import { ConfirmationModalService, TableProperty } from 'common-libs';
// ---------------------------------------------- //
import { BookIt } from '../../models/bookit.model';
import { MultiSelectFilterRecord } from '../../../core/model/common.model';
import { resetTableProps } from '../../../core/utility/utility';
import { BaseTablePresenter } from '../../../shared/base-presenter/base-table.presenter';

/**
 * BookItListPresenter
 */
@Injectable()
export class BookItListPresenter extends BaseTablePresenter<TableProperty | TableProperty<MultiSelectFilterRecord> | BookIt> implements OnDestroy {

  /** Table prop$ of bookIt list presenter */
  public tableProp$: Observable<TableProperty>;

  /** This property is used to store the BookIts that has been retrieved from the API. */
  public bookIts: BookIt[];

  /** This property is used to store BookIt  of the selected BookIts */
  public selectedBookIts: Set<BookIt>;

  /** This property is used to store the criteria that are selected by the user */
  public tableProperty: TableProperty;

  /** Stores the current sorting order */
  public isAscending: boolean;

  /** Stores the ID of the BookIt that needs to be deleted */
  public bookItId: number;

  /** This property is sue to store selected items. */
  public selectedItems: string[];
  /** store filter data */
  public filterData: MultiSelectFilterRecord;


  /** Table prop of BookItlist presenter */
  private tableProp: Subject<TableProperty>;
  /** BookIt data of bookIt list presenter */
  private bookItData: Subject<BookIt[]>;
  /** create for unsubscribe observable on page destroy */
  private destroy: Subject<void>;

  constructor(
    public renderer: Renderer2,
    public ngZone: NgZone,
    public modalService: ConfirmationModalService,
    private fb: FormBuilder
  ) {
    super(modalService, renderer, ngZone)
    this.initProperty();
  }

  /** lifecycle hook for page destroy */
  public ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }


  /** create filter form */
  public buildBookItFilterForm(): FormGroup {
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
    // if client id different from previous one then clear all the filtered parameter
    if (this.filterData && this.filterData.clientId !== filterData.clientId) {
      filterData = { clientId: filterData.clientId };
    }
    this.filterData = { ...filterData };
    Object.keys(filterData).forEach((key: string) => {
      if (!filterData[key] && filterData[key] !== false || filterData[key] === -1) {
        delete filterData[key];
      }
    });
    this.tableProperty.filter = filterData;
    this.tableProperty = resetTableProps(this.tableProperty);
    this.setTableProperty(this.tableProperty);
  }


  /**
   * Sets table data
   */
  public setTableData(): void {
    if (this.tableProperty.pageNumber > 0 && this.bookIts.length === 0) {
      return;
    } else if (this.bookIts.length === 0) {
      this.tableProperty.pageNumber = 0;
    }
    const bookItLength: number = this.bookIts.length;
    this.bookItData.next(this.bookIts);
    this.tableProperty = this.getTableProperty(this.tableProperty, bookItLength);
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
    this.destroy = new Subject<void>();
    this.bookIts = [];
    this.isAscending = false;
    this.tableProperty.filter = new MultiSelectFilterRecord(null, [], [], []);
    this.tableProp = new Subject();
    this.bookItData = new Subject();
    this.tableProp$ = this.tableProp.asObservable();
  }
}

