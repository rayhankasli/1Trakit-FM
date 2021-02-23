/**
 * @author Farhin Shekh.
 * @description This file is used to initialize the routes for UserModule
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// --------------------------------------------------- //
import { FacilitiesAssistantsContainerComponent } from './facilities-assistants-container/facilities-assistants.container';

const routes: Routes = [
  {
    path: '',
    component: FacilitiesAssistantsContainerComponent
  }
];

/** Routing module defined for routes */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FacilitiesAssistantsRoutingModule { }
