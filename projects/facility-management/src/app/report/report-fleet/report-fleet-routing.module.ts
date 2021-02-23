/**
 * @author Farhin Shekh.
 * @description This file is used to initialize the routes for UserModule
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// --------------------------------------------------- //
import { ReportFleetContainerComponent } from './report-fleet-container/report-fleet.container';

const routes: Routes = [
  {
    path: '',
    component: ReportFleetContainerComponent
  }
];

/** Routing module for define report fleet route */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportFleetRoutingModule { }

