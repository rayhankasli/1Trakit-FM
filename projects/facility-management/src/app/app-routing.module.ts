/**
 * @author
 */


import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthCallbackPolicyComponent, AuthGuard, AuthPolicyGuard, LogoutComponent } from 'common-libs';
import { MasterComponent } from './core/components/master/master.component';
import { MenuLicensing } from './core/enums/menu-licensing.enum';
import { Permission } from './core/enums/role-permissions.enum';
import { ActivateDashboardGuard } from './core/guards/activate-dashboard/activate-dashboard.guard';
import { CheckArchivedGuard } from './core/guards/check-archived/check-archived.guard';
import { CheckLicensingGuard } from './core/guards/check-licensing.guard';
import { CheckUserProfileGuard } from './core/guards/check-user-profile.guard';
import { UserInfoResolverService } from './core/resolvers/user-info.resolver';
import { UserProfileResolverService } from './core/resolvers/user-profile.resolver';
import { NotFoundComponent } from './unauthorized/not-found.component';

const routes: Routes = [
  {
    path: 'auth-callback',
    component: AuthCallbackPolicyComponent
  },
  {
    path: '',
    component: MasterComponent,
    resolve: {
      // policy: AppResolverService,
      userInfo: UserInfoResolverService,
    },
    canActivateChild: [AuthGuard],
    children: [
      {
        path: 'archive',
        canActivate: [CheckUserProfileGuard],
        data: { isArchived: true },
        children: [
          {
            path: '',
            redirectTo: 'dashboard',
            pathMatch: 'full'
          },
          {
            path: 'dashboard',
            canActivate: [ActivateDashboardGuard],
            loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule),
            data: {
              title: 'Dashboard',
              breadcrumb: 'Dashboard',
            },
          },
          {
            path: 'users',
            canLoad: [AuthPolicyGuard],
            loadChildren: () => import('./user/user.module').then(m => m.UserModule),
            data: {
              title: 'User',
              breadcrumb: 'Users',
              permission: Permission.User.view
            },
          },
          {
            path: 'clients',
            data: {
              title: 'Clients',
              breadcrumb: 'Clients',
              permission: Permission.Client.view
            },
            canLoad: [AuthPolicyGuard],
            loadChildren: () => import('./client/client.module').then(m => m.ClientModule)
          },
          {
            path: 'copyit',
            canActivate: [AuthPolicyGuard],
            canActivateChild: [CheckArchivedGuard],
            loadChildren: () => import('./copyit/copyit.module').then(m => m.CopyitModule),
            data: {
              title: 'Copy It',
              breadcrumb: 'Copy It',
              permission: Permission.CopyIt.view,
            },
          },
          {
            path: 'asset',
            data: {
              title: 'Fleet Management',
              breadcrumb: 'Fleet Management',
              permission: Permission.Fleet.view,
            },
            canActivate: [AuthPolicyGuard],
            canActivateChild: [CheckArchivedGuard],
            loadChildren: () => import('./fleet/fleet.module').then(m => m.FleetModule)
          },
          {
            path: 'bookit',
            data: {
              title: 'BookIt',
              breadcrumb: 'Book It',
              permission: Permission.BookIt.view,
            },
            canActivate: [AuthPolicyGuard],
            canActivateChild: [CheckArchivedGuard],
            loadChildren: () => import('./bookit/bookit.module').then(m => m.BookItModule)
          },
          {
            path: 'visitor-log',
            data: {
              title: 'Visitor`s Log',
              breadcrumb: "Visitor's Log",
              permission: Permission.VisitorLog.viewVisitor,
              archived: MenuLicensing.VisitorLog
            },
            canLoad: [AuthPolicyGuard, CheckArchivedGuard],
            loadChildren: () => import('./visitor-log/visitor-log.module').then(m => m.VisitorLogModule)
          },
          {
            path: 'packages',
            loadChildren: () => import('./packages/packages.module').then(m => m.PackagesModule),
            data: {
              breadcrumb: 'Packages',
              title: 'Packages',
              permission: Permission.Packages.webView,
              archived: MenuLicensing.Packages
            },
            canLoad: [AuthPolicyGuard],
            canActivate: [CheckArchivedGuard]
          },
          {
            path: 'report',
            loadChildren: () => import('./report/report-archived.module').then(m => m.ReportArchivedModule),
            data: { title: 'Report' },
          }
        ]
      },
      {
        path: '',
        canActivate: [CheckUserProfileGuard],
        children: [
          {
            path: '',
            redirectTo: 'dashboard',
            pathMatch: 'full'
          },
          {
            path: 'dashboard',
            canActivate: [ActivateDashboardGuard],
            loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule),
            data: {
              title: 'Dashboard',
              breadcrumb: 'Dashboard',
            },
          },
          {
            path: 'users',
            canLoad: [AuthPolicyGuard],
            loadChildren: () => import('./user/user.module').then(m => m.UserModule),
            data: {
              title: 'User',
              breadcrumb: 'Users',
              permission: Permission.User.view
            },
          },
          {
            path: 'clients',
            data: {
              title: 'Clients',
              breadcrumb: 'Clients',
              permission: Permission.Client.view
            },
            canLoad: [AuthPolicyGuard],
            loadChildren: () => import('./client/client.module').then(m => m.ClientModule)
          },
          {
            path: 'copyit',
            canActivate: [AuthPolicyGuard],
            canActivateChild: [CheckLicensingGuard],
            loadChildren: () => import('./copyit/copyit.module').then(m => m.CopyitModule),
            data: {
              title: 'Copy It',
              breadcrumb: 'Copy It',
              permission: Permission.CopyIt.view,
            },
          },
          {
            path: 'asset',
            data: {
              title: 'Fleet Management',
              breadcrumb: 'Fleet Management',
              permission: Permission.Fleet.view,
            },
            canActivate: [AuthPolicyGuard],
            canActivateChild: [CheckLicensingGuard],
            loadChildren: () => import('./fleet/fleet.module').then(m => m.FleetModule)
          },
          {
            path: 'bookit',
            data: {
              title: 'BookIt',
              breadcrumb: 'Book It',
              permission: Permission.BookIt.view,
            },
            canActivate: [AuthPolicyGuard],
            canActivateChild: [CheckLicensingGuard],
            loadChildren: () => import('./bookit/bookit.module').then(m => m.BookItModule)
          },
          {
            path: 'visitor-log',
            data: {
              title: 'Visitor`s Log',
              breadcrumb: "Visitor's Log",
              permission: Permission.VisitorLog.viewVisitor,
              license: MenuLicensing.VisitorLog
            },
            canLoad: [AuthPolicyGuard],
            canActivate: [CheckLicensingGuard],
            loadChildren: () => import('./visitor-log/visitor-log.module').then(m => m.VisitorLogModule)
          },
          {
            path: 'packages',
            loadChildren: () => import('./packages/packages.module').then(m => m.PackagesModule),
            data: {
              breadcrumb: 'Packages',
              title: 'Packages',
              permission: Permission.Packages.webView,
              license: MenuLicensing.Packages
            },
            canLoad: [AuthPolicyGuard],
            canActivate: [CheckLicensingGuard],
          },
          {
            path: 'report',
            loadChildren: () => import('./report/report.module').then(m => m.ReportModule),
            data: { title: 'Report' },
          },
        ]
      },
      {
        path: 'user-profile',
        resolve: { userProfile: UserProfileResolverService },
        data: { breadcrumb: 'User Profile' },
        loadChildren: () => import('./user-profile/user-profile.module').then(m => m.UserProfileModule),
      },
    ]
  },
  {
    path: 'unauthorized',
    component: NotFoundComponent
  },
  {
    path: 'page-not-found',
    component: NotFoundComponent
  },
  {
    path: 'inactive-user',
    component: NotFoundComponent
  },
  {
    path: 'no-license',
    component: NotFoundComponent
  },
  {
    path: 'logout',
    component: LogoutComponent
  },
  {
    path: '**',
    redirectTo: 'page-not-found',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
