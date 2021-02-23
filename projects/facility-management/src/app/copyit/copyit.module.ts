/**
 * @author Enter Your Name Here.
 * @description The module that handles components and services related to copyit-stepper.
 */

import { DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { PopoverConfig } from 'ngx-bootstrap';
// ----------------------------------------------------------------- //
import { AppSharedModule } from '../shared/app-shared.module';
import { CopyItPrintDetailsModule } from '../shared/modules/copy-it-print-details/copy-it-print-details.module';
import { CopyItInfoAdapter } from '../shared/modules/copy-it-print-details/copyit-adapter/copyit.adapter';
import { CustomChatBoxModule } from '../shared/modules/custom-chat-box/custom-chat-box.module';
import { CustomSelectDropDownModule } from '../shared/modules/custom-select-drop-down/custom-select-drop-down.module';
import { ShippingDetailsModule } from '../shared/modules/shipping-details/shiping-details.module';
import { ShippingDetailsFormPresentationComponent } from '../shared/modules/shipping-details/shipping-details-form-presentation/shipping-details-form.presentation';
import {
  ConversationAdapter, CopyItAssignToAdapter, CopyItFilterRecordAdapter,
  CopyItListAdapter, CopyItStatusAdapter, CopyItStatusFilterAdapter
} from './copyit-adapter/copyit.adapter';
import { CopyCenterPresentationComponent } from './copyit-edit-container/copyit-edit-presentation/copy-center/copy-center-presentation/copy-center.presentation';
import { CopyItChargesPresentationComponent } from './copyit-edit-container/copyit-edit-presentation/copyit-charges/copyit-charges-presentation/copyit-charges.presentation';
import { CopyItEditPresentationComponent } from './copyit-edit-container/copyit-edit-presentation/copyit-edit.presentation';
import { PickAssetsPresentationComponent } from './copyit-edit-container/copyit-edit-presentation/pick-assets/pick-assets-presentation/pick-assets.presentation';
import { CopyItEditContainerComponent } from './copyit-edit-container/copyit-edit.container';
import { CopyItListDesktopPresentationComponent } from './copyit-list-container/copyit-list-presentation/copyit-list-desktop-presentation/copyit-list-desktop.presentation';
import { CopyItListPresentationComponent } from './copyit-list-container/copyit-list-presentation/copyit-list.presentation';
import { CopyItListContainerComponent } from './copyit-list-container/copyit-list.container';
import { CopyItPrintResolver } from './copyit-print-resolver';
import { CopyItPrintPresentationComponent } from './copyit-print/copyit-print-presentation/copyit-print.presentation';
import { CopyitRoutingModule } from './copyit-routing.module';
import { CopyitSharedService } from './copyit-shared.service';
import { CopyitStepperPresentationComponent } from './copyit-stepper-container/copyit-stepper-presentation/copyit-stepper.presentation';
import { SummaryPresentationComponent } from './copyit-stepper-container/copyit-stepper-presentation/summary-presentation/summary.presentation';
import { CopyItStepperContainerComponent } from './copyit-stepper-container/copyit-stepper.container';
import { CopyitService } from './copyit.service';
import { RequestInformationDetailsFormPresentationComponent } from './shared/request-information-details-form-presentation/request-information-details-form.presentation';
import { SchedulingDetailsFormPresentationComponent } from './shared/scheduling-details-form-presentation/scheduling-details-form.presentation';

/** Popover configuration */
export function getPopoverConfig(): PopoverConfig {
  return Object.assign(new PopoverConfig(), { placement: 'auto', container: 'body', outsideClick: true });
}

@NgModule({
  declarations: [
    CopyItListContainerComponent,
    CopyItListPresentationComponent,
    CopyItListDesktopPresentationComponent,
    SummaryPresentationComponent,
    CopyitStepperPresentationComponent,
    CopyItStepperContainerComponent,
    RequestInformationDetailsFormPresentationComponent,
    SchedulingDetailsFormPresentationComponent,
    CopyItEditContainerComponent,
    CopyItEditPresentationComponent,
    CopyCenterPresentationComponent,
    CopyItChargesPresentationComponent,
    PickAssetsPresentationComponent,
    CopyItPrintPresentationComponent
  ],
  imports: [
    CopyitRoutingModule,
    AppSharedModule,
    CopyItPrintDetailsModule,
    CustomSelectDropDownModule,
    CustomChatBoxModule,
    ShippingDetailsModule
  ],
  providers: [
    CopyitService,
    CopyitSharedService,
    DatePipe,
    CopyItListAdapter,
    CopyItFilterRecordAdapter,
    CopyItInfoAdapter,
    ConversationAdapter,
    CopyItStatusAdapter,
    CopyItAssignToAdapter,
    CopyItPrintResolver,
    CopyItStatusFilterAdapter,
    { provide: PopoverConfig, useFactory: getPopoverConfig },
  ],
  entryComponents: [
    SummaryPresentationComponent,
    RequestInformationDetailsFormPresentationComponent,
    SchedulingDetailsFormPresentationComponent,
    ShippingDetailsFormPresentationComponent
  ],
})
export class CopyitModule {
}

