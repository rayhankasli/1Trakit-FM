/**
 * @author Ashok Yadav.
 * @decriptions
 */
import { Component, HostBinding } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
// --------------------------------------------------- //
import { CalendarService } from '../calendar.service';
import { Calendar, CalendarParams, CurrentMonthStartAndEndDate, Rooms, CalendarMasterData } from '../calender.model';

@Component({
  selector: 'app-calendar-container',
  templateUrl: './calendar.container.html'
})
export class CalendarContainerComponent {
  /** hostBinding */
  @HostBinding('class') public class: string = 'd-flex w-100 flex-grow-1 mt-n2 overflow-hidden';
  /** This observable is use to pass calendar items */
  public calendar$: Observable<Calendar[]>;
  /** This observable is use to pass calendar items */
  public calenderMasterData$: Observable<CalendarMasterData>;
  /** This observable is use to pass calendar items */
  public calendarPeriod$: Observable<CurrentMonthStartAndEndDate>;

  constructor(
    private calendarService: CalendarService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  /** This method invoke and it is get calendar month and week data */
  public getCalendar(params: CalendarParams): void {
    this.calendar$ = this.calendarService.getMonthAndWeekViewData(params);
  }

  /** This method get master data of the entry events date */
  public getCalendarPeriod(params: CalendarParams): void {
    const calendarPeriod$ = this.calendarService.getCalendarPeriod(params.clientId);
    const allRooms$ = this.calendarService.getAllRooms(params.clientId);

    this.calenderMasterData$ = forkJoin(calendarPeriod$, allRooms$).pipe(
      map(([calendarPeriod, allRooms]: [CurrentMonthStartAndEndDate, Rooms[]]) => {
        this.calendar$ = this.calendarService.getMonthAndWeekViewData(params);
        const calendarMasterData: CalendarMasterData = {
          calendarPeriod,
          allRooms
        };
        return calendarMasterData;
      }));
  }

  /** Print downloaded bookIt detail PDF */
  public generateCalendarPrint(): void {
    this.router.navigate(['../print'], { relativeTo: this.route });
  }
}