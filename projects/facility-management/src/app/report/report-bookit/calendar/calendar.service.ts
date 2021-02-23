/**
 * @author Ashok Yadav
 */
import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
// ------------------------------------------------------ //
import { HttpService, BaseResponse } from 'common-libs';
// --------------------------------------------------------------- //
import { environment } from '../../../../environments/environment';
import { CalendarAdapter, CalendarPeriodAdapter } from './calendar-adapter/calendar.adapter';
import { CalendarResponse, CalendarParams, Calendar, CalendarPeriodResponse, CurrentMonthStartAndEndDate, Rooms } from './calender.model';

@Injectable()
export class CalendarService {

  public subject: Subject<any> = new Subject();
  /** store base url */
  private baseUrl: string;
  constructor(
    private http: HttpService,
    private calendarAdapter: CalendarAdapter,
    private calendarPeriodAdapter: CalendarPeriodAdapter
  ) {
    this.baseUrl = environment.baseUrl;
  }

  /**
   * This method invoke and return data of month and week view.
   */
  public getMonthAndWeekViewData(params: CalendarParams): Observable<Calendar[]> {
    const url: string = this.baseUrl + 'reports/bookItCalendar';
    return this.http.httpGetRequest<CalendarResponse[]>(url, { params: { ...params } }).pipe(map((data: BaseResponse<CalendarResponse[]>) => {
      return data && data.result.map((items: CalendarResponse) => this.calendarAdapter.toResponse(items));
    }));
  }

  /**
   * This method invoke and return data of month and week view.
   */
  public getAllRooms(id: number | undefined): Observable<Rooms[]> {
    const url: string = this.baseUrl + 'reports/bookIt/rooms';
    return this.http.httpGetRequest<Rooms[]>(url, { params: id ? { clientId: id } : {} }).pipe(map((data: BaseResponse<Rooms[]>) => {
      return data.result;
    }));
  }

  /** 
   * This method return event entry data.
   */
  public getCalendarPeriod(id: number): Observable<CurrentMonthStartAndEndDate> {
    const url: string = this.baseUrl + 'reports/bookItCalendar/period';
    return this.http.httpGetRequest<CalendarResponse[]>(url, { params: { clientId: id } }).pipe(map((data: BaseResponse<CalendarPeriodResponse>) => {
      return this.calendarPeriodAdapter.toResponse(data.result);
    }));
  }
}
