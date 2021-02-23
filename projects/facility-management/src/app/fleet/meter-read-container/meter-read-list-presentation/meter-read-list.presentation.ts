
/**
 * @author Ronak Patel.
 * @description This is data table presentation component.To represent get data from container component and render to dom.
 */
import { ScrollDispatcher } from '@angular/cdk/overlay';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { AfterViewInit, ChangeDetectionStrategy, Component, EventEmitter, Input, NgZone, OnDestroy, OnInit, Output, ViewChild, ViewContainerRef } from '@angular/core';
import { AuthPolicyService } from 'auth-policy';
import { pageCount, TableProperty } from 'common-libs';
import { debounceTime, filter } from 'rxjs/operators';
import { takeUntil } from 'rxjs/operators/takeUntil';
import { Subject } from 'rxjs/Subject';
// ---------------------------------------------------------- //
import { BasePresentation } from '../../../core/base-classes/base.presentation';
import { Permission } from '../../../core/enums/role-permissions.enum';
import { ArchiveModeService } from '../../../core/services/archive-mode/archive-mode.service';
import { DATE_FORMAT } from '../../../core/utility/constants';
import { Asset, AssetMeter, AssetMeterReadResult } from '../../fleet.model';
import { MeterReadListPresenter } from '../meter-read-list-presenter/meter-read-list.presenter';

/**
 * MeterReadListPresentationComponent
 */
@Component({
  selector: 'app-meter-read-list-ui',
  templateUrl: './meter-read-list.presentation.html',
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [MeterReadListPresenter]
})
export class MeterReadListPresentationComponent extends BasePresentation implements OnInit, AfterViewInit, OnDestroy {

  /** 
   * to handle successful deleting the record
   * reset the table properties and reload the list
   */
  @Input() public set onDeleteSuccess(count: number) {
    if (count) {
      this.meterReadPresenter.onDeleteSuccessCallback();
    }
  }
  /** to reset the lazyloaded list forcefully */
  @Input() public set resetList(flag: boolean) {
    if (flag) {
      this.meterReadPresenter.resetList();
    }
  }
  /** This property is used for get data from container component */
  @Input() public set baseResponse(baseResponse: AssetMeterReadResult) {
    if (baseResponse) {
      this._baseResponse = { ...this.meterReadPresenter.setMissingMeterRead(baseResponse) };
      this.totalRecord = this._baseResponse.total;
      this.addMeterRead.emit();
      this.setTableData();
    }
  };
  public get baseResponse(): AssetMeterReadResult {
    return this._baseResponse;
  }
  public get meterReads(): AssetMeter[] {
    return this.baseResponse.assetMeterList;
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

  /**
   * This enum is return FleetMeterReads enum props.
   */
  public get fleetMeterReadsEnum(): typeof Permission.FleetMeterReads {
    return Permission.FleetMeterReads;
  }

  /** get common formate for date */
  public get dateFormat(): string {
    return DATE_FORMAT;
  }
  public get searchText(): string {
    return this.tableProperty.search;
  }


  /** This property is used for emit data to container component */
  @Output() public getMeterRead: EventEmitter<TableProperty>;
  /** addMeterRead */
  @Output() public addMeterRead: EventEmitter<void>;
  /** addMissingMeterRead */
  @Output() public addMissingMeterRead: EventEmitter<[AssetMeter, AssetMeter]>;
  /** exportPDF */
  @Output() public exportPDF: EventEmitter<void>;
  /** exportExcel */
  @Output() public exportExcel: EventEmitter<void>;
  /** printDetails */
  @Output() public printDetails: EventEmitter<number>;
  /** addNewReader */
  @Output() public addNewReader: EventEmitter<boolean>;
  /** delete meter-read evenet */
  @Output() public deleteSlots: EventEmitter<number>;

  /** virtualScroll */
  @ViewChild(CdkVirtualScrollViewport, { static: false }) public virtualScroll: CdkVirtualScrollViewport;

  /**
   * View child of customer list presentation component
   */
  @ViewChild('container', { read: ViewContainerRef, static: false }) public container: ViewContainerRef;

  /** This property is used to store the selected MeterReads */
  public selectedMeterReads: Set<AssetMeter>;

  /** This property is used to store the criteria that are selected by the user */
  public tableProperty: TableProperty;

  /** This property is used to store the options that are available in the Page Size selection drawdown */
  public pageSize: number[];

  /** This boolean is used to indicate whether all rows are selected or not  */
  public isCheckAll: boolean;

  /** Table prop of customer list presentation component */
  public tableProp: Subject<TableProperty>;

  /** This property is used for checking filter applied or not. */
  public isFilterApply: boolean;

  /** This property is used for checking sort applied or not. */
  public isSortApply: boolean;
  /** to show total records available in list */
  public totalRecord: number;
  /** to check archive mode enable */
  public isArchived: boolean;
  /** to check if user can delete the record based on permission */
  public canDelete: boolean;

  /** create for getter setter */
  private _assetRecord: Asset;
  private _baseResponse: AssetMeterReadResult;

  /** create for  */
  private destroy: Subject<boolean>;

  constructor(
    private zone: NgZone,
    private scrollDispatcher: ScrollDispatcher,
    private meterReadPresenter: MeterReadListPresenter,
    private archiveModeService: ArchiveModeService,
    private authPolicyService: AuthPolicyService
  ) {
    super();
    this.initProperty();
  }

  public ngOnInit(): void {
    this.meterReadPresenter.setTableProp$.pipe(takeUntil(this.destroy)).subscribe((tableProperty: TableProperty) => {
      this.getMeterRead.emit(tableProperty);
      this.tableProperty = tableProperty;
    });
    this.meterReadPresenter.tableProp$.subscribe((value: TableProperty) => {
      this.tableProperty = value;
    });
    // listen to delete event and emit to container
    this.meterReadPresenter.deleteRecord$.pipe(takeUntil(this.destroy))
      .subscribe((meterRead: AssetMeter) => { this.deleteSlots.emit(meterRead.assetMeterId) });
    // listen to archive mode
    this.archiveModeService.archiveMode$.pipe(takeUntil(this.destroy)).subscribe((isArchived: boolean) => {
      this.isArchived = isArchived ? isArchived : false;
    });
  }

  public ngAfterViewInit(): void {
    this.zone.runOutsideAngular(() => {
      this.scrollDispatcher.scrolled().pipe(
        takeUntil(this.destroy),
        debounceTime(100),
        filter((event: CdkVirtualScrollViewport) => this.virtualScroll.measureScrollOffset('bottom') === 0))
        .subscribe((event: CdkVirtualScrollViewport) => {
          this.zone.run(() => {
            if (this.baseResponse.assetMeterList && (this.baseResponse.assetMeterList.length > 0 && this.baseResponse.assetMeterList.length < this.totalRecord)) {
              this.meterReadPresenter.onScroll();
            }
          })
        });
    })
  }

  /**
   * Sets table data
   */
  public setTableData(): void {
    this.meterReadPresenter.meterReads = this.baseResponse.assetMeterList;
    this.meterReadPresenter.setTableData();
  }

  /**
   * This method is invoked when the user performs a global search. It resets the selected rows, updates the criteria
   * and then gets the new list of MeterRead based on updated criteria.
   * @param searchTerm The search string that has been searched by the user
   */
  public onSearch(searchTerm: string): void {
    this.meterReadPresenter.onSearch(searchTerm);
  }

  /** onAddMeterRead  */
  public onAddMeterRead(): void {
    this.addNewReader.emit(true);
  }
  /** onAddMissingEntry  */
  public onAddMissingEntry(previous: AssetMeter, current: AssetMeter): void {
    this.addMissingMeterRead.emit([previous, current]);
  }
  /** onExportAsPDF  */
  public onExportAsPDF(): void {
    this.exportPDF.emit();
  }
  /** onExportAsExcel  */
  public onExportAsExcel(): void {
    this.exportExcel.emit();
  }
  /** onPrint  */
  public onPrint(): void {
    this.printDetails.emit(this.totalRecord);
  }

  /** ask for confirmation and delete the record */
  public deleteReading(meterRead: AssetMeter): void {
    this.meterReadPresenter.openDeleteConfirmationModal(meterRead)
  }

  /** destroy */
  public ngOnDestroy(): void {
    this.destroy.next(true);
    this.destroy.unsubscribe();
  }

  /** Initializes default properties for the component */
  private initProperty(): void {
    this._baseResponse = new AssetMeterReadResult();
    this.selectedMeterReads = new Set();
    this.isCheckAll = false;
    this.tableProp = new Subject();
    this.tableProperty = new TableProperty();
    this.pageSize = pageCount;
    this.destroy = new Subject();
    this.addMeterRead = new EventEmitter(true);
    this.addMissingMeterRead = new EventEmitter(true);
    this.exportExcel = new EventEmitter(true);
    this.exportPDF = new EventEmitter(true);
    this.printDetails = new EventEmitter(true);
    this.addNewReader = new EventEmitter(true);
    this.deleteSlots = new EventEmitter(true);
    this.getMeterRead = new EventEmitter<TableProperty>(true);
    this.canDelete = this.authPolicyService.hasPermission(this.fleetMeterReadsEnum.delete);
  }
}
