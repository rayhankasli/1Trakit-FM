/**
 * @name MeterReadPresentationComponent
 * @author Ronak Patel.
 * @description This is a presentation component for meter-readwhich contains the ui and business logic
 */

import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef, ViewChild, ElementRef, NgZone, Inject } from '@angular/core';
import { FormGroup, } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/operators';
//-------------------------------------------------------------------------------//
import { MeterReadFormPresenter } from '../meter-read-form-presenter/meter-read-form.presenter';
import { MeterRead, AssetMeter } from '../../fleet.model';
import { BaseCloseSelectDropdown } from '../../../core/base-classes/base-close-select-dropdown';
import { ArchiveModeService } from '../../../core/services/archive-mode/archive-mode.service';

/** 
 * MeterReadFormPresentationComponent
 */
@Component({
  selector: 'app-meter-read-form-ui',
  templateUrl: './meter-read-form.presentation.html',
  viewProviders: [MeterReadFormPresenter],
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false
})
export class MeterReadFormPresentationComponent extends BaseCloseSelectDropdown implements OnInit, OnDestroy {
  /** This will set the data */
  @Input() public set meterRead(value: MeterRead) {
    if (value) {
      this.bsConfig.minDate = value.assetMeter ? value.assetMeter.assetCreatedDate : new Date();
      this._meterRead = value;
      this.isMissingEntry = false;
      this.meterReadFormGroup = this.meterReadPresenter.bindControlValue(this.meterReadFormGroup, this._meterRead);
      this.isFormSubmitted = false;
      this.bsConfig.maxDate = new Date();
      this.isTenants = value.assetMeter ? value.assetMeter.tenantRates : false;
    }
  }

  public get meterRead(): MeterRead {
    return this._meterRead;
  }

  @Input() public set isaddNewReader(value: number) {
    if (value) {
      this._isaddNewReader = value;
      this.isMissingEntry = false;
      this.meterReadFormGroup = this.meterReadPresenter.bindControlValue(this.meterReadFormGroup, this._meterRead);
      this.elementRef.nativeElement.focus();
    }
  }

  public get isaddNewReader(): number {
    return this._isaddNewReader;
  }


  /** This will set the data */
  @Input() public set missingEntry(value: [AssetMeter, AssetMeter]) {
    if (value) {
      this._missingEntry = value;
      this.isMissingEntry = true;
      this.meterReadFormGroup = this.meterReadPresenter.bindMissingControl(this.meterReadFormGroup, value);
      this.elementRef.nativeElement.focus();
      this.isFormSubmitted = false;
      this.isTenants = value[0].tenantRates ? value[0].tenantRates : false;
      if (value[0] && value[1]) {
        this.bsConfig.minDate = value[0].readingDate;
        this.bsConfig.maxDate = value[1].readingDate;
      }
    }
  }

  public get missingEntry(): [AssetMeter, AssetMeter] {
    return this._missingEntry;
  }

  /** Customer form group of customer form presentation component */
  public meterReadFormGroup: FormGroup;

  /*** Output of customer form presentation component */
  @Output() public add: EventEmitter<MeterRead>;
  /*** Output of customer form presentation component */
  @Output() public update: EventEmitter<MeterRead>;
  /** elementRef */
  @ViewChild('currentColorRead', { read: ElementRef, static: false }) public elementRef: ElementRef;

  /** Determines whether form submitted */
  public isFormSubmitted: boolean = false;
  public isMissingEntry: boolean;
  /** Bs config of customer form presentation component */
  public bsConfig: BsDatepickerConfig;
  public isTenants: boolean;
  public isArchived: boolean;
  public requestType: any[] =
    [
      { requestTypeId: false, requestType: 'Client' },
      { requestTypeId: true, requestType: 'Tenant' }
    ]

  /** Customer of customer form presentation component */
  private _meterRead: MeterRead;
  private _missingEntry: [AssetMeter, AssetMeter];
  private _isaddNewReader: number;

  constructor(
    private meterReadPresenter: MeterReadFormPresenter,
    private cdrRef: ChangeDetectorRef,
    private archiveModeService: ArchiveModeService,
    @Inject('Window') window: Window,
    zone: NgZone
  ) {
    super(window, zone);
    this.destroy = new Subject();
    this.add = new EventEmitter();
    this.update = new EventEmitter();

    this.bsConfig = new BsDatepickerConfig();
    this.bsConfig.containerClass = 'theme-primary';
    this.bsConfig.adaptivePosition = true;
    this.bsConfig.maxDate = new Date();
    this.bsConfig.customTodayClass = 'current-date';
    this.meterReadFormGroup = this.meterReadPresenter.buildForm();
  }

  public ngOnInit(): void {
    // This will subscribe the save event and emit to container component
    this.meterReadPresenter.add$.pipe(takeUntil(this.destroy)).subscribe((meterRead: MeterRead) => {
      this.add.emit(meterRead);
    });

    this.archiveModeService.archiveMode$.pipe(takeUntil(this.destroy)).subscribe((isArchived: boolean) => {
      this.isArchived = isArchived ? isArchived : false;
      this.isArchived && this.meterReadFormGroup.disable();
    });
  }

  public ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }

  /** This is used to save the data */
  public saveMeterRead(): void {
    this.isFormSubmitted = true;
    if (this.isMissingEntry) {
      this.meterReadPresenter.saveMeterRead(this.meterReadFormGroup, this.missingEntry[1]);
    } else {
      this.meterReadPresenter.saveMeterRead(this.meterReadFormGroup);
    }
  }

}

