
/**
 * @author Rayhan Kasli.
 * @description
 */
import { InjectionToken } from '@angular/core';
// ------------------------------------------- //
import { SortingOrder } from 'common-libs';
// ------------------------------------------- //
import { Pictures } from '../../core/model/common.model';

/** model class for TaskReport */
export class TaskReport {

    /** taskName  of TaskReport */
    public taskName: string;

    /** assignedTo  of TaskReport */
    public assignedTo: string;

    /** assignedTo  of TaskReport */
    public assignedToId: number;

    /** createdBy  of TaskReport */
    public createdBy: string;

    /** location  of TaskReport */
    public location: string;

    /** dateTimeOfCompletion  of TaskReport */
    public dateTimeOfCompletion: string | Date;

    /** timeliness  of TaskReport */
    public timeliness: string;

    /** pictures  of TaskReport */
    public pictures: Pictures[];

    /** status  of TaskReport */
    public status: string;

    /** reasonNotCompleted  of TaskReport */
    public reasonNotCompleted: string;

    /** comments  of TaskReport */
    public comments: string;

    /** priority for TaskReport */
    public priority: string;

    constructor(
        taskName?: string,
        assignedTo?: string,
        assignedToId?: number,
        createdBy?: string,
        location?: string,
        dateTimeOfCompletion?: string | Date,
        timeliness?: string,
        pictures?: Pictures[],
        status?: string,
        reasonNotCompleted?: string,
        comments?: string,
        priority?: string,
    ) {
        this.taskName = taskName;
        this.assignedTo = assignedTo;
        this.assignedToId = assignedToId;
        this.createdBy = createdBy;
        this.location = location;
        this.dateTimeOfCompletion = dateTimeOfCompletion;
        this.timeliness = timeliness;
        this.pictures = pictures;
        this.status = status;
        this.reasonNotCompleted = reasonNotCompleted;
        this.comments = comments;
        this.priority = priority;
    }
}


/** TaskReportFilterRecord */
export class TaskReportFilterRecord {
    /** ClientID */
    public clientId?: number;
    /** Start Date */
    public startDate?: Date;
    /** end Date */
    public endDate?: Date;

    constructor(
        clientId?: number,
        startDate?: Date,
        endDate?: Date
    ) {
        this.clientId = clientId;
        this.startDate = startDate;
        this.endDate = endDate;
    }
}

/** TaskChart */
export class TaskReportChart {
    public new: number;
    public completed: number;
    public period: string | Date;

    constructor(
        period?: string | Date,
        newTask?: number,
        completed?: number
    ) {
        this.period = period;
        this.new = newTask;
        this.completed = completed;
    }
}
/** BacklogChart */
export class BacklogChart {
    public backlog: number;
    public period: string | Date;

    constructor(
        period?: string | Date,
        backlog?: number
    ) {
        this.period = period;
        this.backlog = backlog;
    }
}



/** Model class for sortRecord. */
export class TaskReportSortRecord {
    /** This property is use for which type of sorting apply by user. */
    public sortBy: SortingOrder;
    /** This property is used for sort field . */
    public sortColumn: string;
}

export const TASKREPORT_SORT: InjectionToken<TaskReportSortRecord> = new InjectionToken<TaskReportSortRecord>('taskReportSort');

/** BARS_PER_WINDOW */
export enum BARS_PER_WINDOW {
    Bar_Max = 7,
    Bar_Min = 0
}

/** BARS_PER_WINDOW */
export enum CHART_TYPE {
    Task = 'task',
    Backlog = 'backlog'
}

/** Graph */
export interface ChartObject {
    clientId: number
    year?: number
}