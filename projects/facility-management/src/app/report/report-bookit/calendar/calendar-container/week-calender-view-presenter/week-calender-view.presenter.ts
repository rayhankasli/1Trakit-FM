import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Observable, BehaviorSubject } from 'rxjs';
// -------------------------------------------------------------- //
import { Calendar, CalendarWeek, CurrentMonthStartAndEndDate } from '../../calender.model';
import { getDaysInMonth } from '../../calendarUtility';

@Injectable()
export class WeekViewCalendarPresenter {
    
    public eventsItem: any[];
    public _currentDate: Date;
    public week: CalendarWeek[];
    public weekDayName: string[];
    public getDayArray: any[] = [];
    public events: Calendar[];
    public months: string[];
    public week$: Observable<any>;
    public weekData: BehaviorSubject<any>;
    public weekStartDate$: Observable<CurrentMonthStartAndEndDate>;
    public weekStartDate: BehaviorSubject<CurrentMonthStartAndEndDate>;

    public get currentDate(): Date {
        return this._currentDate;
    }

    private isStartAndEndDate: boolean;
    constructor() {
        this.isStartAndEndDate = false;
        this.weekData = new BehaviorSubject<any>(null);
        this.weekStartDate = new BehaviorSubject<CurrentMonthStartAndEndDate>(null);
        this.week$ = this.weekData.asObservable();
        this.weekStartDate$ = this.weekStartDate.asObservable();
        this.months = [ 'Jan', 'Feb', 'Mar', 'Apr', 'May','Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ];
        this.weekDayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    }

    /** setIsStartAndEndDateValue */
    public setIsStartAndEndDateValue(value: boolean): void {
       this.isStartAndEndDate = value;
    }

    /** setIsStartAndEndDateValue */
    public onNext(): void {
        this.isStartAndEndDate = true;
        const date = new Date(this.getDayArray[6]);
        date.setDate(date.getDate() + 1);
        this._currentDate = date;
        this.setWeekDays(date);
    }

    /** setIsStartAndEndDateValue */
    public onPrev(): void {
        this.isStartAndEndDate = true;
        const date = new Date(this.getDayArray[0]);
        date.setDate(date.getDate() - 1);
        this._currentDate = date;
        this.setWeekDays(date);
    }

    /** setIsStartAndEndDateValue */
    public setEventPropertyBasedInEndDate(eventsItem: any): void {
        this.eventsItem = eventsItem;
        this.events = eventsItem;
        this.eventsItem.forEach((item: any) => {
            if (item.hasOwnProperty('end')) {
                if (new Date(item.start) < new Date(item.end)) {
                    if (new Date(item.start).getMonth() === new Date(item.end).getMonth()
                        && new Date(item.start).getFullYear() === new Date(item.end).getFullYear()) {
                        this.setEventsDataIfAllEqual(item);
                    } else if (new Date(item.start).getMonth() < new Date(item.end).getMonth()
                        && new Date(item.start).getFullYear() === new Date(item.end).getFullYear()) {
                        this.setEventsDataIfMonthIsGreater(item);
                    } else if (new Date(item.start).getFullYear() < new Date(item.end).getFullYear()) {
                        this.setEventsDataIfYearIsGreater(item);
                    }
                }
            }
        });
    }

    /** setWeekDays */
    public setWeekDays(currentDate: Date): void {
        this._currentDate = currentDate;
        this.week = [];
        this.getDayArray = [];
        const datePipe = new DatePipe('en-US');
        for (let i = 1; i <= 7; i++) {
            const first: number = (currentDate.getDate() - currentDate.getDay() + i - 1);
            const day: string = datePipe.transform(new Date(currentDate.setDate(first)), 'MM/dd/yyyy');
            this.getDayArray.push(day);
            const eventsItem = [];
            this.events && this.events.forEach((item: any) => {
                if (new Date(item.start).getDate() === new Date(day).getDate()
                    && new Date(item.start).getMonth() === new Date(day).getMonth()) {
                    eventsItem.push(item);
                }
            });
            const dateObj: Date = new Date(day);
            const month: string | number = (dateObj.getMonth() + 1) < 10 ? '0' + (dateObj.getMonth() + 1) : (dateObj.getMonth() + 1);
            const date: string = String(dateObj.getDate()).padStart(2, '0');
            const year: number = dateObj.getFullYear();
            const output: string = (month + '/' + date + '/' + year);
            const utcDate: Date = new Date((month + '/' + date + '/' + year));
            this.week.push({ weekDate: output, dayName: this.weekDayName[i - 1], utcDate: utcDate, events: eventsItem });
        }
        if (this.isStartAndEndDate) {
            const startDate: Date = new Date(this.week[0].utcDate);
            const endDate: Date = new Date(this.week[this.week.length - 1].utcDate);
            this.weekStartDate.next({startDate: startDate, endDate: endDate });
            this.isStartAndEndDate = false;
        } else {
            this.weekData.next(this.week);
        }
    }

    /** setEventsDataIfMonthIsGreater */
    private setEventsDataIfMonthIsGreater(item: any): void {
        const eventStartDateInstance: number = new Date(item.start).getMonth();
        const eventEndDateInstance: number = new Date(item.end).getMonth();
        const betweenMonthCount: number = eventEndDateInstance - eventStartDateInstance;
        for (let h: number = 0; h <= betweenMonthCount; h++) {
            const daysInMonth: number = this.getDaysInMonth((eventStartDateInstance), (new Date(item.start).getFullYear()));
            const endValue: number = ((eventStartDateInstance + h) === new Date(item.end).getMonth()) ? new Date(item.end).getDate() : daysInMonth;
            const initialValue: number = ((eventStartDateInstance + h) === new Date(item.start).getMonth()) ? new Date(item.start).getDate() + 1 : 1;
            for (let i: number = initialValue; i <= endValue; i++) {
                this.eventsItem.push({
                    start: new Date(new Date(item.start).getFullYear(), eventStartDateInstance + h, i)
                        .setHours(new Date(item.start).getHours(),
                                  new Date(item.start).getMinutes(), new Date(item.start).getSeconds(), new Date(item.start).getMilliseconds()),
                    end: new Date(item.end)
                });
            }
        }
    }

    /** getDaysInMonth */
    private getDaysInMonth(month: number, year: number): number {
        return getDaysInMonth(month,year);
    }


    /** setEventsDataIfYearIsGreater */
    private setEventsDataIfYearIsGreater(item: any): void {
        const eventStartDateYearInstance: number = new Date(item.start).getFullYear();
        const eventStartDateInstance: number = new Date(item.start).getMonth();
        const eventEndDateYearInstance: number = new Date(item.end).getFullYear();
        const eventEndDateInstance: number = new Date(item.end).getMonth();
        const betweenYearCount: number = eventEndDateYearInstance - eventStartDateYearInstance;
        for (let y: number = 0; y <= betweenYearCount; y++) {
            const betweenMonthCount: number = (y === 0) ? (11 - eventStartDateInstance) : (y === betweenYearCount) ? eventEndDateInstance : 11;
            for (let h: number = 0; h <= betweenMonthCount; h++) {
                const daysInMonth: number = this.getDaysInMonth(((y === 0) ?
                    (eventStartDateInstance + h) : h),          (new Date(item.start).getFullYear() + y));
                const endValue: number =
                    (this.isStartAndEndDateMonthMatchForWeek(eventStartDateInstance, h, y, item.end)) ? new Date(item.end).getDate() : daysInMonth;
                const initialValue: number =
                    (this.isStartAndEndDateMonthMatchForWeek(eventStartDateInstance, h, y, item.start)) ? new Date(item.start).getDate() + 1 : 1;
                for (let i: number = initialValue; i <= endValue; i++) {
                    this.eventsItem.push({
                        start: new Date(new Date(item.start).getFullYear() + y, (y === 0) ? (eventStartDateInstance + h) : (h), i)
                            .setHours(new Date(item.start).getHours(),
                                      new Date(item.start).getMinutes(), new Date(item.start).getSeconds(), new Date(item.start).getMilliseconds()),
                        end: new Date(item.end)
                    });
                }
            }
        }
    }

    /** setEventsDataIfAllEqual */
    private setEventsDataIfAllEqual(item: any): void {
        for (let i: number = new Date(item.start).getDate() + 1; i <= new Date(item.end).getDate(); i++) {
            this.eventsItem.push({
                start: new Date(new Date(item.start).getFullYear(), (new Date(item.start).getMonth()), i)
                    .setHours(new Date(item.start).getHours(),
                              new Date(item.start).getMinutes(), new Date(item.start).getSeconds(), new Date(item.start).getMilliseconds()),
                end: new Date(item.end)
            });
        }
    }


    /** isStartAndEndDateMonthMatchForWeek */
    private isStartAndEndDateMonthMatchForWeek(eventStartDateInstance: number, h: number, y: number, date: Date): boolean {
        return ((eventStartDateInstance + h) === new Date(date).getMonth() && (y === 0) && (h === 0));
    }

}