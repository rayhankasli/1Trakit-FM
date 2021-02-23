

/**
 * @name CopyitOptionsPresentationComponent
 * @author Enter Your Name Here
 * @description This is a presentation component for copyit-optionswhich contains the ui and business logic
 */

import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef, Inject, NgZone } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/operators';
import { AuthPolicyService } from 'auth-policy';
//-------------------------------------------------------------------------------//
import { BaseCloseSelectDropdown } from '../../../core/base-classes/base-close-select-dropdown';
import { Permission } from '../../../core/enums/role-permissions.enum';
import { CopyitOptionsFormPresenter } from '../copyit-options-form-presenter/copyit-options-form.presenter';
import { CopyitOptions } from '../../copyit-configurations.model';
import { CopyItConfigShippingMethod } from '../../../shared/modules/copy-it-print-details/models/copyit-info';

/** 
 * CopyitOptionsFormPresentationComponent
 */
@Component({
  selector: 'app-copyit-options-form-ui',
  templateUrl: './copyit-options-form.presentation.html',
  viewProviders: [CopyitOptionsFormPresenter],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CopyitOptionsFormPresentationComponent extends BaseCloseSelectDropdown implements OnInit, OnDestroy {

  /** This will set the data */
  @Input() public set masterData(value: { copyitOption: CopyitOptions, copyitMasterData: CopyitOptions }) {
    if (value) {
      this._masterData = value;
      this.copyitOptionsFormGroup = this.copyitOptionsPresenter.bindControlValue(this.copyitOptionsFormGroup, this._masterData.copyitOption);
    }
  }

  public get masterData(): { copyitOption: CopyitOptions, copyitMasterData: CopyitOptions } {
    return this._masterData;
  }

  /*** Output of customer form presentation component */
  @Output() public add: EventEmitter<CopyitOptions>;
  /*** Output of customer form presentation component */
  @Output() public update: EventEmitter<CopyitOptions>;

  /** Customer form group of customer form presentation component */
  public copyitOptionsFormGroup: FormGroup;

  /** Determines whether form submitted */
  public isFormSubmitted: boolean = false;

  /**
   * This enum is return copyit configuration options enum props.
   */
  public get copyItConfigurationEnum(): typeof Permission.CopyItConfigurationOptions {
    return Permission.CopyItConfigurationOptions;
  }

  public get formControls(): any {
    return this.copyitOptionsFormGroup.controls;
  }

  /** flag for can user edit */
  public canEdit: boolean;
  public selectedDataItem: any[] = [];
  public selectedItemIndex: number;
  public lableCount: number = 0;

  /** Customer of customer form presentation component */
  private _masterData: { copyitOption: CopyitOptions, copyitMasterData: CopyitOptions };

  constructor(
    private copyitOptionsPresenter: CopyitOptionsFormPresenter,
    private cdrRef: ChangeDetectorRef,
    private authPolicyService: AuthPolicyService,
    @Inject('Window') window: Window,
    zone: NgZone
  ) {
    super(window, zone);
    this.initProps();
  }

  public ngOnInit(): void {
    // This will subscribe the save event and emit to container component
    this.copyitOptionsPresenter.add$.pipe(takeUntil(this.destroy)).subscribe((copyitOptions: CopyitOptions) => {
      this.update.emit(copyitOptions);
    });
    this.copyitOptionsFormGroup.get('shippingServices').valueChanges.pipe(takeUntil(this.destroy)).subscribe((value) => {
      if (value) {
        this.selectedDataItem = value.filter(filter => { return filter.shippingServiceParentId });
        this.cdrRef.detectChanges();
      }
    });
  }

  /** This is used to save the data */
  public saveCopyitOptions(): void {
    this.isFormSubmitted = true;
    this.copyitOptionsPresenter.saveCopyitOptions(this.copyitOptionsFormGroup);
  }

  /** Remove item form shipping method droupdown */
  public removeItem(item: CopyItConfigShippingMethod): void {
    const list: CopyItConfigShippingMethod[] = this.copyitOptionsFormGroup.value.shippingServices.filter((data: CopyItConfigShippingMethod) => data.shippingServiceId !== item.shippingServiceId);
    this.copyitOptionsFormGroup.get('shippingServices').setValue(list);
  }

  /** changeIndex */
  public changeIndex(totalIndex: number): void {
    this.selectedItemIndex = totalIndex;
  }

  /** initialize the all the properties */
  private initProps(): void {
    this.destroy = new Subject();
    this.add = new EventEmitter();
    this.update = new EventEmitter();
    this.selectedItemIndex = 2;

    this.copyitOptionsFormGroup = this.copyitOptionsPresenter.buildForm();
    this.canEdit = this.authPolicyService.hasPermission(this.copyItConfigurationEnum.change);
    if (!this.canEdit) {
      this.copyitOptionsFormGroup.disable();
    }
  }

}

