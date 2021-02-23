
/**
 * @author Nitesh Sharma | Rayhan Kasli.
 * @description The module that handles components and services related to visitor-log.
 */
import { NgModule } from '@angular/core';
import { DatePipe } from '@angular/common';
// ----------------------------------------------------------------- //
import { VisitorLogRoutingModule } from './visitor-log-routing.module';
import { AppSharedModule } from '../shared/app-shared.module';
import { VisitorLogService } from './visitor-log.service';
import {
  VisitorLogAdapter, IdentificationProofAdapter, VisitorStatusAdapter,
  UploadPictureAdapter, VisitorFilterAdapter, EmployeeAdapter
} from './visitor-log-adapter/visitor-log.adapter';
import { VisitorLogListContainerComponent } from './visitor-log-list-container/visitor-log-list.container';
import { VisitorLogListDesktopPresentationComponent } from
  './visitor-log-list-container/visitor-log-list-presentation/visitor-log-list-desktop-presentation/visitor-log-list-desktop.presentation';
import { VisitorLogListPresentationComponent } from './visitor-log-list-container/visitor-log-list-presentation/visitor-log-list.presentation';
import { VisitorLogFormPresentationComponent } from
  './visitor-log-list-container/visitor-log-list-presentation/visitor-log-form/visitor-log-form-presentation/visitor-log-form.presentation';
import {
  VisitorLogFilterPresentationComponent
} from './visitor-log-list-container/visitor-log-list-presentation/visitor-log-filter-presentation/visitor-log-filter.presentation';


@NgModule({
  declarations: [
    VisitorLogListContainerComponent,
    VisitorLogFormPresentationComponent,
    VisitorLogListDesktopPresentationComponent,
    VisitorLogListPresentationComponent,
    VisitorLogFilterPresentationComponent
  ],
  imports: [
    VisitorLogRoutingModule,
    AppSharedModule
  ],
  providers: [
    VisitorLogService,
    VisitorLogAdapter,
    IdentificationProofAdapter,
    VisitorStatusAdapter,
    UploadPictureAdapter,
    VisitorFilterAdapter,
    EmployeeAdapter,
    DatePipe
  ],
  entryComponents: [
    VisitorLogFilterPresentationComponent
  ],
})
export class VisitorLogModule {
}

