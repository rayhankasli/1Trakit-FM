/** 
 * @author Shahbaz Shaikh 
 */
import { Component, Input, ChangeDetectionStrategy, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { Router, NavigationEnd, Event } from '@angular/router';
// ---------------------------------------------- //
import { Notifications } from '../../../core/models/notification.model';

/**
 * NotificationContentComponent
 */
@Component({
  selector: 'lib-notification-content',
  templateUrl: './notification-content.component.html',
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotificationContentComponent {
  /**
   * Sets input
   */
  @Input() public set notifications(baseResponse: Notifications[]) {
    if (baseResponse) {
      this._notifications = baseResponse;
      this.cdr.detectChanges();
    }
  }

  /**
   * Output  of notification content component
   */
  @Output() public updateNotification: EventEmitter<Notifications>;

  public get notifications(): Notifications[] {
    return this._notifications;
  }

  /**
   * Show description of notification content component
   */
  public showDescription: boolean;

  /**
   * Notifications  of notification content component
   */
  private _notifications: Notifications[];
  constructor(
    private router: Router, private cdr: ChangeDetectorRef,
  ) {
    this.updateNotification = new EventEmitter();
    router.events.subscribe((val: Event) => {
      if (val instanceof NavigationEnd) {
        this.showDescription = true;
      }
    });
  }

  /**
   * Modify notification
   * @param notification 
   */
  public modifyNotification(notification: Notifications): void {
    if (!notification.isRead) {
      notification.isRead = true;
      this.updateNotification.emit(notification);
    }
  }
  /**
   * Tracks by
   * @param index 
   * @param item 
   * @returns by 
   */
  public trackBy(index: number, item: Notifications): number {
    return index;
  }
}

