import { NgModule } from '@angular/core';
// ------------------------------------------------------ //
import { TotalCopyVolumeRoutingModule } from './total-copy-volume-routing.module';
import { AppSharedModule } from '../../../shared/app-shared.module';
import { TotalCopyVolumeService } from './total-copy-volume.service';
import { TotalCopyVolumeAdapter } from './total-copy-volume-adapter/total-copy-volume.adapter';
import { TotalCopyVolumeContainerComponent } from './total-copy-volume-container/total-copy-volume.container';
import { TotalCopyVolumePresentationComponent } from './total-copy-volume-container/total-copy-volume-presentation/total-copy-volume.presentation';


@NgModule({
  declarations: [
    TotalCopyVolumeContainerComponent,
    TotalCopyVolumePresentationComponent
  ],
  imports: [
    TotalCopyVolumeRoutingModule,
    AppSharedModule
  ],
  providers: [
    TotalCopyVolumeService,
    TotalCopyVolumeAdapter
  ]
})
export class TotalCopyVolumeModule { }
