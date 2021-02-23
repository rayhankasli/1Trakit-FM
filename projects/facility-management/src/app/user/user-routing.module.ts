/**
 * @author Nitesh Sharma.
 * @description This file is used to initialize the routes for UserModule
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// --------------------------------------------------- //
import { UserListContainerComponent } from './user-list-container/user-list.container';

const routes: Routes = [
  {
    path: '',
    component: UserListContainerComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }

