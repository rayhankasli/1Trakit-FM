/**
 * @author Farhin Shekh.
 * @description This file is used to initialize the routes for UserModule
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// --------------------------------------------------- //
import { ReportComponent } from './report-presentation/report.component';
import { Permission } from '../core/enums/role-permissions.enum';
import { AuthPolicyGuard } from 'common-libs';
import { MenuLicensing } from '../core/enums/menu-licensing.enum';
import { CheckArchivedGuard } from '../core/guards/check-archived/check-archived.guard';

const routes: Routes = [
  {
    path: '',
    component: ReportComponent,
    children: [
      {
        path: 'copyit',
        canActivate: [AuthPolicyGuard],
        canActivateChild: [CheckArchivedGuard],
        loadChildren: () => import('./report-copyit/report-copyit.module').then(m => m.ReportCopyItModule),
        data: {
          breadcrumb: 'Report - Copy It',
          permission: Permission.ReportsCopyIt.view,
        }
      },
      {
        path: 'bookit',
        canActivate: [AuthPolicyGuard],
        canActivateChild: [CheckArchivedGuard],
        loadChildren: () => import('./report-bookit/report-bookit.module').then(m => m.ReportBookItModule),
        data: {
          breadcrumb: 'Report - Book It',
          permission: Permission.ReportsBookIt.view,
        }
      },
      {
        path: 'fleet',
        canActivate: [AuthPolicyGuard, CheckArchivedGuard],
        loadChildren: () => import('./report-fleet/report-fleet.module').then(m => m.ReportFleetModule),
        data: {
          breadcrumb: 'Report - Fleet',
          permission: Permission.ReportsFleet.view,
          archived: MenuLicensing.ReportFleet
        }
      },
      {
        path: 'mail',
        canActivate: [AuthPolicyGuard, CheckArchivedGuard],
        loadChildren: () => import('./report-mail/report-mail.module').then(m => m.ReportMailModule),
        data: {
          breadcrumb: 'Report - Mail',
          permission: Permission.ReportsMail.reportMailView,
          archived: MenuLicensing.ReportMail
        }
      },
      {
        path: 'workflow',
        canActivate: [AuthPolicyGuard, CheckArchivedGuard],
        loadChildren: () => import('./report-workflow/report-workflow.module').then(m => m.ReportWorkflowModule),
        data: {
          breadcrumb: 'Report - Workflow',
          permission: Permission.ReportsWorkflow.reportWorkflowView,
          archived: MenuLicensing.ReportWorkflow
        }
      },
      {
        path: 'task',
        canActivate: [AuthPolicyGuard, CheckArchivedGuard],
        loadChildren: () => import('./report-task/report-task.module').then(m => m.ReportTaskModule),
        data: {
          breadcrumb: 'Report - Tasks',
          permission: Permission.ReportsTask.reportTaskView,
          archived: MenuLicensing.ReportTask
        }
      },
      {
        path: 'meter-read',
        canActivate: [AuthPolicyGuard, CheckArchivedGuard],
        loadChildren: () => import('./report-meter-read/report-meter-read.module').then(m => m.ReportMeterReadModule),
        data: {
          breadcrumb: 'Report - Meter Reads',
          permission: Permission.ReportsMeterReads.reportMeterReadsView,
          archived: MenuLicensing.ReportMeterReads,
        }
      }
    ]
  }
];

/**
 * All archived routes with archived route guard
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportRoutingArchivedModule { }

