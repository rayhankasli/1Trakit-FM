import { Injectable } from '@angular/core';
import { Adapter } from 'common-libs/projects';
import { Notification } from '../dashboard.model';

@Injectable()
export class NotificationAdapter implements Adapter<Notification> {

  /**
   * This is a method of  adapter class to modify CopyItChartStatus
   * response coming from service.
   * @param item
   */
  public toResponse(item: Notification): any {

    const model: Notification = new Notification(
      item.copyItId,
      item.bookItId,
      item.assetId,
      item.notification,
      item.requestorId,
      item.assetTicketId,
      item.dueDate
    );
    return model;
  }
}
