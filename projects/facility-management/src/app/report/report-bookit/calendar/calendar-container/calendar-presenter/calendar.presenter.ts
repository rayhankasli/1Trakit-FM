/**
 * @author Ashok Yadav.
 * @description 
 */
import { Injectable, ViewContainerRef, Type, ComponentRef, ComponentFactoryResolver, OnDestroy, ElementRef, Renderer2 } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Overlay, OverlayPositionBuilder, OverlayRef } from '@angular/cdk/overlay';
import { Subject, Observable, BehaviorSubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
// ---------------------------------------------------------------------------- //
import { CalendarEvent, Calendar, Events, CurrentMonthStartAndEndDate, CalendarParams, MonthFilterItem, WeekFilterItem, DateGroup } from '../../calender.model';
import { MonthCalendarViewPresentationComponent } from '../month-calendar-view-presentation/month-calendar-view.presentation';
import { WeekCalendarViewPresentationComponent } from '../week-calendar-view-presentation/week-calendar-view.presentation';
import { NoRecordFoundComponent } from '../no-record-found/no-record-found.component';
import { getDaysInMonth, getDays } from '../../calendarUtility';

@Injectable()
export class CalendarPresenter implements OnDestroy {
    public get overlayRef(): OverlayRef {
        return this._overlayRef;
    }

    public set currentView(currentView: string) {
        this._currentView = currentView;
    }

    public get currentView(): string {
        return this._currentView;
    }

    public get checkTodayAndMonthViewIsMatched(): boolean {
        const date = new Date();
        return (this.currentView === 'month') && date.getMonth() === this.currentMonthDate.getMonth() && date.getFullYear() === this.currentMonthDate.getFullYear() ||
        (this.currentView === 'week') && date.getMonth() === this.currentWeekDate.getMonth() && date.getFullYear() === this.currentWeekDate.getFullYear();
    }
    public events: CalendarEvent[];
    public currentMonthDate: Date;
    public currentWeekDate: Date;
    public weekDayName: string[];
    public clickOnDay$: Observable<any>;
    public changeDateYear$: Observable<Date>;
    public currentMonthStartAndEndDate$: Observable<CurrentMonthStartAndEndDate>;
    public getCalendarWeek$: Observable<CurrentMonthStartAndEndDate>;
    // ------------------- //
    private _currentView: string;
    private clientId: number;
    private roomId: number;
    private currentMonthSEDate: CurrentMonthStartAndEndDate;
    private _overlayRef: OverlayRef;
    private months: string[];
    private destroy: Subject<boolean>;
    private clickOnDay: BehaviorSubject<DateGroup>;
    private changeDateYear: BehaviorSubject<Date>;
    private currentMonthStartAndEndDate: BehaviorSubject<CurrentMonthStartAndEndDate>;
    private getCalendarWeek: BehaviorSubject<any>;
    private componentRef: ComponentRef<MonthCalendarViewPresentationComponent | WeekCalendarViewPresentationComponent | NoRecordFoundComponent>;
    
    constructor(
        private factoryResolver: ComponentFactoryResolver,
        private datePipe: DatePipe,
        private renderer: Renderer2,
        private overlay: Overlay,
        private overlayPositionBuilder: OverlayPositionBuilder, ) {
        this.weekDayName = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        this.months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        this.currentMonthDate = new Date();
        this.destroy = new Subject<boolean>();
        this.clickOnDay = new BehaviorSubject<DateGroup>(null);
        this.changeDateYear = new BehaviorSubject<Date>(null);
        this.currentMonthStartAndEndDate = new BehaviorSubject<CurrentMonthStartAndEndDate>(null);
        this.getCalendarWeek = new BehaviorSubject<CurrentMonthStartAndEndDate>(null);
        this.clickOnDay$ = this.clickOnDay.asObservable();
        this.changeDateYear$ = this.changeDateYear.asObservable();
        this.currentMonthStartAndEndDate$ = this.currentMonthStartAndEndDate.asObservable();
        this.getCalendarWeek$ = this.getCalendarWeek.asObservable();
        this.roomId = 0;
    }

    /** isPeriodDateMatch */
    public isPeriodDateMatch(monthFilterDate: Date, calendarPeriod: Date): boolean {
        return monthFilterDate.getMonth() === calendarPeriod.getMonth() && monthFilterDate.getFullYear() === calendarPeriod.getFullYear();
    }

    public ngOnDestroy(): void {
        this.destroy.next();
        this.destroy.complete();
    }

    /** getMonthYear */
    public getMonthYear(date: Date): string {
        return this.months[(date.getMonth())] + '  ' + date.getFullYear();
    }

    /** addRemoveClass */
    public addRemoveClass(elementRef: ElementRef, add: string, remove: string): void {
        remove && this.renderer.removeClass(elementRef.nativeElement, remove);
        add && this.renderer.addClass(elementRef.nativeElement, add);
    }

    /** getWeekdaysName */
    public getWeekdaysName(utcDate: Date | null): string {
        const date = event ? new Date(utcDate).getDay() : new Date().getDay();
        return this.weekDayName[date === 0 ? 6 : date - 1];
    }

    /** getCalendarParamsItemBasedOnRoomChange */
    public getCalendarParamsItemBasedOnRoomChange(roomId: number): CalendarParams {
        this.roomId = roomId;
        return this.setCurrentMonthStartAndEndDate(this.currentMonthSEDate);
    }

    /** setMonthWeekViewOverlay */
    public setMonthWeekViewOverlay(buttonRef: ElementRef): void {
        const positionStrategy = this.overlayPositionBuilder
            .flexibleConnectedTo(buttonRef)
            .withPositions([{
                originX: 'end',
                originY: 'bottom',
                overlayX: 'end',
                overlayY: 'top',
                offsetY: 1,
            }]);
        this._overlayRef = this.overlay.create({ hasBackdrop: true, backdropClass: '', positionStrategy });
        this.overlayRef.backdropClick().subscribe(() => this.overlayRef.detach());
    }

    /** setCurrentMonthStartAndEndDate */
    public setCurrentMonthStartAndEndDate(startEndMonthDate: CurrentMonthStartAndEndDate): CalendarParams {
        const calendarParams: CalendarParams = new CalendarParams();
        calendarParams.startDate = this.datePipe.transform(startEndMonthDate.startDate, 'yyyy-MM-dd');
        calendarParams.endDate = this.datePipe.transform(startEndMonthDate.endDate, 'yyyy-MM-dd');
        calendarParams.clientId = this.clientId;
        calendarParams.roomId = this.roomId;
        return calendarParams;
    }

    /** getCalendarItems */
    public getCalendarItems(calender: Calendar[]): CalendarEvent[] {
        const calendarArray: CalendarEvent[] = [];
        calender.forEach((item: Calendar) => {
            item.events.forEach((eventItem: Events) => {
                const calendarEvent = new CalendarEvent();
                calendarEvent.start = new Date(item.date);
                // calendarEvent.end = new Date(item.date);
                calendarEvent.events = eventItem;
                calendarArray.push(calendarEvent);
            });
        });
        return calendarArray;
    }

    /** getMonthFilterItems */
    public getMonthFilterItems(date: CurrentMonthStartAndEndDate): MonthFilterItem[] {
        let filterItems: MonthFilterItem[] = [];
        let indexOfGroup: number = -1;
        let endIndex: number = -1;
        let index: number = 0;
        const isBothYearSame: boolean = date.startDate.getFullYear() === date.endDate.getFullYear();
        const month = isBothYearSame ? (date.endDate.getMonth() + 1) : 12;
        for (let i = date.startDate.getFullYear(); i <= date.endDate.getFullYear(); i++) {
            for (let j = (date.startDate.getMonth() + 1); j <= month; j++) {
                const currentMonthView = new Date(j.toString() + '-' + date.startDate.getDate() + '-' + i.toString());
                filterItems.push({ id: index, label: (this.months[j - 1] + ' ' + currentMonthView.getFullYear()), utcDate: currentMonthView });
                index++;
            }
        }
        return filterItems;
    }

    /** getWeekFilterItems */
    public getWeekFilterItems(date: CurrentMonthStartAndEndDate): any[] {
        let weekFilterItems: any[] = [];
        let indexOfGroup: number = -1;
        let endIndex: number = -1;
        const startYear: number = date.startDate.getFullYear();
        const endYear: number = date.endDate.getFullYear();
        for (let i = startYear; i <= endYear; i++) {
            const startMonth: number = (i === startYear) ? (date.startDate.getMonth() + 1) : 1;
            const isBothYearSame: boolean = (i === endYear);
            const month = isBothYearSame ? (date.endDate.getMonth() + 1) : 12;
            for (let j = startMonth; j <= month; j++) {
                const currentMonthView = new Date(j.toString() + '/' + date.startDate.getDate() + '/' + i.toString())
                this.setCurrentWeekView(currentMonthView, weekFilterItems);
            }
        }
        for (let x = 0; x < 6; x++) {
            if (indexOfGroup === -1) {
                indexOfGroup = weekFilterItems[x].dateGroup.findIndex(item => new Date(item.utcDate).getDate() === date.startDate.getDate() && new Date(item.utcDate).getMonth() === date.startDate.getMonth());
                indexOfGroup != -1 && weekFilterItems.splice(0, x);
            }
        }
        const dupArray: number[] = [];
        this.addComp(weekFilterItems, dupArray);
        for (let y = weekFilterItems.length - 1; y >= weekFilterItems.length - 6; y--) {
            if (endIndex === -1) {
                endIndex = weekFilterItems[y].dateGroup.findIndex(item => new Date(item.utcDate).getDate() === date.endDate.getDate() && new Date(item.utcDate).getMonth() === date.endDate.getMonth());
                endIndex != -1 && weekFilterItems.splice(y + 1, weekFilterItems.length);
            }
        }
        this.setLableAndValueInFilterItems(weekFilterItems);
        return weekFilterItems;
    }

    /** invoke this method and it is set component ref property */
    public setcurrentWeekDate(currentDate: Date): void {
        this.currentWeekDate = currentDate;
        (this.componentRef.instance as WeekCalendarViewPresentationComponent).currentDate = currentDate;
    }

    /** invoke this method and it is set component ref property */
    public setcurrentMonthDate(currentDate: Date): void {
        this.currentMonthDate = currentDate;
        (this.componentRef.instance as MonthCalendarViewPresentationComponent).currentMonthView = currentDate;
        (this.componentRef.instance as MonthCalendarViewPresentationComponent).setNextAndPrevItem(currentDate.getMonth() + 1, currentDate.getMonth() - 1);
    }

    /** invoke this method and it is set component ref property */
    public setEvents(events: CalendarEvent[]): void {
        this.events = events;
        (this.componentRef.instance as MonthCalendarViewPresentationComponent | WeekCalendarViewPresentationComponent).events = events;
    }

    /** Creates component */
    public createComponent(calendarView: string, container: ViewContainerRef): void {
        if (this.componentRef) {
            this.componentRef.destroy();
        }
        if (container) {
            container.clear();
        }

        switch (calendarView) {
            case 'month':
                this.componentRef = this.createCalendarMonth(container);
                break;
            case 'week':
                this.componentRef = this.createCalendarWeek(container);
                break;
            default:
                this.componentRef = this.createNoRacordFoundComponent(container);
                break;
        }
    }

    /** setClientId */
    public setClientId(clientId: number): void {
        if (clientId || clientId === 0) { this.clientId = clientId; }
    }

    /** todayEventList */
    public todayEventList(calendar: Calendar[]): DateGroup {
        let todayEvent: DateGroup;
        let today: Date = new Date();
        calendar.forEach((element: Calendar) => {
            let eventDate: Date = new Date(element.date);
            if((eventDate.getDate() === today.getDate() && eventDate.getMonth() === today.getMonth()
            && eventDate.getFullYear() === today.getFullYear())  && element.events.length > 0) {
                let events: CalendarEvent[] = [];
                element.events.forEach((event) => {
                    events.push({start: eventDate,events: event})
                });
                todayEvent = new DateGroup(
                    `${eventDate.getDate()}`,
                    false,
                    events,
                    eventDate,
                    eventDate
                );
            }
        });
        return todayEvent;
    }

    /** createCalendarMonth */
    private createCalendarMonth(container: ViewContainerRef): ComponentRef<MonthCalendarViewPresentationComponent> {
        const componentRef: ComponentRef<MonthCalendarViewPresentationComponent>
            = this.createDynamicComponent(container, MonthCalendarViewPresentationComponent);
        componentRef.instance.currentMonthView = this.currentMonthDate;
        componentRef.instance.events = this.events;
        componentRef.instance.clickOnDay.pipe(takeUntil(this.destroy)).subscribe((clickDayItem: DateGroup | null) => {
            this.clickOnDay.next(clickDayItem);
        });
        componentRef.instance.changeDateYear.pipe(takeUntil(this.destroy)).subscribe((changeDateYear: Date | null) => {
            if (changeDateYear) this.currentMonthDate = changeDateYear;
            this.changeDateYear.next(changeDateYear);
        });
        componentRef.instance.currentMonthStartAndEndDate.pipe(takeUntil(this.destroy)).subscribe((currentMonthStartAndEndDate: CurrentMonthStartAndEndDate) => {
            this.currentMonthSEDate = currentMonthStartAndEndDate;
            this.currentMonthStartAndEndDate.next(currentMonthStartAndEndDate);
        });
        return componentRef;
    }

    /** createCalendarWeek */
    private createCalendarWeek(container: ViewContainerRef): ComponentRef<WeekCalendarViewPresentationComponent> {
        const componentRef: ComponentRef<WeekCalendarViewPresentationComponent>
        = this.createDynamicComponent(container, WeekCalendarViewPresentationComponent);
        componentRef.instance.currentDate = this.currentWeekDate;
        componentRef.instance.getCalendarWeek.pipe(takeUntil(this.destroy)).subscribe((calendarWeek: CurrentMonthStartAndEndDate) => {
            this.currentMonthSEDate = calendarWeek;
            this.getCalendarWeek.next(calendarWeek);
        });
        return componentRef;
    }

    /** createNoRacordFoundComponent  */
    private createNoRacordFoundComponent(container: ViewContainerRef): ComponentRef<NoRecordFoundComponent> {
        const componentRef: ComponentRef<NoRecordFoundComponent>
        = this.createDynamicComponent(container, NoRecordFoundComponent);
        return componentRef;
    }
    /**
     * Creates dynamic component
     * @template T
     * @param container
     * @param component
     */
    private createDynamicComponent<T>(container: ViewContainerRef, component: Type<T>): ComponentRef<T> {
        return container.createComponent(this.factoryResolver.resolveComponentFactory(component));;
    }

    /** addComp */
    private addComp(weekFilterItems: any, dupArray: number[]): void {
        weekFilterItems.forEach((item: any, xIndex: number) => {
            item.dateGroup.forEach((innerItem: any, yIndex: number) => {
                weekFilterItems.forEach((item: any, aIndex: number) => {
                    if (xIndex != aIndex) {
                        const isMatch: boolean =
                            new Date(item.dateGroup[yIndex].utcDate).getDate() === new Date(innerItem.utcDate).getDate() &&
                            new Date(item.dateGroup[yIndex].utcDate).getMonth() === new Date(innerItem.utcDate).getMonth() &&
                            new Date(item.dateGroup[yIndex].utcDate).getFullYear() === new Date(innerItem.utcDate).getFullYear();
                        if (isMatch) {
                            weekFilterItems.splice(aIndex, 1);
                        }
                    }
                })
            });
        });
    }

    /** setLableAndValueInFilterItems */
    private setLableAndValueInFilterItems(weekFilterItems: WeekFilterItem[]): void {
        let nextWeek: number = 0;
        weekFilterItems.forEach((filterItems: any, index: number) => {
            nextWeek = index + 1;
            Object.assign(filterItems, { value: index, label: ('Week' + ' ' + (nextWeek)) })
        });
    }

    /** setCurrentWeekView */
    private setCurrentWeekView(date: Date, weekFilterItems: WeekFilterItem[]): void {
        weekFilterItems.push({ dateGroup: [] }, { dateGroup: [] }, { dateGroup: [] }, { dateGroup: [] }, { dateGroup: [] }, { dateGroup: [] });
        let setDate: number;
        let nextSetDate: number;
        let prevDaysInMonth: number;
        setDate = 0;
        nextSetDate = 0;
        const daysInMonth: number = this.getDaysInMonth(date.getMonth(), date.getFullYear());
        prevDaysInMonth = this.getDaysInMonth(((date.getMonth() === 0) ? 12 : date.getMonth() - 1),
                                              (date.getMonth() === 0) ? (date.getFullYear() - 1) : date.getFullYear());
        const days: number = this.getDays(date);
        this.evaluteValueAndSetCalenderItem(days, prevDaysInMonth, daysInMonth, setDate, nextSetDate, date, weekFilterItems);
    }

    /** evaluteValueAndSetCalenderItem */
    private evaluteValueAndSetCalenderItem(days: number, prevDaysInMonth: number,
                                           daysInMonth: number, setDate: number, nextSetDate: number, date: Date, weekFilterItems: WeekFilterItem[]): void {
        let calenderRow: number;
        let calenderWeekLength: number;
        calenderRow = 6;
        calenderWeekLength = 7;
        for (let i = 0; i < calenderRow; i++) {
            const rowLength: number[] = [];
            for (let k = (weekFilterItems.length - 1); k >= ((weekFilterItems.length - 1) - 5); k--) {
                rowLength.push(k);
                rowLength.sort((a, b) => {
                    return a - b;
                });
            }
            for (let j = 1; j <= calenderWeekLength; j++) {
                if (i === 0 && j < days) {
                    const month: string | number = date.getMonth() < 10 ? ('0' + (date.getMonth() + 1)) : (date.getMonth() + 1);
                    const year: number = (date.getMonth() === 0) ? date.getFullYear() - 1 : date.getFullYear();
                    const concatDate: string = month + '/' + prevDaysInMonth.toString() + '/' + year.toString();
                    const fullDate: Date = new Date(concatDate);
                    weekFilterItems[rowLength[i]].dateGroup.push({ date: prevDaysInMonth.toString(), disabled: true, utcDate: fullDate, event: [] });
                    weekFilterItems[rowLength[i]].dateGroup.sort((a: { date: string, disabled: boolean, event: any[] },
                                                                  b: { date: string, disabled: boolean, event: any[] }) => {
                        return (+a.date) - (+b.date);
                    });
                    prevDaysInMonth = prevDaysInMonth - 1;
                } else {
                    if (setDate < daysInMonth) {
                        setDate = setDate + 1;
                        const currentDate: string = setDate < 10 ? ('0' + setDate) : setDate.toString();
                        weekFilterItems[rowLength[i]].dateGroup.push({
                            date: currentDate, 
                            disabled: false, 
                            utcDate: this.createDateSet(date, +currentDate),
                            event: [],
                            dateSet: this.createDateSet(date, +currentDate)
                        });
                    } else {
                        nextSetDate = nextSetDate + 1;
                        const year: string = (date.getMonth() === 11) ? (date.getFullYear() + 1).toString() : date.getFullYear().toString();
                        const month: string = date.getMonth() < 10 ? ('0' + (date.getMonth() + 2)) : (date.getMonth() === 11) ? '01' : (date.getMonth() + 2).toString();
                        const nextMonthDate: string = nextSetDate < 10 ? ('0' + nextSetDate) : nextSetDate.toString();
                        const concatDate: string = month + '/' + nextMonthDate + '/' + year.toString();
                        const fullDate: Date = new Date(concatDate);
                        weekFilterItems[rowLength[i]].dateGroup.push({ date: nextMonthDate, disabled: true, utcDate: fullDate, event: [] });
                    }
                }
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

    /** getDaysInMonth */
    private getDaysInMonth(month: number, year: number): number {
        return getDaysInMonth(month,year);
    }

    /** getDays */
    private getDays(date: Date): number {
        return getDays(date);
    }
}