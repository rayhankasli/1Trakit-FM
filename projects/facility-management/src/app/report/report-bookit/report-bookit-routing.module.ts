/**
 * @author Farhin Shekh.
 * @description This file is used to initialize the routes for UserModule
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// --------------------------------------------------- //
import { ReportBookItContainerComponent } from './report-bookit-container/report-bookit.container';
import { Permission } from '../../core/enums/role-permissions.enum';
import { MenuLicensing } from '../../core/enums/menu-licensing.enum';

const routes: Routes = [
  {
    path: '',
    component: ReportBookItContainerComponent,
    data: {
      license: MenuLicensing.ReportBookIt,
      archived: MenuLicensing.ReportBookIt
    },
    children: [
      {
        path: '',
        redirectTo: 'facility-help-desk',
        pathMatch: 'full'
      },
      {
        path: 'facility-help-desk',
        loadChildren: () => import('./facilities-help-desk/facilities-help-desk.module').then(m => m.FacilitiesHelpDeskModule),
        data: {
          permission: Permission.ReportsBookIt.facilityHelpDeskView,
          license: MenuLicensing.ReportBookIt,
          archived: MenuLicensing.ReportBookIt
        }
      },
      {
        path: 'Labor-hours',
        loadChildren: () => import('./facilities-assistants/facilities-assistants.module').then(m => m.FacilitiesAssistantsModule),
        data: {
          permission: Permission.ReportsBookIt.facilityAssistantsView,
          license: MenuLicensing.ReportBookIt,
          archived: MenuLicensing.ReportBookIt
        }
      },
      {
        path: 'calendar',
        loadChildren: () => import('./calendar/calendar.module').then(m => m.CalendarModule),
        data: {
          permission: Permission.ReportsBookIt.calendarView,
          license: MenuLicensing.ReportBookIt,
          archived: MenuLicensing.ReportBookIt
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportBookItRoutingModule { }

