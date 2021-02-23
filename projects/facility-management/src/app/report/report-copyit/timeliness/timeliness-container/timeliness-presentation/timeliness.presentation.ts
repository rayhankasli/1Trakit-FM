/** 
 * @author Shahbaz Shaikh.
 * @description TimelinessPresentationComponent component.
 */


import { Component, ChangeDetectionStrategy, Input, ViewChild, ElementRef, OnInit, OnDestroy, Output, EventEmitter, HostListener } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
// ----------------------------------------------------- //
import { SidebarService } from 'common-libs';
// ----------------------------------------------------- //
import { CoreDataService } from '../../../../../core/services/core-data.service';
import { ClientMaster } from '../../../../../core/model/common.model';
import { Permission } from '../../../../../core/enums/role-permissions.enum';
import { TimelinessPresenter } from '../timeliness-presenter/timeliness.presenter';
import { TimelinessResponse } from '../../timeliness.model';


@Component({
  selector: 'app-timeliness-ui',
  templateUrl: './timeliness.presentation.html',
  viewProviders: [TimelinessPresenter],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TimelinessPresentationComponent implements OnInit, OnDestroy {

  /** This will set client info data */
  @Input() public set clientMaster(value: ClientMaster) {
    if (value) {
      this._clientMaster = { ...value };
    }
  }

  public get clientMaster(): ClientMaster {
    return this._clientMaster;
  }

  /** Timeliness List */
  @Input() public set timelinessList(value: TimelinessResponse[]) {
    if (value) {
      this._timelinessList = value;
      this.tableHeader = this.timelinessPresenter.getTableHeader(this._timelinessList);
      this.timelinessPresenter.setChartData(this._timelinessList);
      this.timelinessPresenter.drawTimelinessChart(this.chartContainer);
    }
  }

  public get timelinessList(): TimelinessResponse[] {
    return this._timelinessList;
  }

  /** Event emitter set the clientId when component are initialize and change client ID. */
  @Output() public timeliness: EventEmitter<number>;

  /** Holds Element reference of the content for chart */
  @ViewChild('timelinessRef', { static: false }) public chartContainer: ElementRef<HTMLDivElement>;

  /** Table Header */
  public tableHeader: string[];
  /** Current Months */
  public currentMonth: Date;
  /** client ID */
  public clientId: number;

  /** This enum is return users enum props. */
  public get timelinessEnum(): typeof Permission.ReportsCopyIt {
    return Permission.ReportsCopyIt;
  }

  /** client info */
  private _clientMaster: ClientMaster;
  /** Timeliness List */
  private _timelinessList: TimelinessResponse[];
  /** destroy */
  private destroy: Subject<void>;

  constructor(
    private coreDataService: CoreDataService,
    private sidebarService: SidebarService,
    private timelinessPresenter: TimelinessPresenter
  ) {
    this.destroy = new Subject();
    this.timeliness = new EventEmitter(true);
    this.currentMonth = new Date();
    this.tableHeader = [];
  }

  /** Chart Resize */
  @HostListener('window:resize', ['$event']) public onResize(): void {
    setTimeout(() => {
      this.timelinessPresenter.drawTimelinessChart(this.chartContainer);
    }, 500);
  }

  public ngOnInit(): void {
    this.coreDataService.globalClientId$.pipe(takeUntil(this.destroy)).subscribe((clientId: number) => {
      if (clientId > 0) {
        this.timeliness.emit(clientId);
      } else {
        this.timeliness.emit();
      }
      this.clientId = clientId;
    });

    this.sidebarService.isCollapsed.pipe(takeUntil(this.destroy)).subscribe((flag: boolean) => {
      if (this._timelinessList) {
        setTimeout(() => {
          this.timelinessPresenter.drawTimelinessChart(this.chartContainer);
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
    this.timelinessPresenter.exportAsPDF(this._timelinessList, clientName);
  }

  /** to optimize DOM */
  public trackBy(key:string,index:number,data:any):number{
    return data[key];
  }
}
