/**
 * @name AccordionPresentationComponent
 * @author Enter Your Name Here
 * @description This is a presentation component for accordion control which contains the ui and business logic
 */

import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, Input, NgZone, OnInit, ViewChild } from '@angular/core';
import { NgbAccordion, NgbPanelChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { takeUntil } from 'rxjs/operators';
// ------------------------------------------------------------- //
import { DATE_FORMAT, DECIMAL_FORMAT, TIME_FORMAT } from '../../../../core/utility/constants';
import { CopyItConfigShippingMethod, CopyItConfiguration, ShippingOption } from '../../../../shared/modules/copy-it-print-details/models/copyit-info';
import { CopyItInfo } from '../../../../shared/modules/copy-it-print-details/models/copyit-info/copyit-info';
import { ShippingDetailsFormPresenter } from '../../../../shared/modules/shipping-details/shipping-details-form-presenter/shipping-details-form.presenter';
import { BaseCopyitStepperPresentation } from '../base-copyit-stepper-presentation/base-copyit-stepper.presentation';
import { SummaryPresenter } from '../summary-presenter/summary.presenter';

/**
 * SummaryPresentationComponent
 */
@Component({
  selector: 'app-summary-ui',
  templateUrl: './summary.presentation.html',
  viewProviders: [SummaryPresenter, ShippingDetailsFormPresenter],
  changeDetection: ChangeDetectionStrategy.OnPush,
  // tslint:disable-next-line: no-host-metadata-property
  host: {
    class: 'd-flex flex-column h-100 overflow-hidden'
  }
})
export class SummaryPresentationComponent extends BaseCopyitStepperPresentation implements OnInit, AfterViewInit {

  /** This will set the data */
  @Input() public set copyItInfo(value: CopyItInfo) {
    if (value) {
      this._copyItInfo = { ...value };
      this.pageType = this.summaryPresenter.findPageType(this._copyItInfo.frontCoverPageType);
      this.priceQuote = this.summaryPresenter.findPriceQuoteAndProof(this._copyItInfo.isPriceQuote);
      this.proof = this.summaryPresenter.findPriceQuoteAndProof(this._copyItInfo.isProof);
    }
  }

  public get copyItInfo(): CopyItInfo {
    return this._copyItInfo;
  }


  /** View child of summary presentation component   */
  @ViewChild('accordion', { static: false }) public accordionComponent: NgbAccordion;

  /** Store the Page Type */
  public pageType: string;
  /** Store the Price Quote */
  public priceQuote: string;
  /** Store Proof */
  public proof: string;
  /** Store the CopyIt Configuration */
  public configuration: CopyItConfiguration;
  /** Determines enableShipping or not */
  public enableShipping: boolean;
  /** Determines enableEnvelop or not */
  public enableEnvelop: boolean;
  /** String format for datePicker value  */
  public readonly dateFormat: string = DATE_FORMAT;
  /** String format for timePicker value  */
  public readonly timeFormat: string = TIME_FORMAT;
  /** decimal format for amount */
  public readonly decimal: string = DECIMAL_FORMAT;

  /** It will store the copyIt Info */
  private _copyItInfo: CopyItInfo;

  constructor(
    private shippingDetailsPresenter: ShippingDetailsFormPresenter,
    private cdr: ChangeDetectorRef,
    private summaryPresenter: SummaryPresenter,
    @Inject('Window') window: Window,
    zone: NgZone
  ) {
    super(window, zone);
    this.enableShipping = false;
    this.enableEnvelop = false;
  }

  public ngOnInit(): void {
    this.baseNextStep$.pipe(takeUntil(this.destroy)).subscribe(
      (value: number) => {
        this.saveCopyItInfo.next(this.copyItInfo);
      });
  }

  public ngAfterViewInit(): void {
    this.summaryPresenter.activeIds = ['0'];
    this.setPanelPrimaryType('0', false);
    this.cdr.detectChanges();
  }

  /**
   * When user click on save, make current panel collapsed and set next panel opened
   * @param id : This is the panel which we want to set as active
   */
  public onSave(id: string): void {
    this.summaryPresenter.activeIds = [id];
    this.setPanelPrimaryType(id, false);
  }

  /**
   * When user click on cancel, make it collapsed
   * @param id : This is the panel which we want to remove from its active state
   */
  public onCancel(id: string): void {
    this.summaryPresenter.onCancel(id, this.accordionComponent);
  }

  /**
   * On change of tabs, it will set the panel type according to its state
   * @param data: This is the current clicked tab
   */
  public toggleAccordion(data: NgbPanelChangeEvent): void {
    this.accordionComponent = this.summaryPresenter.toggleAccordion(data, this.accordionComponent);
  }


  /** It will return list of active panel ids */
  public get activeIds(): string[] {
    return this.summaryPresenter.activeIds;
  }

  /** to-do */
  public extractShippingOptionValue(value: number): string {
    return this.shippingDetailsPresenter.bindShippingOptionValues().filter((shipping: ShippingOption) => shipping.shippingOptionId === value)[0].shippingOption;
  }

  /** to-do */
  public extractShippingServices(value: number): string {
    return this.configuration.shippingServices.filter((shipping: CopyItConfigShippingMethod) => shipping.shippingServiceId === value)[0].shippingService;
  }

  /**
   * This will set the panel type of the active panel and remove from other panels
   * @param id : This is the panel which we want to set as active
   * @param isCancel : This flag is optional, only used when user click on cancel button, then remove the primary type from active tab
   */
  private setPanelPrimaryType(id: string, isCancel?: boolean): void {
    this.accordionComponent = this.summaryPresenter.setPanelPrimaryType(id, this.accordionComponent, isCancel);
  }

}
