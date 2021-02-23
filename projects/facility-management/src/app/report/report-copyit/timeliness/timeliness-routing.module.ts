/**
 * @author Farhin Shekh.
 * @description This file is used to initialize the routes for UserModule
 */

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// --------------------------------------------------- //
import { TimelinessContainerComponent } from './timeliness-container/timeliness.container';

const routes: Routes = [
  {
    path: '',
    component: TimelinessContainerComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TimelinessRoutingModule { }
