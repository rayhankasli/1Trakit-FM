/**
 * @author Shahbaz Shaikh
 */

/**
 * Notifications
 */
export class Notifications {
    /**
     * Publication id of notification
     */
    public publicationId: number;
    /**
     * Subscription id of notification
     */
    public subscriptionId: number;
    /**
     * Channel name of notification
     */
    public channelName: string;
    /**
     * Published on of notification 
     */
    public publishedOn: string;
    /**
     * Result of notification
     */
    public result: NotificationResult;
    /**
     * Determines whether read is
     */
    public isRead: boolean;

    constructor(
        publicationId: number,
        subscriptionId: number,
        channelName: string,
        publishedOn: string,
        result: NotificationResult,
        isRead: boolean

    ) {
        this.publicationId = publicationId;
        this.subscriptionId = subscriptionId;
        this.channelName = channelName;
        this.publishedOn = publishedOn;
        this.result = result
        this.isRead = isRead;
    }
}

/**
 * Result
 */
export class NotificationResult {
    /**
     * Title  of notifications
     */
    public title: string;
    /**
     * Description  of notifications
     */
    public description: string;
    /**
     * Priority  of notifications
     */
    public priority: null;
    /**
     * Type  of notifications
     */
    public type: string;
    /**
     * Link  of notifications
     */
    public link: string;

    constructor(
        title: string,
        description: string,
        priority: null,
        type: string,
        link: string,
    ) {
        this.title = title;
        this.priority = priority;
        this.type = type;
        this.link = link;
        this.description = description;
    }
}

/**
 * Update notification
 */
export class UpdateNotification {
    /**
     * Publication id of notification
     */
    public publicationId: number;
    /**
     * Determines whether read is
     */
    public isRead: boolean;

    constructor(
        publicationId: number,
        isRead: boolean
    ) {
        this.publicationId = publicationId;
        this.isRead = isRead;
    }
}