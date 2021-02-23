/**
 * @name PrintDetailsPresentationComponent
 * @author Enter Your Name Here
 * @description This is a presentation component for print-detailswhich contains the ui and business logic
 */

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Inject, Input, NgZone, OnDestroy, OnInit, Output, ViewChild, ViewRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NgSelectComponent } from '@ng-select/ng-select';
import { AuthPolicyService } from 'auth-policy';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { Observable } from 'rxjs/Observable';
import { takeUntil, tap } from 'rxjs/operators';
//-------------------------------------------------------------------------------//
import { AllowedRequestorSectionEnum } from '../../../../copyit/models/copy-it.enum';
import { BaseCloseSelectDropdown } from '../../../../core/base-classes/base-close-select-dropdown';
import { PolicyRoles } from '../../../../core/enums/role-permissions.enum';
import { DECIMAL_FORMAT } from '../../../../core/utility/constants';
import { PaperType } from '../copyits.model';
import { copyItPageTypes } from '../models/copyit-constant';
import { CopyItConfigRequestorSection, CopyItConfiguration, DefaultCopyItConfiguration } from '../models/copyit-info';
import { CopyItInfo } from '../models/copyit-info/copyit-info';
import { PrintDetailsFormPresenter } from '../print-details-form-presenter/print-details-form.presenter';

/**
 * PrintDetailsFormPresentationComponent
 */
@Component({
  selector: 'app-print-details-form-ui',
  templateUrl: './print-details-form.presentation.html',
  viewProviders: [PrintDetailsFormPresenter],
  changeDetection: ChangeDetectionStrategy.OnPush,
  // tslint:disable-next-line: no-host-metadata-property
  host: { class: 'd-flex flex-column h-100 overflow-hidden' }
})
export class PrintDetailsFormPresentationComponent extends BaseCloseSelectDropdown implements OnInit, OnDestroy {

  @Input() public set disableCustomOptions(flag: boolean) {
    this.disableCustomSelectOptions(flag);
  }
  /** Determines Edit Form */
  @Input() public isEditForm: boolean = false;
  /** Determines Config Form */
  @Input() public isCopyItConfig: boolean = false;
  /** Set visibility for quantity field */
  @Input() public hideQuantity: boolean = false;
  /**  isNext is used to set the input */
  @Input() public set isNext(value: number) {
    if (value) {
      this._isNext = value;
      this.savePrintDetails();
      setTimeout(() => {
        if (this.cdrRef !== null && this.cdrRef !== undefined && !(this.cdrRef as ViewRef).destroyed) {
          this.cdrRef.detectChanges();
        }
      }, 250);
    }
  }
  public get isNext(): number {
    return this._isNext;
  }

  /** This will set the data */
  @Input() public set copyItInfo(value: CopyItInfo) {
    if (value) {
      this._copyItInfo = { ...value };
      this.printDetailsPresenter.bindCopyItInfoToForm(this.printDetailsFormGroup, this._copyItInfo);
    }
  }
  public get copyItInfo(): CopyItInfo {
    return this._copyItInfo;
  }

  // tslint:disable-next-line: completed-docs
  @Input() public set copyItConfiguration(value: CopyItConfiguration) {
    if (value) {
      this._copyItConfiguration = { ...value };
      this.coverPageTypes = copyItPageTypes;
      this.setEnableEnvelop();
      this.setEnableOversize();
    }
  }
  // tslint:disable-next-line: completed-docs
  public get copyItConfiguration(): CopyItConfiguration {
    return this._copyItConfiguration;
  }

  @Input() public set defaultCopyItConfiguration(value: DefaultCopyItConfiguration) {
    if (value) {
      this._defaultCopyItConfiguration = { ...value };
      this.printDetailsPresenter.bindControlValue(this.printDetailsFormGroup, this._defaultCopyItConfiguration);
    }
  }
  // tslint:disable-next-line: completed-docs
  public get defaultCopyItConfiguration(): DefaultCopyItConfiguration {
    return this._defaultCopyItConfiguration;
  }

  /** to clear all validation for default config page */
  @Input() public set isClearValidation(value: boolean) {
    if (value) {
      this._isClearValidation = value;
      // this.printDetailsPresenter.clearValidations(this.printDetailsFormGroup);
    }
  }
  public get isClearValidation(): boolean {
    return this._isClearValidation;
  }

  /** Customer form group of customer form presentation component */
  public printDetailsFormGroup: FormGroup;
  @Output() public saveCopyItInfo: EventEmitter<CopyItInfo>;
  /*** Output of print detail form presentation component */
  @Output() public save: EventEmitter<CopyItInfo>;

  /** Get the refernce */
  @ViewChild('select', { static: true }) public selectComp: NgSelectComponent

  /** Store thw decimal constant */
  public readonly decimal: string = DECIMAL_FORMAT;

  /** Bs config of customer form presentation component */
  public bsConfig: BsDatepickerConfig;
  /** to-do */
  public coverPageTypes: PaperType[];
  /** show/hide envelop */
  public enableEnvelop: boolean;
  /** show/hide oversize */
  public enableOversize: boolean;
  /** This is used for subscribing the value of subject showFrontPageCover */
  public showFrontPageCover$: Observable<boolean>;
  /** This is used for subscribing the value of subject showMiddlePageCover */
  public showMiddlePageCover$: Observable<boolean>;
  /** enable quantity field based on role */
  public enableQuantity: boolean;

  /** Determines whether form submitted */
  public get isFormSubmitted(): boolean {
    return this.printDetailsPresenter.isFormSubmitted;
  }

  /** _isNext is used to set isNext value */
  private _isNext: number;
  /** it will store the copy it configuration */
  private _copyItConfiguration: CopyItConfiguration;
  /** it will store the copy it default configuration */
  private _defaultCopyItConfiguration: DefaultCopyItConfiguration;
  /** it will store the copyItInfo */
  private _copyItInfo: CopyItInfo;
  /** it will store the isClearValidation or not */
  private _isClearValidation: boolean;
  /** it will store the isRequestor or not */
  private isRequestor: boolean;

  constructor(
    private printDetailsPresenter: PrintDetailsFormPresenter,
    private cdrRef: ChangeDetectorRef,
    private policyService: AuthPolicyService,
    @Inject('Window') window: Window,
    zone: NgZone
  ) {
    super(window, zone);
    this.initProp();
  }

  public ngOnInit(): void {
    // This will subscribe the save event and emit to container component
    this.printDetailsPresenter.add$.pipe(takeUntil(this.destroy)).subscribe((copyItInfo: CopyItInfo) => {
      this.saveCopyItInfo.next(copyItInfo);
    });
  }

  /** This is used to save the data */
  public savePrintDetails(): void {
    this.printDetailsPresenter.savePrintDetails(this.printDetailsFormGroup, this._copyItInfo, this._copyItConfiguration);
  }

  /** enable/disable shipping */
  private setEnableEnvelop(): void {
    const envelopSection: CopyItConfigRequestorSection = this.copyItConfiguration.requestorSections.find(section =>
      section.requestorSectionId === AllowedRequestorSectionEnum.ENVELOP_AND_QUANTITY);
    this.enableEnvelop = this.isRequestor ? envelopSection ? true : false : true;
  }
  /** enable/disable oversized option */
  private setEnableOversize(): void {
    this.enableOversize = this.copyItConfiguration.overSizedCopies.length > 0;
  }
  /** enable/disable quantity for the options based on role */
  private setEnableQuantity(): void {
    if (!this.isRequestor) { this.enableQuantity = true };
  }

  /** enable/disable custom-select options */
  private disableCustomSelectOptions(flag: boolean = false): void {
    if (this.customSelectDropdowns) {
      this.customSelectDropdowns.forEach(ctrl => { ctrl.disableOption = flag; });
    }
    if (this.customPageSizeSelectDropdowns) {
      this.customPageSizeSelectDropdowns.forEach(ctrl => { ctrl.disableOption = flag; });
    }
  }

  /** Init Prop */
  private initProp(): void {
    this.coverPageTypes = [];
    this._copyItConfiguration = new CopyItConfiguration();
    this.save = new EventEmitter();
    this.saveCopyItInfo = new EventEmitter<CopyItInfo>();
    this.printDetailsFormGroup = this.printDetailsPresenter.buildForm();

    this.showFrontPageCover$ = this.printDetailsPresenter.showFrontPageCover$.pipe(
      tap((value: boolean) => !value && this.printDetailsFormGroup.get('frontCoverPageColor').setValue(null))
    );
    this.showMiddlePageCover$ = this.printDetailsPresenter.showMiddlePageCover$.pipe(
      tap((value: boolean) => !value && this.printDetailsFormGroup.get('middlePageColor').setValue(null))
    );
    this.enableEnvelop = true;
    this.enableOversize = true;
    // set disable quantity default
    this.enableQuantity = false;
    this.isRequestor = this.policyService.isInRole(PolicyRoles.requestor);
    this.setEnableQuantity();
  }
}


