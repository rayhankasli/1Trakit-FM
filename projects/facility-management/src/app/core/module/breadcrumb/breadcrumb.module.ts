import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
// --------------------------------------------------------------------- //
import { BreadcrumbComponent } from './component/breadcrumb.component';
import { BreadcrumbConfig } from './services/breadcrumb.config';
import { BreadcrumbService } from './services/breadcrumb.service';

@NgModule({
  declarations: [
    BreadcrumbComponent
  ],
  imports: [
    CommonModule, 
    RouterModule
  ],
  exports: [
    BreadcrumbComponent
  ],
})
export class BreadcrumbModule {
  /** Module With Providers */
  public static forRoot(): ModuleWithProviders {
    return {
      ngModule: BreadcrumbModule,
      providers: [BreadcrumbService, BreadcrumbConfig],
    };
  }
}
