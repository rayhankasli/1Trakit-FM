/**
 * @author Ronak Patel.
 * @description This file is used to initialize the routes for ClientModule
 */

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// ------------------------------------------- //
import { AuthPolicyGuard } from 'common-libs';
// ------------------------------------------- //
import { Permission } from '../../core/enums/role-permissions.enum';
import { OfficeContainerComponent } from './office-container/office.container';
import { FloorContainerComponent } from './floor-container/floor.container';
import { FloorResolver } from './floor-resolver';


const routes: Routes = [
  {
    path: '',
    // data: { breadcrumb: 'Offices' },
    component: OfficeContainerComponent,
  },
  {
    path: ':id/floors',
    resolve: { floors: FloorResolver },
    data: { breadcrumb: "{{floors.officeName + ' - Floors'}}", permission: Permission.Floor.view },
    component: FloorContainerComponent,
    canActivate: [AuthPolicyGuard],
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OfficeRoutingModule { }
