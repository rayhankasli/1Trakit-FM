/**
 * @author Ashok Yadav
 */
import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
// ------------------------------------------- //
import { CommonService } from './calendar-common.service';
import { Calendar } from './calender.model';
import { CalendarService } from './calendar.service';

/**
 * CopyIt detail resolver
 */
@Injectable()
export class CalendarPrintResolver implements Resolve<Calendar[]> {

    constructor(
        private commonService: CommonService,
        private calendarService: CalendarService
    ) { }

    /**
     * Resolve Calendar details
     */
    public resolve(): Observable<Calendar[]> {
        return this.calendarService.getMonthAndWeekViewData(this.commonService.calendarEvents);
    }
}