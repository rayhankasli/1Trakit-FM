/** 
 * @author Shahbaz Shaikh
 */
import { Adapter } from './adapter';
import { Notifications, UpdateNotification, NotificationResult } from '../models/notification.model';

/**
 * Notification adapter
 */
export class NotificationAdapter implements Adapter<Notifications> {

    /**
     * To request
     * @param items 
     * @returns request 
     */
    public toRequest(items: any): Notifications {
        const result: any = JSON.parse(items.result);
        const notification: Notifications = new Notifications(
            items.publicationId,
            items.subscriptionId,
            items.channelName,
            items.publishedOn,
            new NotificationResult(
                result.Title,
                result.Description,
                result.Priority,
                result.Type,
                result.Link
            ),
            items.isRead

        );
        return notification;
    }

    /**
     * To response
     * @param items 
     * @returns response 
     */
    public toResponse(items: any): Notifications {
        const result: any = JSON.parse(items.result);
        const notification: Notifications = new Notifications(
            items.publicationId,
            items.subscriptionId,
            items.channelName,
            items.publishedOn,
            new NotificationResult(
                result.Title,
                result.Description,
                result.Priority,
                result.Type,
                result.Link
            ),
            items.isRead
        );
        return notification;
    }
}

/**
 * Update notification adapter
 */
export class UpdateNotificationAdapter implements Adapter<Notifications> {
    /**
     * To request
     * @param items 
     * @returns request 
     */
    public toRequest(items: UpdateNotification): UpdateNotification {
        const updateNotification: UpdateNotification = new UpdateNotification(
            items.publicationId,
            items.isRead

        );
        return updateNotification;
    }

}