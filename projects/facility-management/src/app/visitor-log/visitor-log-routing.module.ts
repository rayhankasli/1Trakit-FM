/**
 * @author Nitesh Sharma | Rayhan Kasli.
 * @description This file is used to initialize the routes for VisitorLogModule
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// --------------------------------------------------- //
import { VisitorLogListContainerComponent } from './visitor-log-list-container/visitor-log-list.container';


const routes: Routes = [
  {
    path: '',
    component: VisitorLogListContainerComponent
  },
  {
    path: 'history',
    component: VisitorLogListContainerComponent,
    data: {
      breadcrumb: 'History'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VisitorLogRoutingModule { }

