/** 
 * @author Rayhan Kasli.
 * @description Packagespresenter service for Packagespresentation component.
 */

import { Injectable, Renderer2, NgZone } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
// ---------------------------------------------- //
import { ConfirmationModalService, TableProperty } from 'common-libs';
import { Packages, PackageFilterRecord } from '../../packages.model';
import { resetTableProps } from '../../../core/utility/utility';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BaseTablePresenter } from '../../../shared/base-presenter/base-table.presenter';

/**
 * PackagesListPresenter
 */
@Injectable()
export class PackagesListPresenter extends BaseTablePresenter<TableProperty | Packages> {

  /** Table prop$ of packages list presenter */
  public tableProp$: Observable<TableProperty>;

  /** This property is used to store the Packagess that has been retrieved from the API. */
  public packagess: Packages[];

  /** This property is used to store Packages  of the selected Packagess */
  public selectedPackagess: Set<Packages>;

  /** This property is used to store the criteria that are selected by the user */
  public tableProperty: TableProperty;

  /** Stores the current sorting order */
  public isAscending: boolean;

  /** The message that will be shown in template when no record found */
  public message: string;

  /** Stores the ID of the Packages that needs to be deleted */
  public packagesId: number;

  /** This property is sue to store selected items. */
  public selectedItems: string[];

  /** Bs config of customer form presentation component */
  public minDate: Date;

  /** isFormSubmitted */
  public isFormSubmitted: boolean;

  /** set it true when user clicks on add button */
  public isAddPackage: boolean;

  /** Table prop of Packageslist presenter */
  private tableProp: Subject<TableProperty>;

  /** Packages data of packages list presenter */
  private packagesData: Subject<Packages[]>;
  /** clientId */
  private clientId: number;

  /** Start Date */
  private startDate: Date;

  /** End Date */
  private endDate: Date;

  /** Today Date */
  private todayDate: Date;

  /** This property is used to store filterData. */
  private filterData: PackageFilterRecord;

  constructor(
    public renderer: Renderer2,
    public ngZone: NgZone,
    public modalService: ConfirmationModalService,
    private formBuilder: FormBuilder
  ) {
    super(modalService, renderer, ngZone);
    this.initProperty();
  }



  /**
   * used to call api for filter
   * @param filterData filter record 
   */
  public onFilterChange(filterData: any): void {
    Object.keys(filterData).forEach((key: string) => {
      if (!filterData[key] && filterData[key] !== false || filterData[key] === -1) {
        delete filterData[key];
      }
    });
    this.clientId = filterData > 0 ? filterData : undefined;
    this.tableProperty.filter = { clientId: this.clientId, startDate: this.startDate, endDate: this.endDate };
    this.tableProperty = resetTableProps(this.tableProperty);
    this.setTableProperty(this.tableProperty);
  }

  /**
   * Sets table data
   */
  public setTableData(): void {
    if (this.tableProperty.pageNumber > 0 && this.packagess.length === 0) {
      // this.toaster.info('No more records found', 'alert');
      return;
    } else if (this.packagess.length === 0) {
      this.tableProperty.pageNumber = 0;
    }
    const packagesLength: number = this.packagess.length;
    this.packagesData.next(this.packagess);
    this.tableProperty = this.getTableProperty(this.tableProperty, packagesLength);
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

  /**
   * it will show the add user form
   * @param user this is a user object
   */
  public addPackageForm(packageList: Packages[]): void {
    this.isAddPackage = true;
    packageList && packageList.forEach((item: Packages) => {
      item.isEdit = false;
    })
  }

  /**
   * it will show the user form for edit
   * @param user this is a user object
   */
  public editPackageForm(packages: Packages, packageList: Packages[]): boolean {
    this.isAddPackage = false;
    packages.isEdit = true;

    packageList && packageList.forEach((item) => {
      if (item.packageId !== packages.packageId) {
        item.isEdit = false;
      }
    });

    return this.isAddPackage;
  }

  /**
   * it will hide the form on cancel click
   * @param user this is a user object
   */
  public cancelPackagesForm(packages?: Packages): boolean {
    if (packages) {
      packages.isEdit = false;
    } else {
      this.isAddPackage = false;
    }
    return this.isAddPackage
  }

  /** Build Filter Form */
  public buildForm(): FormGroup {
    return this.formBuilder.group({
      startDate: [this.startDate, [Validators.required]],
      endDate: [this.endDate, [Validators.required]]
    })
  }

  /**
   * used to call api for filter
   * @param filterData filter record 
   */
  public packageFilter(formGroup: FormGroup): void {
    if (formGroup.valid) {
      this.isFormSubmitted = false;
      let filterData: PackageFilterRecord = formGroup.value;

      this.filterData = filterData;
      Object.keys(filterData).forEach((key: string) => {
        if (!filterData[key] && filterData[key] !== false) {
          delete filterData[key];
        }
      });
      this.startDate = new Date(filterData.startDate);
      this.endDate = new Date(filterData.endDate);
      this.tableProperty.filter = { clientId: this.clientId, ...filterData };
      if (!this.clientId) {
        delete this.tableProperty.filter['clientId'];
      }
      this.tableProperty = resetTableProps(this.tableProperty);
      this.setTableProperty(this.tableProperty);
    } else {
      this.isFormSubmitted = true;
    }
  }

  /** Start Date */
  public setStartDate(formGroup: FormGroup, startDate: Date): void {
    if (startDate) {
      formGroup.get('endDate').patchValue(null);
      formGroup.get('endDate').markAsTouched();
      this.minDate = startDate;
    }
  }

  /** Initializes default properties for the component */
  private initProperty(): void {
    this.todayDate = new Date();
    this.startDate = new Date(this.todayDate.getFullYear(), this.todayDate.getMonth(), 1);
    this.endDate = new Date(this.todayDate.getFullYear(), this.todayDate.getMonth() + 1, 0);
    this.filterData = { startDate: this.startDate, endDate: this.endDate };
    this.minDate = this.startDate;
    this.packagess = [];
    this.selectedPackagess = new Set();
    this.isAscending = false;
    this.tableProperty = new TableProperty<PackageFilterRecord>();
    this.tableProperty.filter = new PackageFilterRecord(this.clientId, this.startDate, this.endDate);
    this.selectedItems = [];
    this.tableProp = new Subject();
    this.packagesData = new Subject();
    this.tableProp$ = this.tableProp.asObservable();
  }
}

