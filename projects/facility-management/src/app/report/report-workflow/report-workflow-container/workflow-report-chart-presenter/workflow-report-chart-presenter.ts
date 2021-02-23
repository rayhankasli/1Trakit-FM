import { Injectable, ElementRef, NgZone } from '@angular/core';
import { DatePipe } from '@angular/common';
// -------------------------------------------------- //
import { WorkFlowReportGraph } from '../../report-workflow.model';
import { roundToN, getMaximumFrom } from '../../../../core/utility/utility';
import { StackedColumnChartService } from '../../../../core/services/chart-service/stacked-column-chart.service';
import { REPORT_VAXIS_TITLE } from '../../../../core/model/chart-data.model';
import { stackedChartOption } from '../../../../shared/utility/utility';

@Injectable()
export class WorkflowReportChartPresenter {

  /* max value for the Y axis */
  private maxY: number;

  constructor(
    private ngZone: NgZone,
    private stackedColumnChartService: StackedColumnChartService,
    private datePipe: DatePipe
  ) {
    this.maxY = 10;
  }

  /**
   *  Prepare data for graph
   * @param workFlowReportGraph Get the list of workflow
   * @param graphType Get the type of workflow report date or monthe wise
   */
  public prepareData(workFlowReportGraph: WorkFlowReportGraph[], graphType: number): any {
    let workFlowGraphList: any = [];
    const graphHeader: string[] = ['WorkFlow', 'Open', 'Completed', 'Not Completed'];
    workFlowGraphList.push(graphHeader);

    if (workFlowReportGraph.length <= 0) {
      workFlowReportGraph =
        [new WorkFlowReportGraph(graphType === 1 ? new Date() : this.datePipe.transform(new Date(), 'MMM'), 0, 0, 0)]
    }
    workFlowReportGraph.forEach((workFlow: WorkFlowReportGraph) => {
      let graphData: any = [];
      if (graphType === 1 && Date.parse(workFlow.period as string)) { workFlow.period = this.datePipe.transform(workFlow.period, 'M/d') };
      graphData = [workFlow.period, workFlow.open, workFlow.completed, workFlow.notCompleted];
      workFlowGraphList.push(graphData);
    });

    /** Get the max value for the Y axis */
    this.maxY = roundToN(workFlowReportGraph && getMaximumFrom(workFlowReportGraph), 20);
    return workFlowGraphList;
  }

  /**
   *  Get the chart option 
   * @param graphType Get the type of workflow report date or monthe wise
   * @param isZoom Getthe weather zoom or not
   */
  public chartOptions(graphType?: number, isZoom?: boolean): Object {

    let chartOptions: any = stackedChartOption(
      graphType, REPORT_VAXIS_TITLE.Workflow_Report, this.maxY, isZoom);

    chartOptions.series = {
      0: { color: '#22a8ee', targetAxisIndex: 0 },
      1: { color: '#763fea', targetAxisIndex: 1 },
      2: { color: '#fa3a4b', targetAxisIndex: 1 }
    };

    return chartOptions;
  }

  /**
   * Draw workflow chart
   * @param chartContainerRef Get the refrence for chart container
   * @param workFlowGraphData Get the workflow list
   * @param chartOptions Get the chart options
   */
  public drawChart(chartContainerRef: ElementRef, workFlowGraphData: any[], chartOptions: any): void {

    this.ngZone.runOutsideAngular(() => {
      this.stackedColumnChartService.drawStackedChart(chartContainerRef, chartOptions, workFlowGraphData);
    });
  }
}
