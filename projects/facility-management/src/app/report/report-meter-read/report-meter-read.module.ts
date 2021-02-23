
/**
 * @author Rayhan Kasli.
 * @description The module that handles components and services related to report-meter-read.
 */
import { NgModule } from '@angular/core';

import { NgSelectModule } from '@ng-select/ng-select';
import { SharedModule } from 'common-libs';
import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
// ----------------------------------------------------------------- //
import { ReportMeterReadRoutingModule } from './report-meter-read-routing.module';
import { ReportMeterReadListContainerComponent } from './report-meter-read-list-container/report-meter-read-list.container';
import { ReportMeterReadService } from './report-meter-read.service';
import { MeterReadAdapter, MeterReadReportFilterAdapter } from './report-meter-read-adapter/report-meter-read.adapter';
import { MeterReadListDesktopPresentationComponent } from './report-meter-read-list-container/meter-read-list-presentation/meter-read-list-desktop-presentation/meter-read-list-desktop.presentation';
import { MeterReadListPresentationComponent } from './report-meter-read-list-container/meter-read-list-presentation/meter-read-list.presentation';
import { ReportMeterReadPresentationComponent } from './report-meter-read-list-container/report-meter-read-presentation/report-meter-read-presentation.component';
import { AppSharedModule } from '../../shared/app-shared.module';

@NgModule({
  declarations: [
    ReportMeterReadListContainerComponent,
    MeterReadListDesktopPresentationComponent,
    MeterReadListPresentationComponent,
    ReportMeterReadPresentationComponent,
  ],
  imports: [
    SharedModule,
    ReportMeterReadRoutingModule,
    NgSelectModule,
    PortalModule,
    OverlayModule,
    NgbDropdownModule,
    AppSharedModule
  ],
  providers: [
    ReportMeterReadService,
    MeterReadAdapter, 
    MeterReadReportFilterAdapter
  ]
})
export class ReportMeterReadModule {}

