import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// -------------------------------------------------- //
import { CopyCenterImpColorContainerComponent } from './copy-center-imp-color-container/copy-center-imp-color.container';


const routes: Routes = [
  {
    path: '',
    component: CopyCenterImpColorContainerComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CopyCenterImpColorRoutingModule { }
