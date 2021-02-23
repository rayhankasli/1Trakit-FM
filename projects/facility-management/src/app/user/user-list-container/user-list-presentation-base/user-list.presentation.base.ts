
/**
 * @author Nitesh Sharma.
 * @description This is base class to represent the common members of desktop and mobile component.
 */

import { ChangeDetectorRef, EventEmitter, Inject, Input, NgZone, Output } from '@angular/core';
// --------------------------------------------- //
import { TableProperty } from 'common-libs';
import { BaseCloseSelectDropdown } from '../../../core/base-classes/base-close-select-dropdown';
// --------------------------------------------- //
import { ClientMaster, FloorMaster, OfficeMaster } from '../../../core/model/common.model';
import { User, UserFilterRecord, UserMasterData } from '../../user.model';
import { UserListPresenter } from '../user-list-presenter/user-list.presenter';

/**
 * user list presentation base
 */
export class UserListPresentationBase extends BaseCloseSelectDropdown {

  /** global client id for client dropdown */
  @Input() public globalClientId: number;

  /** this is master data object */
  @Input() public set userMasterData(value: UserMasterData) {
    if (value) {
      this._userMasterData = value;
    }
  }

  public get userMasterData(): UserMasterData {
    return this._userMasterData;
  }

  /** list of offices */
  @Input() public set offices(value: OfficeMaster[]) {
    if (value) {
      this._offices = value;
    }
  }

  public get offices(): OfficeMaster[] {
    return this._offices;
  }

  /** list of offices */
  @Input() public set clients(value: ClientMaster[]) {
    if (value) {
      this._clients = value;
    }
  }

  public get clients(): ClientMaster[] {
    return this._clients;
  }

  /** list of floors */
  @Input() public floors: FloorMaster[];
  /*** it will used to emit the event for get the office list by client id */
  @Output() public getOffices: EventEmitter<number>;
  /*** it will used to emit the event for get the floors list by office id */
  @Output() public getFloors: EventEmitter<number>;
  /*** it will used for emit the add user form value to the parent component */
  @Output() public add: EventEmitter<User>;
  /*** it will used for emit the update user form value to the parent component */
  @Output() public update: EventEmitter<User>;
  /*** it will used for emit the change status event to the parent component */
  @Output() public changeStatus: EventEmitter<User>;
  /** This boolean is used to indicate whether all rows are selected or not  */
  public isCheckAll: boolean;
  /** This property is used for filter apply or not. */
  public isFilterApply: boolean;
  /** This property is used to store the criteria that are selected by the user */
  public tableProperty: TableProperty<UserFilterRecord>;

  /** UserMasterData of customer presentation component */
  private _userMasterData: UserMasterData;
  /** list of offices */
  private _offices: OfficeMaster[];
  /** list of clients */
  private _clients: ClientMaster[];

  constructor(
    public userPresenter: UserListPresenter,
    public changeDetection: ChangeDetectorRef,
    @Inject('Window') window: Window,
    zone: NgZone
  ) {
    super(window, zone);
    this.window = window as Window;
    this.add = new EventEmitter<User>();
    this.update = new EventEmitter<User>();
    this.getOffices = new EventEmitter<number>();
    this.getFloors = new EventEmitter<number>();
    this.changeStatus = new EventEmitter<User>();
  }

  /**
   * This method is invoked when the user changes the current page size.
   * @param pageSize The page number that needs to be set.
   */
  public onPageSizeChange(pageSize: number): void {
    this.userPresenter.onPageSizeChange(pageSize);
  }

  /**
   * This method is invoked when the user changes the page number from the pagination toolbar.
   * @param pageNumber The number to which the table should switch to
   */
  public onPageChange(pageNumber: number): void {
    this.userPresenter.onPageChange(pageNumber);
  }

  /** create for open modal when action perform */
  public clearFilter(): void {
    this.isFilterApply = false;
    this.userPresenter.setTableProperty(new TableProperty());
  }

  /**
   * This method is invoked when the user performs a global search. It resets the selected rows, updates the criteria
   * and then gets the new list of User based on updated criteria.
   * @param searchTerm The search string that has been searched by the user
   */
  public onSearch(searchTerm: string): void {
    this.userPresenter.onSearch(searchTerm);
  }


  /** create for open modal when action perform */
  public openModal(user: User): void {
    this.userPresenter.openModal(user);
  }

  /**
   * it will used to emit the add user data to parent component
   * @param user
   */
  public addUser(user: User): void {
    this.add.emit(user);
  }

  /**
   * it will used to emit the update user data to parent component
   * @param user
   */
  public updateUser(user: User): void {
    this.update.emit(user);
  }

  /**
   * it will emit the change status event to parent component for api call
   * @param user this is the user data object
   */
  public onChangeStatus(user: User): void {
    this.changeStatus.emit(user);
  }

  /**
   * this will call on client change
   * @param clientId it will have the client id
   */
  public onClientChange(clientId: number): void {
    this.getOffices.emit(clientId);
    this.offices = [];
  }

  /**
   * this will call on office change
   * @param officeId it will have the office id
   */
  public onOfficeChange(officeId: number): void {
    this.getFloors.emit(officeId);
    this.floors = [];
  }

  /** clear office and floor data */
  public clearOfficeData(): void {
    this.offices = [];
    this.floors = [];
  }
}
