/**
 * @name AssetTicketPresentationComponent
 * @author Ronak Patel.
 * @description This is a presentation component for asset-ticketwhich contains the ui and business logic
 */

import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef, ViewChild, ElementRef, NgZone, Inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/operators';
//-------------------------------------------------------------------------------//
import { AssetTicketFormPresenter } from '../asset-ticket-form-presenter/asset-ticket-form.presenter';
import { MasterDataTicket, AssetTicket } from '../../fleet.model';
import { BaseCloseSelectDropdown } from '../../../core/base-classes/base-close-select-dropdown';
import { ArchiveModeService } from '../../../core/services/archive-mode/archive-mode.service';

@Component({
  selector: 'app-asset-ticket-form-ui',
  templateUrl: './asset-ticket-form.presentation.html',
  viewProviders: [AssetTicketFormPresenter],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AssetTicketFormPresentationComponent extends BaseCloseSelectDropdown implements OnInit, OnDestroy {
  /** This will set the data */
  @Input() public set assetTicket(value: AssetTicket) {
    if (value) {
      this._assetTicket = value;
      this.assetTicketFormGroup = this.assetTicketPresenter.bindControlValue(this.assetTicketFormGroup, this._assetTicket);
      if (value.status === 'Close') {
        this.assetTicketFormGroup.disable();
      }
    }
  }

  public get assetTicket(): AssetTicket {
    return this._assetTicket;
  }

  /** This will set the data */
  @Input() public set masterData(value: MasterDataTicket) {
    this._masterData = value;
    if (value) {
      this._masterData = value;
    }
  }

  public get masterData(): MasterDataTicket {
    return this._masterData;
  }

  /** Customer form group of customer form presentation component */
  public assetTicketFormGroup: FormGroup;

  /*** Output of customer form presentation component */
  @Output() public add: EventEmitter<AssetTicket>;
  /*** Output of customer form presentation component */
  @Output() public update: EventEmitter<AssetTicket>;
  @ViewChild('timePicker', { read: ElementRef, static: true }) public timeControlRef: ElementRef;
  /** Determines whether form submitted */
  public isFormSubmitted: boolean = false;
  /** Bs config of customer form presentation component */
  public bsConfig: BsDatepickerConfig;
  public isArchived: boolean;
  /** Customer of customer form presentation component */
  private _assetTicket: AssetTicket;
  private _masterData: MasterDataTicket;
  
  constructor(
    private assetTicketPresenter: AssetTicketFormPresenter,
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
    this.bsConfig.customTodayClass = 'current-date';
    this.assetTicketFormGroup = this.assetTicketPresenter.buildForm();
  }

  public ngOnInit(): void {
    // This will subscribe the save event and emit to container component
    this.assetTicketPresenter.add$.pipe(takeUntil(this.destroy)).subscribe((assetTicket: AssetTicket) => {
      if (this.assetTicket) {
        this.update.emit(assetTicket);
      } else {
        this.add.emit(assetTicket);
      }
    });

    this.archiveModeService.archiveMode$.pipe(takeUntil(this.destroy)).subscribe((isArchived: boolean)=>{
      this.isArchived = isArchived ? isArchived : false;
      this.isArchived && this.assetTicketFormGroup.disable();
      this.cdrRef.markForCheck();
    });
  }

  /** This is used to save the data */
  public saveAssetTicket(): void {
    this.isFormSubmitted = true;
    this.assetTicketPresenter.saveAssetTicket(this.assetTicketFormGroup);
  }

  /** ngOnDestroy */
  public ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }

}

