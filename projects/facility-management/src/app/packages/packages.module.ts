
/**
 * @author Rayhan Kasli.
 * @description The module that handles components and services related to packages.
 */
import { NgModule } from '@angular/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedModule } from 'common-libs';
import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
// ----------------------------------------------------------------- //
import { PackagesRoutingModule } from './packages-routing.module';
import { PackagesListContainerComponent } from './packages-list-container/packages-list.container';
import { PackagesService } from './packages.service';
import { DeliveryServiceAdapter, PackagesAdapter, PackagesFilterAdapter, SlotAdapter, UserDetailsAdapter, UserListAdapter } from './packages-adapter/packages.adapter';
import { PackagesListDesktopPresentationComponent } from './packages-list-container/packages-list-presentation/packages-list-desktop-presentation/packages-list-desktop.presentation';
import { PackagesListPresentationComponent } from './packages-list-container/packages-list-presentation/packages-list.presentation';
import { PackagesFormPresentationComponent } from './packages-list-container/packages-form-presentation/packages-form.presentation';
import { AppSharedModule } from '../shared/app-shared.module';
import { PackagePresentationComponent } from './packages-list-container/package-presentation/package-presentation.component';

@NgModule({
  declarations: [
    PackagesFormPresentationComponent,
    PackagesListContainerComponent,
    PackagesListDesktopPresentationComponent,
    PackagesListPresentationComponent,
    PackagePresentationComponent,
  ],
  imports: [
    SharedModule,
    PackagesRoutingModule,
    NgSelectModule,
    PortalModule,
    OverlayModule,
    NgbDropdownModule,
    AppSharedModule
  ],
  providers: [
    PackagesService,
    PackagesAdapter,
    PackagesFilterAdapter,
    UserDetailsAdapter,
    DeliveryServiceAdapter,
    UserListAdapter,
    SlotAdapter
  ]
})
export class PackagesModule {
}

