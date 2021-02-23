/**
 * @author Nitesh Sharma.
 * @description This is data filter presentation component. Used for filter data base on field.
 */

import { Component, ChangeDetectionStrategy, Inject, Optional, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { AuthPolicyService } from 'auth-policy';
import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/operators';
// ---------------------------------------------------------- //
import { ClientMaster } from '../../../../core/model/common.model';
import { PolicyRoles } from '../../../../core/enums/role-permissions.enum';
import { USER_FILTER, UserFilterRecord, UserMasterData, customerStatusList } from '../../../user.model';
import { UserFilterPresenter } from '../user-filter-presenter/user-filter.presenter';

/**
 * UserFilterPresentationComponent
 */
@Component({
  selector: 'trackit-user-filter',
  templateUrl: './user-filter.presentation.html',
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [UserFilterPresenter]
})
export class UserFilterPresentationComponent {

  /** global client id for client dropdown */
  @Input() public set globalClientId(value: number) {
    if (value !== null && value !== undefined) {
      this._globalClientId = value;
      if (value !== Number(this.userFormGroup.get('clientId').value)) {
        this.userFormGroup.get('clientId').setValue(value);
      }
    }
  }

  public get globalClientId(): number {
    return this._globalClientId;
  }

  /** this is master data object */
  @Input() public set clients(value: ClientMaster[]) {
    if (value) {
      this._clients = [...value];
    }
  }

  public get clients(): ClientMaster[] {
    return this._clients;
  }

  /** This property is used for emit when filter apply. */
  @Output() public filterData: EventEmitter<UserFilterRecord>;
  /** This property is used to create for filter Form. */
  public userFormGroup: FormGroup;
  /** This property is used for date picker. */
  public bsConfig: BsDatepickerConfig;
  /** This property is used for emit when filter close. */
  public closeFilter: Subject<boolean>;
  /** This property is used for emit when filter data cleared. */
  public clearFilter: Subject<boolean>;
  /** Determines whether filter apply is */
  public isFilterApply: boolean;
  /** Determines whether form submitted is */
  public isFormSubmitted: boolean;
  /** list of status for status dropdown */
  public statusList = customerStatusList;
  /** User role is super user */
  public isSuperUser: boolean;
  /** UserMasterData of customer presentation component */
  private _userMasterData: UserMasterData;
  /** list of clients */
  private _clients: ClientMaster[];
  /** for unsubscribe the subscription */
  private destroy: Subject<void>;
  /** it will store the global store client id */
  private _globalClientId: number;

  constructor(
    private presenter: UserFilterPresenter,
    private policy: AuthPolicyService,
    @Optional() @Inject(USER_FILTER) private data: UserFilterRecord,
  ) {
    this.userFormGroup = this.presenter.buildForm();
    this.filterData = new EventEmitter<UserFilterRecord>();
    this.isFilterApply = false;
    if (this.data) {
      this.isFilterApply = true;
      this.userFormGroup.patchValue(data);
      this.userFormGroup.markAsDirty();
    }
    this.destroy = new Subject<void>();
    if (!this.policy.isInRole(PolicyRoles.superUser)) {
      this.userFormGroup.get('isActive').disable();
    }
  }

  public ngOnInit(): void {
    this.userFormGroup.valueChanges.pipe(takeUntil(this.destroy)).subscribe(
      (value: UserFilterRecord) => {
        this.filterData.emit(this.userFormGroup.getRawValue());
      }
    )
  }

  public ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }
}
