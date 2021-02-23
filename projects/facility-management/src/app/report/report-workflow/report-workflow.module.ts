/**
 * @author Enter Your Name Here.
 * @description The module that handles components and services related to report-workflow.
 */

import { NgModule } from '@angular/core';
// ----------------------------------------------------------------- //
import { ReportWorkflowRoutingModule } from './report-workflow-routing.module';
import { AppSharedModule } from '../../shared/app-shared.module';
import { ReportWorkflowService } from './report-workflow.service';
import { WorkflowReportGraphAdapter, WorkflowReportListAdapter, WorkflowReportFilterAdapter } from './report-workflow-adapter/report-workflow.adapter';
import { ReportWorkflowContainerComponent } from './report-workflow-container/report-workflow.container';
import { WorkflowReportChartPresentationComponent } from './report-workflow-container/workflow-report-chart-presentation/workflow-report-chart-presentation';
import { WorkflowReportPresentationComponent } from './report-workflow-container/workflow-report-presentation/workflow-report-presentation';
import { WorkflowReportListDesktopPresentationComponent } from './report-workflow-container/workflow-report-list-presentation/workflow-report-list-desktop-presentation/workflow-report-list-desktop.presentation';
import { WorkflowReportListPresentationComponent } from './report-workflow-container/workflow-report-list-presentation/workflow-report-list.presentation';


@NgModule({
  declarations: [
    ReportWorkflowContainerComponent,
    WorkflowReportPresentationComponent,
    WorkflowReportChartPresentationComponent,
    WorkflowReportListPresentationComponent,
    WorkflowReportListDesktopPresentationComponent
  ],
  imports: [
    ReportWorkflowRoutingModule,
    AppSharedModule
  ],
  providers: [
    ReportWorkflowService,
    WorkflowReportGraphAdapter,
    WorkflowReportListAdapter,
    WorkflowReportFilterAdapter
  ]
})
export class ReportWorkflowModule {
  constructor() { }
}

