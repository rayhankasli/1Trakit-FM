/**
 * @author Enter Your Name Here.
 * @description This file is used to initialize the routes for BookItModule
 */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthPolicyGuard } from 'common-libs';
// --------------------------------------------------- //
import { MenuLicensing } from '../core/enums/menu-licensing.enum';
import { Permission } from '../core/enums/role-permissions.enum';
import { BookitFormContainerComponent } from './bookit-form-container/bookit-form.container';
import { BookItListContainerComponent } from './bookit-list-container/bookit-list.container';
import { BookitPrintContainerComponent } from './bookit-print-container/bookit-print.container';
import { BookItPrintResolver } from './bookit-print.resolver';


const routes: Routes = [
  {
    path: '',
    component: BookItListContainerComponent,
    data: {
      license: MenuLicensing.BookIt,
      archived: MenuLicensing.BookIt
    },
  },
  {
    path: 'add-new-request',
    data: { breadcrumb: 'Add Request', mode: 'add', license: MenuLicensing.BookIt },
    component: BookitFormContainerComponent
  },
  {
    path: ':id',
    // resolve: { info: BookItPrintResolver },
    data: {
      license: MenuLicensing.BookIt,
      archived: MenuLicensing.BookIt
    },
    children: [
      {
        path: '',
        data: { breadcrumb: 'Edit Request', mode: 'edit' },
        component: BookitFormContainerComponent
      },
      {
        path: 'print',
        pathMatch: 'full',
        resolve: { info: BookItPrintResolver },
        data: { permission: Permission.BookIt.print, autoPrint: true },
        canActivate: [AuthPolicyGuard],
        component: BookitPrintContainerComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class BookItRoutingModule { }

