
/**
 * @author Enter Your Name Here.
 * @description The module that handles components and services related to workflow.
 */
import { NgModule } from '@angular/core';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { PopoverConfig } from 'ngx-bootstrap';
// ----------------------------------------------------------------- //
import { WorkflowConfigurationsRoutingModule } from './workflow-configurations-routing.module';
import { WorkflowListContainerComponent } from './workflow-list-container/workflow-list.container';
import { WorkflowConfigurationsService } from './workflow-configurations.service';
import {
  WorkflowAdapter, WorkflowFilterAdapter, ReasonsAdapter, AssignAdapter,
  WorkflowTaskAdapter, WorkflowTaskFilterAdapter
} from './workflow-configurations-adapter/workflow-configurations.adapter';
import { WorkflowContainerComponent } from './workflow-container/workflow.container';
import { WorkflowTaskContainerComponent } from './workflow-task-container/workflow-task.container';
import { WorkflowReasonsContainerComponent } from './workflow-reasons-container/workflow-reasons.container';
import { WorkflowListDesktopPresentationComponent }
  from './workflow-list-container/workflow-list-presentation/workflow-list-desktop-presentation/workflow-list-desktop.presentation';
import { WorkflowFilterPresentationComponent }
  from './workflow-list-container/workflow-list-presentation/workflow-filter-presentation/workflow-filter.presentation';
import { WorkflowListPresentationComponent } from './workflow-list-container/workflow-list-presentation/workflow-list.presentation';
import { WorkflowFormPresentationComponent } from './workflow-list-container/workflow-form-presentation/workflow-form.presentation';
import { AppSharedModule } from '../shared/app-shared.module';
import { WorkflowTaskListPresentationComponent } from './workflow-task-container/workflow-task-list-presentation/workflow-task-list.presentation';
import { WorkflowTaskFilterPresentationComponent }
  from './workflow-task-container/workflow-task-list-presentation/workflow-task-filter-presentation/workflow-task-filter.presentation';
import { WorkflowTaskFormPresentationComponent }
  from './workflow-task-container/workflow-task-list-presentation/workflow-task-form-presentation/workflow-task-form.presentation';
import { WorkflowPresentationComponent } from './workflow-container/workflow-presentation/workflow.presentation';
import { WorkflowResolver } from './workflow-resolver';


/**  Popover configuration */
export function getPopoverConfig(): PopoverConfig {
  return Object.assign(new PopoverConfig(), { placement: 'auto', container: 'body' });
}

@NgModule({
  declarations: [
    WorkflowTaskContainerComponent,
    WorkflowContainerComponent,
    WorkflowReasonsContainerComponent,
    WorkflowTaskListPresentationComponent,
    WorkflowTaskFilterPresentationComponent,
    WorkflowTaskFormPresentationComponent,
    WorkflowPresentationComponent,
    WorkflowFormPresentationComponent,
    WorkflowListContainerComponent,
    WorkflowListDesktopPresentationComponent,
    WorkflowFilterPresentationComponent,
    WorkflowListPresentationComponent
  ],
  imports: [
    WorkflowConfigurationsRoutingModule,
    AppSharedModule,
    DragDropModule
  ],
  providers: [
    WorkflowConfigurationsService,
    WorkflowTaskAdapter,
    WorkflowTaskFilterAdapter,
    ReasonsAdapter,
    AssignAdapter,
    WorkflowAdapter,
    WorkflowFilterAdapter,
    WorkflowResolver,
    { provide: PopoverConfig, useFactory: getPopoverConfig }
  ],
  entryComponents: [
    WorkflowTaskFilterPresentationComponent,
    WorkflowListDesktopPresentationComponent,
    WorkflowFilterPresentationComponent,
  ],
})
export class WorkflowConfigurationsModule {
}

