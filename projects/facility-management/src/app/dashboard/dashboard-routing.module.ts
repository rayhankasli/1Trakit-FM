/**
 * @author : Bikash Das
 * @description : routng file for dashboard module
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardContainerComponent } from './dashboard-container/dashboard.container';

const routes: Routes = [
  {
    path: '',
    component: DashboardContainerComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
