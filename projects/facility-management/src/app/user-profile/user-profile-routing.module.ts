/**
 * @author Ronak Patel.
 * @description This file is used to initialize the routes for UserProfileModule
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// --------------------------------------------------- //
import { UserProfileFormContainerComponent } from './user-profile-form-container/user-profile-form.container';
const routes: Routes = [
  {
    path: '',
    component: UserProfileFormContainerComponent,

  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserProfileRoutingModule { }

