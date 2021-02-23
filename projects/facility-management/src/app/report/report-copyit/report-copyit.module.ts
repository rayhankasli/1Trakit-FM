import { NgModule } from '@angular/core';
// ---------------------------------------------- //
import { ReportCopyItRoutingModule } from './report-copyit-routing.module';
import { AppSharedModule } from '../../shared/app-shared.module';
import { ReportCopyItContainerComponent } from './report-copyit-container/report-copyit.container';
import { ReportCopyItPresentationComponent } from './report-copyit-container/report-copyit-presentation/report-copyit.presentation';


@NgModule({
  declarations: [
    ReportCopyItContainerComponent,
    ReportCopyItPresentationComponent
  ],
  imports: [
    ReportCopyItRoutingModule,
    AppSharedModule
  ],
  providers: []
})
export class ReportCopyItModule { }
