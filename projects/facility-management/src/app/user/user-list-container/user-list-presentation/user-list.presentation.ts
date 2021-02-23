
/**
 * @author Nitesh Sharma
 * @description This is data table presentation component.To represent get data from container component and render to dom.
 */
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, HostBinding, Inject, Input, NgZone, OnDestroy, OnInit, Output, QueryList, ViewChild, ViewChildren, ViewContainerRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { filter } from 'rxjs/operators';
import { takeUntil } from 'rxjs/operators/takeUntil';
import { Subject } from 'rxjs/Subject';
// ---------------------------------------------------------- //
import { pageCount, SortingOrderDirective, TableProperty } from 'common-libs';
// ---------------------------------------------------------- //
import { Permission } from '../../../core/enums/role-permissions.enum';
import { bulkUploadAcceptFiles } from '../../../core/utility/constants';
import { BulkUploadUser, CustomerListStatus, User, UserFilterRecord, UserListResult } from '../../user.model';
import { UserListPresentationBase } from '../user-list-presentation-base/user-list.presentation.base';
import { UserListPresenter } from '../user-list-presenter/user-list.presenter';

/**
 * UserListPresentationComponent
 */
@Component({
  selector: 'trackit-user-list-ui',
  templateUrl: './user-list.presentation.html',
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [UserListPresenter]
})
export class UserListPresentationComponent extends UserListPresentationBase implements OnInit, AfterViewInit, OnDestroy {

  /** This property is used for add class host element */
  @HostBinding('class') public class: string;
  /** This property is used for get data from container component */
  @Input() public set baseResponse(value: UserListResult) {
    if (value) {
      this._baseResponse = value;
      this.clearOfficeData();
      this.setTableData();
    }
  };
  public get baseResponse(): UserListResult {
    return this._baseResponse;
  }

  /**
   * This enum is return users enum props.
   */
  public get userEnum(): typeof Permission.User {
    return Permission.User;
  }

  /** This property is used for emit data to container component */
  @Output() public getUser: EventEmitter<TableProperty<UserFilterRecord>>;

  /** This property is used for emit data to container component */
  @Output() public deleteUser: EventEmitter<User>;
  /** This property is used for emit save user data to container component */
  @Output() public saveUser: EventEmitter<User>;
  /** This property is used for emit download escel file to container component */
  @Output() public downloadSampleFile: EventEmitter<void>;
  /** This property is used for emit download escel file to container component */
  @Output() public bulkUploadUsers: EventEmitter<BulkUploadUser>;

  /**
   * View child of customer list presentation component
   */
  @ViewChild('container', { read: ViewContainerRef, static: false }) public container: ViewContainerRef;

  /** This property is used to store QueryList of SortingOrderDirective */
  @ViewChildren(SortingOrderDirective) public sortingColumns: QueryList<SortingOrderDirective>;

  /** This property is used to store the selected Users */
  public selectedUsers: Set<User>;

  /** This property is used to store the criteria that are selected by the user */
  public tableProperty: TableProperty<UserFilterRecord>;

  /** This property is used to store the options that are available in the Page Size selection drawdown */
  public pageSize: number[];

  /** This boolean is used to indicate whether all rows are selected or not  */
  public isCheckAll: boolean;

  /** Table prop of customer list presentation component */
  public tableProp: Subject<TableProperty<UserFilterRecord>>;

  /** This property is used for checking filter applied or not. */
  public isFilterApply: boolean;
  /** based on its state user form wilm show or hide */
  public get isAddUser(): boolean {
    return this.userPresenter.isAddUser;
  }

  /** This property is used for checking sort applied or not. */
  public isSortApply: boolean;
  /** list of status for status dropdown */
  public status = CustomerListStatus;
  /** bulkUploadForm */
  public bulkUploadForm: FormGroup;
  /** File upload acceptable files */
  public readonly bulkUploadAcceptFiles: string = bulkUploadAcceptFiles;

  /** create for getter setter */
  private _baseResponse: UserListResult;

  constructor(
    public userPresenter: UserListPresenter,
    public changeDetection: ChangeDetectorRef,
    private toaster: ToastrService,
    @Inject('Window') window: Window,
    zone: NgZone) {
    super(userPresenter, changeDetection, window, zone);
    this.initProperty();
    this.class = 'd-flex flex-column h-100 overflow-hidden';
  }

  public ngOnInit(): void {
    this.userPresenter.setTableProp$.pipe(takeUntil(this.destroy)).subscribe((tableProperty: TableProperty) => {
      this.getUser.emit(tableProperty);
      this.tableProperty = tableProperty;
      this.bulkUploadForm.get('clientId').patchValue(tableProperty.filter.clientId || null);
    });
    this.userPresenter.deleteRecord$.pipe(takeUntil(this.destroy)).subscribe((user: User) => { this.deleteUser.emit(user) });
    this.userPresenter.tableProp$.pipe(takeUntil(this.destroy)).subscribe((value: TableProperty<UserFilterRecord>) => {
      this.tableProperty = value;
    });
    this.userPresenter.saveUser$.pipe(takeUntil(this.destroy)).subscribe((value: User) => {
      this.saveUser.emit(value);
    });
    this.userPresenter.uploadUsers$.pipe(takeUntil(this.destroy)).subscribe((data: BulkUploadUser) => {
      this.bulkUploadUsers.emit(data);
      this.bulkUploadForm.reset({ clientId: this.tableProperty.filter.clientId }, { emitEvent: false });
    });
  }

  /**
   * after view init
   */
  public ngAfterViewInit(): void {
    this.bulkUploadForm.valueChanges.pipe(
      filter((data: BulkUploadUser) => data.clientId !== null && data.userImportFile !== null),
    ).subscribe((d: BulkUploadUser) => this.userPresenter.validateBulkUpload(this.bulkUploadForm));
  }

  /**
   * Sets table data
   */
  public setTableData(): void {
    this.isFilterApply = this.userPresenter.filterApply(this.tableProperty.filter);
    this.isSortApply = this.userPresenter.sortApply(this.tableProperty.sort);
    this.userPresenter.users = this._baseResponse.userList;
    this.userPresenter.setTableData();
  }

  /**
   * when user clicks on add button
   */
  public addUserForm(): void {
    this.userPresenter.addUserForm(this._baseResponse && this._baseResponse.userList || []);
    this.changeDetection.detectChanges();
  }

  /**
   * when user will clicks on edit button
   * @param user this is a user data object
   */
  public editUserForm(user: User): void {
    this.userPresenter.editUserForm(user, this._baseResponse.userList);
    this.changeDetection.detectChanges();
  }

  /**
   * called on filter value change
   * @param filterValue filter record
   */
  public onFilterChange(filterValue: UserFilterRecord): void {
    this.userPresenter.onFilterChange(filterValue);
  }

  /** it will emit event for download sample file */
  public downloadFile(): void {
    this.downloadSampleFile.emit();
  }

  /** On file selection */
  public onFileChange(event: Event): void {
    this.userPresenter.onUserUploadFileChange(event, this.bulkUploadForm.get('userImportFile'));
  }

  /** Initializes default properties for the component */
  private initProperty(): void {
    this.selectedUsers = new Set();
    this.isCheckAll = false;
    this.tableProp = new Subject();
    this.tableProperty = new TableProperty<UserFilterRecord>();
    this.pageSize = pageCount;
    this.destroy = new Subject();
    this.getUser = new EventEmitter<TableProperty<UserFilterRecord>>(true);
    this.deleteUser = new EventEmitter<User>(true);
    this.downloadSampleFile = new EventEmitter<void>(true);
    this.bulkUploadUsers = new EventEmitter<BulkUploadUser>(true);
    this.bulkUploadForm = this.userPresenter.getBulkUploadForm();
  }
}
