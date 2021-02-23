/**
 * @author Enter Your Name Here.
 * @description The module that handles components and services related to client.
 */

import { NgModule } from '@angular/core';
// ----------------------------------------------------------------- //
import { AppSharedModule } from '../shared/app-shared.module';
import { ClientRoutingModule } from './client-routing.module';
import { ClientService } from './client.service';
import { ClientConfigGuard } from './guards/client-config.guard';
import { ClientDetailGuard } from './guards/client-detail.guard';
import { ClientAdapter, ClientFilterAdapter, ClientFormAdapter } from './client-adapter/client.adapter';
import { ClientPresentationComponent } from './client-container/client-presentation/client.presentation';
import { ClientContainerComponent } from './client-container/client.container';
import { ClientDetailPreserveService } from './client-detail-preserve.service';
import { ClientDetailResolver } from './client-detail-resolver';
import { ClientFormContainerComponent } from './client-form-container/client-form.container';
import { ClientFormPresentationComponent } from './client-form-container/client-form-presentation/client-form.presentation';
import {
  ClientListDesktopPresentationComponent
} from './client-list-container/client-list-presentation/client-list-desktop-presentation/client-list-desktop.presentation';
import { ClientListPresentationComponent } from './client-list-container/client-list-presentation/client-list.presentation';
import { ClientListContainerComponent } from './client-list-container/client-list.container';

@NgModule({
  declarations: [
    ClientFormContainerComponent,
    ClientFormPresentationComponent,
    ClientContainerComponent,
    ClientPresentationComponent,
    ClientListContainerComponent,
    ClientListDesktopPresentationComponent,
    ClientListPresentationComponent,
  ],
  imports: [
    ClientRoutingModule,
    AppSharedModule
  ],
  providers: [
    ClientService,
    ClientAdapter,
    ClientFilterAdapter,
    ClientFormAdapter,
    ClientDetailResolver,
    ClientDetailPreserveService,
    ClientConfigGuard,
    ClientDetailGuard
  ],
  entryComponents: [
    ClientListDesktopPresentationComponent,
  ],
})
export class ClientModule {
  constructor() { }
}

