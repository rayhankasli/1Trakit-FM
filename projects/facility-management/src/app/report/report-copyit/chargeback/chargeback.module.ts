
/**
 * @author Enter Your Name Here.
 * @description The module that handles components and services related to chargeback.
 */
import { NgModule } from '@angular/core';
// ----------------------------------------------------------------- //
import { ChargebackRoutingModule } from './chargeback-routing.module';
import { AppSharedModule } from '../../../shared/app-shared.module';
import { ChargebackService } from './chargeback.service';
import { ChargeBackListAdapter, ChargeBackFilterAdapter, AccountNumberAdapter, JobAdapter, } from './chargeback-adapter/chargeback.adapter';
import { ChargebackListContainerComponent } from './chargeback-list-container/chargeback-list.container';
import { ChargeBackListPresentationComponent } from './chargeback-list-container/chargeback-list-presentation/chargeback-list.presentation';
import {
  ChargeBackListDesktopPresentationComponent
} from './chargeback-list-container/chargeback-list-presentation/chargeback-list-desktop-presentation/chargeback-list-desktop.presentation';

@NgModule({
  declarations: [
    ChargebackListContainerComponent,
    ChargeBackListPresentationComponent,
    ChargeBackListDesktopPresentationComponent,

  ],
  imports: [
    ChargebackRoutingModule,
    AppSharedModule
  ],
  providers: [
    ChargebackService,
    ChargeBackListAdapter,
    ChargeBackFilterAdapter,
    AccountNumberAdapter,
    JobAdapter
  ]
})
export class ChargebackModule { }

