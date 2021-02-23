/**
 * @author Enter Your Name Here.
 * @description This file is used to initialize the routes for ChargebackModule
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// --------------------------------------------------- //
import { ChargebackListContainerComponent } from './chargeback-list-container/chargeback-list.container';

const routes: Routes = [
  {
    path: '',
    component: ChargebackListContainerComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChargebackRoutingModule { }

