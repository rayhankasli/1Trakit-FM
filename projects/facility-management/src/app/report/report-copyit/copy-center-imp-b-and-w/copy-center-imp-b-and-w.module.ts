import { NgModule } from '@angular/core';
// ------------------------------------------------ //
import { CopyCenterImpBAndWRoutingModule } from './copy-center-imp-b-and-w-routing.module';
import { AppSharedModule } from '../../../shared/app-shared.module';
import { CopyCenterImpBAndWService } from './copy-center-imp-b-and-w.service';
import { CopyCenterImpBAndWAdapter } from './copy-center-imp-b-and-w-adapter/copy-center-imp-b-and-w.adapter';
import { CopyCenterImpBAndWContainerComponent } from './copy-center-imp-b-and-w-container/copy-center-imp-b-and-w.container';
import {
  CopyCenterImpBAndWPresentationComponent
} from './copy-center-imp-b-and-w-container/copy-center-imp-b-and-w-presentation/copy-center-imp-b-and-w.presentation';


@NgModule({
  declarations: [
    CopyCenterImpBAndWContainerComponent,
    CopyCenterImpBAndWPresentationComponent
  ],
  imports: [
    CopyCenterImpBAndWRoutingModule,
    AppSharedModule
  ],
  providers: [
    CopyCenterImpBAndWService,
    CopyCenterImpBAndWAdapter,
  ]
})
export class CopyCenterImpBAndWModule { }
