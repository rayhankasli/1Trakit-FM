
/**
 * @author Rayhan Kasli
 * @description This is data table presentation component.To represent get data from container component and render to dom.
 */
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef, Component, EventEmitter,
  HostBinding, Inject, Input, NgZone, OnDestroy, OnInit, Output, QueryList,
  ViewChild, ViewChildren,
  ViewContainerRef
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
// ---------------------------------------------------------- //
import { pageCount, SortingOrderDirective, TableProperty } from 'common-libs';
import { takeUntil } from 'rxjs/operators/takeUntil';
import { Subject } from 'rxjs/Subject';
import { PackageFilterRecord, Packages } from '../../packages.model';
import { PackagesListPresentationBase } from '../packages-list-presentation-base/packages-list.presentation.base';
import { PackagesListPresenter } from '../packages-list-presenter/packages-list.presenter';
import { Permission } from '../../../core/enums/role-permissions.enum'
import { AuthPolicyService } from 'auth-policy';
import { ArchiveModeService } from '../../../core/services/archive-mode/archive-mode.service';

/**
 * PackagesListPresentationComponent
 */
@Component({
  selector: 'app-packages-list-ui',
  templateUrl: './packages-list.presentation.html',
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [PackagesListPresenter]
})
export class PackagesListPresentationComponent extends PackagesListPresentationBase implements OnInit, OnDestroy {

  /** This property is used for add class host element */
  @HostBinding('class') public class: string;
  /** clientId */
  @Input() public set clientId(clientId: PackageFilterRecord) {
    if (clientId) {
      this.onFilterChange(clientId);
      this.packagesPresenter.cancelPackagesForm();
    }
  }

  /** This property is used for get data from container component */
  @Input() public set baseResponse(baseResponse: any) {
    if (baseResponse) {
      this._baseResponse = baseResponse;
      this.setTableData();
    }
  };
  public get baseResponse(): any {
    return this._baseResponse;
  }

  /** This property is used for get delete record or not. */
  @Input() public set isDeleted(response: boolean) {
    if (response) {
      this.changeDetection.detectChanges();
      this.getPackages.emit(this.tableProperty);
    }

  }

  /** This property is used for emit data to container component */
  @Output() public getPackages: EventEmitter<TableProperty>;
  /** This property is used for emit data to container component */
  @Output() public deletePackages: EventEmitter<Packages>;
  /** This property is used for emit data to container component */
  @Output() public masterData: EventEmitter<void>;

  /**
   * View child of customer list presentation component
   */
  @ViewChild('container', { read: ViewContainerRef, static: true }) public container: ViewContainerRef;

  /** This property is used to store QueryList of SortingOrderDirective */
  @ViewChildren(SortingOrderDirective) public sortingColumns: QueryList<SortingOrderDirective>;

  /** This property is used to store the selected Packagess */
  public selectedPackagess: Set<Packages>;

  /** filterFormGroup */
  public filterFormGroup: FormGroup;

  /** This property is used to store the criteria that are selected by the user */
  public tableProperty: TableProperty;

  /** This property is used to store the options that are available in the Page Size selection drawdown */
  public pageSize: number[];

  /** Table prop of customer list presentation component */
  public tableProp: Subject<TableProperty>;

  /** This property is used for checking filter applied or not. */
  public isFilterApply: boolean;

  /** for group for  */
  public clientFormControl: FormControl = new FormControl();

  /** This property is used for checking sort applied or not. */
  public isSortApply: boolean;

  /** Determines whether form submitted is ture or false */
  public get isFormSubmitted(): boolean {
    return this.packagesPresenter.isFormSubmitted;
  }

  /** This enum is return users enum props. */
  public get packagesEnum(): typeof Permission.Packages {
    return Permission.Packages;
  }


  /** Determines whether form submitted is ture or false */
  public get minDate(): Date {
    return this.packagesPresenter.minDate;
  }


  /** create for getter setter */
  private _baseResponse: any;

  constructor(
    public packagesPresenter: PackagesListPresenter,
    public changeDetection: ChangeDetectorRef,
    public authPolicy: AuthPolicyService,
    public archiveModeService: ArchiveModeService,
    @Inject('Window') window: Window,
    public zone: NgZone
    ) {
    super(packagesPresenter, changeDetection, authPolicy, archiveModeService, window, zone);
    this.initProperty();
    this.class = 'd-flex flex-column h-100 overflow-hidden';
  }

  public ngOnInit(): void {
    this.packagesPresenter.setTableProp$.pipe(takeUntil(this.destroy)).subscribe((tableProperty: TableProperty) => {
      this.getPackages.emit(tableProperty);
      this.tableProperty = tableProperty;
    });
    this.packagesPresenter.deleteRecord$.pipe(takeUntil(this.destroy)).subscribe((packages: Packages) => { this.deletePackages.emit(packages) });
    this.packagesPresenter.tableProp$.subscribe((value: TableProperty) => {
      this.tableProperty = value;
    });

    this.filterFormGroup.get('startDate').valueChanges.subscribe((startDate: Date) => {
      if (startDate) {
        this.packagesPresenter.setStartDate(this.filterFormGroup, startDate);
      }
    });
  }

  /** addPackageForm */
  public addPackageForm(): void {
    this.masterData.emit();
    this._baseResponse && this._baseResponse.packageList && this.packagesPresenter.addPackageForm(this._baseResponse.packageList);
    this.changeDetection.detectChanges();
  }

  /** editPackage */
  public editPackage(packages: Packages): void {
    this.masterData.emit();
    this.packagesPresenter.editPackageForm(packages, this.baseResponse.packageList);
    this.changeDetection.detectChanges();
  }

  
  /**
   * Sets table data
   */
  public setTableData(): void {
    this.isSortApply = this.packagesPresenter.sortApply(this.tableProperty.sort);
    this.packagesPresenter.packagess = this.baseResponse.packageList;
    this.packagesPresenter.setTableData();
  }
  
  
  /** applyFilter */
  public applyFilter(): void {
    this.packagesPresenter.packageFilter(this.filterFormGroup);
  }

  /** onSerach */
  public onSearch(searchTerm: string): void {
    this.packagesPresenter.onSearch(searchTerm);
  }

  /** destroy */
  public ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.unsubscribe();
  }

  /**
   * called on filter value change
   * @param filterValue filter record
   */
  private onFilterChange(clientId: PackageFilterRecord): void {
    this.packagesPresenter.onFilterChange(clientId);
  }


  /** Initializes default properties for the component */
  private initProperty(): void {
    this.filterFormGroup = this.packagesPresenter.buildForm()
    this.selectedPackagess = new Set();
    this.tableProp = new Subject();
    this.tableProperty = new TableProperty();
    this.pageSize = pageCount;
    this.destroy = new Subject();
    this.getPackages = new EventEmitter<TableProperty>(true);
    this.deletePackages = new EventEmitter<Packages>(true);
    this.masterData = new EventEmitter(true);
  }
}
