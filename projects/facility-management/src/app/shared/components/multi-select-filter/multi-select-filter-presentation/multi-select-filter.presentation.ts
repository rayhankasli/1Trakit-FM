
/**
 * @author Farhin Shaikh
 * @description This is data table presentation component.To represent get data from container component and render to dom.
 */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { takeUntil } from 'rxjs/operators/takeUntil';
import { Subject } from 'rxjs/Subject';
// ---------------------------------------------------------- //
import { ClientMaster, MultiSelectFilterRecord, StatusMaster, UsersMaster } from '../../../../core/model/common.model';
import { MultiSelectFilterPresenter } from '../multi-select-filter-presenter/multi-select-filter.presenter';

/**
 * BookItListPresentationComponent
 */
@Component({
  selector: 'app-multi-select-filter-ui',
  templateUrl: './multi-select-filter.presentation.html',
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [MultiSelectFilterPresenter]
})
export class MultiSelectFilterPresentationComponent implements OnInit, OnDestroy {

  /** list of offices */
  @Input() public set clients(value: ClientMaster[]) {
    if (value) {
      this._clients = [...value];
    }
  }

  public get clients(): ClientMaster[] {
    return this._clients;
  }

  /** list of offices */
  @Input() public set client(value: number) {
    if (value) {
      this._client = value;
      if (value < 0) {
        this.onReset();
        this.isFilterApplied = false;
      }
    }
  }

  public get client(): number {
    return this._client;
  }

  /** List of assignedTo */
  @Input() public set assignedTo(list: UsersMaster[]) {
    if (list) {
      this._assignedTo = list;
    }
  }

  public get assignedTo(): UsersMaster[] {
    return this._assignedTo;
  }

  /** List of requestors */
  @Input() public set requestors(list: UsersMaster[]) {
    if (list) {
      this._requestors = list;
    }
  }

  public get requestors(): UsersMaster[] {
    return this._requestors;
  }

  /** List of status */
  @Input() public set statuses(list: StatusMaster[]) {
    if (list) {
      this._statuses = list;
    }
  }

  public get statuses(): StatusMaster[] {
    return this._statuses;
  }

  /** Multi Select Filter Form */
  @Input() public set multiSelectFilterForm(form: FormGroup) {
    this._multiSelectFilterForm = form;
  }

  public get multiSelectFilterForm(): FormGroup {
    return this._multiSelectFilterForm;
  }

  @Output() public filterData: EventEmitter<MultiSelectFilterRecord>;
  @Output() public searchTerm: EventEmitter<string>;

  /** Status list drop-down setting */
  public statusDropSettings: {};
  /** AssignTo list drop-down setting */
  public assignToDropSettings: {};
  /** requestedBy list settings */
  public requestedByDropSettings: {};
  /** Wether filter apply or not */
  public isFilterApplied: boolean;
  /** search field control object */
  public searchField: FormControl = new FormControl('');

  /** list of clients */
  protected _clients: ClientMaster[];
  /** list of clients */
  protected _client: number;
  /** AssignedTo List for filter */
  protected _assignedTo: UsersMaster[];
  /** Requestor List for filter */
  protected _requestors: UsersMaster[];
  /** Status List for filter */
  protected _statuses: StatusMaster[];
  /** multiSelect form instance */
  private _multiSelectFilterForm: FormGroup;

  /** destroy  */
  private destroy: Subject<boolean>;

  constructor(
    public multiSelectFilterPresenter: MultiSelectFilterPresenter,
    public changeDetection: ChangeDetectorRef
  ) {
    this.initProperty();
  }

  public ngOnInit(): void {
    this.handleDropdownChange();
    this.handleSearch();
  }

  /** Reset multi-select filter */
  public onReset(): void {
    this.isFilterApplied = false;
    this.multiSelectFilterPresenter.resetControls(this.searchField, this.multiSelectFilterForm);
  }

  /** destroy */
  public ngOnDestroy(): void {
    this.destroy.next(true);
    this.destroy.unsubscribe();
  }

  /** subscribe to filter dropdown change */
  private handleDropdownChange(): void {
    this.multiSelectFilterForm.valueChanges.pipe(takeUntil(this.destroy)).subscribe((filter: MultiSelectFilterRecord) => {
      this.filterData.emit(filter);
      this.isFilterApplied = this.multiSelectFilterPresenter.checkFilterApplied(this.searchField.value, filter);
    });
  }

  /** subscribe to search control */
  private handleSearch(): void {
    this.searchField.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged()).subscribe((searchText: string) => {
        this.isFilterApplied = this.multiSelectFilterPresenter.checkFilterApplied(searchText, this.multiSelectFilterForm.getRawValue());
        this.searchTerm.emit(this.searchField.value.trim());
      });
  }

  /** Initializes default properties for the component */
  private initProperty(): void {
    this.multiSelectFilterForm = this.multiSelectFilterPresenter.buildForm();
    this.destroy = new Subject();
    this.statusDropSettings = this.multiSelectFilterPresenter.getSettings('Status', 'statusId');
    this.assignToDropSettings = this.multiSelectFilterPresenter.getSettings('Assigned To', 'userId');
    this.requestedByDropSettings = this.multiSelectFilterPresenter.getSettings('Requested By', 'userId');
    this.filterData = new EventEmitter();
    this.searchTerm = new EventEmitter();
  }
}
