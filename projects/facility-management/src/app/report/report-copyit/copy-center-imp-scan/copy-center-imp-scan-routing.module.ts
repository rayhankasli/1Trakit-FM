/**
 * @author Farhin Shekh.
 * @description This file is used to initialize the routes for UserModule
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// --------------------------------------------------- //
import { CopyCenterImpScanContainerComponent } from './copy-center-imp-scan-container/copy-center-imp-scan.container';

const routes: Routes = [
  {
    path: '',
    component: CopyCenterImpScanContainerComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CopyCenterImpScanRoutingModule { }
