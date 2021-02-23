/**
 * @author Enter Your Name Here.
 * @description This file is used to initialize the routes for WorkflowModule
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// --------------------------------------------------- //
import { WorkflowListContainerComponent } from './workflow-list-container/workflow-list.container';
import { WorkflowTaskContainerComponent } from './workflow-task-container/workflow-task.container';
import { AuthPolicyGuard } from 'common-libs';
import { Permission } from '../core/enums/role-permissions.enum';
import { WorkflowReasonsContainerComponent } from './workflow-reasons-container/workflow-reasons.container';
import { WorkflowContainerComponent } from './workflow-container/workflow.container';
import { WorkflowResolver } from './workflow-resolver';


const routes: Routes = [
  {
    path: '',
    component: WorkflowContainerComponent,
    children: [
      {
        path: '',
        data: {
          // breadcrumb: 'Work Flow Configurations'
        },
        children: [
          {
            path: '', redirectTo: 'workflow', pathMatch: 'full'
          },
          {
            path: 'workflow',
            canActivate: [AuthPolicyGuard],
            data: { permission: Permission.WorkFlowConfiguration.view },
            component: WorkflowListContainerComponent
          },
          {
            path: 'workflow/:id/task',
            resolve: { workflow: WorkflowResolver },
            canActivate: [AuthPolicyGuard],
            data: { breadcrumb: '{{workflow.workflowName}} - {{workflow.officeName}}', permission: Permission.Task.view },
            component: WorkflowTaskContainerComponent
          }
        ]
      },
      {
        path: 'workflow-reasons',
        canActivate: [AuthPolicyGuard],
        data: {
          breadcrumb: 'Task not completed - Reasons', permission: Permission.WorkFlowConfiguration.viewReason
        },
        component: WorkflowReasonsContainerComponent
      },
    ]

  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkflowConfigurationsRoutingModule { }

