import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Workflow } from './workflow-configurations.model';
import { WorkflowConfigurationsService } from './workflow-configurations.service';
import { Observable } from 'rxjs';

@Injectable()
export class WorkflowResolver implements Resolve<Workflow> {
    constructor(
        private workflowConfigurationsService: WorkflowConfigurationsService,
    ) {
    }

    /**
     * Resolve floor details
     * @param route Activated route
     * @param state Router state snapshot
     */
    public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
        Observable<Workflow> {
        return this.workflowConfigurationsService.getWorkflowById(route.paramMap.get('id'));
    }
}