import { NgModule } from '@angular/core';
// -------------------------------------------------------- //
import { CopyCenterImpColorRoutingModule } from './copy-center-imp-color-routing.module';
import { AppSharedModule } from '../../../shared/app-shared.module';
import { CopyCenterImpColorService } from './copy-center-imp-color.service';
import { CopyCenterImpColorAdapter } from './copy-center-imp-color-adapter/copy-center-imp-color.adapter';
import { CopyCenterImpColorContainerComponent } from './copy-center-imp-color-container/copy-center-imp-color.container';
import {
  CopyCenterImpColorPresentationComponent
} from './copy-center-imp-color-container/copy-center-imp-color-presentation/copy-center-imp-color.presentation';


@NgModule({
  declarations: [
    CopyCenterImpColorContainerComponent,
    CopyCenterImpColorPresentationComponent
  ],
  imports: [
    CopyCenterImpColorRoutingModule,
    AppSharedModule
  ],
  providers: [
    CopyCenterImpColorService,
    CopyCenterImpColorAdapter
  ]
})
export class CopyCenterImpColorModule { }
