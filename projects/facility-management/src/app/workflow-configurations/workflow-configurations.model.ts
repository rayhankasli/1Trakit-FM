/**
 * @author Rayhan Kasli.
 * @description
 */
import { InjectionToken } from '@angular/core';
import { SortingOrder } from 'common-libs';
import { getLocaleTime } from '../core/utility/utility';

/** model class for Workflow */
export class Workflow {
  /** id  of Workflow */
  public workflowId: number;

  /** WorkflowName  of Workflow */
  public workflowName: string;

  /** office  of SlotsRequest */
  public officeId: number;

  /** office  of SlotsRequest */
  public officeName: string;

  /** office  of SlotsRequest */
  public officeNickName: string;

  /** WorkflowStartTime  of Workflow */
  public workflowStartTime: string;

  /** assignTo  of SlotsRequest */
  public assignedToId: number;

  /** assignTo  of SlotsRequest */
  public assignedTo: string;

  /** lastWorkFlowName */
  public lastWorkflowName: string;
  /** clientId */
  public clientId: number;

  /** assignTo  of SlotsRequest */
  public isActive: boolean;

  /** Determines whether editable is */
  public isEditable: boolean;
  /** Determines whether editable is */
  public isCreateNewCopy: boolean;
  /** Determines whether editable is */
  public isTaskCreated: boolean;

  /** arrangement sequence */
  public sequence?: number;

  constructor(
    workflowId?: number,
    WorkflowName?: string,
    officeId?: number,
    officeName?: string,
    officeNickName?: string,
    workflowStartTime?: string,
    assignedToId?: number,
    assignedTo?: string,
    clientId?: number,
    isActive?: boolean,
    isTaskCreated?: boolean,
    lastWorkflowName?: string,
    isEditable?: boolean,
    isCreateNewCopy?: boolean,
  ) {
    this.workflowId = workflowId;
    this.workflowName = WorkflowName;
    this.officeId = officeId;
    this.officeName = officeName;
    this.officeNickName = officeNickName;
    this.workflowStartTime = getLocaleTime(workflowStartTime);
    this.assignedToId = assignedToId;
    this.assignedTo = assignedTo;
    this.clientId = clientId;
    this.lastWorkflowName = lastWorkflowName;
    this.isTaskCreated = isTaskCreated;
    this.isActive = isActive;
    this.isEditable = isEditable;
    this.isCreateNewCopy = isCreateNewCopy;
  }

}
/** model class for WorkflowRequest */
export class WorkflowRequest {
  /** id  of WorkflowRequest */
  public workflowId: number;

  /** WorkflowName  of WorkflowRequest */
  public workflowName: string;

  /** office  of WorkflowRequest */
  public officeId: number;

  /** WorkflowStartTime  of WorkflowRequest */
  public workflowStartTime: string;

  /** assignTo  of WorkflowRequest */
  public assignedToId: number;

  /** clientId */
  public clientId: number;

  /** Determines whether isTaskCreated  */
  public isTaskCreated: boolean;


  constructor(
    workflowName?: string,
    officeId?: number,
    workflowStartTime?: string,
    assignedToId?: number,
    clientId?: number,
    isTaskCreated?: boolean

  ) {
    this.workflowName = workflowName;
    this.officeId = officeId;
    this.workflowStartTime = workflowStartTime;
    this.assignedToId = assignedToId;
    this.clientId = clientId;
    this.isTaskCreated = isTaskCreated;

  }
}
/** model class for WorkflowResponse */
export class WorkflowResponse {
  /** id  of WorkflowResponse */
  public lastWorkflowName: string;

  /** WorkflowName  of WorkflowResponse */
  public workflows: Workflow[];

  constructor(
    lastWorkFlowName?: string,
    workflows?: Workflow[]
  ) {
    this.lastWorkflowName = lastWorkFlowName;
    this.workflows = workflows;
  }
}
/** Model class for filterRecord. */

export class WorkflowFilterRecord {
  /** This property is used for filter record. */
  public workflowName?: string;
  /** office  of SlotsRequest */
  public officeId?: number;
  /** office  of SlotsRequest */
  public officeName?: string;
  /** This property is used for filter record. */
  public workflowStartTime?: string;
  /** assignTo  of SlotsRequest */
  public assignToId?: number;

  /** assignTo  of SlotsRequest */
  public assignTo?: string;
  /** assignTo  of SlotsRequest */
  public isActive?: boolean;
  /** clientId */
  public clientId?: number;
  constructor(
    isActive?: boolean,
    clientId?: number,
    officeId?: number,
    workflowStartTime?: string,
    assignToId?: number,

  ) {
    this.clientId = clientId;
    this.officeId = officeId;
    this.workflowStartTime = workflowStartTime;
    this.assignToId = assignToId;
    this.isActive = isActive;
  }
}

/** Status */
export class Status {
  /** assignTo  of SlotsRequest */
  public isActive?: boolean;
}

/**
 * Toggle status
 */
export class ToggleStatus {
  /** Id  of toggle status */
  public id: number;
  /** Status  of toggle status */
  public isActive: boolean;
}

export const WORKFLOW_FILTER: InjectionToken<WorkflowFilterRecord> = new InjectionToken<
  WorkflowFilterRecord
>('workflowFilter');
/** Model class for sortRecord. */
export class WorkflowSortRecord {
  /** This property is use for which type of sorting apply by user. */
  public sortBy: SortingOrder;
  /** This property is used for sort field . */
  public sortColumn: string;
}

export const WORKFLOW_SORT: InjectionToken<WorkflowSortRecord> = new InjectionToken<WorkflowSortRecord>('workflowSort');


/** model class for WorkflowTask */
export class WorkflowTask {
  /** task description */
  public description: string;
  /** floor */
  public floor: number;
  /** floorId */
  public floorId: number;
  /** floorRoomId */
  public floorRoomId: number;
  /** floorRoomName */
  public floorRoomName: string;
  /** isActive status */
  public isActive: boolean;
  /** isPictureRequired */
  public isPictureRequired: boolean;
  /** location */
  public location: string;
  /** nickName */
  public nickName: string;
  /** repeatsOn */
  public repeatsOn: RepeatsOn;;
  /** sequence no */
  public sequence: number;
  /** taskName */
  public taskName: string;
  /** workflow task id */
  public workflowTaskConfigId: number;
  /** idEditable  */
  public isEditable: boolean;
  /** workflow id */
  public workflowId: number;
  constructor(
    description?: string,
    floor?: number,
    floorId?: number,
    floorRoomId?: number,
    floorRoomName?: string,
    isActive?: boolean,
    isPictureRequired?: boolean,
    location?: string,
    nickName?: string,
    repeatsOn?: RepeatsOn,
    sequence?: number,
    taskName?: string,
    workFlowId?: number,
    workflowTaskConfigId?: number,
  ) {
    this.description = description;
    this.floor = floor;
    this.floorId = floorId;
    this.floorRoomId = floorRoomId;
    this.floorRoomName = floorRoomName;
    this.isActive = isActive;
    this.isPictureRequired = isPictureRequired;
    this.location = location;
    this.nickName = nickName;
    this.repeatsOn = repeatsOn;
    this.sequence = sequence;
    this.taskName = taskName;
    this.workflowId = workFlowId;
    this.workflowTaskConfigId = workflowTaskConfigId;
  }
}

/** workflow detail for request */
export class WorkflowTaskRequest {
  /** workflow task id */
  public workflowTaskConfigId?: number;
  /** workflow id */
  public workflowId: number;
  /** taskName */
  public taskName: string;
  /** sequence number */
  public sequence: number;
  /** floor Id */
  public floorId: number;
  /** floor Room id */
  public floorRoomId: number;
  /** task description */
  public description: string;
  /** repeatOn */
  public repeatsOn: RepeatsOn;
  /** isPictureRequired */
  public isPictureRequired: boolean;
  /** isActive status */
  public isActive: boolean;
  constructor(
    workflowId?: number,
    taskName?: string,
    sequence?: number,
    floorId?: number,
    floorRoomId?: number,
    description?: string,
    repeatsOn?: RepeatsOn,
    isPictureRequired?: boolean,
    isActive?: boolean,
  ) {
    this.workflowId = workflowId;
    this.taskName = taskName;
    this.sequence = sequence;
    this.floorId = floorId;
    this.floorRoomId = floorRoomId;
    this.description = description;
    this.repeatsOn = repeatsOn;
    this.isPictureRequired = isPictureRequired;
    this.isActive = isActive;
  }
}

/** Model class for filterRecord. */
export class WorkflowTaskFilterRecord {
  /** floor. */
  public floorId?: string;
  /** location. */
  public floorRoomId?: string;
  /** repeatsOn. */
  public repeatsOn?: string;

  constructor(
    floorId?: string,
    floorRoomId?: string,
    repeatsOn?: string,
  ) {
    this.floorId = floorId;
    this.floorRoomId = floorRoomId;
    this.repeatsOn = repeatsOn;
  }
}

export const WORKFLOWTASK_FILTER: InjectionToken<WorkflowTaskFilterRecord> = new InjectionToken<WorkflowTaskFilterRecord>('workflowtaskFilter');

/** Model class for sortRecord. */
export class WorkflowTaskSortRecord {
  /** This property is use for which type of sorting apply by user. */
  public sortBy: SortingOrder;
  /** This property is used for sort field . */
  public sortColumn: string;
}

export const WORKFLOWTASK_SORT: InjectionToken<WorkflowTaskSortRecord> = new InjectionToken<WorkflowTaskSortRecord>('workflowtaskSort');

/** floor details model */
export class Floor {
  /** floor Id */
  public floorId: number;
  /** floor */
  public floor: string;
  /** floor nickName */
  public nickName: string;
}
/** room detail model */
export class Room {
  /** floor room id */
  public floorRoomId: number;
  /** floor name */
  public name: string;
  /** room location */
  public location: string;
}

/** repeats On model */
export class RepeatsOn {
  public repeatType: number;
  /** repeats */
  public repeats: number;
  /** every for request */
  public every: number;
  /** list of days */
  public repeatsOnDay: number[] | any[];
}

/** WeekDays */
export class RepeatOn {
  /** Id  of assigner */
  public weekDayId: number;
  /** Assigner name of assigner */
  public weekDay: string;

  constructor(weekDayId: number, weekDay: string) {
    this.weekDayId = weekDayId;
    this.weekDay = weekDay;
  }
}
/** rearrange workflowTask */
export class RearrangeTask {
  /** current index of record */
  public currentIndex: number;
  /** workflow task id */
  public workflowTaskId: number;
  constructor(currentIndex: number, workflowTaskId: number) {
    this.currentIndex = currentIndex;
    this.workflowTaskId = workflowTaskId;
  }
}
