
/**
 * @author Ronak Patel.
 * @description The module that handles components and services related to fleet.
 */
import { DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
// ----------------------------------------------------------------- //
import { AppSharedModule } from '../shared/app-shared.module';
import { AssetFormPresentationComponent } from './asset-form-container/asset-form-presentation/asset-form.presentation';
import { AssetFormContainerComponent } from './asset-form-container/asset-form.container';
import { AssetTicketListPresentationComponent } from './asset-form-container/asset-ticket-list/asset-ticket-list-presentation/asset-ticket-list.presentation';
import { AssetListPresentationComponent } from './asset-list-container/asset-list-presentation/asset-list.presentation';
import { AssetListContainerComponent } from './asset-list-container/asset-list.container';
// ----------------------------------------------------------------- //
import { AssetResolver } from './asset-resolver';
import { AssetTicketFormPresentationComponent } from './asset-ticket-form-container/asset-ticket-form-presentation/asset-ticket-form.presentation';
import { AssetTicketFormContainerComponent } from './asset-ticket-form-container/asset-ticket-form.container';
import { AssetFormAdapter, AssetListAdapter, AssetMeterAdapter, AssetTicketAdapter, MeterReadAdapter } from './fleet-adapter/fleet.adapter';
import { FleetRoutingModule } from './fleet-routing.module';
import { FleetService } from './fleet.service';
import { MeterReadFormPresentationComponent } from './meter-read-container/meter-read-form-presentation/meter-read-form.presentation';
import { MeterReadListPresentationComponent } from './meter-read-container/meter-read-list-presentation/meter-read-list.presentation';
import { MeterReadContainerComponent } from './meter-read-container/meter-read.container';
import { MeterReadPrintPresentationComponent } from './meter-read-print-container/meter-read-print-presentation/meter-read-print.presentation';
import { MeterReadPrintContainerComponent } from './meter-read-print-container/meter-read-print.container';
import { MeterReadPrintResolver } from './meter-read-print-resolver';

@NgModule({
  declarations: [
    MeterReadContainerComponent,
    MeterReadListPresentationComponent,
    MeterReadFormPresentationComponent,
    AssetListContainerComponent,
    AssetListPresentationComponent,
    AssetFormContainerComponent,
    AssetFormPresentationComponent,
    AssetTicketFormContainerComponent,
    AssetTicketFormPresentationComponent,
    AssetTicketListPresentationComponent,
    MeterReadPrintContainerComponent,
    MeterReadPrintPresentationComponent,
  ],
  imports: [
    FleetRoutingModule,
    AppSharedModule
  ],
  providers: [
    FleetService,
    MeterReadAdapter,
    AssetMeterAdapter,
    AssetTicketAdapter,
    AssetListAdapter,
    AssetFormAdapter,
    MeterReadPrintResolver,
    AssetResolver,
    DatePipe,
  ]
})
export class FleetModule {
}

