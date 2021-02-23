/** 
 * @author Nitesh Sharma.
 * @description Userpresenter service for Userpresentation component.
 */

import { ComponentFactoryResolver, ComponentRef, Injectable, NgZone, Renderer2 } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
// ---------------------------------------------- //
import { ConfirmationModalService, requiredFileType, TableProperty } from 'common-libs';
// ---------------------------------------------- //
import { resetTableProps } from '../../../core/utility/utility';
import { BaseTablePresenter } from '../../../shared/base-presenter/base-table.presenter';
import { BulkUploadUser, User, UserFilterRecord } from '../../user.model';
import { UserListDesktopPresentationComponent } from '../user-list-presentation/user-list-desktop-presentation/user-list-desktop.presentation';

/**
 * UserListPresenter
 */
@Injectable()
export class UserListPresenter extends BaseTablePresenter<TableProperty | TableProperty<UserFilterRecord> | User>{

  /** This property is used for subscribe the value of subject  isCheckAll */
  public isCheckAll$: Observable<boolean>;
  /** Table prop$ of user list presenter */
  public tableProp$: Observable<TableProperty<UserFilterRecord>>;
  /** This property is used to store the Users that has been retrieved from the API. */
  public users: User[];
  /** This property is used to store the criteria that are selected by the user */
  public tableProperty: TableProperty;
  /** Stores the current sorting order */
  public isAscending: boolean;
  /** The message that will be shown in template when no record found */
  public message: string;
  /** Stores the ID of the User that needs to be deleted */
  public userId: number;
  /** This property is used for subscribing the value of subject saveUser */
  public saveUser$: Observable<User>;
  /** set it true when user clicks on add button */
  public isAddUser: boolean;
  /** Bulk upload data observable */
  public uploadUsers$: Observable<BulkUploadUser>;

  /** This is used for save user info object */
  private saveUser: Subject<User>;
  /** Table prop of Userlist presenter */
  private tableProp: Subject<TableProperty<UserFilterRecord>>;
  /** Component ref of data table presentation component */
  private componentRef: ComponentRef<UserListDesktopPresentationComponent>;
  /** User data of user list presenter */
  private userData: Subject<User[]>;
  /** Bulk upload data */
  private uploadUsers: Subject<BulkUploadUser>;

  constructor(
    public renderer: Renderer2,
    public ngZone: NgZone,
    public modalService: ConfirmationModalService,
    private factoryResolver: ComponentFactoryResolver,
    private fb: FormBuilder,
    private toast: ToastrService
  ) {
    super(modalService, renderer, ngZone)
    this.initProperty();
  }

  /**
   * Sets table data
   */
  public setTableData(): void {
    this.isAddUser = false;

    if (this.tableProperty.pageNumber > 0 && this.users.length === 0) {
      // this.toaster.info('No more records found', 'alert');
      return;
    } else if (this.users.length === 0) {
      // this.tableProperty.pageNumber = 0;
      this.tableProperty = resetTableProps(this.tableProperty);
    }
    const userLength: number = this.users.length;
    this.userData.next(this.users);
    this.tableProperty = this.getTableProperty(this.tableProperty, userLength);
    this.tableProp.next(this.tableProperty);
  }

  /**
   * Filters apply
   * @param filter 
   * @returns true if apply 
   */
  public filterApply(filter: UserFilterRecord): boolean {
    if (filter) {
      return true;
    } else {
      return false;
    }
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
  public addUserForm(userList: User[]): void {
    this.isAddUser = true;
    for (const item of userList) {
      item.isEdit = false;
    }
  }

  /**
   * it will show the user form for edit
   * @param user this is a user object
   */
  public editUserForm(user: User, userList: User[]): void {
    this.isAddUser = false;
    user.isEdit = true;
    for (const item of userList) {
      if (item.userId !== user.userId) {
        item.isEdit = false;
      }
    }
  }

  /**
   * it will hide the form on cancel click
   * @param user this is a user object
   */
  public cancelUserForm(user?: User): void {
    if (user) {
      user.isEdit = false;
    } else {
      this.isAddUser = false;
    }
  }

  /**
   * used to call api for filter
   * @param filterData filter record 
   */
  public onFilterChange(filterData: UserFilterRecord): void {
    Object.keys(filterData).forEach((key: string) => {
      if (!filterData[key] && filterData[key] !== false || filterData[key] === -1) {
        delete filterData[key];
      }
    });
    this.tableProperty.filter = filterData;
    this.tableProperty = resetTableProps(this.tableProperty);
    this.setTableProperty(this.tableProperty);
  }

  /** Generate form for bulk uploading users */
  public getBulkUploadForm(): FormGroup {
    return this.fb.group({
      clientId: [null, [Validators.required]],
      userImportFile: [null, [requiredFileType(['xlsx'])]]
    })
  }

  /** On file selection */
  public onUserUploadFileChange(event: Event, control: AbstractControl): void {
    if (event.target['value'] !== '') {
      const file: File = event.target['files'] && (event.target['files'] as FileList).item(0);
      control.patchValue(file);
      event.target['value'] = null;
    }
  }

  /** Validate Bulk upload controls */
  public validateBulkUpload(form: FormGroup): void {
    const userImportFile: AbstractControl = form.controls['userImportFile'];
    if (userImportFile.errors && userImportFile.errors.requiredFileType) {
      this.toast.error('Please select valid excel file.')
    } else {
      this.uploadUsers.next(form.getRawValue());
    }
  }

  /** Initializes default properties for the component */
  private initProperty(): void {
    this.users = [];
    this.isAscending = false;
    this.tableProperty.filter = { isActive: true };
    this.tableProperty.filter.isActive = true;
    this.tableProp = new Subject();
    this.userData = new Subject();
    // to overwrite setTableProp from parent
    this.setTableProp = new Subject();
    this.setTableProp$ = this.setTableProp.asObservable();
    this.tableProp$ = this.tableProp.asObservable();
    this.saveUser = new Subject<User>();
    this.saveUser$ = this.saveUser.asObservable();
    this.uploadUsers = new Subject<BulkUploadUser>();
    this.uploadUsers$ = this.uploadUsers.asObservable();
  }
}

