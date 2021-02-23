
/**
 * @author Rayhan Kasli.
 * @description The module that handles components and services related to mail-configurations.
 */
import { NgModule } from '@angular/core';
import { PopoverConfig } from 'ngx-bootstrap';
// ----------------------------------------------------------------- //
import { MailConfigurationsRoutingModule } from './mail-configurations-routing.module';
import { AppSharedModule } from '../shared/app-shared.module';
import { MailConfigurationsService } from './mail-configurations.service';
import { SlotsAdapter, ReasonsAdapter, SlotFilterAdapter } from './mail-configurations-adapter/mail-configurations.adapter';
import { MailConfigurationsContainerComponent } from './mail-configurations-container/mail-configurations.container';
import { MailConfigurationsPresentationComponent }
  from './mail-configurations-container/mail-configurations-presentation/mail-configurations.presentation';
import { SlotsListPresentationComponent }
  from './mail-configurations-container/mail-configurations-presentation/slots-list-presentation/slots-list.presentation';
import { SlotsListDesktopPresentationComponent }
  from './mail-configurations-container/mail-configurations-presentation/slots-list-presentation/slots-list-desktop-presentation/slots-list-desktop.presentation';
import { SlotsFormPresentationComponent } from './mail-configurations-container/mail-configurations-presentation/slots-form-presentation/slots-form.presentation';

/** Popover configuration */
export function getPopoverConfig(): PopoverConfig {
  return Object.assign(new PopoverConfig(), { placement: 'auto', container: 'body' });
}

@NgModule({
  declarations: [
    MailConfigurationsContainerComponent,
    MailConfigurationsPresentationComponent,
    SlotsListDesktopPresentationComponent,
    SlotsListPresentationComponent,
    SlotsFormPresentationComponent,
  ],
  imports: [
    MailConfigurationsRoutingModule,
    AppSharedModule,
  ],
  providers: [
    MailConfigurationsService,
    SlotsAdapter,
    ReasonsAdapter,
    SlotFilterAdapter,
    { provide: PopoverConfig, useFactory: getPopoverConfig }
  ],
  entryComponents: [
    SlotsListDesktopPresentationComponent,
  ],
})
export class MailConfigurationsModule {

}

