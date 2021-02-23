/**
 * @name SchedulingDetailsPresentationComponent
 * @author Shahbaz Shaikh
 * @description This is a presentation component for scheduling-detailswhich contains the ui and business logic
 */

import { ChangeDetectionStrategy, Component, Inject, Input, NgZone, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { takeUntil } from 'rxjs/operators';
// ------------------------------------------------------------------------------- //
import { DefaultCopyItConfiguration } from '../../../shared/modules/copy-it-print-details/models/copyit-info';
import { CopyItInfo } from '../../../shared/modules/copy-it-print-details/models/copyit-info/copyit-info';
import { BaseCopyitStepperPresentation } from '../../copyit-stepper-container/copyit-stepper-presentation/base-copyit-stepper-presentation/base-copyit-stepper.presentation';
import { SchedulingDetailsFormPresenter } from '../scheduling-details-form-presenter/scheduling-details-form.presenter';


/** Time format used for datePipe in timePicker */
export const TIME_FORMAT: string = 'HH:mm';

/**
 * SchedulingDetailsFormPresentationComponent
 */
@Component({
  selector: 'app-scheduling-details-form-ui',
  templateUrl: './scheduling-details-form.presentation.html',
  viewProviders: [SchedulingDetailsFormPresenter],
  changeDetection: ChangeDetectionStrategy.OnPush,
  // tslint:disable-next-line: no-host-metadata-property
  host: {
    class: 'd-flex flex-column h-100 overflow-hidden'
  }
})

export class SchedulingDetailsFormPresentationComponent extends BaseCopyitStepperPresentation implements OnInit {

  /** Determines Edit Form */
  @Input() public isEditForm: boolean = false;

  /** This will set the data */
  @Input() public set copyItInfo(value: CopyItInfo) {
    if (value && (JSON.stringify(value) !== JSON.stringify(this.copyItInfo))) {
      this._copyItInfo = { ...value };
      this.schedulingDetailsFormGroup = this.schedulingDetailsPresenter.bindControlValue(this.schedulingDetailsFormGroup, this.copyItInfo);
    }
  }
  public get copyItInfo(): CopyItInfo {
    return this._copyItInfo;
  }

  @Input() public set defaultConfigurations(value: DefaultCopyItConfiguration) {
    if (value) {
      this._defaultConfigurations = value;
      this.schedulingDetailsFormGroup = this.schedulingDetailsPresenter.bindControlValue(this.schedulingDetailsFormGroup, this._defaultConfigurations);
    }
  }
  public get defaultConfigurations(): DefaultCopyItConfiguration {
    return this._defaultConfigurations;
  }
  /** form raw value */
  public get readOnlyFormGroup(): CopyItInfo {
    return this.schedulingDetailsFormGroup.getRawValue();
  };

  /** Customer form group of customer form presentation component */
  public schedulingDetailsFormGroup: FormGroup;
  /** Bs config of customer form presentation component */
  public bsConfig: BsDatepickerConfig;
  /** String format for timePicker value  */
  public readonly dateFormat: string = TIME_FORMAT;
  /** Determines isFormSubmitted or not */
  public get isFormSubmitted(): boolean {
    return this.schedulingDetailsPresenter.isFormSubmitted;
  }


  /** Store the Default CopyIt Configuration */
  private _defaultConfigurations: DefaultCopyItConfiguration;
  /** Store copy it info value */
  private _copyItInfo: CopyItInfo;

  constructor(
    private schedulingDetailsPresenter: SchedulingDetailsFormPresenter,
    @Inject('Window') window: Window,
    zone: NgZone,
  ) {
    super(window, zone);
    this.initConfigAndForm();
  }

  public ngOnInit(): void {
    this.initProps();
  }

  /** initConfigAndForm */
  private initConfigAndForm(): void {
    this.bsConfig = new BsDatepickerConfig();
    this.bsConfig.containerClass = 'theme-primary';
    this.bsConfig.adaptivePosition = true;
    this.schedulingDetailsFormGroup = this.schedulingDetailsPresenter.buildForm();
  }

  /**
   * subscribe all props here
   */
  private initProps(): void {
    this.baseNextStep$.pipe(takeUntil(this.destroy)).subscribe(
      (value: number) => {
        this.schedulingDetailsPresenter.saveSchedulingDetails(this.schedulingDetailsFormGroup, this.copyItInfo);
      });

    this.schedulingDetailsPresenter.save$.pipe(takeUntil(this.destroy)).subscribe(
      (copyItInfo: CopyItInfo) => {
        this.saveCopyItInfo.next(copyItInfo);
      });
  }
}

