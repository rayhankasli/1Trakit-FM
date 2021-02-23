/**
 * @author Farhin Shekh.
 * @description This file is used to initialize the routes for UserModule
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// --------------------------------------------------- //
import { ReportCopyItContainerComponent } from './report-copyit-container/report-copyit.container';
import { Permission } from '../../core/enums/role-permissions.enum';
import { MenuLicensing } from '../../core/enums/menu-licensing.enum';

const routes: Routes = [
  {
    path: '',
    component: ReportCopyItContainerComponent,
    data: {
      license: MenuLicensing.ReportCopyIt,
      archived: MenuLicensing.ReportCopyIt,
    },
    children: [
      {
        path: '',
        redirectTo: 'timeliness',
        pathMatch: 'full'
      },
      {
        path: 'timeliness',
        loadChildren: () => import('./timeliness/timeliness.module').then(m => m.TimelinessModule),
        data: {
          permission: Permission.ReportsCopyIt.timelinessView,
          license: MenuLicensing.ReportCopyIt,
          archived: MenuLicensing.ReportCopyIt,
        }
      },
      {
        path: 'copy-center-imp-color',
        loadChildren: () => import('./copy-center-imp-color/copy-center-imp-color.module').then(m => m.CopyCenterImpColorModule),
        data: {
          permission: Permission.ReportsCopyIt.copyCenterImpColorView,
          license: MenuLicensing.ReportCopyIt,
          archived: MenuLicensing.ReportCopyIt,
        }
      },
      {
        path: 'copy-center-imp-b-and-w',
        loadChildren: () => import('./copy-center-imp-b-and-w/copy-center-imp-b-and-w.module').then(m => m.CopyCenterImpBAndWModule),
        data: {
          permission: Permission.ReportsCopyIt.copyCenterImpBlackAndWhiteView,
          license: MenuLicensing.ReportCopyIt,
          archived: MenuLicensing.ReportCopyIt,
        }
      },
      {
        path: 'copy-center-imp-scan',
        loadChildren: () => import('./copy-center-imp-scan/copy-center-imp-scan.module').then(m => m.CopyCenterImpScanModule),
        data: {
          permission: Permission.ReportsCopyIt.copyCenterImpScanView,
          license: MenuLicensing.ReportCopyIt,
          archived: MenuLicensing.ReportCopyIt,
        }
      },
      {
        path: 'total-copy-volume',
        loadChildren: () => import('./total-copy-volume/total-copy-volume.module').then(m => m.TotalCopyVolumeModule),
        data: {
          permission: Permission.ReportsCopyIt.totalCopyVolumeView,
          license: MenuLicensing.ReportCopyIt,
          archived: MenuLicensing.ReportCopyIt,
        }
      },
      {
        path: 'total-copy-jobs',
        loadChildren: () => import('./total-copy-jobs/total-copy-jobs.module').then(m => m.TotalCopyJobsModule),
        data: {
          permission: Permission.ReportsCopyIt.totalCopyJobsView,
          license: MenuLicensing.ReportCopyIt,
          archived: MenuLicensing.ReportCopyIt,
        }
      },
      {
        path: 'cost-recovery',
        loadChildren: () => import('./cost-recovery/cost-recovery.module').then(m => m.CostRecoveryModule),
        data: {
          permission: Permission.ReportsCopyIt.costRecoveryView,
          license: MenuLicensing.ReportCopyIt,
          archived: MenuLicensing.ReportCopyIt,
        }
      },
      {
        path: 'chargeback',
        loadChildren: () => import('./chargeback/chargeback.module').then(m => m.ChargebackModule),
        data: {
          permission: Permission.ReportsCopyIt.chargebackView,
          license: MenuLicensing.ReportCopyIt,
          archived: MenuLicensing.ReportCopyIt,
        }
      }

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportCopyItRoutingModule { }

