import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
// ------------------------------------------------------ //
import { BsDatepickerModule, TimepickerModule, TooltipModule, BsDropdownModule } from 'ngx-bootstrap';
import { AuthGuard } from './services/guard/auth.guard';
import { AuthCallbackComponent } from './component/auth-callback/auth-callback.component';
import { interceptorProviders } from './services/interceptor/interceptors';
import { ConfirmationModalService } from './services/confirmation-modal/confirmation-modal.service';
import { BreadcrumbComponent } from './component/breadcrumb/breadcrumb.component';
import { PageTitleComponent } from './component/page-title/page-title.component';
import { ToastrModule } from 'ngx-toastr';
import { LoaderService } from './services/loader/loader.service';
import { OverlayModule } from '@angular/cdk/overlay';
import { NgSelectModule } from '@ng-select/ng-select';
import { RouterModule } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { HttpClientModule } from '@angular/common/http';
import { NgbTimeStringAdapter } from './adapter/timepicker.adapter';
import { SharedModule } from '../shared/shared.module';
import { TopbarService } from './services/topbar/topbar.service';

import { NotificationAdapter, UpdateNotificationAdapter } from './adapter/notification-adapter';
import { AuthService } from './services/auth/auth.service';
import { BreakPointObserverService } from './services/break-point-observer/break-point-observer.service';
import { HelpContentDataService } from './services/help-content/help-content-data.service';
import { MenuDataService } from './services/menu/menu-data.service';
import { LanguageDataService } from './services/language/language-data.service';
import { HttpService } from './services/http/http.service';
import { LayoutModule } from '@angular/cdk/layout';
import { LogoutComponent } from './component/logout/logout.component';
import { TopbarPresentationComponent } from './component/topbar/topbar-presentation/topbar.presentation';
import { SidebarPresentationComponent } from './component/sidebar/sidebar-presentation/sidebar.presentation';
import { AuthPolicyGuard } from './services/guard/auth-policy.guard';
import { AuthCallbackPolicyComponent } from './component/auth-callback/auth-callback-policy.component';
import { MenuDataPolicyService } from './services/menu/menu-data-policy.service';
import { ToastrServiceProvider } from './services/toaster/toastr.service';
import { AuthPolicyModule, PolicyEnvironment } from 'auth-policy';
import { SidebarService } from './services/sidebar/sidebar.service';
import { CustomToastComponent } from './component/custom-toastr/custom-toastr.component';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { BusyService } from './services/interceptor/busy.service';

/**
 * CoreModule
 */
@NgModule({
  declarations: [
    AuthCallbackComponent,
    AuthCallbackPolicyComponent,
    PageTitleComponent,
    BreadcrumbComponent,
    TopbarPresentationComponent,
    SidebarPresentationComponent,
    LogoutComponent,
    CustomToastComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    HttpClientModule,
    NgbDropdownModule,
    BsDatepickerModule.forRoot(),
    BsDropdownModule.forRoot(),
    TimepickerModule.forRoot(),
    ToastrModule.forRoot({
      toastComponent: CustomToastComponent,
      timeOut: 3000,
      preventDuplicates: true,
      enableHtml: true,
      // autoDismiss: false,
      // disableTimeOut: true
    }),
    OverlayModule,
    LayoutModule,
    NgSelectModule,
    StoreModule.forRoot({}),
    EffectsModule.forRoot([]),
    TooltipModule.forRoot(),
    SharedModule,
    AuthPolicyModule
  ],
  providers: [],
  exports: [
    CommonModule,
    RouterModule,
    BsDatepickerModule,
    TimepickerModule,
    NgSelectModule,
    BreadcrumbComponent,
    PageTitleComponent,
    TopbarPresentationComponent,
    SidebarPresentationComponent,
    LogoutComponent,
    AuthPolicyModule
  ],
  entryComponents: [
    CustomToastComponent
  ]

})
export class CoreModule {

  /**
   * For root
   * @param environment
   * @returns root
   */
  public static forRoot(environment: any): ModuleWithProviders {
    return {
      ngModule: CoreModule,
      providers: [
        ToastrServiceProvider,
        AuthGuard,
        AuthPolicyGuard,
        interceptorProviders,
        LoaderService,
        HelpContentDataService,
        MenuDataService,
        MenuDataPolicyService,
        TopbarService,
        SidebarService,
        HttpService,
        LanguageDataService,
        ConfirmationModalService,
        AuthService,
        BreakPointObserverService,
        NgbTimeStringAdapter,
        NotificationAdapter,
        UpdateNotificationAdapter,
        BusyService,
        {
          provide: 'environment',
          useValue: environment
        }
      ],
    };
  }

}
