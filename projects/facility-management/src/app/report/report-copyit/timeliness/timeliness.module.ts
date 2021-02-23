import { NgModule } from '@angular/core';
// ----------------------------------------------------- //
import { TimelinessRoutingModule } from './timeliness-routing.module';
import { AppSharedModule } from '../../../shared/app-shared.module';
import { TimelinessService } from './timeliness.service';
import { TimelinessAdapter } from './timeliness-adapter/timeliness.adapter';
import { TimelinessContainerComponent } from './timeliness-container/timeliness.container';
import { TimelinessPresentationComponent } from './timeliness-container/timeliness-presentation/timeliness.presentation';


@NgModule({
  declarations: [
    TimelinessContainerComponent,
    TimelinessPresentationComponent
  ],
  imports: [
    TimelinessRoutingModule,
    AppSharedModule
  ],
  providers: [
    TimelinessService,
    TimelinessAdapter
  ]
})
export class TimelinessModule { }
