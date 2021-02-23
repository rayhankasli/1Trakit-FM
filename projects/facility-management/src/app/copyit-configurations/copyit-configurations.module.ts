
/**
 * @author Enter Your Name Here.
 * @description The module that handles components and services related to copyit-configurations.
 */
import { NgModule } from '@angular/core';
// ----------------------------------------------------------------- //
import { AppSharedModule } from '../shared/app-shared.module';
import { CopyItPrintDetailsModule } from '../shared/modules/copy-it-print-details/copy-it-print-details.module';
import { ShippingDetailsModule } from '../shared/modules/shipping-details/shiping-details.module';
import { CopyitDefaultValuesAdapter, CopyitManageAccountAdapter } from './copyit-configurations-adapter/copyit-configurations.adapter';
import { CopyItConfigAdapter, CopyitOptionsAdapter } from './copyit-configurations-adapter/copyit-option.adapter';
import { CopyitConfigurationsPresentationComponent } from './copyit-configurations-presentation/copyit-configurations.presentation';
import { CopyitConfigurationsRoutingModule } from './copyit-configurations-routing.module';
import { CopyitConfigurationsService } from './copyit-configurations.service';
import { CopyitDefaultValuesFormPresentationComponent } from './copyit-default-values-form-container/copyit-default-values-form-presentation/copyit-default-values-form.presentation';
import { RequestInformationDetailsFormPresentationComponent } from './copyit-default-values-form-container/copyit-default-values-form-presentation/request-information-details-form-presentation/request-information-details-form.presentation';
import { CopyitDefaultValuesFormContainerComponent } from './copyit-default-values-form-container/copyit-default-values-form.container';
import { CopyitManageAccountFormPresentationComponent } from './copyit-manage-account-list-container/copyit-manage-account-list-presentation/copyit-manage-account-form-presentation/copyit-manage-account-form.presentation';
import { CopyitManageAccountListPresentationComponent } from './copyit-manage-account-list-container/copyit-manage-account-list-presentation/copyit-manage-account-list.presentation';
import { CopyitManageAccountListContainerComponent } from './copyit-manage-account-list-container/copyit-manage-account-list.container';
import { CopyitOptionsFormPresentationComponent } from './copyit-options-form-container/copyit-options-form-presentation/copyit-options-form.presentation';
import { CopyitOptionsFormContainerComponent } from './copyit-options-form-container/copyit-options-form.container';
import { CustomDropdownComponent } from './custom-select-dropdown/custom-select-dropdown.component';

@NgModule({
  declarations: [
    RequestInformationDetailsFormPresentationComponent,
    CopyitConfigurationsPresentationComponent,
    CopyitOptionsFormPresentationComponent,
    CopyitOptionsFormContainerComponent,
    CopyitDefaultValuesFormPresentationComponent,
    CopyitDefaultValuesFormContainerComponent,
    CopyitManageAccountListPresentationComponent,
    CopyitManageAccountListContainerComponent,
    CopyitManageAccountFormPresentationComponent,
    CustomDropdownComponent,
  ],
  imports: [
    CopyitConfigurationsRoutingModule,
    AppSharedModule,
    CopyItPrintDetailsModule,
    ShippingDetailsModule
  ],
  providers: [
    CopyitConfigurationsService,
    CopyitDefaultValuesAdapter,
    CopyitOptionsAdapter,
    CopyItConfigAdapter,
    CopyitManageAccountAdapter,
    CopyitManageAccountAdapter,
  ]
})
export class CopyitConfigurationsModule {

}

