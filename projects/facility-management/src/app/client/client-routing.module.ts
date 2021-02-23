/**
 * @author Enter Your Name Here.
 * @description This file is used to initialize the routes for ClientModule
 */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// --------------------------------------------------- //
import { AuthPolicyGuard } from 'common-libs';
// --------------------------------------------------- //
import { ClientContainerComponent } from './client-container/client.container';
import { ClientDetailResolver } from './client-detail-resolver';
import { ClientFormContainerComponent } from './client-form-container/client-form.container';
import { ClientListContainerComponent } from './client-list-container/client-list.container';
import { CLIENT_GUARD_TYPE } from './client.constant';
import { ClientConfigGuard } from './guards/client-config.guard';
import { ClientDetailGuard } from './guards/client-detail.guard';
import { Permission } from '../core/enums/role-permissions.enum';


const routes: Routes = [
  {
    path: '',
    component: ClientListContainerComponent,
  },
  {
    path: 'add',
    component: ClientContainerComponent,
    children: [
      { path: '', redirectTo: 'detail', pathMatch: 'full' },
      {
        path: 'detail',
        canActivate: [AuthPolicyGuard],
        data: { breadcrumb: 'Details', permission: Permission.Client.add },
        component: ClientFormContainerComponent
      }
    ]
  },
  {
    path: ':id',
    canActivate: [ClientDetailGuard],
    resolve: { client: ClientDetailResolver },
    // data: { breadcrumb: '{{ client?.companyName }}' },
    component: ClientContainerComponent,
    children: [
      { path: '', redirectTo: 'detail', pathMatch: 'full' },
      {
        path: 'detail',
        resolve: { client: ClientDetailResolver },
        canActivate: [AuthPolicyGuard],
        data: { breadcrumb: '{{ client.companyName }}-Details', permission: Permission.Client.update },
        component: ClientFormContainerComponent
      },
      {
        path: 'offices',
        resolve: { client: ClientDetailResolver },
        canActivateChild: [AuthPolicyGuard, ClientConfigGuard],
        data: { breadcrumb: '{{ client.companyName }}-Offices', config: CLIENT_GUARD_TYPE.office, permission: Permission.Office.view },
        loadChildren: () => import('./office/office.module').then(m => m.OfficeModule)
      }
    ]
  },
  {
    path: ':id',
    canActivate: [ClientDetailGuard],
    resolve: { client: ClientDetailResolver },
    // data: { breadcrumb: '{{ client?.companyName }}' },
    children: [
      // {
      //   path: 'book-it',
      //   data: { breadcrumb: 'Book It' },
      // },
      {
        path: 'copyit-configuration',
        resolve: { client: ClientDetailResolver },
        data: {
          breadcrumb: '{{ client.companyName }}-Copy It Configurations',
          config: CLIENT_GUARD_TYPE.copyItConfig,
          // permission: Permission.MailConfiguration.view
        },
        canActivate: [AuthPolicyGuard, ClientConfigGuard],
        loadChildren: () => import('../copyit-configurations/copyit-configurations.module').then(m => m.CopyitConfigurationsModule),
      },
      {
        path: 'mail-configuration',
        resolve: { client: ClientDetailResolver },
        data: {
          breadcrumb: '{{ client.companyName }}-Mail Configurations',
          config: CLIENT_GUARD_TYPE.mailConfig,
          permission: Permission.MailConfiguration.view
        },
        canActivate: [AuthPolicyGuard, ClientConfigGuard],
        loadChildren: () => import('../mail-configurations/mail-configurations.module').then(m => m.MailConfigurationsModule),
      },
      {
        path: 'workflow-configuration',
        resolve: { client: ClientDetailResolver },
        canActivate: [AuthPolicyGuard, ClientConfigGuard],
        data: {
          breadcrumb: '{{ client.companyName }}-Work Flow Configurations',
          config: CLIENT_GUARD_TYPE.workflowConfig,
          permission: Permission.WorkFlowConfiguration.view
        },
        loadChildren: () => import('../workflow-configurations/workflow-configurations.module').then(m => m.WorkflowConfigurationsModule),
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientRoutingModule { }

