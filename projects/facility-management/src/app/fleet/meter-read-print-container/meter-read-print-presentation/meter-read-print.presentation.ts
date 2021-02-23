/**
 * @author Ronak Patel.
 */

import { Location } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Input, ViewChild } from '@angular/core';
// ---------------------------------- //
import { environment } from '../../../../environments/environment';
import { BasePresentation } from '../../../core/base-classes/base.presentation';
import { DATE_FORMAT } from '../../../core/utility/constants';
import { Asset, AssetMeterReadResult } from '../../fleet.model';
import { MeterReadPrintPresenter } from '../meter-read-print-presenter/meter-read-print.presenter';


@Component({
  selector: 'app-meter-read-print-ui',
  templateUrl: './meter-read-print.presentation.html',
  viewProviders: [MeterReadPrintPresenter],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MeterReadPrintPresentationComponent extends BasePresentation implements AfterViewInit {

  /** This property is used for get data from container component */
  @Input() public set meterReads(value: AssetMeterReadResult) {
    if (value) {
      this._meterReads = this.meterReadPresenter.setMissingMeterRead(value);
    }
  };
  public get meterReads(): AssetMeterReadResult {
    return this._meterReads;
  }

  /** This property is used for get data from container component */
  @Input() public set assetRecord(assetRecord: Asset) {
    if (assetRecord) {
      this._assetRecord = assetRecord;
    }
  };
  public get assetRecord(): Asset {
    return this._assetRecord;
  }
  /** print button reference */
  @ViewChild('printBtn', { static: false }) public printBtn: ElementRef;

  /** host path for absolute URL */
  public get host(): string {
    return environment.redirect_uri;
  }

  /** get common formate for date */
  public get dateFormat(): string {
    return DATE_FORMAT;
  }

  private _meterReads: AssetMeterReadResult;
  private _assetRecord: Asset;

  constructor(
    private location: Location,
    private meterReadPresenter: MeterReadPrintPresenter
  ) {
    super();
  }

  public ngAfterViewInit(): void {
    this.printBtn.nativeElement.click();
    this.location.back();
  }

}