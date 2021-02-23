/** 
 * @author Shahbaz Shaikh.
 * @description ChargeBackListpresenter service for ChargeBackListpresentation component.
 */

import { Injectable, QueryList, Renderer2, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
// ---------------------------------------------- //
import { TableProperty, SortingOrder, SortingOrderDirective } from 'common-libs';
// ---------------------------------------------- //
import { ReportDateRangeFilterBasePresenter } from '../../../../../core/base-classes/report-date-range-filter.base';
import { onSorting } from '../../../../../core/utility/utility';
import { FilterRecord, ChargeBackData, ChargeBack } from '../../chargeback.model';

/**
 * ChargeBackListListPresenter
 */
@Injectable()
export class ChargeBackListPresenter extends ReportDateRangeFilterBasePresenter {

  /** isFormSubmitted */
  public isFormSubmitted: boolean;

  /** Table prop$ of chargeBackList list presenter */
  public tableProp$: Observable<TableProperty>;

  /** This property is used to store the ChargeBackLists that has been retrieved from the API. */
  public chargeBackLists: ChargeBackData[];

  /** This property is used to store ChargeBackList  of the selected ChargeBackLists */
  public selectedChargeBackLists: Set<ChargeBack>;

  /** This property is used to store the criteria that are selected by the user */
  public tableProperty: TableProperty;

  /** Table prop of ChargeBackListlist presenter */
  private tableProp: Subject<TableProperty>;

  /** ChargeBackList data of chargeBackList list presenter */
  private chargeBackListData: Subject<ChargeBackData[]>;

  /** This property is used to store filterData. */
  private filterData: FilterRecord;

  /** clientId */
  private clientId: number;

  constructor(
    private formBuilder: FormBuilder,
    public renderer: Renderer2,
    public ngZone: NgZone,
  ) {
    super()
    this.initProperty();
  }

  /**
   * This will create all the controls for the form group
   * @param schedulingDetailsFormGroup is the form group
   * @param fb is the form builder which will create the controls
   * @returns It will return the schedulingDetailsFromGroup with all the controls
   */
  public buildFilterForm(): FormGroup {
    return this.formBuilder.group({
      accountNo: [null],
      job: [null],
      startDate: [this.startDate, [Validators.required]],
      endDate: [this.endDate, [Validators.required]]
    });
  }

  /**
   * This method is invoked when the user clicks on sorting icons. It sets the sort related criteria and queries the server
   * to get the updated list of ChargeBackLists.
   * @param column The column on which sorting needs to be performed. 
   * @param sortingOrder The sort order by which the column needs to be sorted.
   */
  public onSortOrder(column: string, sortingOrder: SortingOrder, sortingColumns: QueryList<SortingOrderDirective>): void {
    this.selectedChargeBackLists = new Set();
    this.tableProperty.filter = { clientId: this.clientId, ...this.filterData };
    this.tableProperty = onSorting(this.tableProperty, column, sortingOrder, sortingColumns, this.ngZone, this.renderer)
    this.setTableProperty(this.tableProperty);
  }

  /**
   * This methos used to call api for filter
   * @param chargeBackFormGroup Get the filter form group 
   */
  public chargebackFilter(chargeBackFormGroup: FormGroup): void {
    if (chargeBackFormGroup.valid) {
      this.isFormSubmitted = false;
      let chargebackFilterData: FilterRecord = chargeBackFormGroup.value;

      this.filterData = chargebackFilterData;
      Object.keys(chargebackFilterData).forEach((key: string) => {
        if (!chargebackFilterData[key] && chargebackFilterData[key] !== false) {
          delete chargebackFilterData[key];
        }
      });
      this.tableProperty.filter = { clientId: this.clientId, ...chargebackFilterData };
      if (!this.clientId) {
        delete this.tableProperty.filter['clientId'];
      }
      this.resetchargebackTableProps();
      this.setTableProperty(this.tableProperty);
    } else {
      this.isFormSubmitted = true;
    }
  }

  /**
   * This methos is set the client id in the filter when client change
   * @param clientId Get the Client Id
   */
  public chargeBackClientChange(clientId?: number): void {
    if (clientId > 0) {
      this.clientId = clientId;
      let chargeBackFilterData: FilterRecord = { clientId: this.clientId, startDate: this.filterData.startDate, endDate: this.filterData.endDate };
      this.tableProperty.filter = chargeBackFilterData;
    } else {
      let chargeBackFilterData: FilterRecord = { startDate: this.filterData.startDate, endDate: this.filterData.endDate };
      this.tableProperty.filter = chargeBackFilterData;
    }
    this.setTableProperty(this.tableProperty);
  }

  /**
   * This method are set null end date and set start date in the mindate 
   * @param formGroup Get the chargeback filter form group
   * @param startDate Get the start date
   */
  public setChargebackStartDate(formGroup: FormGroup, startDate: Date): void {
    this.setStartDate(formGroup, startDate);
  }

  /**
   * Compare two month in charge back start and end period
   * @param tableProperty Get the table property
   */
  public compareMonth(tableProperty: TableProperty): void {
    this.setCompareMonth(tableProperty);
  }

  /**
   * Sets table data
   */
  public setTableData(): void {
    if (this.tableProperty.pageNumber > 0 && this.chargeBackLists.length === 0) {
      // this.toaster.info('No more records found', 'alert');
      return;
    } else if (this.chargeBackLists.length === 0) {
      this.tableProperty.pageNumber = 0;
    }
    const chargeBackListLength: number = this.chargeBackLists.length;
    this.chargeBackListData.next(this.chargeBackLists);
    this.tableProperty = this.getTableProperty(this.tableProperty, chargeBackListLength);
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

  /** Initializes default properties for the charge back component */
  private initProperty(): void {
    this.filterData = { startDate: this.startDate, endDate: this.endDate };
    this.chargeBackLists = [];
    this.selectedChargeBackLists = new Set();
    this.tableProp = new Subject();
    this.chargeBackListData = new Subject();
    this.tableProperty.filter = new FilterRecord(this.clientId, [], [], this.startDate, this.endDate);
    this.tableProp$ = this.tableProp.asObservable();
  }

  /** 
   * it will reset the table property
   */
  private resetchargebackTableProps(): void {
    this.tableProperty.pageNumber = 0;
  }

}

