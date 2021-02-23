/**
 * @author Ashok Yadav.
 * @description 
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// ----------------------------------------------------------------------------- //
import { CalendarContainerComponent } from './calendar-container/calendar.container';
import { CalendarPrintContainerComponent } from './calendar-print-container/calendar-print.container';
import { CalendarPrintResolver } from './calendar-print.resolver';
import { Permission } from '../../../core/enums/role-permissions.enum';

const routes: Routes = [
  {
    path: '',
    component: CalendarContainerComponent,
  },
  {
    path: 'print',
    resolve: { info: CalendarPrintResolver },
    data: { permission: Permission.ReportsBookIt, autoPrint: true },
   // canActivate: [AuthPolicyGuard],
    component: CalendarPrintContainerComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CalendarRoutingModule { }
