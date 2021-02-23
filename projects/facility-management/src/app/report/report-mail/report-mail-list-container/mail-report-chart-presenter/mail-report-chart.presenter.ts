import { DatePipe } from '@angular/common';
import { ElementRef, Injectable, NgZone } from '@angular/core';
// -------------------------------------------------------------- //
import { StackedColumnChartService } from '../../../../core/services/chart-service/stacked-column-chart.service';
import { roundToN, getMaximumFrom } from '../../../../core/utility/utility';
import { REPORT_VAXIS_TITLE } from '../../../../core/model/chart-data.model';
import { stackedChartOption } from '../../../../shared/utility/utility';
import { MailChartModel } from '../../report-mail.model';

/** Injectable presenter */
@Injectable()
export class MailReportChartPresenter {

  /* max value for the Y axis */
  private maxY: number;

  constructor(
    private datePipe: DatePipe,
    private stackedColumnChartService: StackedColumnChartService,
    private ngZone: NgZone
  ) { }

  /**
   *  Prepare data for graph
   * @param workFlowReportGraph Get the list of mail
   * @param graphType Get the type of mail report date or monthe wise
   */
  public prepareData(data: MailChartModel[], graphType: number): any {
    const graphHeader: string[] = ['WorkFlow', 'Open Packages', 'Delivered', 'Attempted'];
    let graphArray: any = [];
    graphArray.push(graphHeader);

    /** add default data with 0 values if not available */

    if (!data.length) { data = [new MailChartModel(0, 0, 0, graphType === 1 ? new Date() : this.datePipe.transform(new Date(), 'MMM'))] }
    data.forEach((element: MailChartModel) => {
      let graphData: any = [];
      /** convert x-axis label based on selected graphType */
      if (graphType === 1 && Date.parse(element.period as string)) { element.period = this.datePipe.transform(element.period, 'M/d') };
      graphData = [element.period, element.open, element.delivered, element.attempted];
      graphArray.push(graphData);
    });

    /** get the max value for the Y axis */
    this.maxY = roundToN(data && getMaximumFrom(data));
    return graphArray;
  }

  /**
   *  Get the chart option 
   * @param statusOption Get the type of mail report date or monthe wise
   * @param isZoom Getthe weather zoom or not
   */
  public mailChartOption(statusOption: number, isZoom?: boolean): Object {

    let mailChartOptions: any = stackedChartOption(
      statusOption, REPORT_VAXIS_TITLE.Mail_Report, this.maxY, isZoom);

    mailChartOptions.series = {
      0: { color: '#2ec740', targetAxisIndex: 0 },
      1: { color: '#22a8ee', targetAxisIndex: 1 },
      2: { color: '#ff8f2b', targetAxisIndex: 1 }
    };

    return mailChartOptions;
  }

  /**
   * Draw Mail chart
   * @param chartContainerRef Get the refrence for chart container
   * @param customOptions Get the chart options
   * @param chartDataValue Get the workflow list
   */
  public drawStackChart(chartContainerRef: ElementRef, customOptions: any, chartDataValue: any): any {

    this.ngZone.runOutsideAngular(() => {
      this.stackedColumnChartService.drawStackedChart(chartContainerRef, customOptions, chartDataValue);
    })
  }
}
