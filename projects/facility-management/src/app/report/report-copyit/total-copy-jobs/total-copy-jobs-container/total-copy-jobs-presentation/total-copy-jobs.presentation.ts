/** 
 * @author Shahbaz Shaikh.
 * @description TotalCopyJobsPresentationComponent component.
 */

import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
// ---------------------------------------------------------------- //
import { SidebarService } from 'common-libs';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
// ----------------------------------------------------- //
import { BasePresentation } from '../../../../../core/base-classes/base.presentation';
import { Permission } from '../../../../../core/enums/role-permissions.enum';
import { ClientMaster } from '../../../../../core/model/common.model';
import { CoreDataService } from '../../../../../core/services/core-data.service';
import { OPTIONAL_DECIMAL_FORMAT } from '../../../../../core/utility/constants';
import { TotalCopyJobsResponse } from '../../total-copy-jobs.model';
import { TotalCopyJobsPresenter } from '../total-copy-jobs-presenter/total-copy-jobs.presenter';


@Component({
  selector: 'app-total-copy-jobs-ui',
  templateUrl: './total-copy-jobs.presentation.html',
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [TotalCopyJobsPresenter]
})
export class TotalCopyJobsPresentationComponent extends BasePresentation implements OnInit, OnDestroy {

  /** This will set client info data */
  @Input() public set clientMaster(value: ClientMaster) {
    if (value) {
      this._clientMaster = { ...value };
    }
  }

  public get clientMaster(): ClientMaster {
    return this._clientMaster;
  }

  /** Total copy jobs list */
  @Input() public set totalCopyJobsList(value: TotalCopyJobsResponse[]) {
    if (value) {
      this._totalCopyJobsList = value;
      this.tableHeader = this.totalCopyJobsPresenter.getTableHeader(this._totalCopyJobsList);
      this.totalCopyJobsPresenter.setChartData(this._totalCopyJobsList);
      this.totalCopyJobsPresenter.drawChart(this.chartContainer);
    }
  }

  public get totalCopyJobsList(): TotalCopyJobsResponse[] {
    return this._totalCopyJobsList;
  }

  /** Event emitter set the clientId when component are initialize and change client ID. */
  @Output() public totalCopyJob: EventEmitter<number>;

  /** Holds Element reference of the content for chart */
  @ViewChild('totalCopyJobs', { static: false }) public chartContainer: ElementRef<HTMLDivElement>;

  /** Table Header */
  public tableHeader: string[];
  /** Current Months */
  public currentMonth: Date;
  /** client ID */
  public clientId: number;
  /** Decimal format for showing Amounts */
  public decimal: string = OPTIONAL_DECIMAL_FORMAT;

  /** This enum is return users enum props. */
  public get totalCopyJobsEnum(): typeof Permission.ReportsCopyIt {
    return Permission.ReportsCopyIt;
  }

  /** client info */
  private _clientMaster: ClientMaster;
  /** Total copy Jobs List */
  private _totalCopyJobsList: TotalCopyJobsResponse[];
  /** destroy */
  private destroy: Subject<void>;

  constructor(
    private coreDataService: CoreDataService,
    private sidebarService: SidebarService,
    private totalCopyJobsPresenter: TotalCopyJobsPresenter
  ) {
    super();
    this.destroy = new Subject();
    this.totalCopyJob = new EventEmitter(true);
    this.currentMonth = new Date();
    this.tableHeader = [];
  }

  /** Chart Resize */
  @HostListener('window:resize', ['$event']) public onResize(): void {
    setTimeout(() => {
      this.totalCopyJobsPresenter.drawChart(this.chartContainer);
    }, 500);
  }

  public ngOnInit(): void {
    this.coreDataService.globalClientId$.pipe(takeUntil(this.destroy)).subscribe((clientId: number) => {
      if (clientId > 0) {
        this.totalCopyJob.emit(clientId);
      } else {
        this.totalCopyJob.emit();
      }
      this.clientId = clientId;
    });

    this.sidebarService.isCollapsed.pipe(takeUntil(this.destroy)).subscribe((flag: Boolean) => {
      if (this._totalCopyJobsList) {
        setTimeout(() => {
          this.totalCopyJobsPresenter.drawChart(this.chartContainer);
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
    this.totalCopyJobsPresenter.exportAsPDF(this._totalCopyJobsList, clientName);
  }
}