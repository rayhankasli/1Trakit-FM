
/**
 * @author Ronak Patel.
 * @description This is data table presentation component.To represent get data from container component and render to dom.
 */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, HostBinding, Inject, Input, NgZone, OnDestroy, OnInit, Output, QueryList, ViewChildren } from '@angular/core';
import { takeUntil } from 'rxjs/operators/takeUntil';
import { Subject } from 'rxjs/Subject';
// ---------------------------------------------------------- //
import { pageCount, SortingOrder, SortingOrderDirective, TableProperty } from 'common-libs';
// ---------------------------------------------------------- //
import { Permission } from '../../../../core/enums/role-permissions.enum';
import { City, Office, State, ToggleStatus } from '../../office.model';
import { OfficeListPresenter } from '../office-list-presenter/office-list.presenter';
import { BaseCloseSelectDropdown } from 'projects/facility-management/src/app/core/base-classes/base-close-select-dropdown';

/**
 * OfficeListPresentationComponent
 */
@Component({
  selector: 'app-office-list-ui',
  templateUrl: './office-list.presentation.html',
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [OfficeListPresenter]
})
export class OfficeListPresentationComponent extends BaseCloseSelectDropdown implements OnInit, OnDestroy {

  /** This property is used for add class host element */
  @HostBinding('class') public class: string;
  /** This property is used for get data from container component */
  @Input() public set baseResponse(baseResponse: Office[]) {
    if (baseResponse) {
      this._baseResponse = baseResponse;
      this.setTableData();
    }
  };
  public get baseResponse(): Office[] {
    return this._baseResponse;
  }

  /** This property is to set last office name */
  @Input() public set lastOffice(officeName: string) {
    this._lastOffice = officeName;
  }
  public get lastOffice(): string {
    return this._lastOffice;
  }

  /** This property is used for get data form container component */
  @Input() public set states(states: State[]) {
    if (states) {
      this._states = states;
    }
  };
  public get states(): State[] {
    return this._states;
  }

  /** This property is used for get data form container component */
  @Input() public set cites(cites: City[]) {
    if (cites) {
      this._cites = cites;
    }
  };
  public get cites(): City[] {
    return this._cites;
  }

  /**
   * This enum is return offices enum props.
   */
  public get officeEnum(): typeof Permission.Office {
    return Permission.Office;
  }

  status = ["active", "inactive"]
  /** This property is used for emit data to container component */
  @Output() public add: EventEmitter<Office>;

  /** This property is used for emit data to container component */
  @Output() public update: EventEmitter<Office>;

  /** This property is used for emit data to container component */
  @Output() public closeForm: EventEmitter<boolean>;

  /** This property is used for emit data to container component */
  @Output() public getOffice: EventEmitter<TableProperty>;

  /** This property is used for emit data to container component */
  @Output() public getStates: EventEmitter<void>;

  /** This property is used for emit data to container component */
  @Output() public getCites: EventEmitter<State>;

  /** This property is used for emit data to container component */
  @Output() public deleteOffice: EventEmitter<Office>;

  /** This property is used for emit data to container component */
  @Output() public toggleOfficeStatus: EventEmitter<ToggleStatus>;

  /** This property is used to store QueryList of SortingOrderDirective */
  @ViewChildren(SortingOrderDirective) public sortingColumns: QueryList<SortingOrderDirective>;

  /** This property is used to store the selected Offices */
  public selectedOffices: Set<Office>;

  /** This property is used to store the criteria that are selected by the user */
  public tableProperty: TableProperty;

  /** This property is used to store the options that are available in the Page Size selection drawdown */
  public pageSize: number[];

  /** This boolean is used to indicate whether all rows are selected or not  */
  public isCheckAll: boolean;

  /** Table prop of customer list presentation component */
  public tableProp: Subject<TableProperty>;

  /** This property is used for checking filter applied or not. */
  public isFilterApply: boolean;

  /** This property is used for checking sort applied or not. */
  public isSortApply: boolean;

  /** This property is used for status dropdown */
  public officeStatus: string;

  /** This property is used for form open or note */
  public formOpen: boolean;

  /** store lastOffice */
  private _lastOffice: string;

  /** create for getter setter */
  private _baseResponse: Office[];

  /** Create for getter setter */
  private _states: State[];

  /** Create for getter setter */
  private _cites: City[];
  
  constructor(
    public officePresenter: OfficeListPresenter,
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
    this.officePresenter.setTableProp$.pipe(takeUntil(this.destroy)).subscribe((tableProperty: TableProperty) => {
      this.getOffice.emit(tableProperty);
      this.tableProperty = tableProperty;
    });
    this.officePresenter.deleteOffice$.pipe(takeUntil(this.destroy)).subscribe((office: Office) => { this.deleteOffice.emit(office) });
    this.officePresenter.tableProp$.subscribe((value: TableProperty) => {
      this.tableProperty = value;
    });
  }

  /** This method is used for add form  */
  public addForm(): void {
    this.formOpen = !this.formOpen;
    this.formOpen && this.getStates.emit();
    this.closeEditForm();
  }
  /** This method is used for close add form  */
  public close(value: boolean): void {
    this.formOpen = value;
  }

  /**
   * This method is invoked when the user performs a global search. It resets the selected rows, updates the criteria
   * and then gets the new list of Floor based on updated criteria.
   * @param searchTerm The search string that has been searched by the user
   */
  public onSearch(searchTerm: string): void {
    this.officePresenter.onSearch(searchTerm);
  }
  /**
   * This method is invoked when the user changes the current page size.
   * @param pageSize The page number that needs to be set.
   */
  public onPageSizeChange(pageSize: number): void {
    this.officePresenter.onPageSizeChange(pageSize);
  }

  /**
   * This method is invoked when the user changes the page number from the pagination toolbar.
   * @param pageNumber The number to which the table should switch to
   */
  public onPageChange(pageNumber: number): void {
    this.officePresenter.onPageChange(pageNumber);
  }

  /** This method is used for get office from form presenter and pass to container */
  public addOffice(value: Office): void {
    this.formOpen = false;
    this.add.emit(value)
  }

  /** This method is used for update the office */
  public updateOffice(value: Office): void {
    this.baseResponse = this.officePresenter.closeForm(this.baseResponse);
    this.update.emit(value)
  }

  /** This method is used for get city base on selected state  */
  public onGetCites(state: State): void {
    this.getCites.emit(state);
  }

  /** This Method is used for change the status */
  public onStatusChange(status: string): void {
    this.officePresenter.onStatusChange(status);
    if (this.formOpen) { this.formOpen = false; }
  }

  /** This method is for toggle status */
  public onToggleStatus(office: Office): void {
    this.toggleOfficeStatus.emit({ id: office.officeId, status: this.officeStatus === 'active' ? false : true });
  }

  /** create for open modal when action perform */
  public openModal(office: Office): void {
    this.officePresenter.openModal(office);
  }

  /**
   * This method is invoked when the user clicks on sorting icons. It sets the sort related criteria and queries the server
   * to get the updated list of offices.
   * @param column The column on which sorting needs to be performed. 
   * @param sortingOrder The sort order by which the column needs to be sorted.
   */
  public onSortOrder(column: string, sortingOrder: SortingOrder): void {
    this.officePresenter.onSortOrder(column, sortingOrder, this.sortingColumns);
  }

  /** This method is used for edit form  */
  public openEditForm(office: Office): void {
    this.getStates.emit();
    this.formOpen = false;
    this.baseResponse = this.officePresenter.closeForm(this.baseResponse, office);
  }
  /** This method is used for close edit form */
  public closeEditForm(): void {
    this.baseResponse = this.officePresenter.closeForm(this.baseResponse);
  }

  /**
   * Sets table data
   */
  public setTableData(): void {
    this.isSortApply = this.officePresenter.sortApply(this.tableProperty.sort);
    this.officePresenter.offices = this.baseResponse;
    this.officePresenter.setTableData();
  }


  /** Initializes default properties for the component */
  private initProperty(): void {
    this.selectedOffices = new Set();
    this.isCheckAll = false;
    this.tableProp = new Subject();
    this.tableProperty = new TableProperty();
    this.pageSize = pageCount;
    this.destroy = new Subject();
    this.getOffice = new EventEmitter();
    this.deleteOffice = new EventEmitter();
    this.add = new EventEmitter();
    this.update = new EventEmitter();
    this.closeForm = new EventEmitter();
    this.getStates = new EventEmitter();
    this.getCites = new EventEmitter();
    this.officeStatus = 'active';
    this.toggleOfficeStatus = new EventEmitter();
  }
}
