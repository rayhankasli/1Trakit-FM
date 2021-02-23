

/**
 * @name WorkflowContainerComponent
 * @author Rayhan Kasli
 * @description This is a container component for Workflow. This is responsible for all data retrieving and posting to the server by http calls.
 */
import { Component, OnInit, HostBinding } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
//--------------------------------------------------------------------//
import { TableProperty, BaseResponse } from 'common-libs';
import { WorkflowConfigurationsService } from '../workflow-configurations.service';
import { Workflow, WorkflowFilterRecord, ToggleStatus } from '../workflow-configurations.model';
import { CommonHttpService } from '../../core/services/common-http.service';
import { OfficeMaster, AssignedToMaster } from '../../core/model/common.model';

/**
 * WorkflowListContainerComponent
 */
@Component({
  selector: 'app-workflow-list-container',
  templateUrl: './workflow-list.container.html'
})
export class WorkflowListContainerComponent implements OnInit {

  @HostBinding('class') public class: string;
  /** This is a observable which passes the list of workflow to its child component */
  public workflows$: Observable<Workflow[]>;

  /** Office list$ of mail configurations container component */
  public officeList$: Observable<OfficeMaster[]>;

  /** Assigner$  of mail configurations container component */
  public assigner$: Observable<AssignedToMaster[]>;

  /** client Id    */
  public clientId: number;

  /** Determines whether  deleted */
  public isDeleted: boolean;

  /** it will store the table property */
  private tableProperty: TableProperty<WorkflowFilterRecord>;

  constructor(
    private workflowConfigurationsService: WorkflowConfigurationsService,
    private route: ActivatedRoute,
    private commonHttpService: CommonHttpService
  ) {
    this.class = 'flex-grow-1 h-100 overflow-hidden';
   }

  public ngOnInit(): void {
    this.clientId = +this.route.parent.snapshot.paramMap.get('id');
    this.getMasterData();
  }
  /** This Method is used to get data from server  */
  public getWorkflows(tableProperty: TableProperty<WorkflowFilterRecord>): void {
    tableProperty.filter.clientId = this.clientId;
    this.tableProperty = tableProperty;
    this.workflows$ = this.workflowConfigurationsService.getWorkflows(tableProperty);
  }

  /** When presentation layer emits the save event, then this will post data on server */
  public addWorkflow(workflow: Workflow): void {
    workflow.clientId = this.clientId;
    if(workflow.isCreateNewCopy) {
      this.workflowConfigurationsService.createNewCopy(workflow).subscribe(
        (response: BaseResponse<string>) => {
          this.getWorkflows(this.tableProperty);
        });
    } else {
      this.workflowConfigurationsService.addWorkflow(workflow).subscribe(
        (response: BaseResponse<string>) => {
          this.getWorkflows(this.tableProperty);
        });
    }
  }

  /** When presentation layer emits the save event, then this will post data on server */
  public updateWorkflow(workflow: Workflow): void {
    const id: number = workflow.workflowId;
    workflow.clientId = this.clientId;
    this.workflowConfigurationsService.updateWorkflow(id, workflow).subscribe(
      (response: BaseResponse<string>) => {
        this.getWorkflows(this.tableProperty);
      });
  }

  /** This Method is delete data from server  */
  public deleteWorkflow(workflow: Workflow): void {
    this.workflowConfigurationsService.deleteWorkflow(workflow).subscribe(() => {
      this.getWorkflows(this.tableProperty);
    });
  }
  /** This Method is invoke when user filters data from server  */
  public filterWorkflow(tableProperty: TableProperty<WorkflowFilterRecord>): void {
    this.workflows$ = this.workflowConfigurationsService.filterWorkflow(tableProperty);
  }

  /** getMasterData */
  public getMasterData(): void {
    this.officeList$ = this.commonHttpService.getOffices(this.clientId);
    this.assigner$ = this.workflowConfigurationsService.getAssignerList(this.clientId);

  }

  /** This method is for toggle status */
  public toggleWorkflowStatus(toggleStatus: ToggleStatus): void {
    this.workflowConfigurationsService.toggleWorkflowStatus(toggleStatus).subscribe(
      (response: BaseResponse<string>) => {
        this.getWorkflows(this.tableProperty);
      });
  }


}
