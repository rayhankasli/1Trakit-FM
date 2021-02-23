import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// -------------------------------------------------- //
import { TotalCopyVolumeContainerComponent } from './total-copy-volume-container/total-copy-volume.container';


const routes: Routes = [
  {
    path: '',
    component: TotalCopyVolumeContainerComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TotalCopyVolumeRoutingModule { }
