import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// --------------------------------------------------- //
import { CopyCenterImpBAndWContainerComponent } from './copy-center-imp-b-and-w-container/copy-center-imp-b-and-w.container';

const routes: Routes = [
  {
    path: '',
    component: CopyCenterImpBAndWContainerComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CopyCenterImpBAndWRoutingModule { }