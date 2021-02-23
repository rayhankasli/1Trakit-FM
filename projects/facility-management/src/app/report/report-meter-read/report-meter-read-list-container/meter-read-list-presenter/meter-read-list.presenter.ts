/** 
 * @author Rayhan Kasli.
 * @description MeterReadpresenter service for MeterReadpresentation component.
 */

import { 
  Injectable, QueryList, Renderer2, NgZone } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
// ---------------------------------------------- //
import { TableProperty, SortingOrder, SortingOrderDirective } from 'common-libs';
import { MeterRead } from '../../report-meter-read.model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { FilterObject } from '../../../report-model';
import { BaseTablePresenter } from 'projects/facility-management/src/app/shared/base-presenter/base-table.presenter';
import { FleetReports } from 'projects/facility-management/src/app/core/base-classes/fleet-report-base';

/**
 * MeterReadListPresenter
 */
@Injectable()
export class MeterReadListPresenter extends FleetReports {


  /** Table prop$ of meterRead list presenter */
  public tableProp$: Observable<TableProperty>;

  /** This property is used to store the MeterReads that has been retrieved from the API. */
  public meterReads: MeterRead[];

  /** This property is used to store the criteria that are selected by the user */
  public tableProperty: TableProperty;

  /** Stores the ID of the MeterRead that needs to be deleted */
  public meterReadId: number;

  /** This property is sue to store selected items. */
  public selectedItems: string[];

  /** This property is used to store searchText . */
  public searchText: string;
  /** previousData to store previousData */
  public previousData: MeterRead[] = [];
  /** newMeterReads$ to store newMeterReads data */
  public newMeterReads$: Observable<MeterRead[]>;
  /** totalBwCopies store total count black and white copy  */
  public totalBwCopies: number;
  /** totalBwCost store total of black and white cost  */
  public totalBwCost: number;
  /** totalColorCopies store total count color copy */
  public totalColorCopies: number;
  /** totalBwCost store total of color cost */
  public totalColorCost: number
  /** preserveFilter store filter data */
  public preserveFilter: FilterObject;


  /** This property is used to store sortData.  */
  private newMeterReads: Subject<MeterRead[]>;

  /** Table prop of MeterReadlist presenter */
  private tableProp: Subject<TableProperty>;

  /** MeterRead data of meterRead list presenter */
  private meterReadData: Subject<MeterRead[]>;

  private clientId: number;

  private data: MeterRead[] = [];

  private filterData: FilterObject;

  constructor(
    public renderer: Renderer2,
    public ngZone: NgZone,
    public fb: FormBuilder,
    private datePipe: DatePipe
  ) {
    super(fb)
    this.initProperty();
  }

  /**
   * This method is invoked when the user performs a global search. It resets the selected rows, updates the criteria
   * and then gets the new list of Userbased on updated criteria.
   * @param searchTerm The search string that has been searched by the user
   */
  public onMeterReadSearch(searchTerm: string, clientId: number, filterForm): void {
      if (this.searchText === searchTerm) { return; }
      this.tableProperty.search = searchTerm;
      this.searchText = searchTerm;
      this.tableProperty = { ...this.tableProperty, pageNumber: 1, pageLimit: 10 }
      this.tableProperty.filter = this.getFilterObject(clientId, filterForm);
      this.setTableProperty(this.tableProperty);
  }

  /**
   * This method is invoked when the user clicks on sorting icons. It sets the sort related criteria and queries the server
   * to get the updated list of MeterReads.
   * @param column The column on which sorting needs to be performed. 
   * @param sortingOrder The sort order by which the column needs to be sorted.
   */
  public onMeterReadSortOrder(column: string, sortingOrder: SortingOrder, sortingColumns: QueryList<SortingOrderDirective>, meter: MeterRead): void {
    this.tableProperty.sort = column;
    this.tableProperty.order = sortingOrder;
    this.ngZone.runOutsideAngular(() => {
      sortingColumns.forEach((sortingColumn: SortingOrderDirective) => {
        if (sortingColumn.column !== column) {
          this.renderer.removeClass(sortingColumn.elementRef.nativeElement, 'sort-asc');
          this.renderer.removeClass(sortingColumn.elementRef.nativeElement, 'sort-desc');
        }
      });
    })
    let item: MeterRead = this.data.find((e: MeterRead)=> e.assetId === meter.assetId);
    if(item) {
      this.tableProperty = { ...this.tableProperty, pageNumber: 0, pageLimit: meter.meterReadDetail.length }
    } else {
      this.tableProperty.pageNumber = 0;
    }
    this.filterData.assets = [meter.assetId];
    this.tableProperty.filter = { ...this.filterData };
    this.setTableProperty(this.tableProperty);
  }

  /** Get fleet list by selected filter */
  public getTableDataBySearch(clientId: number, filterForm: FormGroup): void {
    this.tableProperty = new TableProperty();
    this.tableProperty.search = this.searchText;
    this.tableProperty.filter = this.getFilterObject(clientId, filterForm)
    this.setTableProperty(this.tableProperty);
  }

  /** scrollHandalingEvents */
  public scrollHandalingEvents(meterRead: MeterRead): void {
    if (meterRead) {
      let item: MeterRead = this.data.find((e: MeterRead)=> e.assetId === meterRead.assetId);
      if(item) {
        this.data.forEach((element: MeterRead)=>{
          if (element.assetId === item.assetId) {
            element.pageNumber++;
            this.tableProperty = { ...this.tableProperty, pageNumber: element.pageNumber, pageLimit: 10 }
          }
        });
      } else {
        this.data.push({...meterRead, pageNumber: 1});
        this.tableProperty = { ...this.tableProperty, pageNumber: 1, pageLimit: 10 }
      }
      this.filterData.assets = [meterRead.assetId];
      this.tableProperty.filter = this.filterData ;
      this.setTableProperty(this.tableProperty);
    }

  }

  /** setMeterReadData */
  public setMeterReadData(meterRead: MeterRead[]): void {
    if(meterRead) {
      if(this.previousData.length <= 0) {
        meterRead.forEach((meter: MeterRead)=>{
          meter.pageNumber = 0;
        });
        this.previousData = meterRead;
      } else {
        this.previousData.forEach((previous: MeterRead,index: number)=>{
          meterRead.forEach((element: MeterRead)=>{
            if(previous.assetId === element.assetId && (
              (this.tableProperty.sort && previous.pageNumber === this.tableProperty.pageNumber && this.tableProperty.search) || 
              (this.tableProperty.sort && previous.pageNumber === this.tableProperty.pageNumber) || 
              (previous.pageNumber === this.tableProperty.pageNumber && this.tableProperty.search))) {
              if (element.meterReadDetail.length <= 0) {
                this.previousData[index].meterReadDetail = [];
              } else {
                this.previousData[index].meterReadDetail = element.meterReadDetail;
              } 
            } else if ((previous.assetId === element.assetId && (this.tableProperty.sort && previous.pageNumber !== this.tableProperty.pageNumber)) ||
                        previous.assetId === element.assetId) {
                  this.previousData[index].meterReadDetail = [...this.previousData[index].meterReadDetail,...element.meterReadDetail];
            }
          });
        });
      }
      let totalBwCopies: number[] = this.previousData.map((e: MeterRead) => e.totalBwCopies);
      let totalColorCopies: number[]  = this.previousData.map((e: MeterRead) => e.totalColorCopies)
      let totalBwCost: number[]  = this.previousData.map((e: MeterRead) => e.totalBwCost);
      let totalColorCost: number[]  = this.previousData.map((e: MeterRead) => e.totalColorCost);
      this.totalBwCopies = totalBwCopies.reduce((a: number, b: number) => a + b, 0); 
      this.totalColorCopies = totalColorCopies.reduce((a: number, b: number) => a + b, 0); 
      this.totalBwCost = totalBwCost.reduce((a: number, b: number) => a + b, 0); 
      this.totalColorCost = totalColorCost.reduce((a: number, b: number) => a + b, 0); 
      this.newMeterReads.next(this.previousData);
    }
  }

  /**
   * Sets table data
   */
  public setTableData(): void {
    if (this.tableProperty.pageNumber > 0 && this.meterReads.length === 0) {
      // this.toaster.info('No more records found', 'alert');
      return;
    } else if (this.meterReads.length === 0) {
      this.tableProperty.pageNumber = 0;
    }
    const meterReadLength: number = this.meterReads.length;
    this.meterReadData.next(this.meterReads);
    this.tableProperty = this.getTableProperty(this.tableProperty, meterReadLength);
    this.tableProp.next(this.tableProperty);
  }

  /**
   * Sorts apply
   * @param sort 
   * @returns true if apply 
   */
  public sortApply(sort: string): boolean {
    if (sort) { return true; } else {
      return false;
    }
  }

  /** Set Client Id */
  public clientChange(clientId: number, formData: FormGroup): void {
    if (clientId > 0) {
      this.clientId = clientId;
      this.tableProperty = new TableProperty();
      this.tableProperty.filter = this.getFilterObject(clientId,formData);
      this.setTableProperty(this.tableProperty);
    }
  }



  /** get selected ids and returen filtered object */
  public getFilterObject(clientId: number, filterForm): FilterObject {
    this.tableProperty.pageNumber = 0;
    this.data = [];
    this.previousData = [];
    let filterObj: FilterObject = this.filterObject(clientId,filterForm);
    this.filterData = filterObj;
    this.preserveFilter = filterObj;
    return filterObj;
  }

  /** filterObject */
  public filterObject(clientId: number, filterForm): FilterObject {
    let filterObj: FilterObject = {
      'year': filterForm.year ? filterForm.year : '',
      'clientId': clientId,
      'months': filterForm.months !== null ? filterForm.months : [],
      'assets': filterForm.fleets !== null ? filterForm.fleets : []
    }
    return filterObj;
  }

  /** Initializes default properties for the component */
  private initProperty(): void {
    this.meterReads = [];
    this.tableProperty = new TableProperty();
    this.selectedItems = [];
    this.searchText = '';
    this.tableProp = new Subject();
    this.meterReadData = new Subject();
    this.tableProp$ = this.tableProp.asObservable();
    this.newMeterReads = new Subject();
    this.newMeterReads$ = this.newMeterReads.asObservable();
  }
}

