/**
 * @author Ashok Yadav.
 * @description 
 */
import { NgModule } from '@angular/core'
// ------------------------------------------------------------------------------- //
import { CalendarRoutingModule } from './calendar-routing.module';
import { AppSharedModule } from '../../../shared/app-shared.module';
import { CalendarService } from './calendar.service';
import { CommonService } from './calendar-common.service';
import { CalendarContainerComponent } from './calendar-container/calendar.container';
import { CalendarPresentationComponent } from './calendar-container/calendar-presentation/calendar.presentation';
import { OverlayMonthWeekPresentationComponent } from './calendar-container/overlay-month-week-presentation/overlay-month-week.presentation';
import { MonthCalendarViewPresentationComponent } from './calendar-container/month-calendar-view-presentation/month-calendar-view.presentation';
import { WeekCalendarViewPresentationComponent } from './calendar-container/week-calendar-view-presentation/week-calendar-view.presentation';
import { CalendarAdapter, CalendarPeriodAdapter } from './calendar-adapter/calendar.adapter';
import { CalendarPrintContainerComponent } from './calendar-print-container/calendar-print.container';
import { CalendarPrintResolver } from './calendar-print.resolver';
import { CalendarPrintPresentationComponent } from './calendar-print-container/calendar-print-presentation/calendar-print.presentation';
import { NoRecordFoundComponent } from './calendar-container/no-record-found/no-record-found.component';

@NgModule({
  declarations: [
    CalendarContainerComponent,
    CalendarPresentationComponent,
    MonthCalendarViewPresentationComponent,
    WeekCalendarViewPresentationComponent,
    OverlayMonthWeekPresentationComponent,
    CalendarPrintContainerComponent,
    CalendarPrintPresentationComponent,
    NoRecordFoundComponent
  ],
  imports: [
    CalendarRoutingModule,
    AppSharedModule
  ],
  entryComponents: [
    OverlayMonthWeekPresentationComponent,
    MonthCalendarViewPresentationComponent,
    WeekCalendarViewPresentationComponent,
    NoRecordFoundComponent
  ],
  providers: [
    CalendarService,
    CommonService,
    CalendarAdapter,
    CalendarPeriodAdapter,
    CalendarPrintResolver
  ]
})

export class CalendarModule { }
