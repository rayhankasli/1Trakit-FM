/**
 * @author Bikash Das.
 * @description : feature module for dashboard
 */
import { ScrollingModule } from '@angular/cdk/scrolling';
import { DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
// ----------------------------------------------------------- //
import { AppSharedModule } from '../shared/app-shared.module';
import { ChartService } from '././dashboard-chart.service';
import { AssociateAdapter, RequestStatusFilterAdapter } from './dashboard-adapter/associate-adapter.service';
import { BookitChartAdapter } from './dashboard-adapter/bookit-adapter.service';
import { ClientstatusAdapter } from './dashboard-adapter/clientstatus-adapter.service';
import { CombochartAdapter } from './dashboard-adapter/combochart-adapter.service';
import { CopyitChartAdapter } from './dashboard-adapter/copyit-adapter.service';
import { FleetChartAdapter } from './dashboard-adapter/fleet-adapter.service';
import { NotificationAdapter } from './dashboard-adapter/notification-adapter.service';
import { OpenrequestAdapter } from './dashboard-adapter/openrequest-adapter.service';
import { BarChartPresentationComponent } from './dashboard-container/dashboard-presentation/bar-chart/bar-chart-presentation/bar-chart.presentation';
import { CardViewPresentationComponent } from './dashboard-container/dashboard-presentation/card-view/card-view.presentation';
import { ComboChartPresentationComponent } from './dashboard-container/dashboard-presentation/combo-chart/combochart-presentation/combo-chart.presentation';
import { DashboardPresentationComponent } from './dashboard-container/dashboard-presentation/dashboard.presentation';
import { DonutChartPresentationComponent } from './dashboard-container/dashboard-presentation/donut-chart/donutchart-presentation/donut-chart.presentation';
import { ProgressBarPresentationComponent } from './dashboard-container/dashboard-presentation/progress-bar/progress-bar.presentation';
import { DashboardContainerComponent } from './dashboard-container/dashboard.container';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardService } from './dashboard.service';
import { GoogleChartsBaseService } from './google-chart.service';
import { NotificationPresentationComponent } from './notification-container/notification-presentation/notification.presentation';
import { NotificationContainerComponent } from './notification-container/notification.container';

/**
 * DashboardModule
 */
@NgModule({
  declarations: [
    DashboardContainerComponent,
    DashboardPresentationComponent,
    ProgressBarPresentationComponent,
    DonutChartPresentationComponent,
    BarChartPresentationComponent,
    ComboChartPresentationComponent,
    NotificationPresentationComponent,
    CardViewPresentationComponent,
    NotificationContainerComponent
  ],
  imports: [
    DashboardRoutingModule,
    AppSharedModule,
    ScrollingModule,
    NgbModule
  ],
  providers: [
    DashboardService,
    GoogleChartsBaseService,
    ChartService,
    CopyitChartAdapter,
    BookitChartAdapter,
    FleetChartAdapter,
    AssociateAdapter,
    ClientstatusAdapter,
    OpenrequestAdapter,
    NotificationAdapter,
    CombochartAdapter,
    DatePipe,
    RequestStatusFilterAdapter
  ]
})
export class DashboardModule { }
