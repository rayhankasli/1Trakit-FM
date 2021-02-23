import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
// ------------------------------------------
import { BasePresentation } from '../../../../../core/base-classes/base.presentation';
import { CommonService } from '../../calendar-common.service';
import { CalendarEvent, CurrentMonthStartAndEndDate, DateGroup } from '../../calender.model';
import { MonthViewCalendarPresenter } from '../month-calendar-view-presenter/month-calendar-view.presenter';

@Component({
  selector: 'app-month-calendar-view-ui',
  templateUrl: './month-calendar-view.presentation.html',
  viewProviders: [MonthViewCalendarPresenter],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MonthCalendarViewPresentationComponent extends BasePresentation implements OnInit, OnDestroy {

  @Input() public set currentMonthView(value: Date) {
    if (value) {
      this._currentMonthView = value;
      this.monthViewCalendarPresenter.setMonthViewCurrent(this._currentMonthView);
    }
  }

  public get currentMonthView(): Date {
    return this._currentMonthView;
  }

  @Input() public set events(value: CalendarEvent[]) {
    if (value) {
      this._events = [...value];
      this.monthViewCalendarPresenter.setEventProperty(this._currentMonthView, this._events);
    }
  }

  public get events(): CalendarEvent[] {
    return this._events;
  }

  public changeDateYear$: Observable<Date>;
  public clickOnDay$: Observable<any>;
  public currentMonthStartAndEndDate$: Observable<CurrentMonthStartAndEndDate>;
  public changeDateYear: BehaviorSubject<Date>;
  public clickOnDay: BehaviorSubject<DateGroup>;
  public currentMonthStartAndEndDate: BehaviorSubject<CurrentMonthStartAndEndDate>;
  public headerItems: string[];
  public setRowField: any[];
  private destroy: Subject<boolean>;
  private _events: any[] = new Array();
  private _currentMonthView: Date;

  constructor(
    private calendarService: CommonService,
    private monthViewCalendarPresenter: MonthViewCalendarPresenter,
    private cdr: ChangeDetectorRef
  ) {
    super();
    this.destroy = new Subject<boolean>();
    this.headerItems = this.monthViewCalendarPresenter.headerItems;
    this.clickOnDay = new BehaviorSubject<DateGroup>(null);
    this.changeDateYear = new BehaviorSubject<Date>(null);
    this.currentMonthStartAndEndDate = new BehaviorSubject<CurrentMonthStartAndEndDate>(null);
    this.clickOnDay$ = this.clickOnDay.asObservable();
    this.changeDateYear$ = this.changeDateYear.asObservable();
    this.currentMonthStartAndEndDate$ = this.currentMonthStartAndEndDate.asObservable();
  }

  /** isCurrentDate */
  public isCurrentDate(date: Date): boolean {
    return date.getDate() === new Date().getDate() && date.getMonth() === new Date().getMonth() && date.getFullYear() === new Date().getFullYear();
  }

  public ngOnInit(): void {
    this.inItProps();
  }


  public ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }

  /** setNextAndPrevItem */
  public setNextAndPrevItem(nextMonth: number | null, prevMonth: number | null): void {
     this.monthViewCalendarPresenter.setNextAndPrevItem(nextMonth, prevMonth);
  }

  /** dayClick */
  public dayClick(days: DateGroup): void {
    this.clickOnDay.next(days);
  }

  /** setNextAndPrevItem */
  private inItProps(): void {
    this.monthViewCalendarPresenter.changeDateYear$.pipe(takeUntil(this.destroy)).subscribe((date: Date) => {
      date && this.changeDateYear.next(date);
    });
    this.monthViewCalendarPresenter.clickOnDay$.pipe(takeUntil(this.destroy)).subscribe((clickOnDay: DateGroup) => {
      clickOnDay && this.clickOnDay.next(clickOnDay);
    });
    this.monthViewCalendarPresenter.currentMonthStartAndEndDate$.pipe(takeUntil(this.destroy)).subscribe((currentMonthStartAndEndDate: CurrentMonthStartAndEndDate) => {
      currentMonthStartAndEndDate && this.currentMonthStartAndEndDate.next(currentMonthStartAndEndDate);
    });
    this.calendarService.subject.pipe(takeUntil(this.destroy)).subscribe((value: string): void => {
      this.monthViewCalendarPresenter.setNextPrevCalendarView(value);
    });
    this.monthViewCalendarPresenter.setCalenderField$.pipe(takeUntil(this.destroy)).subscribe((calendarField: any) => {
      this.setRowField = calendarField;
      this._currentMonthView = this.monthViewCalendarPresenter.currentMonthView;
      this.cdr.detectChanges();
    });
  }
}
