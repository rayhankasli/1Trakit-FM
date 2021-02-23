/**
 * @author Ronak Patel.
 */


import { Asset, AssetMeterReadResult } from '../fleet.model';
import { ActivatedRoute, } from '@angular/router';
import { Component } from '@angular/core';

@Component({
  selector: 'app-meter-read-print-container',
  templateUrl: './meter-read-print.container.html'
})
export class MeterReadPrintContainerComponent {
  public meterReads: AssetMeterReadResult;
  public assetRecord: Asset;
  constructor(
    private route: ActivatedRoute,
  ) {
    this.meterReads = this.route.snapshot.data['meterReads'];
    this.assetRecord = this.route.snapshot.data['asset'];
  }
}