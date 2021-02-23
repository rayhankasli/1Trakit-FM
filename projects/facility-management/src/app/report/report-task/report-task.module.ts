
/**
 * @author Rayhan Kasli.
 * @description The module that handles components and services related to report-task.
 */
import { NgModule } from '@angular/core';
// ----------------------------------------------------------------- //
import { ReportTaskRoutingModule } from './report-task-routing.module';
import { AppSharedModule } from '../../shared/app-shared.module';
import { ReportTaskService } from './report-task.service';
import { TaskReportAdapter, BacklogChartAdapter, TaskReportChartAdapter, TaskReportFilterAdapter } from './report-task-adapter/report-task.adapter';
import { ReportTaskListContainerComponent } from './report-task-list-container/report-task-list.container';
import { TaskReportChartPresentationComponent } from './report-task-list-container/task-report-chart-presentation/task-report-chart-presentation.component';
import { ReportTaskPresentationComponent } from './report-task-list-container/report-task-presentation/report-task-presentation.component';
import { TaskReportListPresentationComponent } from './report-task-list-container/task-report-list-presentation/task-report-list.presentation';
import { TaskReportListDesktopPresentationComponent 
} from './report-task-list-container/task-report-list-presentation/task-report-list-desktop-presentation/task-report-list-desktop.presentation';


@NgModule({
  declarations: [
    ReportTaskListContainerComponent,
    TaskReportChartPresentationComponent,
    ReportTaskPresentationComponent,
    TaskReportListPresentationComponent,
    TaskReportListDesktopPresentationComponent
  ],
  imports: [
    ReportTaskRoutingModule,
    AppSharedModule
  ],
  providers: [
    ReportTaskService,
    TaskReportAdapter, 
    TaskReportChartAdapter,
    BacklogChartAdapter,
    TaskReportFilterAdapter
  ]
})
export class ReportTaskModule {
  constructor() {}
}

