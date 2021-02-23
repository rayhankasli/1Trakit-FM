
/**
 * @author YOUR_NAME_HERE
 * @description This is data table presentation component.To represent get data from container component and render to dom.
 */
import {
  Component, OnInit, ViewChildren, QueryList, Input, Output, EventEmitter, ChangeDetectionStrategy, OnDestroy,
  ChangeDetectorRef, HostBinding, Inject, NgZone
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BreakpointState } from '@angular/cdk/layout';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { takeUntil } from 'rxjs/operators/takeUntil';
// ---------------------------------------------------------- //
import { TableProperty, SortingOrderDirective, pageCount } from 'common-libs';
// ---------------------------------------------------------- //
import { BookIt, BookItListResult } from '../../models/bookit.model';
import { BookItListPresenter } from '../bookit-list-presenter/bookit-list.presenter';
import { BookItListPresentationBase } from '../bookit-list-presentation-base/bookit-list.presentation.base';
import { MultiSelectFilterRecord } from '../../../core/model/common.model';
import { Permission } from '../../../core/enums/role-permissions.enum';
import { ArchiveModeService } from '../../../core/services/archive-mode/archive-mode.service';

/**
 * BookItListPresentationComponent
 */
@Component({
  selector: 'trakit-bookit-list-ui',
  templateUrl: './bookit-list.presentation.html',
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [BookItListPresenter]
})
export class BookItListPresentationComponent extends BookItListPresentationBase implements OnInit, OnDestroy {

  @HostBinding('class') public class: string;

  /** This property is used for get data from container component */
  @Input() public set baseResponse(bookItList: BookItListResult) {
    if (bookItList) {
      this._baseResponse = bookItList;
      this.setTableData();
    }
  };
  public get baseResponse(): BookItListResult {
    return this._baseResponse;
  }

  /** This property is used for emit data to container component */
  @Output() public getBookIt: EventEmitter<TableProperty>;

  /** This property is used for emit data to container component */
  @Output() public deleteBookIt: EventEmitter<BookIt>;

  /** This property is used to store QueryList of SortingOrderDirective */
  @ViewChildren(SortingOrderDirective) public sortingColumns: QueryList<SortingOrderDirective>;

  /** This property is used to store the selected bookItList */
  public selectedbookItList: Set<BookIt>;

  public clientForm: FormGroup;

  public multiSelectFilterForm: FormGroup;

  public filterClientData: EventEmitter<MultiSelectFilterRecord>;

  /** This property is used to store the criteria that are selected by the user */
  public tableProperty: TableProperty;

  /** This property is used to store the options that are available in the Page Size selection drawdown */
  public pageSize: number[];

  /** Table prop of customer list presentation component */
  public tableProp: Subject<TableProperty>;

  /** isMobile property for mobile screen or not */
  public isMobile: Observable<BreakpointState>;

  /** This property is used for checking filter applied or not. */
  public isFilterApply: boolean;

  /** This property is used for checking sort applied or not. */
  public isSortApply: boolean;

  public get bookItPermissions(): typeof Permission.BookIt {
    return Permission.BookIt;
  }

  /** create for getter setter */
  private _baseResponse: BookItListResult;

  constructor(
    public bookItPresenter: BookItListPresenter,
    public changeDetection: ChangeDetectorRef,
    public archiveModeService: ArchiveModeService,
    @Inject('Window') window: Window,
    zone: NgZone
  ) {
    super(bookItPresenter, changeDetection, archiveModeService, window, zone);
    this.initProperty();
    this.class = 'd-flex flex-column h-100 overflow-hidden';
  }

  public ngOnInit(): void {
    this.bookItPresenter.setTableProp$.pipe(takeUntil(this.destroy)).subscribe((tableProperty: TableProperty) => {
      this.getBookIt.emit(tableProperty);
      this.tableProperty = tableProperty;
    });
    this.bookItPresenter.deleteRecord$.pipe(takeUntil(this.destroy)).subscribe((bookIt: BookIt) => { this.deleteBookIt.emit(bookIt) });
    this.bookItPresenter.tableProp$.subscribe((value: TableProperty) => {
      this.tableProperty = value;
    });

    /** On filter form changes */
    this.multiSelectFilterForm.valueChanges.pipe(takeUntil(this.destroy)).subscribe((filter: MultiSelectFilterRecord) => {
      this.onFilterChange({ ...filter });
    });

    // clear other filter which are dependent on clientId
    this.multiSelectFilterForm.get('clientId').valueChanges.pipe(takeUntil(this.destroy)).subscribe(() => {
      this.multiSelectFilterForm.patchValue({ requestedById: [], assignedToId: [], statusId: [] });
    });
  }

  /**
   * used to call api for filter
   * @param filterData filter record
   */
  public onFilterChange(filterData: MultiSelectFilterRecord): void {
    this.bookItPresenter.onFilterChange(filterData);
  }

  /**
   * used to call api for search records
   */
  public onSearchTerm(searchTerm: string): void {
    this.onSearch(searchTerm);
  }

  /**
   * Sets table data
   */
  public setTableData(): void {
    this.isSortApply = this.bookItPresenter.sortApply(this.tableProperty.sort);
    this.bookItPresenter.bookIts = this._baseResponse.bookItList;
    this.bookItPresenter.setTableData();
  }

  /** Initializes default properties for the component */
  private initProperty(): void {
    this.selectedbookItList = new Set();
    this.tableProp = new Subject();
    this.tableProperty = new TableProperty();
    this.pageSize = pageCount;
    this.destroy = new Subject();
    this.getBookIt = new EventEmitter<TableProperty>();
    this.deleteBookIt = new EventEmitter<BookIt>();
    this.multiSelectFilterForm = this.bookItPresenter.buildBookItFilterForm();
  }
}
