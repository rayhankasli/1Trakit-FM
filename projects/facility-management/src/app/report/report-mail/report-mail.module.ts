
/**
 * @author Enter Your Name Here.
 * @description The module that handles components and services related to report-mail.
 */

import { NgModule } from '@angular/core';
// ----------------------------------------------------------------- //
import { ReportMailRoutingModule } from './report-mail-routing.module';
import { AppSharedModule } from '../../shared/app-shared.module';
import { ReportMailService } from './report-mail.service';
import { MailChartAdapter, MailReportAdapter, MailReportFilterAdapter } from './report-mail-adapter/report-mail.adapter';
import { ReportMailListContainerComponent } from './report-mail-list-container/report-mail-list.container';
import { MailReportChartPresentationComponent } from './report-mail-list-container/mail-report-chart-presentation/mail-report-chart-presentation';
import { ReportMailPresentationComponent } from './report-mail-list-container/report-mail-presentation/report-mail-presentation';
import { MailReportListPresentationComponent } from './report-mail-list-container/mail-report-list-presentation/mail-report-list.presentation';
import { MailReportListDesktopPresentationComponent } from './report-mail-list-container/mail-report-list-presentation/mail-report-list-desktop-presentation/mail-report-list-desktop.presentation';


@NgModule({
  declarations: [
    ReportMailListContainerComponent,
    MailReportChartPresentationComponent,
    ReportMailPresentationComponent,
    MailReportListPresentationComponent,
    MailReportListDesktopPresentationComponent
  ],
  imports: [
    ReportMailRoutingModule,
    AppSharedModule
  ],
  providers: [
    ReportMailService,
    MailReportAdapter,
    MailReportFilterAdapter,
    MailChartAdapter,
  ]
})
export class ReportMailModule {
  constructor() { }

}

