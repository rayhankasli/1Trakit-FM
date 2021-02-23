

/**
 * @name CopyitManageAccountPresentationComponent
 * @author Ronak Patel.
 * @description This is a presentation component for copyit-manage-accountwhich contains the ui and business logic
 */

import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BasePresentation } from 'projects/facility-management/src/app/core/base-classes/base.presentation';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';
//-------------------------------------------------------------------------------//
import { AssignTo } from '../../../copyit-configurations.model';
import { CopyitManageAccount } from '../../../models/copyit-manage-account.model';
import { CopyitManageAccountFormPresenter } from '../copyit-manage-account-form-presenter/copyit-manage-account-form.presenter';

/**
 * CopyitManageAccountFormPresentationComponent
 */
@Component({
  selector: '[app-copyit-manage-account-form-ui]',
  templateUrl: './copyit-manage-account-form.presentation.html',
  viewProviders: [CopyitManageAccountFormPresenter],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CopyitManageAccountFormPresentationComponent extends BasePresentation implements OnInit, OnDestroy {

  /** This will set the data */
  @Input() public set copyitManageAccount(value: any) {
    this._copyitManageAccount = value;
    if (value) {
      this.copyitManageAccountFormGroup = this.copyitManageAccountPresenter.bindControlValue(this.copyitManageAccountFormGroup, this._copyitManageAccount);
    }
  }

  public get copyitManageAccount(): any {
    return this._copyitManageAccount;
  }

  /** This property is used for get data from container component */
  @Input() public set assignToRequestor(assignToRequestor: AssignTo[]) {
    if (assignToRequestor) {
      this._assignToRequestor = assignToRequestor;
    }
  };
  public get assignToRequestor(): AssignTo[] {
    return this._assignToRequestor;
  }

  /** This property is used for get data from container component */
  @Input() public set assignToAssociate(assignToAssociate: AssignTo[]) {
    if (assignToAssociate) {
      this._assignToAssociate = assignToAssociate;
    }
  };
  public get assignToAssociate(): AssignTo[] {
    return this._assignToAssociate;
  }

  /*** Output of CopyitManageAccount form presentation component */
  @Output() public add: EventEmitter<CopyitManageAccount>;
  /*** Output of CopyitManageAccount form presentation component */
  @Output() public update: EventEmitter<CopyitManageAccount>;
  /*** Output of CopyitManageAccount form presentation component */
  @Output() public cancel: EventEmitter<void>;

  /** Customer form group of CopyitManageAccount form presentation component */
  public copyitManageAccountFormGroup: FormGroup;

  /** Determines whether form submitted */
  public isFormSubmitted: boolean = false;
  status = [
    { name: 'Active', value: true },
    { name: 'Inactive', value: false },
  ];

  /** Destroy of CopyitManageAccount form presentation component */
  private destroy: Subject<void>;
  /** Customer of CopyitManageAccount form presentation component */
  private _copyitManageAccount: CopyitManageAccount;
  /** Assign To Requestor */
  private _assignToRequestor: AssignTo[];
  /** Assign To Associate */
  private _assignToAssociate: AssignTo[]


  constructor(
    private copyitManageAccountPresenter: CopyitManageAccountFormPresenter
  ) {
    super();
    this.destroy = new Subject();
    this.add = new EventEmitter();
    this.update = new EventEmitter();
    this.cancel = new EventEmitter();
    this.copyitManageAccountFormGroup = this.copyitManageAccountPresenter.buildForm();
  }

  public ngOnInit(): void {
    // This will subscribe the save event and emit to container component
    this.copyitManageAccountPresenter.add$.pipe(takeUntil(this.destroy)).subscribe((copyitManageAccount: CopyitManageAccount) => {
      if (this.copyitManageAccount) {
        this.update.emit(copyitManageAccount);
      } else {
        this.add.emit(copyitManageAccount);
      }
    });
  }

  /** This is used to save the data */
  public onSave(): void {
    this.isFormSubmitted = true;
    this.copyitManageAccountPresenter.saveCopyitManageAccount(this.copyitManageAccountFormGroup);
  }


  /** When user click on cancel */
  public onCancel(): void {
    this.cancel.emit();
  }

  /** ngOnDestroy */
  public ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }

}

