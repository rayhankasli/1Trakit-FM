import { Injectable } from '@angular/core';
// ---------------------------------------------- //
import { Adapter } from 'common-libs';
// ---------------------------------------------- //
import { getLocaleDate } from '../../../../core/utility/utility';
import {
    Calendar, CalendarParams, CalendarPeriodRequest, CalendarPeriodResponse,
    CalendarRequest, CalendarResponse, CurrentMonthStartAndEndDate, Events
} from '../calender.model';



/**
 * CalenderAdapter
 */
@Injectable()
export class CalendarAdapter implements Adapter<Calendar> {
    /** This method is used to transform response object into T object. */
    public toResponse(item: CalendarResponse): Calendar {
        const calendar: Calendar = new Calendar(
            item.date,
            item.eventCount,
            this.getEvents(item.events)
        );
        return calendar;
    }

    /** This method is used to transform T object into request object. */
    public toRequest(item: CalendarRequest): CalendarParams {
        const calendar: CalendarParams = new CalendarParams();
        calendar.startDate = item.startDate;
        calendar.endDate = item.endDate;
        calendar.clientId = item.clientId;
        calendar.roomId = item.roomId;
        this.removeUndefinedValueKey(calendar);
        return calendar;
    }

    /** getEvents  */
    private getEvents(event: Events[]): Events[] {
        let eventData: Events[] = [];
        event.forEach((e: Events) => {
            let events: Events = new Events();
            events.bookitId = e.bookitId;
            events.eventName = e.eventName;
            events.eventDate = (e.eventDate).toString();
            events.timeFrom = e.timeFrom;
            events.timeTo = e.timeTo;
            events.roomLayout = e.roomLayout;
            events.roomId = e.roomId;
            events.room = e.room;
            events.amenities = e.amenities;
            eventData.push(events);
        });
        return eventData;
    }


    /** removeUndefinedValueKey  */
    private removeUndefinedValueKey(calendar: CalendarParams): void {
        Object.keys(calendar).forEach((key: string) => {
            if (typeof calendar[key] === 'undefined') {
                delete calendar[key];
            }
        });
    }
}

/**
 * CalenderAdapter
 */
@Injectable()
export class CalendarPeriodAdapter implements Adapter<CurrentMonthStartAndEndDate | CalendarPeriodRequest> {
    /** This method is used to transform response object into T object. */
    public toResponse(item: CalendarPeriodResponse): CurrentMonthStartAndEndDate {
        const calendar: CurrentMonthStartAndEndDate = new CurrentMonthStartAndEndDate(
            item.startDate && getLocaleDate(item.startDate),
            item.endDate && getLocaleDate(item.endDate),
        );
        return calendar;
    }

    /** This method is used to transform T object into request object. */
    public toRequest(item: { clientId: number }): CalendarPeriodRequest {
        const calendar: CalendarPeriodRequest = new CalendarPeriodRequest(
            item.clientId,
        );
        return calendar;
    }
}