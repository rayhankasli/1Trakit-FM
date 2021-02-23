import { NgModule } from '@angular/core'
// --------------------------------------------------------------- //
import { AppSharedModule } from '../../app-shared.module';
import { CustomSelectDropDownModule } from '../custom-select-drop-down/custom-select-drop-down.module';
import { CopyItSharedConfigurationService } from './copyit-shared-configuration.service';
import { CopyitCommonService } from './copyit-common.service';
import { CopyItUserAdapter } from './copyit-adapter/copyit-user-detail-adapter';
import { PrintDetailsFormPresentationComponent } from './print-details-form-presentation/print-details-form.presentation';
import { CopyItConfigAdapter, DefaultCopyItConfigurationAdapter } from './copyit-adapter/copyit.adapter';

@NgModule({
  declarations: [
    PrintDetailsFormPresentationComponent
  ],
  imports: [
    AppSharedModule,
    CustomSelectDropDownModule
  ],
  exports: [
    PrintDetailsFormPresentationComponent,
  ],
  providers: [
    DefaultCopyItConfigurationAdapter,
    CopyItSharedConfigurationService,
    CopyitCommonService,
    CopyItConfigAdapter,
    CopyItUserAdapter
  ],
  entryComponents: [
    PrintDetailsFormPresentationComponent
  ],
})
export class CopyItPrintDetailsModule { }
