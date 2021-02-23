/**
 * @author Rayhan Kasli.
 * @description This file is used to initialize the routes for ReportMeterReadModule
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// --------------------------------------------------- //
import { ReportMeterReadListContainerComponent } from './report-meter-read-list-container/report-meter-read-list.container';

const routes: Routes = [
  {
    path: '',
    component: ReportMeterReadListContainerComponent,
 
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportMeterReadRoutingModule { }

