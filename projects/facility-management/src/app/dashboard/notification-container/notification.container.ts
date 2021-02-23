/**
 * @author: Bikash Das
 * @description : This is a container class for Notificstion which is responsible to
 *                call notification service. 
 */

import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { TableProperty } from 'common-libs';
import { ArchiveModeService } from 'projects/facility-management/src/app/core/services/archive-mode/archive-mode.service';
import { Observable, Subject } from 'rxjs';
import { distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { Notification } from '../dashboard.model';
import { DashboardService } from '../dashboard.service';

@Component({
  selector: 'app-notification-container',
  templateUrl: './notification.container.html',
})
export class NotificationContainerComponent implements OnInit, OnDestroy {

  @Input() public set notificationParam(val: number) {
    if (val) {
      this.clientId = val;
    }
  }

  public notifications$: Observable<Notification[]>;
  public clientId: number;

  private isArchived: number;
  private destroy: Subject<boolean>;

  constructor(
    private dashboardChartService: DashboardService,
    private archievedModeService: ArchiveModeService
  ) {
    this.destroy = new Subject();
  }

  public ngOnInit(): void {
    this.archievedModeService.archiveMode$.pipe(distinctUntilChanged(), takeUntil(this.destroy))
      .subscribe((isArchived: boolean) => {
        this.isArchived = isArchived === true ? 1 : 0;
      })

  }

  /** get notification */
  public getNotificationList(tableProperty: TableProperty): void {
    tableProperty.filter = this.clientId;
    this.notifications$ = this.dashboardChartService.getNotifications(
      tableProperty, this.isArchived);
  }


  public ngOnDestroy(): void {
    this.destroy.next(true);
    this.destroy.unsubscribe();
  }
}
