

/**
 * @name WorkflowTaskContainerComponent
 * @author  Ronak Patel.
 * @description This is a container component for WorkflowTask. This is responsible for all data retrieving and posting to the server by http calls.
 */
import { Component, HostBinding } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
//--------------------------------------------------------------------//
import { TableProperty } from 'common-libs';
import { WorkflowConfigurationsService } from '../workflow-configurations.service';
import {
  WorkflowTask, Floor, WorkflowTaskRequest, RearrangeTask,
} from '../workflow-configurations.model';
import { CommonHttpService } from '../../core/services/common-http.service';
import { WeekDays } from '../../core/model/common.model';
import { of } from 'rxjs';

/**
 * WorkflowTaskContainerComponent
 */
@Component({
  selector: 'app-workflow-task-container',
  templateUrl: './workflow-task.container.html'
})
export class WorkflowTaskContainerComponent {

  @HostBinding('class') public class: string;
  /** This is a observable which passes the list of workflowTask to its child component */
  public workflowTasks$: Observable<WorkflowTask[]>;
  /** workflow id */
  public workflowId: string;
  /** Store table property */
  public tableProperty: TableProperty;
  /** This is a observable which passes the list of workflowTask to its child component */
  public weekDays$: Observable<WeekDays[]>
  /** This is a observable which passes the list of workflowTask to its child component */
  public floors$: Observable<Floor[]>;
  /** This is a observable which passes the list of workflowTask to its child component */
  public rooms$: Observable<any>;
  /** officeId of perticular office */
  public officeId: string;
  /** clientId of pericular client */
  public clientId: string;
  constructor(
    private workflowConfigurationsService: WorkflowConfigurationsService,
    private route: ActivatedRoute,
    private commonService: CommonHttpService
  ) {
    this.tableProperty = new TableProperty();
    this.workflowId = this.route.snapshot.paramMap.get('id');
    this.clientId = this.route.parent.parent.snapshot.paramMap.get('id');
    this.officeId = this.route.snapshot.data['workflow'].officeId;
    this.class = 'd-flex flex-column h-100 overflow-hidden';
  }

  /** This Method is used to get data from server  */
  public getWorkflowTasks(tableProperty: TableProperty): void {
    this.tableProperty = tableProperty;
    this.getWorkflowTask();

  }

  /** This Method is delete data from server  */
  public deleteWorkflowTask(workflowTask: WorkflowTask): void {
    this.workflowConfigurationsService.deleteWorkflowTask(workflowTask).subscribe(() => {
      this.getWorkflowTask();

    });
  }

  /** get weekdays */
  public getFormMasterData(): void {
    this.weekDays$ = this.commonService.getWeekDays(+this.clientId);
    this.floors$ = this.workflowConfigurationsService.getFloors(this.officeId);
  }

  /** getRooms */
  public getRooms(floorId: number): void {
    this.rooms$ = floorId === -1 ? of([]) : this.workflowConfigurationsService.getRoom(+floorId);
  }

  /** onReArrange */
  public onReArrange(reArrange: RearrangeTask[]): void {
    this.workflowConfigurationsService.reArrange(reArrange).subscribe(() => {
      this.getWorkflowTask();
    });
  }


  /** When presentation layer emits the save event, then this will post data on server */
  public addWorkflowTask(workflowTask: WorkflowTaskRequest): void {
    workflowTask.workflowId = +this.workflowId;
    this.workflowConfigurationsService.addWorkflowTask(workflowTask).subscribe(
      () => {
        this.getWorkflowTask();
      });
  }

  /** When presentation layer emits the save event, then this will post data on server */
  public updateWorkflowTask(workflowTask: WorkflowTaskRequest): void {
    this.workflowConfigurationsService.updateWorkflowTask(workflowTask).subscribe(
      () => {
        this.getWorkflowTask();
      });
  }

  /** getWorkflowTask */
  private getWorkflowTask(): void {
    this.workflowTasks$ = this.workflowConfigurationsService.getWorkflowTasks(this.workflowId, this.tableProperty);
  }

}
