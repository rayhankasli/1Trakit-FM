/** 
 * @author Shahbaz Shaikh.
 * @description CopyCenterImpScanPresentationComponent component.
 */


import { Component, ChangeDetectionStrategy, Input, ViewChild, ElementRef, Output, EventEmitter, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
// ---------------------------------- //
import { SidebarService } from 'common-libs';
// ----------------------------------------------------- //
import { CoreDataService } from '../../../../../core/services/core-data.service';
import { ClientMaster } from '../../../../../core/model/common.model';
import { OPTIONAL_DECIMAL_FORMAT } from '../../../../../core/utility/constants';
import { Permission } from '../../../../../core/enums/role-permissions.enum';
import { CopyCenterImpScanPresenter } from '../copy-center-imp-scan-presenter/copy-center-imp-scan.presenter';
import { CopyIMPScanResponse } from '../../copy-center-imp-scan.model';

@Component({
  selector: 'app-copy-center-imp-scan-ui',
  templateUrl: './copy-center-imp-scan.presentation.html',
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [CopyCenterImpScanPresenter]
})
export class CopyCenterImpScanPresentationComponent implements OnInit, OnDestroy {

  /** This will set client info data */
  @Input() public set clientMaster(value: ClientMaster) {
    if (value) {
      this._clientMaster = { ...value };
    }
  }

  public get clientMaster(): ClientMaster {
    return this._clientMaster;
  }

  /** Copy Center IMP Scan List */
  @Input() public set copyCenterIMPScanList(value: CopyIMPScanResponse[]) {
    if (value) {
      this._copyCenterIMPScanList = value;
      this.tableHeader = this.copyCenterImpScanPresenter.getTableHeader(this._copyCenterIMPScanList);
      this.copyCenterImpScanPresenter.setChartData(this._copyCenterIMPScanList);
      this.copyCenterImpScanPresenter.drawChart(this.chartContainer);
    }
  }

  public get copyCenterIMPScanList(): CopyIMPScanResponse[] {
    return this._copyCenterIMPScanList;
  }

  /** Event emitter set the clientId when component are initialize and change client ID. */
  @Output() public copyCenterIMPScan: EventEmitter<number>;

  /** Holds Element reference of the content for chart */
  @ViewChild('copyCenterIMPScan', { static: false }) public chartContainer: ElementRef<HTMLDivElement>;

  /** tableHeader */
  public tableHeader: string[];
  /** Current Months */
  public currentMonth: Date;
  /** client ID */
  public clientId: number;
  /** Decimal format for showing Amounts */
  public decimal: string = OPTIONAL_DECIMAL_FORMAT;

  /** This enum is return users enum props. */
  public get copyCenterImpScanEnum(): typeof Permission.ReportsCopyIt {
    return Permission.ReportsCopyIt;
  }

  /** client info */
  private _clientMaster: ClientMaster;
  /** Copy Center IMP Scan List */
  private _copyCenterIMPScanList: CopyIMPScanResponse[];
  /** destroy */
  private destroy: Subject<void>;

  constructor(
    private coreDataService: CoreDataService,
    private sidebarService: SidebarService,
    private copyCenterImpScanPresenter: CopyCenterImpScanPresenter
  ) {
    this.destroy = new Subject();
    this.copyCenterIMPScan = new EventEmitter(true);
    this.currentMonth = new Date();
    this.tableHeader = [];
  }

  /** Chart Resize */
  @HostListener('window:resize', ['$event']) public onResize(): void {
    setTimeout(() => {
      this.copyCenterImpScanPresenter.drawChart(this.chartContainer);
    }, 500);
  }

  public ngOnInit(): void {
    this.coreDataService.globalClientId$.pipe(takeUntil(this.destroy)).subscribe((clientId: number) => {
      if (clientId > 0) {
        this.copyCenterIMPScan.emit(clientId);
      } else {
        this.copyCenterIMPScan.emit();
      }
      this.clientId = clientId;
    });

    this.sidebarService.isCollapsed.pipe(takeUntil(this.destroy)).subscribe((flag: boolean) => {
      if (this._copyCenterIMPScanList) {
        setTimeout(() => {
          this.copyCenterImpScanPresenter.drawChart(this.chartContainer);
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
    this.copyCenterImpScanPresenter.exportAsPDF(this._copyCenterIMPScanList, clientName);
  }

  /** to optimize DOM */
  public trackBy(key: string, index: number, data: any): number {
    return data[key];
  }
}