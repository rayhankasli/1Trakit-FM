/**
 * @author Ashok Yadav
 * @description
 */
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
// -------------------------------------------------------------- //
import { CurrentMonthStartAndEndDate, CalendarEvent, WeekFilterItem, Calendar } from '../../calender.model';
import { getDaysInMonth, getDays } from '../../calendarUtility';

@Injectable()
export class MonthViewCalendarPresenter {
    public get currentMonthView(): Date {
        return this._currentMonthView;
    }
    public eventsData: CalendarEvent[];
    public headerItems: string[];
    public changeDateYear$: Observable<Date>;
    public clickOnDay$: Observable<any>;
    public currentMonthStartAndEndDate$: Observable<CurrentMonthStartAndEndDate>;
    public setCalenderField$: Observable<any>;
    private setCalenderField: BehaviorSubject<any>;
    private clickOnDay: BehaviorSubject<any>;
    private changeDateYear: BehaviorSubject<Date>;
    private currentMonthStartAndEndDate: BehaviorSubject<CurrentMonthStartAndEndDate>;
    private _events: any[] = new Array();
    private _currentMonthView: Date;
    private isNextCall: boolean;
    private isPrevCall: boolean;
    private isStartDateAndDateCall: boolean;
    private setRowField: WeekFilterItem[];
    private prevMonth: number = new Date().getMonth() - 1;
    private nextMonth: number = new Date().getMonth() + 1;
    private currentYear: number = new Date().getFullYear();
    constructor() {
        this.changeDateYear = new BehaviorSubject<Date>(null);
        this.clickOnDay = new BehaviorSubject<any>(null);
        this.currentMonthStartAndEndDate = new BehaviorSubject<CurrentMonthStartAndEndDate>(null);
        this.setCalenderField = new BehaviorSubject<any>(null);
        this.changeDateYear$ = this.changeDateYear.asObservable();
        this.clickOnDay$ = this.clickOnDay.asObservable();
        this.currentMonthStartAndEndDate$ = this.currentMonthStartAndEndDate.asObservable();
        this.setCalenderField$ = this.setCalenderField.asObservable();
        this.isNextCall = false;
        this.isPrevCall = false;
        this.isStartDateAndDateCall = false;
        this.headerItems = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    }

    /** setNextAndPrevItem */
    public setNextAndPrevItem(nextMonth: number | null, prevMonth: number | null): void {
        nextMonth && (this.nextMonth = nextMonth);
        prevMonth && (this.prevMonth = prevMonth);
    }

    /** setEventProperty */
    public setEventProperty(currentMonthView: Date, calendarEvent: CalendarEvent[]): void {
        this.eventsData = calendarEvent;
        this._currentMonthView = currentMonthView;
        this.setEventPropertyBasedInEndDate();
        this.changeDateYear.next(this._currentMonthView);
        this.setCurrentMonthView(this._currentMonthView);
    }

    /** setNextPrevCalendarView */
    public setNextPrevCalendarView(value: string): void {
        this.isStartDateAndDateCall = true;
        if (value === 'next') {
            this.isNextCall = true;
            if (this.isPrevCall) {
                this.setCalenderViewOnCallNext();
                this.setCalenderViewAfterSetCurrentSetPrevProps(this.nextMonth);
            } else {
                this.setCalenderViewAfterSetCurrentSetPrevProps(this.nextMonth);
                this.setCalenderViewOnCallNext();
            }
            this.changeDateYear.next(this._currentMonthView);
        } else {
            this.isPrevCall = true;
            if (this.isNextCall) {
                this.setCalenderViewOnCallPrev();
                this.setCalenderViewAfterSetCurrentSetPrevProps(this.prevMonth);
            } else {
                this.setCalenderViewAfterSetCurrentSetPrevProps(this.prevMonth);
                this.setCalenderViewOnCallPrev();
            }
            this.changeDateYear.next(this._currentMonthView);
        }
    }

    /** dayClick */
    public dayClick(days: { date: number, disabled: boolean }): void {
        this.clickOnDay.next(days);
    }

    /** setMonthViewCurrent */
    public setMonthViewCurrent(date: Date): void {
        this._currentMonthView = date;
        this.currentYear = date.getFullYear();
        this.isStartDateAndDateCall = true;
        this.changeDateYear.next(this._currentMonthView);
        this.setCurrentMonthView(date);
    }

    /** setCurrentMonthView */
    private setCurrentMonthView(date: Date): void {
        this.setRowField = [{ dateGroup: [] }, { dateGroup: [] }, { dateGroup: [] }, { dateGroup: [] }, { dateGroup: [] }, { dateGroup: [] }];
        let setDate: number;
        let nextSetDate: number;
        let prevDaysInMonth: number;
        setDate = 0;
        nextSetDate = 0;
        const daysInMonth: number = this.getDaysInMonth(date.getMonth(), date.getFullYear());
        prevDaysInMonth = this.getDaysInMonth(((date.getMonth() === 0) ? 12 : date.getMonth() - 1),
            (date.getMonth() === 0) ? (date.getFullYear() - 1) : date.getFullYear());
        const days: number = this.getDays(date);
        this.evaluteValueAndSetCalenderItem(days, prevDaysInMonth, daysInMonth, setDate, nextSetDate, date);
        if (this.isStartDateAndDateCall) {
            this.getStartAndEndDateOfGivenMonthOrYear();
        }
        this.setCalenderField.next(this.setRowField);
    }

    /** setEventPropertyBasedInEndDate */
    private setEventPropertyBasedInEndDate(): void {
        this.eventsData.forEach((item: CalendarEvent) => {
            if (item.hasOwnProperty('end') && item.end) {
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

    /** setEventsDataIfAllEqual */
    private setEventsDataIfAllEqual(item: any): void {
        for (let i = new Date(item.start).getDate() + 1; i <= new Date(item.end).getDate(); i++) {
            this._events.push({
                start: new Date(new Date(item.start).getFullYear(), (new Date(item.start).getMonth()), i)
                    .setHours(new Date(item.start).getHours(),
                        new Date(item.start).getMinutes(), new Date(item.start).getSeconds(), new Date(item.start).getMilliseconds()),
                end: new Date(item.end)
            });
        }
    }

    /** setEventsDataIfMonthIsGreater */
    private setEventsDataIfMonthIsGreater(item: any): void {
        const eventStartDateInstance = new Date(item.start).getMonth();
        const eventEndDateInstance = new Date(item.end).getMonth();
        const betweenMonthCount = eventEndDateInstance - eventStartDateInstance;
        for (let h = 0; h <= betweenMonthCount; h++) {
            const daysInMonth: number = this.getDaysInMonth((eventStartDateInstance), (new Date(item.start).getFullYear()));
            const endValue = ((eventStartDateInstance + h) === new Date(item.end).getMonth()) ? new Date(item.end).getDate() : daysInMonth;
            const initialValue = ((eventStartDateInstance + h) === new Date(item.start).getMonth()) ? new Date(item.start).getDate() + 1 : 1;
            for (let i = initialValue; i <= endValue; i++) {
                this._events.push({
                    start: new Date(new Date(item.start).getFullYear(), eventStartDateInstance + h, i)
                        .setHours(new Date(item.start).getHours(),
                            new Date(item.start).getMinutes(), new Date(item.start).getSeconds(), new Date(item.start).getMilliseconds()),
                    end: new Date(item.end)
                });
            }
        }
    }

    /** setEventsDataIfYearIsGreater */
    private setEventsDataIfYearIsGreater(item: any): void {
        const eventStartDateYearInstance = new Date(item.start).getFullYear();
        const eventEndDateYearInstance = new Date(item.end).getFullYear();
        const eventStartDateInstance = new Date(item.start).getMonth();
        const eventEndDateInstance = new Date(item.end).getMonth();
        const betweenYearCount = eventEndDateYearInstance - eventStartDateYearInstance;
        for (let y = 0; y <= betweenYearCount; y++) {
            const betweenMonthCount = (y === 0) ? (11 - eventStartDateInstance) : (y === betweenYearCount) ? eventEndDateInstance : 11;
            for (let h = 0; h <= betweenMonthCount; h++) {
                const daysInMonth: number = this.getDaysInMonth(((y === 0) ?
                    (eventStartDateInstance + h) : h), (new Date(item.start).getFullYear() + y));
                const endValue =
                    (this.isStartAndEndDateMonthMatch(eventStartDateInstance, h, y, item.end)) ? new Date(item.end).getDate() : daysInMonth;
                const initialValue =
                    (this.isStartAndEndDateMonthMatch(eventStartDateInstance, h, y, item.start)) ? new Date(item.start).getDate() + 1 : 1;
                for (let i = initialValue; i <= endValue; i++) {
                    this._events.push({
                        start: new Date(new Date(item.start).getFullYear() + y, (y === 0) ? (eventStartDateInstance + h) : (h), i)
                            .setHours(new Date(item.start).getHours(),
                                new Date(item.start).getMinutes(), new Date(item.start).getSeconds(), new Date(item.start).getMilliseconds()),
                        end: new Date(item.end)
                    });
                }
            }
        }
    }

    /** isStartAndEndDateMonthMatch */
    private isStartAndEndDateMonthMatch(eventStartDateInstance: number, h: number, y: number, date: Date): boolean {
        return ((eventStartDateInstance + h) === new Date(date).getMonth() && (y === 0) && (h === 0));
    }

    /** setCalenderViewAfterSetCurrentSetPrevProps */
    private setCalenderViewAfterSetCurrentSetPrevProps(month: number): void {
        this._currentMonthView = new Date(this.currentYear, month);
        this.setCurrentMonthView(this._currentMonthView);
    }

    /** setCalenderViewOnCallNext */
    private setCalenderViewOnCallNext(): void {
        this.currentYear = this._currentMonthView.getFullYear();
        this.nextMonth = this._currentMonthView.getMonth() + 1;
        this.prevMonth = this._currentMonthView.getMonth();
    }

    /** setCalenderViewOnCallPrev */
    private setCalenderViewOnCallPrev(): void {
        this.currentYear = this._currentMonthView.getFullYear();
        this.nextMonth = this.isNextCall ? this._currentMonthView.getMonth() : this._currentMonthView.getMonth() + 1;
        this.prevMonth = this._currentMonthView.getMonth() - 1;
    }

    /** evaluteValueAndSetCalenderItem */
    private evaluteValueAndSetCalenderItem(days: number, prevDaysInMonth: number,
        daysInMonth: number, setDate: number, nextSetDate: number, date: Date): void {
        let calenderRow: number;
        let calenderWeekLength: number;
        calenderRow = 6;
        calenderWeekLength = 7;
        for (let i = 0; i < calenderRow; i++) {
            for (let j = 1; j <= calenderWeekLength; j++) {
                if (i === 0 && j < (days === 1 ? 8 : days)) {
                    const month = (date.getMonth() < 10 && date.getMonth() !== 0) ? ('0' + date.getMonth()) : (date.getMonth() === 0) ? '12' : date.getMonth();
                    const year = (date.getMonth() === 0) ? date.getFullYear() - 1 : date.getFullYear();
                    const concatDate = month + '/' + prevDaysInMonth.toString() + '/' + year.toString();
                    const fullDate = new Date(concatDate);
                    this.setRowField[i].dateGroup.push({ date: prevDaysInMonth.toString(), disabled: true, utcDate: fullDate, event: [] });
                    this.setRowField[i].dateGroup.sort((a: { date: string, disabled: boolean, event: Calendar[] },
                        b: { date: string, disabled: boolean, event: any[] }) => {
                        return (+a.date) - (+b.date);
                    });
                    prevDaysInMonth = prevDaysInMonth - 1;
                } else {
                    if (setDate < daysInMonth) {
                        setDate = setDate + 1;
                        const currentDate: string = setDate < 10 ? ('0' + setDate) : setDate.toString();
                        this.setRowField[i].dateGroup.push({
                            date: currentDate, disabled: false, utcDate: this.createDateSet(date, +currentDate), event: [],
                            dateSet: this.createDateSet(date, +currentDate)
                        });
                    } else {
                        nextSetDate = nextSetDate + 1;
                        const nextMonthDate: string = nextSetDate < 10 ? ('0' + nextSetDate) : nextSetDate.toString();
                        const month: string = date.getMonth() < 10 ? ('0' + (date.getMonth() + 2)) : (date.getMonth() === 11) ? '01' : (date.getMonth() + 2).toString();
                        const year: string = (date.getMonth() === 11) ? (date.getFullYear() + 1).toString() : date.getFullYear().toString();
                        const concatDate: string = month + '/' + nextMonthDate + '/' + year.toString();
                        const fullDate = new Date(concatDate);
                        this.setRowField[i].dateGroup.push({ date: nextMonthDate, disabled: true, utcDate: fullDate, event: [] });
                    }
                }
            }
            if (!this.isStartDateAndDateCall) {
                this.setEventOnCalenderDate(i, date);
            }
        }
    }

    /** createDateSet */
    private createDateSet(date: Date, setDate: number): Date {
        return new Date(
            date.getFullYear().toString() + '/' + ((
                (date.getMonth() + 1) < 10) ? '0' +
                (date.getMonth() + 1).toString() : (date.getMonth() + 1).toString()) + '/' + (
                (setDate < 10) ? '0' + setDate.toString() : setDate.toString()));
    }

    /** getStartAndEndDateOfGivenMonthOrYear */
    private getStartAndEndDateOfGivenMonthOrYear(): void {
        const startD = this.setRowField[0].dateGroup[0].utcDate;
        const endD = this.setRowField[5].dateGroup[this.setRowField[5].dateGroup.length - 1].utcDate;
        this.currentMonthStartAndEndDate.next({ startDate: startD, endDate: endD })
        this.isStartDateAndDateCall = false;
    }

    /** setEventOnCalenderDate */
    private setEventOnCalenderDate(i: number, date: Date): void {
        this.eventsData.forEach((itemEvent: any) => {
            this.setRowField[i].dateGroup.forEach((item: any) => {
                if (this.isDateMatch(itemEvent, item, date)) {
                    item.event.push(itemEvent);
                }
            });
        });
    }

    /** isDateMatch */
    private isDateMatch(itemEvent: any, item: any, date: any): boolean {
        return (new Date(itemEvent.start).getDate() === +item.date) &&
            (new Date(itemEvent.start).getFullYear() === new Date(date).getFullYear()) && ((new Date(itemEvent.start).getMonth() + 1) === (new Date(item.utcDate).getMonth() + 1));
    }

    /** getDaysInMonth */
    private getDaysInMonth(month: number, year: number): number {
        return getDaysInMonth(month,year);
    }

    /** getDays */
    private getDays(date: Date): number {
        return getDays(date);
    }
}