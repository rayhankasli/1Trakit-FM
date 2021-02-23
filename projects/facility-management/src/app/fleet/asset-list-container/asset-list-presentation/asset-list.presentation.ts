
/**
 * @author Ronak Patel.
 * @description This is data table presentation component.To represent get data from container component and render to dom.
 */
import { BreakpointState } from '@angular/cdk/layout';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, HostBinding, Inject, Input, NgZone, OnDestroy, OnInit, Output, ViewChild, ViewContainerRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { pageCount, TableProperty } from 'common-libs';
import { Observable } from 'rxjs/Observable';
import { takeUntil } from 'rxjs/operators/takeUntil';
import { Subject } from 'rxjs/Subject';
import { BaseCloseSelectDropdown } from '../../../core/base-classes/base-close-select-dropdown';
// ---------------------------------------------------------- //
import { BasePresentation } from '../../../core/base-classes/base.presentation';
import { Permission } from '../../../core/enums/role-permissions.enum';
import { ClientMaster } from '../../../core/model/common.model';
import { ArchiveModeService } from '../../../core/services/archive-mode/archive-mode.service';
import { AssetFilter, AssetResult, AssetStatusList, ASSET_STATUS_OPTION } from '../../fleet.model';
import { AssetListPresenter } from '../asset-list-presenter/asset-list.presenter';


/**
 * AssetListPresentationComponent
 */
@Component({
  selector: 'app-asset-list-ui',
  templateUrl: './asset-list.presentation.html',
  viewProviders: [AssetListPresenter],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AssetListPresentationComponent extends BaseCloseSelectDropdown implements OnInit, OnDestroy {

  /** to bind css class */
  @HostBinding('class') public class: string;

  /** This property is used for get data from container component */
  @Input() public set baseResponse(baseResponse: AssetResult) {
    if (baseResponse) {
      this._baseResponse = baseResponse;
      this.setTableData();
    }
  };
  public get baseResponse(): AssetResult {
    return this._baseResponse;
  }

  /** list of clients */
  @Input() public set clients(value: ClientMaster[]) {
    if (value) {
      this._clients = value;
    }
  }
  public get clients(): ClientMaster[] {
    return this._clients;
  }

  /** This enum is return fleet enum props. */
  public get fleetEnum(): typeof Permission.Fleet {
    return Permission.Fleet;
  }
  /** This enum is return FleetMeterReads enum props. */
  public get fleetMeterReadsEnum(): typeof Permission.FleetMeterReads {
    return Permission.FleetMeterReads;
  }

  /** This property is used for emit data to container component */
  @Output() public getAsset: EventEmitter<TableProperty>;
  /** This property is used for emit data to container component */
  @Output() public deleteAsset: EventEmitter<AssetFilter>;
  /** This property is used for emit data to container component */
  @Output() public setAssetStatus: EventEmitter<any>;
  /** View child of customer list presentation component */
  @ViewChild('container', { read: ViewContainerRef, static: false }) public container: ViewContainerRef;

  public clientId: FormControl = new FormControl();
  /** This property is used to store the criteria that are selected by the user */
  public tableProperty: TableProperty<AssetFilter>;
  /** This property is used to store the options that are available in the Page Size selection drawdown */
  public pageSize: number[];
  /** Table prop of customer list presentation component */
  public tableProp: Subject<TableProperty<AssetFilter>>;
  /** isMobile property for mobile screen or not */
  public isMobile: Observable<BreakpointState>;
  /** This property is used for checking filter applied or not. */
  public isFilterApply: boolean;
  /** This property is used for checking sort applied or not. */
  public isSortApply: boolean;
  /** to check if archive view enabled */
  public isArchived$: Observable<boolean>;
  /** status list */
  public statusList: AssetStatusList[] = ASSET_STATUS_OPTION;
  /** selected status option */
  public statusOption: boolean;

  /** create for getter setter */
  private _baseResponse: AssetResult;
  /** list of clients */
  private _clients: ClientMaster[];

  constructor(
    public assetPresenter: AssetListPresenter,
    public changeDetection: ChangeDetectorRef,
    public archiveModeService: ArchiveModeService,
    @Inject('Window') window: Window,
    zone: NgZone
  ) {
    super(window, zone);
    this.window = window as Window;  
    this.initProperty();
    this.class = 'd-flex flex-column h-100 overflow-hidden';
  }

  /** ngOnInit */
  public ngOnInit(): void {
    this.assetPresenter.setTableProp$.pipe(takeUntil(this.destroy)).subscribe((tableProperty: TableProperty<AssetFilter>) => {
      this.getAsset.emit(tableProperty);
      this.tableProperty = tableProperty;
      this.statusOption = tableProperty.filter.isActive;
    });
    this.assetPresenter.deleteRecord$.pipe(takeUntil(this.destroy)).subscribe((asset: AssetFilter) => { this.deleteAsset.emit(asset) });
    this.assetPresenter.tableProp$.subscribe((value: TableProperty<AssetFilter>) => {
      this.tableProperty = value;
    });
    this.clientId.valueChanges.pipe(takeUntil(this.destroy)).subscribe(
      (value: number) => {
        this.assetPresenter.onClientChange(value);
      }
    )
  }

  /**
   * Sets table data
   */
  public setTableData(): void {
    this.assetPresenter.assets = this.baseResponse.assetList;
    this.assetPresenter.setTableData();
  }

  /**
   * This method is invoked when the user changes the current page size.
   * @param pageSize The page number that needs to be set.
   */
  public onPageSizeChange(pageSize: number): void {
    this.assetPresenter.onPageSizeChange(pageSize);
  }

  /**
   * This method is invoked when the user changes the page number from the pagination toolbar.
   * @param pageNumber The number to which the table should switch to
   */
  public onPageChange(pageNumber: number): void {
    this.assetPresenter.onPageChange(pageNumber);
  }

  /**
   * This method is invoked when the user performs a global search. It resets the selected rows, updates the criteria
   * and then gets the new list of AssetList based on updated criteria.
   * @param searchTerm The search string that has been searched by the user
   */
  public onSearch(searchTerm: string): void {
    this.assetPresenter.onSearch(searchTerm);
  }

  /** create for open modal when action perform */
  public openModal(asset): void {
    this.assetPresenter.openModal(asset);
  }

  /** on status filter change */
  public onStatusChange(status: AssetStatusList): void {
    this.assetPresenter.onStatusChange(this.statusOption);
  }

  /** toggle asset status */
  public setStatus({ statusValue }, { assetId }): void {
    this.setAssetStatus.emit({ statusValue, assetId });
  }

  /** Initializes default properties for the component */
  private initProperty(): void {
    this.tableProp = new Subject();
    this.tableProperty = new TableProperty<AssetFilter>();
    this.pageSize = pageCount;
    this.destroy = new Subject();
    this.getAsset = new EventEmitter<TableProperty<AssetFilter>>();
    this.deleteAsset = new EventEmitter<AssetFilter>();
    this.setAssetStatus = new EventEmitter<any>(true);
    this.isArchived$ = this.archiveModeService.archiveMode$;
    this.statusOption = true;
  }
}