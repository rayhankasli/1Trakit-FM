/**
 * @author Nitesh Sharma.
 * @description This is data table desktop presentation component.To represent data in the desktop view.
 */
import {
  Component, ChangeDetectorRef, OnInit, OnDestroy, ViewChildren, QueryList, ChangeDetectionStrategy,
  EventEmitter, Output, Input, HostBinding, Inject, NgZone
} from '@angular/core';
import { Subject } from 'rxjs/Subject';
//-----------------------------------------------------------------------------------------------------//
import { SortingOrderDirective, SortingOrder } from 'common-libs';
//-----------------------------------------------------------------------------------------------------//
import { Permission } from '../../../../core/enums/role-permissions.enum';
import { UserListPresentationBase } from '../../user-list-presentation-base/user-list.presentation.base';
import { UserListPresenter } from '../../user-list-presenter/user-list.presenter';
import { User, UserMasterData } from '../../../user.model';

/**
 * UserListDesktopPresentationComponent
 */
@Component({
  selector: 'trackit-user-list-desktop-ui',
  templateUrl: './user-list-desktop.presentation.html',
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class UserListDesktopPresentationComponent extends UserListPresentationBase implements OnInit, OnDestroy {

  /** This property is used for add class host element */
  @HostBinding('class') public class: string;
  /** This property is used to store the users that has been retrieved from the API. */
  @Input() public set userList(value: User[]) {
    if (value) {
      this._userList = value;
      this.changeDetection.detectChanges();
    }
  };

  public get userList(): User[] {
    return this._userList;
  }

  /**
   * This enum is return users enum props.
   */
  public get userEnum(): typeof Permission.User { 
    return Permission.User; 
  }

  /** based on its state user form wilm show or hide */
  @Input() public isAddUser: boolean;

  /** it wil used to emit event for edit click to parent component */
  @Output() public edit: EventEmitter<User>;
  /** This property is used to store QueryList of SortingOrderDirective */
  @ViewChildren(SortingOrderDirective) public sortingColumns: QueryList<SortingOrderDirective>;

  
  /** user list presentation base */
  private _userList: User[];

  constructor(
    public userPresenter: UserListPresenter,
    public changeDetection: ChangeDetectorRef,
    @Inject('Window') window: Window,
    zone: NgZone) {
    super(userPresenter, changeDetection, window, zone);
    this.edit = new EventEmitter<User>();
    this.destroy = new Subject();
    this.class = 'd-flex flex-column overflow-hidden';
  }

  public ngOnInit(): void {
  }

  /**
   * This method is invoked when the user clicks on sorting icons. It sets the sort related criteria and queries the server
   * to get the updated list of users.
   * @param column The column on which sorting needs to be performed. 
   * @param sortingOrder The sort order by which the column needs to be sorted.
   */
  public onSortOrder(column: string, sortingOrder: SortingOrder): void {
    this.userPresenter.onSortOrder(column, sortingOrder, this.sortingColumns);
  }

  /**
   * when user click on edit button
   * @param user this is the user object
   */
  public onEdit(user: User): void {
    this.edit.emit(user);
  }

  /**
   * it will hide the form on cancel
   * @param user this is the user object
   */
  public onCancel(user: User): void {
    this.clearOfficeData();
    this.userPresenter.cancelUserForm(user);
  }

  /**
   * it will toggle the user status
   * @param user user object
   * @param isActive status
   */
  public toggleStatus(user: User, isActive: boolean): void {
    this.onChangeStatus({ ...user, isActive });
  }
}
