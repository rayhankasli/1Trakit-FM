/**
 * @author Ronak Patel.
 * @description This file is used to initialize the routes for FleetModule
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// --------------------------------------------------- //
import { MeterReadContainerComponent } from './meter-read-container/meter-read.container';
import { AssetListContainerComponent } from './asset-list-container/asset-list.container';
import { AssetFormContainerComponent } from './asset-form-container/asset-form.container';
import { AssetTicketFormContainerComponent } from './asset-ticket-form-container/asset-ticket-form.container';
import { MeterReadPrintContainerComponent } from './meter-read-print-container/meter-read-print.container';
import { MeterReadPrintResolver } from './meter-read-print-resolver';
import { Permission } from '../core/enums/role-permissions.enum';
import { AuthPolicyGuard } from 'common-libs';
import { AssetResolver } from './asset-resolver';
import { MenuLicensing } from '../core/enums/menu-licensing.enum';

const routes: Routes = [
  {
    path: '',
    component: AssetListContainerComponent,
    data: {
      license: MenuLicensing.Fleet,
      archived: MenuLicensing.Fleet
    },
  },
  {
    path: 'add',
    data: {
      breadcrumb: 'Add Asset',
      permission: Permission.Fleet.add,
      license: MenuLicensing.Fleet,
    },
    canActivate: [AuthPolicyGuard],
    component: AssetFormContainerComponent
  },
  {
    path: ':id',
    data: {
      breadcrumb: 'Edit Asset',
      permission: Permission.Fleet.update,
      license: MenuLicensing.Fleet,
      archived: MenuLicensing.Fleet
    },
    canActivate: [AuthPolicyGuard],
    children: [
      {
        path: '',
        component: AssetFormContainerComponent
      },
      {
        path: 'ticket/add',
        data: {
          breadcrumb: 'Add Ticket',
          permission: Permission.FleetAddTicket.add,
          license: MenuLicensing.Fleet,
          archived: false
        },
        canActivate: [AuthPolicyGuard],
        component: AssetTicketFormContainerComponent
      },
      {
        path: 'ticket/:ticketId',
        data: {
          breadcrumb: 'Edit Ticket',
          permission: Permission.FleetAddTicket.update,
          license: MenuLicensing.Fleet,
          archived: MenuLicensing.Fleet,
        },
        canActivate: [AuthPolicyGuard],
        component: AssetTicketFormContainerComponent
      }
    ]
  },
  {
    path: 'meter/:id',
    resolve: { asset: AssetResolver },
    canActivate: [AuthPolicyGuard],
    data: {
      license: MenuLicensing.Fleet,
    },
    children: [
      {
        path: '',
        data: {
          breadcrumb: 'Meter Read',
          permission: Permission.FleetMeterReads.view
        },
        canActivate: [AuthPolicyGuard],
        component: MeterReadContainerComponent,
      },
      {
        path: 'print/:total',
        resolve: { meterReads: MeterReadPrintResolver },
        data: {
          autoPrint: true,
          permission: Permission.FleetMeterReads.print
        },
        canActivate: [AuthPolicyGuard],
        component: MeterReadPrintContainerComponent
      }

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FleetRoutingModule { }

