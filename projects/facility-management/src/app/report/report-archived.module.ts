import { NgModule } from '@angular/core';
import { ReportRoutingArchivedModule } from './report-routing-archived.module';
import { SharedReportModule } from './shared-report.module';

/**
 * To maintain archived routes for reports
 */
@NgModule({
  imports: [
    SharedReportModule,
    ReportRoutingArchivedModule
  ]
})
export class ReportArchivedModule { }
