import { NgModule } from '@angular/core';
// ------------------------------------------------ //
import { FacilitiesHelpDeskContainerComponent } from './facilities-help-desk-container/facilities-help-desk.container';
import { AppSharedModule } from '../../../shared/app-shared.module';
import { FacilitiesHelpDeskPresentationComponent } from
  './facilities-help-desk-container/facilities-help-desk-presentation/facilities-help-desk.presentation';
import { FacilitiesHelpDeskRoutingModule } from './facilities-help-desk-routing.module';
import { FacilitiesHelpDeskService } from './facilities-help-desk.service';
import { FacilitiesHelpDeskAdapter } from './facilities-help-desk-adapter/facilities-help-desk.adapter';
import { FacilitiesHelpDeskPresenter } from './facilities-help-desk-container/facilities-help-desk-presenter/facilities-help-desk.presenter';

/** Module defined for import and declare components */
@NgModule({
  declarations: [
    FacilitiesHelpDeskContainerComponent,
    FacilitiesHelpDeskPresentationComponent
  ],
  imports: [
    FacilitiesHelpDeskRoutingModule,
    AppSharedModule
  ],
  providers: [
    FacilitiesHelpDeskPresenter,
    FacilitiesHelpDeskService,
    FacilitiesHelpDeskAdapter
  ]
})
export class FacilitiesHelpDeskModule { }
