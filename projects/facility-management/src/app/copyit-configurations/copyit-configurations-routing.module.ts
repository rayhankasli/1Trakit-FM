/**
 * @author Enter Your Name Here.
 * @description This file is used to initialize the routes for CopyitConfigurationsModule
 */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// --------------------------------------------------- //
import { AuthPolicyGuard } from 'common-libs';
// --------------------------------------------------- //
import { Permission } from '../core/enums/role-permissions.enum';
import { CopyitConfigurationsPresentationComponent } from './copyit-configurations-presentation/copyit-configurations.presentation';
import { CopyitDefaultValuesFormContainerComponent } from './copyit-default-values-form-container/copyit-default-values-form.container';
import { CopyitManageAccountListContainerComponent } from './copyit-manage-account-list-container/copyit-manage-account-list.container';
import { CopyitOptionsFormContainerComponent } from './copyit-options-form-container/copyit-options-form.container';

const routes: Routes = [
  {
    path: '',
    component: CopyitConfigurationsPresentationComponent,
    children: [
      {
        path: '',
        redirectTo: 'copyit-options',
        pathMatch: 'full'
      },
      {
        path: 'copyit-options',
        component: CopyitOptionsFormContainerComponent,
        canActivate: [AuthPolicyGuard],
        data: {
          permission: Permission.CopyItConfigurationOptions.view
        },
      },
      {
        path: 'default-values',
        component: CopyitDefaultValuesFormContainerComponent,
        canActivate: [AuthPolicyGuard],
        data: {
          breadcrumb: 'Copy It Default Values',
          permission: Permission.CopyItConfigurationDefaultValues.view
        },
      },
      {
        path: 'copyit-manage-account-list',
        component: CopyitManageAccountListContainerComponent,
        data: {
          breadcrumb: 'Copy It Manage Accounts',
          permission: Permission.CopyItManageAccount.view
        },

      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CopyitConfigurationsRoutingModule { }

