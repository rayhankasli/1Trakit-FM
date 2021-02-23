

/**
 * @name RequestInformationDetailsPresentationComponent
 * @author Enter Your Name Here
 * @description This is a presentation component for request-information-detailswhich contains the ui and business logic
 */

import { ChangeDetectionStrategy, Component, EventEmitter, Inject, Input, NgZone, OnDestroy, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subject } from 'rxjs/Subject';
//-------------------------------------------------------------------------------//
import { PHONE_MASK } from '../../../../core/utility/constants';
import { COPYIY_PRICE_QUOTE, COPYIY_PROOFS } from '../../../../shared/modules/copy-it-print-details/models/copyit-constant';
import { PriceQuote, Proof } from '../../../../shared/modules/copy-it-print-details/models/copyit-shared.model';
import { CopyItUserList } from '../../../../shared/modules/copyit-shared/copyit-shared.model';
import { CopyitDefaultValues } from '../../../copyit-configurations.model';
import { BaseCopyitStepperPresentation } from '../base-copyit-stepper-presentation/base-copyit-stepper.presentation';
import { RequestInformationDetailsFormPresenter } from '../request-information-details-form-presenter/request-information-details-form.presenter';

/** 
 * RequestInformationDetailsFormPresentationComponent
 */
@Component({
  selector: 'app-request-information-details-form-ui',
  templateUrl: './request-information-details-form.presentation.html',
  viewProviders: [RequestInformationDetailsFormPresenter],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RequestInformationDetailsFormPresentationComponent extends BaseCopyitStepperPresentation implements OnInit, OnDestroy {

  /** This will set the data */
  @Input() public set defaultConfigurations(value: CopyitDefaultValues) {
    if (value) {
      this._copyitDefaultValues = value;
      this.requestInformationDetailsPresenter.bindControlValue(this.requestInformationDetailsFormGroup, this._copyitDefaultValues);
    }
  }
  public get defaultConfigurations(): CopyitDefaultValues {
    return this._copyitDefaultValues
  }

  /** user detail */
  @Input() public set userDetail(value: any) {
    if (value) {
      this._userDetail = { ...value };
      this.requestInformationDetailsPresenter.setUserDetail(this._userDetail, this.requestInformationDetailsFormGroup);
    }
  }
  public get userDetail(): any {
    return this._userDetail;
  }

  /** This will set the data */
  @Input() public set userList(value: CopyItUserList[]) {
    this._userData = value;
  }
  public get userList(): CopyItUserList[] {
    return this._userData
  }

  /*** Output of customer form presentation component */
  @Output() public update: EventEmitter<CopyitDefaultValues>;
  /*** Output of customer form presentation component */
  @Output() public isFormvalid: EventEmitter<boolean>;
  /** getUserDetail by user id */
  @Output() public getUserDetail: EventEmitter<number>;

  /** Determines whether form submitted is ture or false */
  public get isFormSubmitted(): boolean {
    return this.requestInformationDetailsPresenter.isFormSubmitted;
  }

  /** Phone number mask */
  public mask: Array<string | RegExp> = PHONE_MASK;

  /** Customer form group of customer form presentation component */
  public requestInformationDetailsFormGroup: FormGroup;
  /** proof */
  public proofs: Proof[] = [];
  /** priceQuotes */
  public priceQuotes: PriceQuote[] = [];
  /** shows that form is valid or invalid */
  private _userData: CopyItUserList[];
  /** _shippingDetails of copyitDefaultValuesForm presentation component  */
  private _copyitDefaultValues: CopyitDefaultValues;
  /** it will store the user detail */
  private _userDetail: any;

  constructor(
    private requestInformationDetailsPresenter: RequestInformationDetailsFormPresenter,
    @Inject('Window') window: Window,
    zone: NgZone
  ) {
    super(window, zone);
    this.initProperties();
  }

  public ngOnInit(): void {
    this.baseNextStep$.subscribe((value: number) => {
      this.requestInformationDetailsPresenter.saveRequestInformationDetails(this.requestInformationDetailsFormGroup);
    });
    this.requestInformationDetailsPresenter.add$.subscribe((response: CopyitDefaultValues) => {
      if (response) {
        this.update.next(response);
      }
    });
  }

  /** on user change */
  public onUserChange(): void {
    this.requestInformationDetailsFormGroup.patchValue({
      emailAddress: '',
      phoneNumber: '',
    });

    const userId: number = this.requestInformationDetailsFormGroup.get('requestForId').value;
    if (userId) {
      this.getUserDetail.emit(userId);
    }
  }

  /** Inits properties */
  private initProperties(): void {
    this.destroy = new Subject();
    this.update = new EventEmitter();
    this.getUserDetail = new EventEmitter<number>();
    this.isFormvalid = new EventEmitter();
    this.requestInformationDetailsFormGroup = this.requestInformationDetailsPresenter.buildForm();
    this.priceQuotes = COPYIY_PRICE_QUOTE;
    this.proofs = COPYIY_PROOFS;
  }

}

