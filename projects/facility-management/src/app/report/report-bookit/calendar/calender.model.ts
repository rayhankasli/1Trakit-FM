/**
 * This intertface is use to define color type of.
 */
export interface ColorsTypeOf {
    readonly grey: ColorProperty;
    readonly red: ColorProperty;
    readonly blue: ColorProperty;
    readonly yellow: ColorProperty;
}

/**
 * This intertface is use to define color type of.
 */
export interface ColorProperty {
    readonly primary: string;
    readonly secondary: string;
}

/**
 * This class is use to calender event.
 */
export class CalendarEvent {
    public start?: Date;
    public end?: Date;
    public events?: Events;
    constructor(
        start?: Date,
        end?: Date,
        events?: Events
    ) {
        this.start = start;
        this.end = end;
        this.events = events;
    }
}

/** This model is use to identify month and week view response  */
export class Calendar {
    public date?: string;
    public eventCount?: number;
    public events?: Events[];
    public startDate?: string;
    public endDate?: string;
    public clientId?: number;
    public roomId?: number;
    constructor(
        date?: string,
        eventCount?: number,
        events?: Events[],
        startDate?: string,
        endDate?: string,
        clientId?: number,
        roomId?: number
    ) {
        this.date = date;
        this.eventCount = eventCount;
        this.events = events;
        this.startDate = startDate;
        this.endDate = endDate;
        this.clientId = clientId;
        this.roomId = roomId;
    }
}

/** This model is use to identify month and week view response  */
export class CalendarResponse {
    public date?: string;
    public eventCount?: number;
    public events?: Events[];
    constructor(
        date?: string,
        eventCount?: number,
        events?: Events[]
    ) {
        this.date = date;
        this.eventCount = eventCount;
        this.events = events;
    }
}

/** This model is use to identify events  */
export class Events {
    public bookitId: number;
    public eventName: string;
    public eventDate: string;
    public timeFrom: string;
    public timeTo: string;
    public roomLayout: string;
    public roomId: number;
    public room: string;
    public amenities: Emenities[];
}

/** This model is use to identify emenities  */
export class Emenities {
    public amenityId: number;
    public amenity: string;
    public quantity: number;
}

/** This model is use to identify month and week view response  */
export class CalendarRequest {
    public startDate?: string;
    public endDate?: string;
    public clientId?: number;
    public roomId?: number;
    constructor(
        startDate?: string,
        endDate?: string,
        clientId?: number,
        roomId?: number
    ) {
        this.startDate = startDate;
        this.endDate = endDate;
        this.clientId = clientId;
        this.roomId = roomId;
    }
}

/** This model is define params for get month week */
export class CalendarParams {
    public startDate: string;
    public endDate: string;
    public clientId?: number;
    public roomId?: number;
}

/** This model is use to define current month end and start date */
export class CurrentMonthStartAndEndDate {
    public startDate: Date;
    public endDate: Date;
    constructor(
        startDate: Date,
        endDate: Date,
    ) {
        this.startDate = startDate;
        this.endDate = endDate;
    }
}

/** This model is use to define current month end and start date */
export class CalendarPeriodResponse {
    public startDate: string;
    public endDate: string;
}

/** This model is use to define current month end and start date */
export interface CalendarPeriod {
    readonly startDate: string;
    readonly endDate: string;
}

/** This model is use to define current month end and start date */
export class CalendarPeriodRequest {
    public clientId: number;
    constructor(
        clientId: number
    ) {
        this.clientId = clientId;
    }
}

/** This model is use to defien current week items */
export class CalendarWeek {
    public weekDate: string;
    public dayName: string;
    public utcDate: Date;
    public events: any[];
}

/** to-do */
export interface WeekFilterItem {
    readonly dateGroup: DateGroup[];
    readonly label?: string;
    readonly value?: number;
}

/** DateGroup */
export class DateGroup {
    public date: string;
    public disabled: boolean;
    public event: any[];
    public utcDate: Date;
    public dateSet?: Date;
    constructor(
        date: string,
        disabled: boolean,
        event: any[],
        utcDate: Date,
        dateSet?: Date,
    ) {
        this.date = date;
        this.dateSet = dateSet;
        this.disabled = disabled;
        this.event = event;
        this.utcDate = utcDate;
    }
}

/** MonthFilterItem */
export interface MonthFilterItem {
    id: number;
    label: string;
    utcDate: Date;
}

/** Rooms */
export interface Rooms {
    roomId: number;
    room: string;
}

/** CalendarMasterData */
export interface CalendarMasterData {
    readonly calendarPeriod: CurrentMonthStartAndEndDate;
    readonly allRooms: Rooms[];
}