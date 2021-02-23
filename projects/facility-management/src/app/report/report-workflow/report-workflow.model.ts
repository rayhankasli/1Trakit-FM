
/**
 * @author Enter Your Name Here.
 * @description
 */
import { InjectionToken } from '@angular/core';
// ----------------------------------------------------------- //
import { SortingOrder } from 'common-libs';
// ----------------------------------------------------------- //
import { Pictures } from '../../core/model/common.model';

/** WorkFlow Graph Detail */
export class WorkFlowReportGraph {
    /** period */
    public period?: Date | string;

    /** Open */
    public open?: number;

    /** completed */
    public completed?: number;

    /** notCompleted */
    public notCompleted?: number;

    constructor(
        period?: Date | string,
        open?: number,
        completed?: number,
        notCompleted?: number
    ) {
        this.period = period;
        this.open = open;
        this.completed = completed;
        this.notCompleted = notCompleted;
    }
}

/** Model Class for Work flow report Deatils */
export class WorkflowReportDetailResponse {
    /** totalCount */
    public totalCount?: number;
    /** workflowReportList */
    public data?: WorkflowReportList[];

    constructor(
        totalCount?: number,
        data?: WorkflowReportList[]
    ) {
        this.totalCount = totalCount;
        this.data = data;
    }
}

/** Model Class for Work flow report Deatils */
export class WorkflowReportDetail {
    /** totalCount */
    public totalCount?: number;
    /** workflowReportList */
    public workflowReportList?: WorkflowReportList[];

    constructor(
        totalCount?: number,
        workflowReportList?: WorkflowReportList[]
    ) {
        this.totalCount = totalCount;
        this.workflowReportList = workflowReportList;
    }
}

/** Model class for WorkflowReport */
export class WorkflowReportList {

    /** taskName  of WorkflowReport */
    public taskName: string;

    /** workflowName */
    public workflowName: string;

    /** assignedTo  of WorkflowReport */
    public assignedTo: string;

    /** assignedToId */
    public assignedToId: number;

    /** location  of WorkflowReport */
    public location: string;

    /** dateTimeOfCompletion  of WorkflowReport */
    public dateTimeOfCompletion: string | Date;

    /** status  of WorkflowReport */
    public status: string;

    /** pictures  of WorkflowReport */
    public pictures: Pictures[];

    /** reasonNotCompleted  of WorkflowReport */
    public reasonNotCompleted: string;

    /** comments  of WorkflowReport */
    public comments: string;

    constructor(
        taskName?: string,
        workflowName?: string,
        assignedTo?: string,
        assignedToId?: number,
        location?: string,
        dateTimeOfCompletion?: string | Date,
        status?: string,
        pictures?: Pictures[],
        reasonNotCompleted?: string,
        comments?: string,
    ) {
        this.taskName = taskName;
        this.workflowName = workflowName;
        this.assignedTo = assignedTo;
        this.assignedToId = assignedToId;
        this.location = location;
        this.dateTimeOfCompletion = dateTimeOfCompletion;
        this.status = status;
        this.pictures = pictures || [];
        this.reasonNotCompleted = reasonNotCompleted;
        this.comments = comments;
    }
}


/** ChartType */
export class ChartType {
    public statusKey: string
    public statusValue: number
}

/** Chart Option */
export const CHART_TYPE_OPTION: ChartType[] = [
    {
        statusKey: 'Daily',
        statusValue: 1
    },
    {
        statusKey: 'Monthly',
        statusValue: 2
    }
]

/** Graph */
export interface ChartObject {
    clientId: number
    graphCategory: number,
    year?: number
}


/** FilterRecord */
export class WorkflowReportFilterRecord {
    /** ClientID */
    public clientId?: number;
    /** Start Date */
    public startDate?: Date | string;
    /** end Date */
    public endDate?: Date | string;

    constructor(
        clientId?: number,
        startDate?: Date | string,
        endDate?: Date | string
    ) {
        this.clientId = clientId;
        this.startDate = startDate;
        this.endDate = endDate;
    }
}


/** Model class for sortRecord. */
export class WorkflowReportSortRecord {
    /** This property is use for which type of sorting apply by user. */
    public sortBy: SortingOrder;
    /** This property is used for sort field . */
    public sortColumn: string;
}

export const WORKFLOWREPORT_SORT: InjectionToken<WorkflowReportSortRecord> = new InjectionToken<WorkflowReportSortRecord>('workflowReportSort');

