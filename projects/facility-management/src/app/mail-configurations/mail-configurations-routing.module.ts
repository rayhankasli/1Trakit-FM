/**
 * @author Rayhan Kasli.
 * @description This file is used to initialize the routes for MailConfigurationsModule
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// --------------------------------------------------- //
import { MailConfigurationsContainerComponent } from './mail-configurations-container/mail-configurations.container';
import { AuthPolicyGuard } from 'common-libs';
import { Permission } from '../core/enums/role-permissions.enum';

const routes: Routes = [
  {
    path: '',
    component: MailConfigurationsContainerComponent,
  }
];

/**
 * Ng module
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MailConfigurationsRoutingModule { }

