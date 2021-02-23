/**
 * @author Enter Your Name Here.
 * @description This file is used to initialize the routes for ReportWorkflowModule
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// --------------------------------------------------- //
import { ReportWorkflowContainerComponent } from './report-workflow-container/report-workflow.container';


const routes: Routes = [
  {
    path: '',
    component: ReportWorkflowContainerComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportWorkflowRoutingModule { }

