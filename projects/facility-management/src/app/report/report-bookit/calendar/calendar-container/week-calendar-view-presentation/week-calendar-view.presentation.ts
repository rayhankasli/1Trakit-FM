/**
 * @author Ashok Yadav.
 * @description 
 */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, HostBinding, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BasePresentation } from 'projects/facility-management/src/app/core/base-classes/base.presentation';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
// ----------------------------------------------
import { ArchiveModeService } from '../../../../../core/services/archive-mode/archive-mode.service';
import { CommonService } from '../../calendar-common.service';
import { CalendarEvent, CalendarWeek, CurrentMonthStartAndEndDate } from '../../calender.model';
import { WeekViewCalendarPresenter } from '../week-calender-view-presenter/week-calender-view.presenter';

@Component({
  selector: 'app-week-calendar-view-ui',
  templateUrl: './week-calendar-view.presentation.html',
  viewProviders: [WeekViewCalendarPresenter],
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false
})

export class WeekCalendarViewPresentationComponent extends BasePresentation implements OnInit, OnDestroy {
  /** hostBinding */
  @HostBinding('class') public class: string = 'd-flex flex-column h-100 w-100 overflow-hidden';

  /** eventsItem */
  public eventsItem: any[];

  @Input() public set currentDate(value: Date) {
    if (value) {
      this._currentDate = value;
      this.weekViewCalendarPresenter.setIsStartAndEndDateValue(true);
      this.weekViewCalendarPresenter.setWeekDays(this.currentDate);
    }
  }

  public get currentDate(): Date {
    return this._currentDate;
  }

  /**
   * The current view date
   */
  @Input() public set events(value: CalendarEvent[]) {
    if (value) {
      this._eventsItem = [...value];
      this.weekViewCalendarPresenter.setEventPropertyBasedInEndDate(this._eventsItem);
      this.currentDate && this.weekViewCalendarPresenter.setWeekDays(this.currentDate);
    }
  }
  /** getCalendarWeek */
  @Output() public getCalendarWeek: EventEmitter<CurrentMonthStartAndEndDate>;

  public get events(): CalendarEvent[] {
    return this._eventsItem;
  }

  public _currentDate: Date;
  public week: CalendarWeek[];
  public weekDayName: string[];
  public getDayArray: any[] = [];
  private destroy: Subject<boolean>;
  private _eventsItem: any[];
  constructor(
    private calendarService: CommonService,
    private weekViewCalendarPresenter: WeekViewCalendarPresenter,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute,
    private archiveModeService: ArchiveModeService
  ) {
    super();
    this.weekDayName = this.weekViewCalendarPresenter.weekDayName;
    this.destroy = new Subject<boolean>();
    this.getCalendarWeek = new EventEmitter<CurrentMonthStartAndEndDate>();
  }

  /** getMonth */
  public getMonth(date: Date): string {
    return this.weekViewCalendarPresenter.months[date.getMonth()];
  }

  /** inItProps */
  public inItProps(): void {
    this.weekViewCalendarPresenter.week$.pipe(takeUntil(this.destroy)).subscribe((weekItem: CalendarWeek[]) => {
      this.week = weekItem;
      this.cdr.detectChanges();
    });

    this.weekViewCalendarPresenter.weekStartDate$.pipe(takeUntil(this.destroy)).subscribe((startEndDate: CurrentMonthStartAndEndDate) => {
      this._currentDate = this.weekViewCalendarPresenter.currentDate;
      startEndDate && this.getCalendarWeek.emit(startEndDate);
    });
  }

  /** isCurrentDate */
  public isCurrentDate(date: Date): boolean {
    return date.getDate() === new Date().getDate() && date.getMonth() === new Date().getMonth() && date.getFullYear() === new Date().getFullYear();
  }

  /** Life cycle hook */
  public ngOnInit(): void {
    this.inItProps();
    this.calendarService.subject.pipe(takeUntil(this.destroy)).subscribe((value: string) => {
      if (value === 'next') {
        this.weekViewCalendarPresenter.onNext();
      } else {
        this.weekViewCalendarPresenter.onPrev();
      }
    });
  }

  /** navigate to bookit ticket */
  public navigateToBookItRequest(id: number): void {
    this.archiveModeService.archiveMode$.pipe(take(1)).subscribe(flag => {
      const path = flag ? '/archive/bookit' : '/bookit';
      this.router.navigate([path, id], { relativeTo: this.route });
    })
  }

  /** Life cycle hook */
  public ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }
}
