/**
 * @author Rayhan Kasli.
 * @description This is adapter service use for transforming data base user requirement.
 */

import { Injectable } from '@angular/core';
// -------------------------------------------- //
import { Adapter } from 'common-libs';

import {
  Workflow,
  WorkflowFilterRecord,
  WorkflowRequest,
  WorkflowTaskRequest,
  RepeatOn,
  RepeatsOn,
  WorkflowTask,
  WorkflowTaskFilterRecord
} from '../workflow-configurations.model';
import { ReasonsResponse, Reasons } from '../../shared/components/reasons/reasons.model';
import { AssignedToMaster } from '../../core/model/common.model';


@Injectable()
export class WorkflowAdapter implements Adapter<Workflow> {
  /** This method is used to transform response object into T object. */
  public toResponse(item: any): Workflow {
    const workflow: Workflow = new Workflow(
      item.workflowId,
      item.workflowName,
      item.officeId,
      item.officeName,
      item.nickName,
      item.workflowStartTime,
      item.assignedToId,
      item.firstName + ' ' + item.lastName,
      item.clientId,
      item.isActive
    );
    return workflow;
  }

  /** This method is used to transform T object into request object. */
  public toRequest(item: any): WorkflowRequest {
    const workflow: WorkflowRequest = new WorkflowRequest(
      item.workflowName,
      item.officeId,
      item.workflowStartTime,
      item.assignedToId,
      item.clientId
    );
    return workflow;
  }
  /** This method is used to transform T object into request object. */
  public toCreateCopyRequest(item: any): WorkflowRequest {
    const workflow: WorkflowRequest = new WorkflowRequest(
      item.workflowName,
      item.officeId,
      item.workflowStartTime,
      item.assignedToId,
      item.clientId,
      item.isTaskCreated
    );
    return workflow;
  }
}

@Injectable()
export class WorkflowFilterAdapter implements Adapter<WorkflowFilterRecord> {

  /** This method is used to transform T object into request object. */
  public toRequest(item: WorkflowFilterRecord): WorkflowFilterRecord {
    const workflowFilter: WorkflowFilterRecord = new WorkflowFilterRecord(
      item.isActive,
      item.clientId,
      item.officeId,
      item.workflowStartTime,
      item.assignToId
    );
    return workflowFilter;
  }
}

@Injectable()
export class WorkflowTaskAdapter implements Adapter<WorkflowTask> {

  /** This method is used to transform response object into T object. */
  public toResponse(item: WorkflowTask): WorkflowTask {
    const workflowTask: WorkflowTask = new WorkflowTask(
      item.description,
      item.floor,
      item.floorId || -1,
      item.floorRoomId,
      item.floorRoomName,
      item.isActive,
      item.isPictureRequired,
      item.location,
      item.nickName,
      item.repeatsOn,
      item.sequence,
      item.taskName,
      item.workflowId,
      item.workflowTaskConfigId,
    );
    return workflowTask;
  }

  /** This method is used to transform T object into request object. */
  public toRequest(item: any): WorkflowTaskRequest {
    const workflowTaskRequest: WorkflowTaskRequest = new WorkflowTaskRequest(
      item.workflowId,
      item.taskName,
      item.sequence,
      item.floorId === -1 ? null : item.floorId,
      item.floorRoomId,
      item.description,
      item.repeatsOn ? this.setRepeatOnArray(item.repeatsOn) : undefined,
      item.isPictureRequired,
      item.isActive,
    );
    return workflowTaskRequest;
  }

  /** sets repeatsOn array for request */
  private setRepeatOnArray(repeatsOn: any): RepeatsOn {
    let wekDay: number[] = [];
    repeatsOn.repeatsOnDay.forEach((repeatOn: RepeatOn) => {
      wekDay.push(repeatOn.weekDayId);
    })
    return {
      repeatType: repeatsOn.repeatType,
      repeats: repeatsOn.repeatType,
      every: repeatsOn.every ? repeatsOn.every : null,
      repeatsOnDay: wekDay
    }
  }
}

@Injectable()
export class WorkflowTaskFilterAdapter implements Adapter<WorkflowTaskFilterRecord> {

  /** This method is used to transform T object into request object. */
  public toRequest(item: WorkflowTaskFilterRecord): WorkflowTaskFilterRecord {
    const workflowTaskFilter: WorkflowTaskFilterRecord = new WorkflowTaskFilterRecord(
      item.floorId,
      item.floorRoomId,
      item.repeatsOn
    );
    return workflowTaskFilter;
  }
}
/**
 * Injectable
 */
@Injectable()
export class ReasonsAdapter implements Adapter<ReasonsResponse> {
  /** This method is used to transform response object into T object. */
  public toResponse(item: ReasonsResponse): ReasonsResponse {
    const reasons: ReasonsResponse = new ReasonsResponse(
      item.lastReasonNotDelivered,
      item.lastReasonNotPicked,
      item.reasons
    );
    return reasons;
  }

  /** This method is used to transform T object into request object. */
  public toRequest(item: any): Reasons {
    const reasons: Reasons = new Reasons(
      item.clientId,
      item.reason,
      item.description,
      item.reasonType
    );
    return reasons;
  }
}

/**
 * Injectable
 */
@Injectable()
export class AssignAdapter implements Adapter<AssignedToMaster> {

  /** This method is used to transform response object into T object. */
  public toResponse(item: any): AssignedToMaster {
    const assignedToMaster: AssignedToMaster = new AssignedToMaster(
      item.userId,
      item.firstName + ' ' + item.lastName
    );
    return assignedToMaster;
  }
}
