/**
 * @author Enter Your Name Here.
 * @description This file is used to initialize the routes for ReportMailModule
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// --------------------------------------------------- //
import { ReportMailListContainerComponent } from './report-mail-list-container/report-mail-list.container';

const routes: Routes = [
  {
    path: '',
    component: ReportMailListContainerComponent,
 
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportMailRoutingModule { }

