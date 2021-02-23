import { NgModule } from '@angular/core';
// ------------------------------------------------------ //
import { ReportBookItRoutingModule } from './report-bookit-routing.module';
import { AppSharedModule } from '../../shared/app-shared.module';
import { ReportBookItContainerComponent } from './report-bookit-container/report-bookit.container';
import { ReportBookItPresentationComponent } from './report-bookit-container/report-bookit-presentation/report-bookit.presentation';



@NgModule({
  declarations: [
    ReportBookItContainerComponent,
    ReportBookItPresentationComponent
  ],
  imports: [
    ReportBookItRoutingModule,
    AppSharedModule
  ],
  providers: []
})
export class ReportBookItModule { }
