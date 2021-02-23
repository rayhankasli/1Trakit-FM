import { NgModule } from '@angular/core';
// ----------------------------------------------------- //
import { CopyCenterImpScanRoutingModule } from './copy-center-imp-scan-routing.module';
import { AppSharedModule } from '../../../shared/app-shared.module';
import { CopyCenterImpScanService } from './copy-center-imp-scan.service';
import { CopyCenterImpScanAdapter } from './copy-center-imp-scan-adapter/copy-center-imp-scan.adapter';
import { CopyCenterImpScanContainerComponent } from './copy-center-imp-scan-container/copy-center-imp-scan.container';
import { 
  CopyCenterImpScanPresentationComponent 
} from './copy-center-imp-scan-container/copy-center-imp-scan-presentation/copy-center-imp-scan.presentation';


@NgModule({
  declarations: [
    CopyCenterImpScanContainerComponent,
    CopyCenterImpScanPresentationComponent
  ],
  imports: [
    CopyCenterImpScanRoutingModule,
    AppSharedModule
  ],
  providers: [
    CopyCenterImpScanService,
    CopyCenterImpScanAdapter
  ]
})
export class CopyCenterImpScanModule { }
