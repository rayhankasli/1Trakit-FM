

/**
 * @author Rayhan Kasli.
 * @description This is adapter service use for transforming data base user requirement. 
 */

import { Injectable } from '@angular/core';
// -------------------------------------------- //
import { Adapter } from 'common-libs';
// -------------------------------------------- //
import { environment } from '../../../../environments/environment';
import { Pictures } from '../../../core/model/common.model';
import { convertDateFormat, getLocaleDate } from '../../../core/utility/utility';
import { BacklogChart, TaskReport, TaskReportChart, TaskReportFilterRecord } from '../report-task.model';

@Injectable()
export class TaskReportAdapter implements Adapter<TaskReport> {

    /** This method is used to transform response object into T object. */
    public toResponse(item: TaskReport): TaskReport {
        const taskReport: TaskReport = new TaskReport(
            item.taskName,
            item.assignedTo,
            item.assignedToId,
            item.createdBy,
            item.location,
            item.dateTimeOfCompletion ? getLocaleDate(item.dateTimeOfCompletion) : null,
            item.timeliness,
            this.getPictures(item.pictures),
            item.status,
            item.reasonNotCompleted,
            item.comments,
            item.priority
        );
        return taskReport;
    }

    /** getPictures  */
    private getPictures(picture: Pictures[]): Pictures[] {
        let pictures: Pictures[] = [];
        picture.forEach((pic: Pictures) => {
            let pictureData: Pictures = new Pictures();
            pictureData.actualImageName = pic.actualImageName;
            pictureData.imageId = pic.imageId;
            pictureData.systemImageName = `${environment.base_host_url}AdhocTaskImage/${pic.systemImageName}`
            pictures.push(pictureData);
        });
        return pictures;
    }
}

@Injectable()
export class TaskReportFilterAdapter implements Adapter<TaskReportFilterRecord> {

    /** This method is used to transform T object into request object. */
    public toRequest(item: TaskReportFilterRecord): TaskReportFilterRecord {
        const taskReport: TaskReportFilterRecord = new TaskReportFilterRecord();
        taskReport.clientId = item.clientId;
        taskReport.startDate = convertDateFormat(item.startDate);
        taskReport.endDate = convertDateFormat(item.endDate);
        return taskReport;
    }
}

@Injectable()
export class TaskReportChartAdapter implements Adapter<TaskReportChart> {

    /** This method is used to transform response object into T object. */
    public toResponse(item: TaskReportChart): TaskReportChart {
        const taskReportChart: TaskReportChart = new TaskReportChart(
            item.period,
            item.new,
            item.completed
        );
        return taskReportChart;
    }
}
@Injectable()
export class BacklogChartAdapter implements Adapter<BacklogChart> {

    /** This method is used to transform response object into T object. */
    public toResponse(item: BacklogChart): BacklogChart {
        const backlogChart: BacklogChart = new BacklogChart(
            item.period,
            item.backlog
        );
        return backlogChart;
    }
}
