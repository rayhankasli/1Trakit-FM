import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
// -------------------------------------- //
import { ReportComponent } from './report-presentation/report.component';

/**
 * Shared report module for licensed and archived reports
 */
@NgModule({
  declarations: [
    ReportComponent
  ],
  imports: [
    RouterModule
  ],
  exports: [
    ReportComponent
  ]
})
export class SharedReportModule { }
