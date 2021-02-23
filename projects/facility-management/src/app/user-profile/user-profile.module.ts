
/**
 * @author Ronak Patel.
 * @description The module that handles components and services related to user-profile.
 */
import { NgModule } from '@angular/core';
// ----------------------------------------------------------------- //
import { UserProfileRoutingModule } from './user-profile-routing.module';
import { AppSharedModule } from '../shared/app-shared.module';
import { UserProfileService } from './user-profile.service';
import { UserProfileAdapter } from './user-profile-adapter/user-profile-adapter';
import { UserProfileFormContainerComponent } from './user-profile-form-container/user-profile-form.container';
import { UserProfileFormPresentationComponent } from './user-profile-form-container/user-profile-form-presentation/user-profile-form.presentation';


@NgModule({
  declarations: [
    UserProfileFormContainerComponent,
    UserProfileFormPresentationComponent,
  ],
  imports: [
    UserProfileRoutingModule,
    AppSharedModule
  ],
  providers: [
    UserProfileService,
    UserProfileAdapter,
  ]
})
export class UserProfileModule {
  constructor() {
  }
}

