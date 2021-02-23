/**
 * @author Farhin Shekh.
 * @description This file is used to initialize the routes for UserModule
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// --------------------------------------------------- //
import { FacilitiesHelpDeskContainerComponent } from './facilities-help-desk-container/facilities-help-desk.container';

const routes: Routes = [
  {
    path: '',
    component: FacilitiesHelpDeskContainerComponent
  }
];

/** Routing module defined for routes */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FacilitiesHelpDeskRoutingModule { }
