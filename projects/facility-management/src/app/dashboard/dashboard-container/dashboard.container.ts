/**
 * @author : Bikash Das
 * @description: This is a container class for dashboard
 */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { TableProperty } from 'projects/common-libs/src/projects';
import { Observable, Subject } from 'rxjs';
import { distinctUntilChanged, map, takeUntil } from 'rxjs/operators';
import { ClientMaster, MultiSelectFilterRecord } from '../../core/model/common.model';
import { UserInfo } from '../../core/model/core.model';
import { ArchiveModeService } from '../../core/services/archive-mode/archive-mode.service';
import { CoreDataService } from '../../core/services/core-data.service';
import { AssociateStatusChart, BookItChartStatusResponse, BookItRequestStatus, ClientStatusChart, CopyItChartStatusResponse, CopyItRequestStatus, FleetChartStatus, FleetRequestStatus, OpenRequest, RequestStatusFilter } from '../dashboard.model';
import { DashboardService } from '../dashboard.service';

/**
 * DashboardContainerComponent
 */
@Component({
  selector: 'app-dashboard-container',
  templateUrl: './dashboard.container.html',
})
export class DashboardContainerComponent implements OnInit, OnDestroy {
  public getCopyItStatus: CopyItChartStatusResponse;
  public getBookItStatus: BookItChartStatusResponse;
  public getFleetStatus: FleetChartStatus;
  public getClientChartStatus: ClientStatusChart[];
  public getAssociateChartStatus: AssociateStatusChart[];
  public getChartStatusCopyitRequest: CopyItRequestStatus[];
  public getChartStatusBookitRequest: BookItRequestStatus[];
  public getChartStatusFleetRequest: FleetRequestStatus[];
  public openRequest: OpenRequest[];
  public clientList$: Observable<ClientMaster[]>;

  private destroy: Subject<boolean>;
  private isArchived: number;


  constructor(
    private dashboardChartService: DashboardService,
    private coreDataService: CoreDataService,
    private archieveModeService: ArchiveModeService
  ) {
    this.destroy = new Subject();
  }

  public ngOnInit(): void {
    this.clientList$ = this.coreDataService.userInfo$.pipe(
      map((data: UserInfo) => data.clients)
    );

    this.archieveModeService.archiveMode$.pipe(distinctUntilChanged(), takeUntil(this.destroy))
      .subscribe((isArchived: boolean) => {
        this.isArchived = isArchived === true ? 1 : 0;
      })
  }

  /**
   * get copyit related data
   * @param tableProperty table props with filter
   */
  public getCopyItChartLists(tableProperty: TableProperty<MultiSelectFilterRecord>): void {
    this.dashboardChartService
      .getCopyItChartStatus(tableProperty, this.isArchived)
      .pipe(takeUntil(this.destroy))
      .subscribe((data: CopyItChartStatusResponse) => {
        this.getCopyItStatus = data;
      });
  }

  /**
   * get bookit related data
   * @param tableProperty table props with filter
   */
  public getBookItChartLists(tableProperty: TableProperty<MultiSelectFilterRecord>): void {
    this.dashboardChartService
      .getBookItChartStatus(tableProperty, this.isArchived)
      .pipe(takeUntil(this.destroy))
      .subscribe((data: BookItChartStatusResponse) => {
        this.getBookItStatus = data;
      });
  }

  /**
   * get fleet related data
   * @param tableProperty table props with filter
   */
  public getFleetChartLists(tableProperty: TableProperty<MultiSelectFilterRecord>): void {
    this.dashboardChartService
      .getFleetChartStatus(tableProperty, this.isArchived)
      .pipe(takeUntil(this.destroy))
      .subscribe((data: FleetChartStatus) => {
        this.getFleetStatus = data;
      });
  }

  /**
   * get client status data
   * @param tableProperty table props with filter
   */
  public getClientStatus(tableProperty: TableProperty<MultiSelectFilterRecord>): void {
    this.dashboardChartService
      .getClientChartStatus(tableProperty, this.isArchived)
      .pipe(takeUntil(this.destroy))
      .subscribe((data: ClientStatusChart[]) => {
        this.getClientChartStatus = data;
      });
  }

  /**
   * get associate status data
   * @param tableProperty table props with filter
   */
  public getAssociateStatus(tableProperty: TableProperty<MultiSelectFilterRecord>): void {
    this.dashboardChartService
      .getAssociateChartStatus(tableProperty, this.isArchived)
      .pipe(takeUntil(this.destroy))
      .subscribe((data: AssociateStatusChart[]) => {
        this.getAssociateChartStatus = data;
      });
  }

  /** getting combochart status report for copyit */
  public getCopyItCombochartData(param: RequestStatusFilter): void {
    this.dashboardChartService
      .getCopyItRequestStatus(param, this.isArchived)
      .pipe(takeUntil(this.destroy))
      .subscribe((data: CopyItRequestStatus[]) => {
        this.getChartStatusCopyitRequest = data;
      });
  }

  /** getting combochart status report for bookit */
  public getbookItCombochartData(param: any): void {
    this.dashboardChartService
      .getBookItRequestStatus(param, this.isArchived)
      .pipe(takeUntil(this.destroy))
      .subscribe((data: BookItRequestStatus[]) => {
        this.getChartStatusBookitRequest = data;
      });
  }

  /** getting combochart status report for fleet */
  public getFleetCombochartData(param: any): void {
    this.dashboardChartService
      .getFleetRequestStatus(param, this.isArchived)
      .pipe(takeUntil(this.destroy))
      .subscribe((data: FleetRequestStatus[]) => {
        this.getChartStatusFleetRequest = data;
      });
  }

  /**
   * get open request related data
   * @param tableProperty table props with filter
   */
  public getOpenRequests(tableProperty: TableProperty): void {
    this.dashboardChartService
      .getOpenRequest(tableProperty, this.isArchived)
      .pipe(takeUntil(this.destroy))
      .subscribe((data: OpenRequest[]) => {
        this.openRequest = data;
      });
  }

  public ngOnDestroy(): void {
    this.destroy.next(true);
    this.destroy.unsubscribe();
  }
}
