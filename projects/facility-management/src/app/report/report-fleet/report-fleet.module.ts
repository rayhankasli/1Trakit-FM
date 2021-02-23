import { NgModule } from '@angular/core';
// ---------------------------------------------------------- //
import { ReportFleetRoutingModule } from './report-fleet-routing.module'
import { AppSharedModule } from '../../shared/app-shared.module';
import { ReportFleetService } from './report-fleet.service';
import { FleetGeneratePdfService } from './fleet-generate-pdf.service';
import { ReportFleetListAdapter } from './report-fleet-adapter/report-fleet.adapter';
import { ReportFleetContainerComponent } from './report-fleet-container/report-fleet.container';
import { ReportFleetPresentationComponent } from './report-fleet-container/report-fleet-presentation/report-fleet.presentation';

/** Module defined for Fleet reports */
@NgModule({
  declarations: [
    ReportFleetContainerComponent,
    ReportFleetPresentationComponent
  ],
  imports: [
    ReportFleetRoutingModule,
    AppSharedModule,
  ],
  providers: [
    ReportFleetService,
    FleetGeneratePdfService,
    ReportFleetListAdapter,
  ]
})
export class ReportFleetModule { }
