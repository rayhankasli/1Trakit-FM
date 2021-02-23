import { DatePipe, DecimalPipe, TitleCasePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthPolicyModule, StorageType } from 'auth-policy';
import { CoreModule } from 'common-libs';
import { NgOidcClientModule } from 'ng-oidc-client';
import { TabsModule } from 'ngx-bootstrap';
import { WebStorageStateStore } from 'oidc-client';
// --------------------------------------------------------------------
import { environment } from '../../environments/environment';
import { MasterComponent } from './components/master/master.component';
import { ActivateDashboardGuard } from './guards/activate-dashboard/activate-dashboard.guard';
import { CheckArchivedGuard } from './guards/check-archived/check-archived.guard';
import { CheckLicensingGuard } from './guards/check-licensing.guard';
import { CheckUserProfileGuard } from './guards/check-user-profile.guard';
import { ArchivedModule } from './module/archived/archived.module';
import { BreadcrumbModule } from './module/breadcrumb/breadcrumb.module';
import { AppResolverService } from './resolvers/app.resolver';
import { UserInfoResolverService } from './resolvers/user-info.resolver';
import { UserProfileResolverService } from './resolvers/user-profile.resolver';
import { ReportFleetDetailListAdapter, ReportYearListAdapter } from './services/adapter/reports.adapter';
import { WeekDaysAdapter } from './services/adapter/weekDays.adapter';
import { AmountConverterService } from './services/amount-converter.service';
import { ArchiveModeService } from './services/archive-mode/archive-mode.service';
import { ColumnChartService } from './services/chart-service/column-chart.service';
import { LineChartService } from './services/chart-service/line-chart.service';
import { PieChartService } from './services/chart-service/pie-chart.service';
import { StackedColumnChartService } from './services/chart-service/stacked-column-chart.service';
import { GeneratePdfService } from './services/generate-pdf-service/generate-pdf.service';

/**
 * Get user-store for authority
 */
export function authorityUserStorage(): WebStorageStateStore {
  return new WebStorageStateStore({ store: window.localStorage });
}

@NgModule({
  declarations: [
    MasterComponent,
  ],
  imports: [
    RouterModule,
    CoreModule.forRoot(environment),
    CoreModule,
    NgOidcClientModule.forRoot({
      oidc_config: {
        client_id: environment.client_id,
        response_type: environment.response_type,
        scope: environment.scope,
        authority: environment.authority,
        redirect_uri: `${environment.redirect_uri}auth-callback`,
        post_logout_redirect_uri: `${environment.redirect_uri}`,
        silent_redirect_uri: `${environment.redirect_uri}silent-renew.html`,
        automaticSilentRenew: true,
        acr_values: environment.acr_values,
        accessTokenExpiringNotificationTime: 10,
        ui_locales: environment.ui_locales,
        userStore: authorityUserStorage
      }
    }),
    AuthPolicyModule.forRoot({
      url: environment.policy_url,
      clientId: environment.client_id,
      policyName: environment.policy_name,
      storageType: StorageType.localStorage
    }),
    TabsModule.forRoot(),
    BreadcrumbModule.forRoot(),
    ArchivedModule
  ],
  providers: [
    AppResolverService,
    UserInfoResolverService,
    UserProfileResolverService,
    CheckUserProfileGuard,
    CheckLicensingGuard,
    CheckArchivedGuard,
    ColumnChartService,
    StackedColumnChartService,
    LineChartService,
    PieChartService,
    GeneratePdfService,
    AmountConverterService,
    DecimalPipe,
    DatePipe,
    TitleCasePipe,
    ArchiveModeService,
    ActivateDashboardGuard,
    WeekDaysAdapter,
    ReportYearListAdapter,
    ReportFleetDetailListAdapter
  ]
})
export class AppCoreModule { }
