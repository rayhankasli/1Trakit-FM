/**
 * @author Rayhan Kasli.
 * @description This file is used to initialize the routes for ReportTaskModule
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// --------------------------------------------------- //
import { ReportTaskListContainerComponent } from './report-task-list-container/report-task-list.container';

const routes: Routes = [
  {
    path: '',
    component: ReportTaskListContainerComponent,
 
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportTaskRoutingModule { }

