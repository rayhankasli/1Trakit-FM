/**
 * @author Enter Your Name Here.
 * @description This file is used to initialize the routes for CopyitStepperModule
 */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// --------------------------------------------------------- //
import { AuthPolicyGuard } from 'common-libs';
// --------------------------------------------------------- //
import { MenuLicensing } from '../core/enums/menu-licensing.enum';
import { Permission } from '../core/enums/role-permissions.enum';
import { CopyItEditContainerComponent } from './copyit-edit-container/copyit-edit.container';
import { CopyItListContainerComponent } from './copyit-list-container/copyit-list.container';
import { CopyItPrintResolver } from './copyit-print-resolver';
import { CopyItPrintPresentationComponent } from './copyit-print/copyit-print-presentation/copyit-print.presentation';
import { CopyItStepperContainerComponent } from './copyit-stepper-container/copyit-stepper.container';


const routes: Routes = [
  {
    path: '',
    component: CopyItListContainerComponent,
    data: {
      license: MenuLicensing.CopyIt,
      archived: MenuLicensing.CopyIt,
    }
  },
  {
    path: 'add-new-request',
    data: { permission: Permission.CopyIt.add, license: MenuLicensing.CopyIt, mode: 'add' },
    canActivate: [AuthPolicyGuard],
    component: CopyItStepperContainerComponent
  },
  {
    path: ':id',
    resolve: { info: CopyItPrintResolver },
    data: {
      license: MenuLicensing.CopyIt,
      archived: MenuLicensing.CopyIt,
    },
    children: [
      {
        path: '',
        data: { breadcrumb: 'Edit Request', mode: 'edit' },
        component: CopyItEditContainerComponent
      },
      {
        path: 'print',
        pathMatch: 'full',
        data: { permission: Permission.CopyIt.print, autoPrint: true },
        canActivate: [AuthPolicyGuard],
        component: CopyItPrintPresentationComponent
      }
    ]
  },
];
/**
 * CopyIt Routing Module
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CopyitRoutingModule { }

