
/**
 * @author Nitesh Sharma.
 * @description The module that handles components and services related to user.
 */
import { NgModule } from '@angular/core';
import { DatePipe } from '@angular/common';
// ----------------------------------------------------------------- //
import { UserRoutingModule } from './user-routing.module';
import { AppSharedModule } from '../shared/app-shared.module';
import { UserService } from './user.service';
import { UserAdapter, UserFilterAdapter, BulkUploadUserAdapter } from './user-adapter/user.adapter';
import { UserListContainerComponent } from './user-list-container/user-list.container';
import { UserListDesktopPresentationComponent }
  from './user-list-container/user-list-presentation/user-list-desktop-presentation/user-list-desktop.presentation';
import { UserListPresentationComponent } from './user-list-container/user-list-presentation/user-list.presentation';
import { UserFilterPresentationComponent }
  from './user-list-container/user-list-presentation/user-filter-presentation/user-filter.presentation';
import { UserFormPresentationComponent } from './user-list-container/user-form-presentation/user-form.presentation';

@NgModule({
  declarations: [
    UserListContainerComponent,
    UserFilterPresentationComponent,
    UserListDesktopPresentationComponent,
    UserListPresentationComponent,
    UserFormPresentationComponent,
    UserFilterPresentationComponent
  ],
  imports: [
    UserRoutingModule,
    AppSharedModule,
  ],
  providers: [
    UserService,
    UserFilterAdapter,
    BulkUploadUserAdapter,
    UserAdapter,
    DatePipe
  ],
  entryComponents: [
    UserFilterPresentationComponent,
    UserListDesktopPresentationComponent
  ],
})
export class UserModule {
}

