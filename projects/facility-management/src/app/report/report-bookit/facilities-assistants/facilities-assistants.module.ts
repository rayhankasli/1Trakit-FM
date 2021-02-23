import { NgModule } from '@angular/core';
// ----------------------------------------------------- //
import { FacilitiesAssistantsRoutingModule } from './facilities-assistants-routing.module';
import { AppSharedModule } from '../../../shared/app-shared.module';
import { FacilitiesAssistantsContainerComponent } from './facilities-assistants-container/facilities-assistants.container';
import { FacilitiesAssistantsPresentationComponent } from
  './facilities-assistants-container/facilities-assistants-presentation/facilities-assistants.presentation';
import { FacilitiesAssistantsService } from './facilities-assistants.service';
import { FacilitiesAssistantsAdapter } from './facilities-assistants-adapter/facilities-assistants.adapter';

/** Module defined for import and declare components */
@NgModule({
  declarations: [
    FacilitiesAssistantsContainerComponent,
    FacilitiesAssistantsPresentationComponent
  ],
  imports: [
    FacilitiesAssistantsRoutingModule,
    AppSharedModule
  ],
  providers: [
    FacilitiesAssistantsService,
    FacilitiesAssistantsAdapter
  ]
})
export class FacilitiesAssistantsModule { }
