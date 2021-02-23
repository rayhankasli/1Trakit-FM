/**
 * @name AssetPresentationComponent
 * @author Ronak Patel.
 * @description This is a presentation component for assetwhich contains the ui and business logic
 */

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Inject, Input, NgZone, OnDestroy, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TableProperty } from 'common-libs/projects';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';
//-------------------------------------------------------------------------------//
import { BaseCloseSelectDropdown } from '../../../core/base-classes/base-close-select-dropdown';
import { ClientMaster } from '../../../core/model/common.model';
import { ArchiveModeService } from '../../../core/services/archive-mode/archive-mode.service';
import { PHONE_MASK } from '../../../core/utility/constants';
import { Asset, AssetTicket, AssetTicketResult, AssetTicketStatus, AssetTypeOption } from '../../fleet.model';
import { AssetFormPresenter } from '../asset-form-presenter/asset-form.presenter';

@Component({
  selector: 'app-asset-form-ui',
  templateUrl: './asset-form.presentation.html',
  viewProviders: [AssetFormPresenter],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AssetFormPresentationComponent extends BaseCloseSelectDropdown implements OnInit, OnDestroy {
  /** This will set the data */
  @Input() public set asset(value: Asset) {
    if (value) {
      this.bsConfig.minDate = value.assetMeter ? value.assetMeter.assetCreatedDate : new Date();
      this._asset = value;
      this.assetFormGroup = this.assetPresenter.bindControlValue(this.assetFormGroup, this._asset);
      this.isTenants = value.assetMeter ? value.assetMeter.tenantRates : false;
      this.cdrRef.detectChanges();
    }
  }
  public get asset(): Asset {
    return this._asset;
  }

  /** This will set the data */
  @Input() public set clients(value: ClientMaster[]) {
    if (value) {
      this._clients = value;
    }
  }
  public get clients(): ClientMaster[] {
    return this._clients;
  }

  /** This will set the data */
  @Input() public set fleetTickets(value: AssetTicketResult) {
    if (value) {
      this._fleetTickets = value;
      this.showAddTicket = this._fleetTickets.assetTickets && this._fleetTickets.assetTickets.find((data: AssetTicket) => data.status !== 'Close');
    }
  }
  public get fleetTickets(): AssetTicketResult {
    return this._fleetTickets;
  }

  /** This will set the data */
  @Input() public set ticketStatus(value: AssetTicketStatus[]) {
    if (value) {
      value.unshift({ assetTicketStatusId: 0, assetTicketStatus: 'All' });
      this._ticketStatus = value;
    }
  }
  public get ticketStatus(): AssetTicketStatus[] {
    return this._ticketStatus;
  }


  /*** Output of customer form presentation component */
  @Output() public add: EventEmitter<Asset>;
  /*** Output of customer form presentation component */
  @Output() public update: EventEmitter<Asset>;
  /*** Output of customer form presentation component */
  @Output() public getAssetTicket: EventEmitter<TableProperty>;

  /** Customer form group of customer form presentation component */
  public assetFormGroup: FormGroup;
  /** Determines whether form submitted */
  public isFormSubmitted: boolean = false;
  public isArchived: boolean;
  /** Bs config of customer form presentation component */
  public bsConfig: BsDatepickerConfig;
  public showAddTicket: AssetTicket;
  /** Phone number mask */
  public mask: Array<string | RegExp> = PHONE_MASK;
  public isTenants: boolean;
  /** show/hide meter-read */
  public get openMeterRead(): boolean {
    return this.assetPresenter.openMeterRead;
  };
  public requestType: any[] =
    [
      { requestTypeId: false, requestType: 'Client' },
      { requestTypeId: true, requestType: 'Tenant' }
    ];
  /** list of available asset type options */
  public get assetTypeOptions(): typeof AssetTypeOption {
    return AssetTypeOption;
  };
  /** Customer of customer form presentation component */
  private _asset: Asset;
  private _ticketStatus: AssetTicketStatus[];
  private _fleetTickets: AssetTicketResult;
  private _clients: ClientMaster[];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private assetPresenter: AssetFormPresenter,
    private cdrRef: ChangeDetectorRef,
    private archiveModeService: ArchiveModeService,
    @Inject('Window') window: Window,
    zone: NgZone
  ) {
    super(window, zone);
    this.window = window as Window;
    this.destroy = new Subject();
    this.add = new EventEmitter();
    this.update = new EventEmitter();
    this.getAssetTicket = new EventEmitter();
    this.bsConfig = new BsDatepickerConfig();
    this.bsConfig.containerClass = 'theme-primary';
    this.bsConfig.adaptivePosition = true;
    this.bsConfig.maxDate = new Date();
    this.assetFormGroup = this.assetPresenter.buildForm();
    this.disabledControls();
  }

  public ngOnInit(): void {
    // This will subscribe the save event and emit to container component
    this.assetPresenter.add$.pipe(takeUntil(this.destroy)).subscribe((asset: Asset) => {
      if (this.asset) {
        this.update.emit(asset);
      } else {
        this.add.emit(asset);
      }
    });
    this.assetFormGroup.get('assetTypeId').valueChanges.pipe(takeUntil(this.destroy)).subscribe((value: number) => {
      // this.onAssetTypeIdChange(value);
      this.assetPresenter.onAssetTypeIdChange(this.assetFormGroup, value, this.asset, this.isArchived);
    });

    this.archiveModeService.archiveMode$.pipe(takeUntil(this.destroy)).subscribe((isArchived: boolean) => {
      this.isArchived = isArchived ? isArchived : false;
      this.isArchived && this.assetFormGroup.disable();
    });
  }

  /** This is used to save the data */
  public saveAsset(): void {
    this.isFormSubmitted = true;
    this.assetPresenter.saveAsset(this.assetFormGroup, this.asset);
  }

  /** When user click on cancel */
  public cancel(): void {
    let path: string = '/asset';
    if (this.isArchived) { path = '/archive/asset'; }
    this.router.navigate([path], { relativeTo: this.route });
  }

  /** This Method is used to get data from server  */
  public getAssetTickets(tableProperty: TableProperty): void {
    this.getAssetTicket.emit(tableProperty);
  }

  /** this method is used for client change */
  public onClientChange(client: ClientMaster): void {
    this.isTenants = client.tenants;
  }

  /** ngOnDestroy */
  public ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }

  /** disabledControls  */
  private disabledControls(): void {
    this.assetPresenter.disabledControls(this.assetFormGroup, this.asset, this.isArchived);
  }

}

