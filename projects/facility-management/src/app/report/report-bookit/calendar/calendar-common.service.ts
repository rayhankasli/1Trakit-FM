/**
 * @author Ashok Yadav
 */
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
// -------------------------------------------------------- //
import { CalendarParams } from './calender.model';

@Injectable()
export class CommonService {
  
  public calendarEvents: CalendarParams;
  public subject: Subject<any> = new Subject();
  
  constructor() {}
}