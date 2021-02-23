/**
 * @name ShippingDetailsPresentationComponent
 * @author Enter Your Name Here
 * @description This is a presentation component for shipping-detailswhich contains the ui and business logic
 */

import { ChangeDetectionStrategy, Component, EventEmitter, Inject, Input, NgZone, OnDestroy, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { Subject } from 'rxjs/Subject';
//-------------------------------------------------------------------------------//
import { BaseCloseSelectDropdown } from '../../../../core/base-classes/base-close-select-dropdown';
import { CopyItConfiguration, DefaultCopyItConfiguration, ShippingOption } from '../../copy-it-print-details/models/copyit-info';
import { CopyItInfo } from '../../copy-it-print-details/models/copyit-info/copyit-info';
import { ShippingDetailsFormPresenter } from '../shipping-details-form-presenter/shipping-details-form.presenter';

/**
 * ShippingDetailsFormPresentationComponent
 */
@Component({
  selector: 'trakit-shipping-details-form-ui',
  templateUrl: './shipping-details-form.presentation.html',
  viewProviders: [ShippingDetailsFormPresenter],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShippingDetailsFormPresentationComponent extends BaseCloseSelectDropdown implements OnInit, OnDestroy {

  /** Wether form is edie mode or not */
  @Input() public isEditForm: boolean = false;

  /** Wether copyIt Config or not */
  @Input() public isCopyItConfig: boolean = false;

  /** This will set the data */
  @Input() public set copyItConfigurations(value: CopyItConfiguration) {
    if (value) {
      this._copyItConfigurations = value;
    }
  }

  public get copyItConfigurations(): CopyItConfiguration {
    return this._copyItConfigurations
  }

  /** This will set the data */
  @Input() public set defaultConfigurations(value: DefaultCopyItConfiguration) {
    if (value) {
      this._copyitDefaultValues = value;
      this.shippingDetailsFormGroup = this.shippingDetailsPresenter.bindControlValue(
        this.shippingDetailsFormGroup,
        this._copyitDefaultValues
      );
      if (this._copyitDefaultValues.shippingOptionId) {
        this.isInstruction = true;
      }
    }
  }

  public get defaultConfigurations(): DefaultCopyItConfiguration {
    return this._copyitDefaultValues;
  }

  /** This will set the data */
  @Input() public set copyItInfo(value: CopyItInfo) {
    if (value) {
      this._copyItInfo = { ...value };
      this.shippingDetailsPresenter.bindControlValue(this.shippingDetailsFormGroup, this._copyItInfo);
      this.isInstruction = this.shippingDetailsFormGroup.get('shippingOptionId').value ? true : false;
    }
  }

  public get copyItInfo(): CopyItInfo {
    return this._copyItInfo;
  }

  /**  isNext is used to set the input */
  @Input() public set isNext(value: number) {
    if (value) {
      this._isNext = value;
      this.shippingDetailsPresenter.saveShippingDetails(this.shippingDetailsFormGroup, this.copyItInfo);
    }
  }

  public get isNext(): number {
    return this._isNext;
  }

  /*** Output of saveCopyItInfo form presentation component */
  @Output() public saveCopyItInfo: EventEmitter<CopyItInfo>;

  /** Customer form group of customer form presentation component */
  public shippingDetailsFormGroup: FormGroup;
  /** Bs config of customer form presentation component */
  public bsConfig: BsDatepickerConfig;
  /** Bs config of customer form presentation component */
  public isInstruction: boolean;
  /** shippingOptionValues */
  public shippingOptionValues: ShippingOption[] = [];
  /** Determines whether form submitted is ture or false */
  public get isFormSubmitted(): boolean {
    return this.shippingDetailsPresenter.isFormSubmitted;
  }

  /** Customer of customer form presentation component */
  private _copyitDefaultValues: DefaultCopyItConfiguration;
  /** _isNext is used to set isNext value */
  private _isNext: number;
  /** _isNext is used to set isNext value */
  private _copyItConfigurations: CopyItConfiguration;
  /** Copy it info of shipping details form presentation component */
  private _copyItInfo: CopyItInfo;

  constructor(
    private shippingDetailsPresenter: ShippingDetailsFormPresenter,
    @Inject('Window') window: Window,
    zone: NgZone
  ) {
    super(window, zone);
    this.destroy = new Subject();
    this.saveCopyItInfo = new EventEmitter<CopyItInfo>();
    this.bsConfig = new BsDatepickerConfig();
    this.bsConfig.containerClass = 'theme-primary';
    this.bsConfig.adaptivePosition = true;
    this.shippingDetailsFormGroup = this.shippingDetailsPresenter.buildForm();
    this.shippingOptionValues = this.shippingDetailsPresenter.bindShippingOptionValues();
  }

  public ngOnInit(): void {
    this.shippingDetailsPresenter.add$.subscribe((response: any) => {
      if (response) {
        this.saveCopyItInfo.next(response);
      }
    });
  }

  /** This is used to save the data */
  public saveShippingDetails(): void {
    this.shippingDetailsPresenter.saveShippingDetails(
      this.shippingDetailsFormGroup,
      this.copyItInfo
    );
  }

  /**
   * Changes charge
   */
  public changeCharge(): void {
    this.isInstruction = true;
  }

  /** when user change the shipping option */
  public onShippingOptionChange(): void {
    const shippingOptionId: number = this.shippingDetailsFormGroup.get('shippingOptionId').value;
    if (shippingOptionId) {
      this.isInstruction = true;
    } else {
      this.isInstruction = false;
      this.shippingDetailsFormGroup.get('shippingOptionValue').setValue('');
    }
  }

  /** When user click on cancel */
  public cancel(): void {
    // do something here
  }

}
