
/**
 * @author: Bikash Das
 * @description : This is a prsentation class for Notificstion which is responsible to show
 *                list of notifiaction data. 
 */

import { CdkVirtualScrollViewport, ScrollDispatcher } from '@angular/cdk/scrolling';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, NgZone, OnDestroy, OnInit, Output, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from '@angular/router';
import { TableProperty } from 'common-libs';
import { BasePresentation } from 'projects/facility-management/src/app/core/base-classes/base.presentation';
import { ArchiveModeService } from 'projects/facility-management/src/app/core/services/archive-mode/archive-mode.service';
import { Subject } from 'rxjs';
import { debounceTime, filter, takeUntil } from 'rxjs/operators';
import { DATE_TIME_FORMAT } from '../../../core/utility/constants';
import { Notification } from '../../dashboard.model';
import { NotificationPresenter } from '../notification-presenter/notification-presenter';

/** component */
@Component({
  selector: 'app-notification-ui',
  templateUrl: './notification.presentation.html',
  viewProviders: [NotificationPresenter],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotificationPresentationComponent extends BasePresentation implements OnInit, AfterViewInit, OnDestroy {

  /**
   * This is a setter method to set notification data
   */
  @Input() public set notifications(data: Notification[]) {
    if (data) {
      this._notifications = this._notifications.concat(data);
      this.lastRecord = data.length;
      if (data.length === 0)
        this.isData = true;

    }
  }
  /**
   * This is a getter method to get notification data.
   */
  public get notifications(): Notification[] {
    return this._notifications;
  }

  /** This property is used for emit data to container component */
  @Output() public getNotificationList: EventEmitter<TableProperty>;

  @ViewChild(CdkVirtualScrollViewport, { static: false }) public virtualScroll: CdkVirtualScrollViewport;

  public readonly dateFormat: string = DATE_TIME_FORMAT;
  public date: string;
  public time: string;
  public isData: boolean = false;
  /** This property is used to store the criteria that are selected by the user */
  public tableProperty: TableProperty;
  private isArchived: boolean;
  private _notifications: Notification[];
  private destroy: Subject<boolean>;
  private lastRecord: number;

  constructor(
    public changeDetection: ChangeDetectorRef,
    private scrollDispatcher: ScrollDispatcher,
    private notificationPresenter: NotificationPresenter,
    private router: Router,
    private route: ActivatedRoute,
    private zone: NgZone,
    private archiveMode: ArchiveModeService
  ) {
    super();
    this.destroy = new Subject();
    this.initProperty();
    this.archiveMode.archiveMode$.pipe(takeUntil(this.destroy)).subscribe((flag: boolean) => this.isArchived = flag);
  }

  /** onInit life cycle method */
  public ngOnInit(): void {
    this.notificationPresenter.setTableProp$.pipe(takeUntil(this.destroy)).subscribe((tableProperty: TableProperty) => {
      if (this.lastRecord < this.tableProperty.pageLimit) {
        return;
      }
      this.getNotificationList.emit(tableProperty);
      this.tableProperty = tableProperty;
    });
  }

  /**
   * provide ng life cycle hook
   */
  public ngAfterViewInit(): void {
    this.zone.runOutsideAngular((fn) => {
      this.scrollDispatcher.scrolled().pipe(takeUntil(this.destroy), filter((event: CdkVirtualScrollViewport) =>
        this.virtualScroll.measureScrollOffset('bottom') === 0), debounceTime(100))
        .subscribe((event: CdkVirtualScrollViewport) => {
          this.zone.run(() => {
            if (this.notifications && this.notifications.length > 0) {
              this.notificationPresenter.onScroll();
            }
          })
        });
    })
  }

  /**
   * Routing occurs as per module type.
   * @param notifiaction 
   */
  public checkType(notifiaction: Notification): void {
    const base: string = this.isArchived ? '/archive' : '';
    if (notifiaction.copyItId) {
      this.router.navigate([base, 'copyit', notifiaction.copyItId], { relativeTo: this.route })
    } else if (notifiaction.bookItId) {
      this.router.navigate([base, 'bookit', notifiaction.bookItId], { relativeTo: this.route })
    } else {
      this.router.navigate([base, 'asset', notifiaction.assetId, 'ticket', notifiaction.assetTicketId], { relativeTo: this.route })
    }
  }

  /** Initializes default properties for the component */
  private initProperty(): void {
    this.tableProperty = new TableProperty();
    this.getNotificationList = new EventEmitter<TableProperty>();
    this._notifications = [];
  }

  /** life cicle method to destroy */
  // tslint:disable-next-line: member-ordering
  public ngOnDestroy(): void {
    this.destroy.next(true);
  }
}
