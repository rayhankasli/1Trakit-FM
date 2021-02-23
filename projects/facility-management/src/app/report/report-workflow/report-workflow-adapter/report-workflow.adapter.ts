/**
 * @author Enter Your Name Here.
 * @description This is adapter service use for transforming data base user requirement. 
 */

import { Injectable } from '@angular/core';
// -------------------------------------------- //
import { Adapter } from 'common-libs';
// -------------------------------------------- //
import { environment } from '../../../../environments/environment';
import { convertDateFormat, getLocaleDate } from '../../../core/utility/utility';
import { WorkflowReportDetail, WorkflowReportDetailResponse, WorkFlowReportGraph, WorkflowReportFilterRecord } from '../report-workflow.model';

@Injectable()
export class WorkflowReportGraphAdapter implements Adapter<WorkFlowReportGraph> {

    /** This method is used to transform response object into T object. */
    public toResponse(item: WorkFlowReportGraph): WorkFlowReportGraph {

        const workFlowReportGraph: WorkFlowReportGraph = new WorkFlowReportGraph();
        workFlowReportGraph.period = item.period;
        workFlowReportGraph.open = item.open;
        workFlowReportGraph.completed = item.completed;
        workFlowReportGraph.notCompleted = item.notCompleted;

        return workFlowReportGraph;

    }

    /** This method is used to transform T object into request object. */
    public toRequest(item: WorkFlowReportGraph): WorkFlowReportGraph {

        const workFlowReportGraph: WorkFlowReportGraph = new WorkFlowReportGraph();
        workFlowReportGraph.period = getLocaleDate(item.period);
        workFlowReportGraph.open = item.open;
        workFlowReportGraph.completed = item.completed;
        workFlowReportGraph.notCompleted = item.notCompleted;

        return workFlowReportGraph;
    }

}

@Injectable()
export class WorkflowReportListAdapter implements Adapter<WorkflowReportDetail> {

    /** This method is used to transform response object into T object. */
    public toResponse(response: WorkflowReportDetailResponse): WorkflowReportDetail {
        const workflowReportDetail: WorkflowReportDetail = new WorkflowReportDetail();

        workflowReportDetail.totalCount = response.totalCount;
        workflowReportDetail.workflowReportList = response.data.map(item => {
            item.dateTimeOfCompletion = item.dateTimeOfCompletion ? getLocaleDate(item.dateTimeOfCompletion) : null;
            item.pictures && item.pictures.map(pic => {
                pic.systemImageName = `${environment.base_host_url}WorkflowTaskImage/${pic.systemImageName}`;
                return pic;
            });
            return item;
        });

        return workflowReportDetail;
    }

    /** This method is used to transform T object into request object. */
    public toRequest(item: WorkflowReportDetailResponse): WorkflowReportDetail {

        const workflowReportDetail: WorkflowReportDetail = new WorkflowReportDetail();

        workflowReportDetail.totalCount = item.totalCount;
        workflowReportDetail.workflowReportList = item.data;

        return workflowReportDetail;
    }
}

@Injectable()
export class WorkflowReportFilterAdapter implements Adapter<WorkflowReportFilterRecord> {

    /** This method is used to transform T object into request object. */
    public toRequest(item: WorkflowReportFilterRecord): WorkflowReportFilterRecord {
        const taskReport: WorkflowReportFilterRecord = new WorkflowReportFilterRecord(
            item.clientId,
            convertDateFormat(item.startDate),
            convertDateFormat(item.endDate)
        );
        return taskReport;
    }
}


