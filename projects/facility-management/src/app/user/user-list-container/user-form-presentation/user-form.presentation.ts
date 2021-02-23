

/**
 * @name UserPresentationComponent
 * @author Nitesh Sharma
 * @description This is a presentation component for userwhich contains the ui and business logic
 */

import {
  Component, OnInit, Input, Output, EventEmitter, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef,
  ViewChild, TemplateRef, QueryList, ViewChildren, AfterViewInit, Inject, HostBinding, NgZone
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NgSelectComponent } from '@ng-select/ng-select';
import { takeUntil } from 'rxjs/operators';
import { AuthPolicyService } from 'auth-policy';
//-------------------------------------------------------------------------------//
import { isArray } from 'util';
import { Permission } from '../../../core/enums/role-permissions.enum';
import { PHONE_MASK, RoleConstants } from '../../../core/utility/constants';
import { BaseCloseSelectDropdown } from '../../../core/base-classes/base-close-select-dropdown';
import { UserFormPresenter } from '../user-form-presenter/user-form.presenter';
import { User, UserMasterData } from '../../user.model';
import { FloorMaster, OfficeMaster, ClientMaster, TimezoneMaster } from '../../../core/model/common.model';

/** 
 * UserFormPresentationComponent
 */
@Component({
  selector: 'trackit-user-form-ui',
  templateUrl: './user-form.presentation.html',
  viewProviders: [UserFormPresenter],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserFormPresentationComponent extends BaseCloseSelectDropdown implements OnInit, AfterViewInit, OnDestroy {

  /** hostBinding */
  @HostBinding('class') public class: string = 'd-flex w-100';

  /** global client id for client dropdown */
  @Input() public set globalClientId(value: number) {
    if (value) {
      this._globalClientId = value;
      if (value > 0) {
        this.userFormGroup.get('clientId').setValue(value);
        this.getOffices.emit(value);
      }
    }
  }

  public get globalClientId(): number {
    return this._globalClientId;
  }

  /** This will set the data */
  @Input() public set user(value: User) {
    if (value) {
      this._user = { ...value };
      this.userFormGroup = this.userPresenter.bindControlValue(this.userFormGroup, this._user);
    }
  }

  public get user(): User {
    return this._user;
  }

  /** list of offices */
  @Input() public set clients(value: ClientMaster[]) {
    if (value) {
      this._clients = value;
      if (value.length === 0) {
        // this.userFormGroup.get('clientId').setValue(value);
      }
    }
  }

  public get clients(): ClientMaster[] {
    return this._clients;
  }

  /** This will set the data */
  @Input() public set userMasterData(value: UserMasterData) {
    if (value) {
      this._userMasterData = value;
      if (this.user) {
        this.userPresenter.setTimeZone(this.userFormGroup, this._user)
        this.getOfficeList(this.user.clientId);
      } else {
        this.userPresenter.setESTTimeZone(this.userFormGroup, this._userMasterData);
      }
    }
  }

  public get userMasterData(): UserMasterData {
    return this._userMasterData;
  }
  /** list of offices */
  @Input() public set offices(value: OfficeMaster[]) {
    if (value) {
      this._offices = value;
      if (this.user && value.length > 0 && this.user.officeId) {
        this.userFormGroup.get('officeId').setValue(this.user.officeId);
        this.getFloors.emit(this.user.officeId);
      }
    }
  }

  public get offices(): OfficeMaster[] {
    return this._offices;
  }
  /** list of floors */
  @Input() public set floors(value: FloorMaster[]) {
    if (value) {
      this._floors = value;
      if (this.user && value.length > 0 && this.user.floorId) {
        this.userFormGroup.get('officeId').setValue(this.user.officeId);
      }
    }
  }

  public get floors(): FloorMaster[] {
    return this._floors;
  }
  /*** it will used for emit the add user form value to the parent component */
  @Output() public add: EventEmitter<User>;
  /*** it will used for emit the update user form value to the parent component */
  @Output() public update: EventEmitter<User>;
  /*** it will used for emit thecancel event to the parent component */
  @Output() public cancel: EventEmitter<void>;
  /*** it will used to emit the event for get the office list by client id */
  @Output() public getOffices: EventEmitter<string | number | number[]>;
  /*** it will used to emit the event for get the floors list by office id */
  @Output() public getFloors: EventEmitter<number>;

  /** role dropdwon reference */
  @ViewChild('client', { static: true }) public client: NgSelectComponent;
  /** optionTemplateRef */
  @ViewChild('optionTemplateRef', { static: true }) public optionTemplateRef: TemplateRef<any>;
  /** multiLabelTemplateRef */
  @ViewChild('multiLabelTemplateRef', { static: true }) public multiLabelTemplateRef: TemplateRef<any>;
  /** ng-select dropdown reference */
  @ViewChildren(NgSelectComponent) public ngSelects: QueryList<NgSelectComponent>;

  /** Customer form group of customer form presentation component */
  public userFormGroup: FormGroup;
  /** Determines whether form submitted */
  public isFormSubmitted: boolean = false;
  /** phone number mask */
  public mask: any[] = PHONE_MASK;
  /** check if multi select is true or not */
  public isMultiple: boolean;
  /** allow user to change password */
  public allowPasswordChang: boolean;
  /** it will used to hide the user name control if user type is employee */
  public get isShowUserNamePassword(): boolean {
    return this.userPresenter.isShowUserNamePassword;
  }
  public get userPermissionEnum(): typeof Permission.User {
    return Permission.User;
  }
  public get userRoleEnum(): typeof RoleConstants {
    return RoleConstants;
  }
  public get userFormValue(): User {
    return this.userFormGroup.getRawValue();
  }

  /** Customer of customer form presentation component */
  private _user: User;
  /** UserMasterData of customer form presentation component */
  private _userMasterData: UserMasterData;
  /** list of offices */
  private _offices: OfficeMaster[];
  /** list of floors */
  private _floors: FloorMaster[];
  /** list of clients */
  private _clients: ClientMaster[];
  /** it will store the global client id */
  private _globalClientId: number;

  constructor(
    private userPresenter: UserFormPresenter,
    private policyService: AuthPolicyService,
    @Inject('Window') window: Window,
    ngZone: NgZone) {
    super(window, ngZone);
    this.initProps();
  }

  public ngOnInit(): void {
    // This will subscribe the save event and emit to container component
    this.userPresenter.save$.pipe(takeUntil(this.destroy)).subscribe((user: User) => {
      if (this.user) {
        this.update.emit(user);
      } else {
        this.add.emit(user);
      }
      this.isFormSubmitted = false;
    });

    this.userPresenter.error$.pipe(takeUntil(this.destroy)).subscribe((error: string) => {
      this.isFormSubmitted = true;
    });

  }

  public ngAfterViewInit(): void {
    this.allowPasswordChang = this.user && this.policyService.hasPermission(this.userPermissionEnum.changePassword);
  }

  /** This is used to save the data */
  public saveUser(): void {
    this.isFormSubmitted = true;
    this.userPresenter.onSave(this.userFormGroup, this.user);
  }

  /** When user click on cancel */
  public onCancel(): void {
    this.cancel.emit();
  }

  /** when user changes the role from dropdown */
  public roleChange(): void {
    // commenting this because only single client selection for client
    // this.userPresenter.checkManagerRole(this.userFormGroup, this.client, this.user, this.optionTemplateRef, this.multiLabelTemplateRef);
    this.userPresenter.onUserTypeChange(this.userFormGroup);
  }

  /** when user changes the client from dropdown */
  public clientChange(): void {
    this._offices = [];
    this.floors = [];
    this.userFormGroup.get('officeId').setValue(null);
    this.userFormGroup.get('floorId').setValue(null);
    if (this._user) {
      this._user.officeId = null;
      this._user.floorId = null;
    }
    const clientId: number | number[] = this.userFormGroup.get('clientId').value;
    if (clientId) {
      if (isArray(clientId)) {
        const ids: number[] = clientId as number[];
        if (ids.length > 0) {
          this.getOffices.emit(ids[0]);
        }
      } else {
        this.getOffices.emit(clientId);
      }
    }
  }

  /** when user changes the client from dropdown */
  public officeChange(): void {
    this.floors = [];
    this.userFormGroup.get('floorId').setValue(null);
    if (this._user) {
      this._user.floorId = null;
    }
    const officeId: number = this.userFormGroup.get('officeId').value;
    if (officeId) {
      this.getFloors.emit(officeId);
    }
  }

  /**
   * it will initalize the properties
   */
  private initProps(): void {
    this.cancel = new EventEmitter(true);
    this.add = new EventEmitter<User>(true);
    this.update = new EventEmitter<User>(true);
    this.getOffices = new EventEmitter<number>(true);
    this.getFloors = new EventEmitter<number>(true);
    this._offices = [];
    this.floors = [];
    this.userFormGroup = this.userPresenter.buildForm();
  }

  /** it will emit the event for get floors list based on office id  */
  private getOfficeList(clientIds: string | number | number[]): void {
    if (clientIds instanceof Array) {
      const ids: number[] = clientIds as number[];
      this.getOffices.emit(ids[0]);
      this.userFormGroup.get('clientId').setValue(ids[0]);
    } else {
      this.getOffices.emit(clientIds);
      this.userFormGroup.get('clientId').setValue(clientIds);
    }
  }
}

