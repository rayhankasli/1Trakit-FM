/**
 * @author Rayhan Kasli.
 * @description This file is used to initialize the routes for PackagesModule
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// --------------------------------------------------- //
import { PackagesListContainerComponent } from './packages-list-container/packages-list.container';


const routes: Routes = [
  {
    path: '',
    component: PackagesListContainerComponent,
 
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PackagesRoutingModule { }

