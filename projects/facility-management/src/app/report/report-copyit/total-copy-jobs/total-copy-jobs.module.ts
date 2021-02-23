import { NgModule } from '@angular/core';
// ------------------------------------------------------- //
import { TotalCopyJobsRoutingModule } from './total-copy-jobs-routing.module';
import { AppSharedModule } from '../../../shared/app-shared.module';
import { TotalCopyJobsService } from './total-copy-jobs.service';
import { TotalCopyJobsAdapter } from './total-copy-jobs-adapter/total-copy-jobs.adapter';
import { TotalCopyJobsContainerComponent } from './total-copy-jobs-container/total-copy-jobs.container';
import { TotalCopyJobsPresentationComponent } from './total-copy-jobs-container/total-copy-jobs-presentation/total-copy-jobs.presentation';


@NgModule({
  declarations: [
    TotalCopyJobsContainerComponent,
    TotalCopyJobsPresentationComponent
  ],
  imports: [
    TotalCopyJobsRoutingModule,
    AppSharedModule
  ],
  providers: [
    TotalCopyJobsService,
    TotalCopyJobsAdapter
  ]
})
export class TotalCopyJobsModule { }
