/**
 * @author Ashok Yadav.
 * @description 
 */
import {
  ComponentRef, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter,
  Input, OnDestroy, OnInit, Output, ViewChild, ViewContainerRef
} from '@angular/core';
import { ComponentPortal } from '@angular/cdk/portal';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { BsDatepickerViewMode } from 'ngx-bootstrap/datepicker/models';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
// ---------------------------------- //
import { BasePresentation } from '../../../../../core/base-classes/base.presentation';
import { Permission } from '../../../../../core/enums/role-permissions.enum';
import { ArchiveModeService } from '../../../../../core/services/archive-mode/archive-mode.service';
import { CoreDataService } from '../../../../../core/services/core-data.service';
import { CommonService } from '../../calendar-common.service';
import {
  Calendar, CalendarEvent, CalendarMasterData, CalendarParams, CurrentMonthStartAndEndDate,
  DateGroup, MonthFilterItem, Rooms, WeekFilterItem
} from '../../calender.model';
import { CalendarPresenter } from '../calendar-presenter/calendar.presenter';
import { OverlayMonthWeekPresentationComponent } from '../overlay-month-week-presentation/overlay-month-week.presentation';

@Component({
  selector: 'app-calendar-ui',
  templateUrl: './calendar.presentation.html',
  viewProviders: [CalendarPresenter],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CalendarPresentationComponent extends BasePresentation implements OnInit, OnDestroy {

  /** This will set the calendar data */
  @Input() public set calenderMasterData(value: CalendarMasterData) {
    if (value) {
      this._calendarMastetData = value;
      this.isCalendarPeriod = this._calendarMastetData.calendarPeriod.startDate && this._calendarMastetData.calendarPeriod.endDate ? true : false;
      this.minDate = this._calendarMastetData.calendarPeriod.startDate;
      this.maxDate = this._calendarMastetData.calendarPeriod.endDate;
      if (!this.isCalendarPeriod) {
        this.calendarPresenter.createComponent('noData', this.containerRef)
        this.initialLoad = true;
      } else {
        if (this.view === 'week') {
          this.calendarPresenter.createComponent('week', this.containerRef);
          this.initialLoad = false;
          this.weekView();
        } else {
          this.initialLoad && this.calendarPresenter.createComponent(this.view, this.containerRef);
          this.initialLoad = false;
        }
        this.monthFilterItems = this.calendarPresenter.getMonthFilterItems(this._calendarMastetData.calendarPeriod);
        this.preventNext = this.isStartDate() ? true : false;
        this.preventPrevious = this.isEndDate() ? true : false;
      }
    }
  }

  public get calenderMasterData(): CalendarMasterData {
    return this._calendarMastetData;
  }

  /** This will set the calendar data */
  @Input() public set calendar(value: Calendar[]) {
    if (value) {
      this._calendar = value;
      this.setCalanderEvent();
      this.cdr.markForCheck();
    }
  }

  public get calendar(): Calendar[] {
    return this._calendar;
  }
  /** Output of customer form presentation component */
  @Output() public generateCalendarPrint: EventEmitter<void>;
  /** Output of customer form presentation component */
  @Output() public getCalendar: EventEmitter<CalendarParams>;
  /** Output of customer form presentation component */
  @Output() public getCalendarPeriod: EventEmitter<CalendarParams>;
  /** This is a container ref which renders child components dynamically */
  @ViewChild('containerRef', { read: ViewContainerRef, static: true }) public containerRef: ViewContainerRef;
  @ViewChild('calenderElement', { static: true }) calenderElement: ElementRef;
  @ViewChild('buttonRef', { static: true }) buttonRef: ElementRef;
  @ViewChild('liRef', { static: true }) liRef: ElementRef;

  public get isTodayDateMatch(): boolean {
    return this.calendarPresenter.checkTodayAndMonthViewIsMatched;
  }

  public get allRooms(): Rooms[] {
    return this.calenderMasterData && this.calenderMasterData.allRooms;
  }

  /**
   * This enum is return ReportsBookIt enum props.
   */
  public get calenderPermission(): typeof Permission.ReportsBookIt {
    return Permission.ReportsBookIt;
  }


  public weekFormControl: FormControl;
  public minDate: Date;
  public maxDate: Date;
  public bsValue: Date = new Date();
  public minMode: BsDatepickerViewMode = 'month';
  public bsConfig: Partial<BsDatepickerConfig>;
  /** to-do */
  public monthFilterDate: Date;
  public filterValue: number = 0;
  public monthYear: string;
  public filterData: CalendarEvent[];
  public dateFormat: Date;
  public date: any;
  public weekDay: any;
  public view: string;
  public isFilter: boolean = false;
  public selectedDay: Date = new Date();
  public currentYear: any = new Date().getFullYear();
  public startWeek: number;
  public endWeek: number;
  public weekFilterItems: WeekFilterItem[];
  public monthFilterItems: MonthFilterItem[];
  public allRoomfilterValue: number;
  public year: any;
  public dateTime: Date;
  public isCalendarPeriod: boolean;
  public preventNext: boolean;
  public preventPrevious: boolean;
  private _calendar: Calendar[];
  private weekDayName: string[];
  private _clientId: number;
  private _roomId: number;
  private isGetCalendarPeriod: boolean;
  private _calendarMastetData: CalendarMasterData;
  private _calendarPeriod: CurrentMonthStartAndEndDate;
  private destroy: Subject<boolean>;
  private isInitialMonthLoad: boolean;
  private currentMonthStartAndEndDate: CurrentMonthStartAndEndDate;
  private calenderWeek: CurrentMonthStartAndEndDate;
  private isCurrentMonthStartAndEndDate: boolean;
  private isCalenderWeek: boolean;
  private roomDetails: Rooms;
  private initialLoad: boolean;
  private startEndMonthDate: CurrentMonthStartAndEndDate;
  constructor(
    private calendarService: CommonService,
    private calendarPresenter: CalendarPresenter,
    private cdr: ChangeDetectorRef,
    private coreDataService: CoreDataService,
    private router: Router,
    private route: ActivatedRoute,
    private archiveModeService: ArchiveModeService
  ) {
    super();
    this.weekFormControl = new FormControl(null, [Validators.required]);
    this.allRoomfilterValue = 0
    this.weekFilterItems = [];
    this.monthFilterItems = [];
    this.isInitialMonthLoad = true;
    this.dateFormat = new Date();
    this.destroy = new Subject<boolean>();
    this.isGetCalendarPeriod = true;
    this.generateCalendarPrint = new EventEmitter<void>();
    this.getCalendar = new EventEmitter<CalendarParams>();
    this.getCalendarPeriod = new EventEmitter<CalendarParams>();
    this.filterData = [];
    this.view = 'month';
    this.calendarPresenter.currentView = 'month';
    this.weekDayName = this.calendarPresenter.weekDayName;
    const currentDate = new Date().getDate();
    this.date = currentDate > 9 ? currentDate : '0' + currentDate;
    this.weekDay = this.calendarPresenter.getWeekdaysName(null);
    this.year = this.dateFormat.getUTCFullYear();
    this.dateTime = new Date();
    this.monthFilterDate = new Date();
    this.isCalendarPeriod = true;
    this.initialLoad = false;
  }

  public ngOnInit(): void {
    this.onInitProps();
    this.calendarPresenter.setMonthWeekViewOverlay(this.buttonRef);
    this.calendarPresenter.addRemoveClass(this.liRef, 'icon-monthly-calendar', null);
  }

  /** onTodayClick */
  public onTodayClick(): void {
    if (this.view === 'month') {
      this.filterMonthItemChange(new Date());
      this.todayEvent();
    } else {
      this.weekFilterItems.forEach((filterItems: any, index: number) => {
        filterItems.dateGroup.forEach((item: DateGroup) => {
          if (item.utcDate.getDate() === new Date().getDate() && item.utcDate.getMonth() === new Date().getMonth() && item.utcDate.getFullYear() === new Date().getFullYear()) {
            this.filterValue = index;
            this.startWeek = index + 1;
            this.calendarPresenter.setcurrentWeekDate(new Date(this.weekFilterItems[index].dateGroup[6].utcDate));
          }
        });
      });
    }
  }

  /** emitSelectedDate */
  public emitSelectedDate(date: Date): void {
    this.calendarPresenter.setcurrentMonthDate(date);
  }

  /** allRoomItemChange */
  public allRoomItemChange(room: Rooms | undefined): void {
    if (room) {
      this.roomDetails = room;
      const calendarParams: CalendarParams =
        this.calendarPresenter.getCalendarParamsItemBasedOnRoomChange(room.roomId);
      this.getCalendar.emit(calendarParams);
    }
  }

  /** emitCalendarPrint */
  public emitCalendarPrint(): void {
    this.calendarService.calendarEvents = this.calendarPresenter.setCurrentMonthStartAndEndDate(this._calendarMastetData.calendarPeriod);
    this.generateCalendarPrint.emit();
  }

  /** reset */
  public reset(): void {
    this.weekFormControl.reset();
    let roomDetails: Rooms = {
      roomId: 0,
      room: ''
    }
    this.allRoomItemChange(roomDetails);
  }

  /** prevCall */
  public prevCall(value: string): void {
    if (this.startWeek != 1 && value === 'week') {
      this.startWeek--;
      this.filterValue--;
      this.calendarService.subject.next('prev');
    } else if (!this.isEndDate() && value === 'month') {
      this.isFilter = false;
      this.preventNext = false;
      this.monthFilterDate = new Date();
      this.calendarService.subject.next('prev');
    }
    this.preventPrevious = this.isEndDate() ? true : false;
  }

  /** nextCall */
  public nextCall(value: string): void {
    if (this.startWeek != this.endWeek && value === 'week') {
      this.startWeek++;
      this.filterValue++;
      this.calendarService.subject.next('next');
    } else if (!this.isStartDate() && value === 'month') {
      this.preventPrevious = false;
      this.isFilter = false;
      this.monthFilterDate = new Date();
      this.calendarService.subject.next('next');
    }
    this.preventNext = this.isStartDate() ? true : false;
  }

  /** isStartDate */
  public isStartDate(): boolean {
    return this.calendarPresenter.isPeriodDateMatch(this.monthFilterDate, this._calendarMastetData.calendarPeriod.endDate);
  }

  /** isEndDate */
  public isEndDate(): boolean {
    return this.calendarPresenter.isPeriodDateMatch(this.monthFilterDate, this._calendarMastetData.calendarPeriod.startDate);
  }

  /** setDateYear */
  public setDateYear(date: Date): void {
    this.monthFilterDate = date;
    this.monthYear = this.calendarPresenter.getMonthYear(date);
    this.currentYear = date.getFullYear();
  }

  /** dayClick */
  public dayClick(event: DateGroup): void {
    this.filterData = event ? event.event : undefined;
    if (this.filterData && event.event.length > 0) {
      this.isFilter = true;
    } else {
      this.isFilter = false;
    }
    if (this.filterData) {
      this.selectedDay = new Date(event.date);
      const currentDate = new Date(event.utcDate).getDate();
      this.date = currentDate > 9 ? currentDate : '0' + currentDate;
      this.weekDay = this.calendarPresenter.getWeekdaysName(event.utcDate);
      this.dateTime = new Date(event.utcDate);
    }
  }

  /** filterWeekItemChange */
  public filterWeekItemChange(filterItem: WeekFilterItem): void {
    this.startWeek = filterItem.value + 1;
    const currentWeekDate = new Date(filterItem.dateGroup[6].utcDate);
    this.calendarPresenter.setcurrentWeekDate(currentWeekDate);
  }

  /** filterMonthItemChange */
  public filterMonthItemChange(filterItem: Date | null): void {
    if (filterItem) {
      this.isFilter = false;
      const currentMonthDate = new Date(filterItem);
      this.calendarPresenter.setcurrentMonthDate(currentMonthDate);
      this.preventNext = this.isStartDate() ? true : false;
      this.preventPrevious = this.isEndDate() ? true : false;
    }
  }

  /** openOverlay */
  public openOverlay(): void {
    const overlayRef: ComponentRef<OverlayMonthWeekPresentationComponent> = this.calendarPresenter.overlayRef.attach(new ComponentPortal(OverlayMonthWeekPresentationComponent));
    overlayRef.instance.clickOnOverlay.pipe(takeUntil(this.destroy)).subscribe((item: string) => {
      this.view = item;
      this.calendarPresenter.currentView = this.view;
      this.filterData = [];
      if (item === 'week') {
        this.weekView();
      } else {
        this.isFilter = false;
        this.filterValue = 0;
        this.calendarPresenter.addRemoveClass(this.liRef, 'icon-monthly-calendar', 'icon-weekly-calendar');
      }
      this.calendarPresenter.overlayRef.detach();
      this.calendarPresenter.createComponent(this.view, this.containerRef);
      this.cdr.detectChanges();
    });
  }

  /** setStartEndDate */
  public setStartEndDate(startEndMonthDate?: CurrentMonthStartAndEndDate, isClientChange?: boolean): void {
    const calenderParam: CalendarParams = this.calendarPresenter.setCurrentMonthStartAndEndDate(startEndMonthDate);
    if (!this.isGetCalendarPeriod && !isClientChange) {
      this.getCalendar.emit(calenderParam);
    } else if (isClientChange) {
      this.setCalenderPeriod(calenderParam);
    } else {
      this.setCalenderPeriod(calenderParam);
    }
  }

  /** navigate to bookit ticket */
  public navigateToBookItRequest(id: number): void {
    this.archiveModeService.archiveMode$.pipe(take(1)).subscribe(flag => {
      const path = flag ? '/archive/bookit' : '/bookit';
      this.router.navigate([path, id], { relativeTo: this.route });
    })
  }

  public ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }

  /** onInitProps */
  private onInitProps(): void {
    this.calendarPresenter.createComponent(this.view, this.containerRef);
    this.bsConfig = Object.assign({}, {
      minMode: this.minMode,
      containerClass: 'theme-primary',
      dateInputFormat: 'MMMM  YYYY',
      showWeekNumbers: false,
    });
    this.calendarPresenter.clickOnDay$.pipe(takeUntil(this.destroy)).subscribe((clickDayItem: any) => {
      clickDayItem && this.dayClick(clickDayItem);
    });
    this.calendarPresenter.changeDateYear$.pipe(takeUntil(this.destroy)).subscribe((changeDateYear: Date) => {
      changeDateYear && this.setDateYear(changeDateYear);
    });

    this.calendarPresenter.currentMonthStartAndEndDate$.pipe(takeUntil(this.destroy)).subscribe((currentMonthStartAndEndDate: CurrentMonthStartAndEndDate) => {
      if (currentMonthStartAndEndDate) {
        this.currentMonthStartAndEndDate = currentMonthStartAndEndDate;
        this.isCurrentMonthStartAndEndDate = true;
        this.isCalenderWeek = false;
      }
      currentMonthStartAndEndDate && this.setStartEndDate(currentMonthStartAndEndDate);
    });
    this.calendarPresenter.getCalendarWeek$.pipe(takeUntil(this.destroy)).subscribe((calendarWeek: CurrentMonthStartAndEndDate) => {
      if (calendarWeek) {
        this.calenderWeek = calendarWeek;
        this.isCalenderWeek = true;
        this.isCurrentMonthStartAndEndDate = false;
      }
      calendarWeek && this.setStartEndDate(calendarWeek);
    });
    this.coreDataService.globalClientId$.pipe(takeUntil(this.destroy)).subscribe((clientId: number) => {
      if (clientId > 0) { this._clientId = clientId; } else { this._clientId = 0; }
      this.calendarPresenter.setClientId(this._clientId);
      if ((this._clientId || this._clientId === 0) && this.isCurrentMonthStartAndEndDate) {
        this.setStartEndDate(this.currentMonthStartAndEndDate, true)
      }
      if ((this._clientId || this._clientId === 0) && this.isCalenderWeek) {
        this.setStartEndDate(this.calenderWeek, true);
      }
    });
  }

  /** setCalanderEvent */
  private setCalanderEvent(): void {
    const events = this.calendarPresenter.getCalendarItems(this.calendar);
    this.calendarPresenter.setEvents(events);
    this.todayEvent();
  }

  /** getCalenderPeriod */
  private setCalenderPeriod(calenderParam: CalendarParams): void {
    this.getCalendarPeriod.emit(calenderParam);
    this.isGetCalendarPeriod = false;
  }

  /** todayEvent */
  private todayEvent(): void {
    let todayEventData: DateGroup = this.isCalendarPeriod && this.calendarPresenter.todayEventList(this.calendar);
    if (this.view === 'month' && this.isCalendarPeriod) {
      this.dayClick(todayEventData);
    }
  }

  /** weekView */
  private weekView(): void {
    this.isFilter = true;
    this.calendarPresenter.addRemoveClass(this.liRef, 'icon-weekly-calendar', 'icon-monthly-calendar');
    this.weekFilterItems = this.calendarPresenter.getWeekFilterItems(this._calendarMastetData.calendarPeriod);
    this.startWeek = 1;
    this.endWeek = this.weekFilterItems.length;
    const currentWeekDate = new Date(this.weekFilterItems[0].dateGroup[6].utcDate);
    this.calendarPresenter.setcurrentWeekDate(currentWeekDate);
  }

}
