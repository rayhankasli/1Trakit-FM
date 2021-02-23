/** 
 * @author Shahbaz Shaikh.
 * @description TTotalCopyVolumePresentationComponent component.
 */

import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
// -------------------------------------------------------- //
import { SidebarService } from 'common-libs';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
// ----------------------------------------------------- //
import { BasePresentation } from '../../../../../core/base-classes/base.presentation';
import { Permission } from '../../../../../core/enums/role-permissions.enum';
import { ClientMaster } from '../../../../../core/model/common.model';
import { CoreDataService } from '../../../../../core/services/core-data.service';
import { OPTIONAL_DECIMAL_FORMAT } from '../../../../../core/utility/constants';
import { TotalCopyVolumeResponse, TotalVolumePeriod } from '../../total-copy-volume.model';
import { TotalCopyVolumePresenter } from '../total-copy-volume-presenter/total-copy-volume.presenter';


@Component({
  selector: 'app-total-copy-volume-ui',
  templateUrl: './total-copy-volume.presentation.html',
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [TotalCopyVolumePresenter]
})
export class TotalCopyVolumePresentationComponent extends BasePresentation implements OnInit, OnDestroy {

  /** This will set client info data */
  @Input() public set clientMaster(value: ClientMaster) {
    if (value) {
      this._clientMaster = { ...value };
    }
  }

  public get clientMaster(): ClientMaster {
    return this._clientMaster;
  }

  /** Total copy Volume list */
  @Input() public set totalCopyVolume(value: TotalCopyVolumeResponse) {
    if (value) {
      this.checkYTDData(value);
      this.totalCopyVolumeList = value.period;
      this._totalCopyVolume = value;
      this.tableHeader = this.totalCopyVolumePresenter.getTableHeader(this._totalCopyVolume);
      this.totalCopyVolumePresenter.setChartData(this._totalCopyVolume);
      this.drawChart();
    }
  }

  public get totalCopyVolume(): TotalCopyVolumeResponse {
    return this._totalCopyVolume;
  }

  /** Event emitter set the clientId when component are initialize and change client ID. */
  @Output() public totalCopyCenterVolume: EventEmitter<number>;

  /** Holds Element reference of the content for chart */
  @ViewChild('totalCopyVolume', { static: false }) public chartContainer: ElementRef<HTMLDivElement>;
  /** Holds Element reference of the content for chart */
  @ViewChild('pieChartRef', { static: false }) public pieChartContainer: ElementRef<HTMLDivElement>;
  /** Holds Element reference of the content for chart */
  @ViewChild('pieChartNoData', { static: false }) public pieChartNoData: ElementRef<HTMLDivElement>;

  /** Store total copy volume list */
  public totalCopyVolumeList: TotalVolumePeriod[];
  /** Table Header */
  public tableHeader: string[];
  /** Current Months */
  public currentMonth: Date;
  /** client ID */
  public clientId: number;
  /** Decimal format for showing Amounts */
  public decimal: string = OPTIONAL_DECIMAL_FORMAT;
  /** Check the YTD data empty */
  public isEmpty: boolean;

  /** This enum is return users enum props. */
  public get totalCopyVolumeEnum(): typeof Permission.ReportsCopyIt {
    return Permission.ReportsCopyIt;
  }

  /** client info */
  private _clientMaster: ClientMaster;
  /** Total copy volume list */
  private _totalCopyVolume: TotalCopyVolumeResponse;
  /** destroy */
  private destroy: Subject<void>;

  constructor(
    private coreDataService: CoreDataService,
    private sidebarService: SidebarService,
    private totalCopyVolumePresenter: TotalCopyVolumePresenter
  ) {
    super();
    this.currentMonth = new Date();
    this.destroy = new Subject();
    this.totalCopyCenterVolume = new EventEmitter(true);
    this.tableHeader = [];
  }

  /** Chart Resize */
  @HostListener('window:resize', ['$event']) public onResize(): void {
    setTimeout(() => {
      this.drawChart();
    }, 500);
  }

  public ngOnInit(): void {
    this.coreDataService.globalClientId$.pipe(takeUntil(this.destroy)).subscribe((clientId: number) => {
      if (clientId > 0) {
        this.totalCopyCenterVolume.emit(clientId);
      } else {
        this.totalCopyCenterVolume.emit();
      }
      this.clientId = clientId;
    });

    this.sidebarService.isCollapsed.pipe(takeUntil(this.destroy)).subscribe((flag: boolean) => {
      if (this.totalCopyVolumeList) {
        setTimeout(() => {
          this.drawChart();
        }, 500)
      }
    });
  }

  public ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }

  /** Export PDF */
  public exportAsPDF(): void {
    let clientName: string = this.clientId > 0 ? this._clientMaster.client : 'All';
    this.totalCopyVolumePresenter.exportAsPDF(this._totalCopyVolume, clientName);
  }

  /**
   * Check the YTD value empty or zero
   * @param value 
   */
  private checkYTDData(value: TotalCopyVolumeResponse) {
    const YTDValue = {
      avgBwRequest: value.avgBwRequest,
      avgColorRequest: value.avgColorRequest,
      avgScanRequest: value.avgScanRequest
    }
    this.isEmpty = Object.values(YTDValue).every((res: number) => (res === 0));
  }

  private drawChart(): void {
    this.totalCopyVolumePresenter.drawChart(this.chartContainer);
    if (this.isEmpty) {
      /** Get the Pie Chart Container child nodes */
      const pieChartContainer = this.pieChartContainer.nativeElement.childNodes;
      /** Remove All items from child node */
      pieChartContainer.forEach((items) => {
        items.remove();
      });
      this.totalCopyVolumePresenter.setPieChartNoData();
    } else {
      this.totalCopyVolumePresenter.drawPieChart(this.pieChartContainer);
    }
  }

}