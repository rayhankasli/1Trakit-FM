import { NgModule } from '@angular/core';
// ------------------------------------------------ //
import { ReportRoutingModule } from './report-routing.module';
import { SharedReportModule } from './shared-report.module';


/**
 * To maintain licensed routes for reports
 */
@NgModule({
  imports: [
    SharedReportModule,
    ReportRoutingModule
  ]
})
export class ReportModule { }
