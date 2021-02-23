/**
 * @author Rayhan Kasli
 */
import { DatePipe } from '@angular/common';
import { ElementRef, Injectable, NgZone } from '@angular/core';
// -------------------------------------------------- //
import { ColumnChartService } from '../../../../core/services/chart-service/column-chart.service';
import { LineChartService } from '../../../../core/services/chart-service/line-chart.service';
import { CHART_TYPE } from '../../report-task.model';

declare const google: any;

@Injectable()
export class TaskReportChartPresenter {

  constructor(
    private ngZone: NgZone,
    private lineChartService: LineChartService,
    private columnChartService: ColumnChartService,
    private datePipe: DatePipe,
  ) { }

  /** Draw Chart */
  public drawStackChart(chartContainerRef: ElementRef, noOfTask: any[], chartOptions?: any): void {
    this.ngZone.runOutsideAngular(() => {
      if (noOfTask.length === 0) {
        noOfTask = [{ completed: 0, new: 0, period: new Date() }];
        chartOptions.vAxis['viewWindow'] = { min: 0, max: 10 };
      } else {
        chartOptions.vAxis['scaleType'] = 'mirrorLog';
        // can set viewWindow max here by utility.getMaximumFrom & utility.roundToN
      }
      let data: any = this.chartData(noOfTask, CHART_TYPE.Task);
      this.columnChartService.drawColumnChart(chartContainerRef, chartOptions, data);
    });
  }
  /** stackChartOption */
  public stackChartOption(isZoom?: boolean): Object {
    let stackChartOptions: any = {
      height: 350,
      width: '100%',
      maxWidth: '100%',
      legend: {
        position: 'none',
      },
      bar: {
        groupWidth: 20
      },
      fontName: 'Poppins',
      fontSize: 13,
      chartArea: {
        height: '70%',
        width: '80%',
        left: 60
      },
      hAxis: {
        title: 'Date',
        titleTextStyle: {
          bold: true,
          italic: false
        },
        maxAlternation: 1,
        maxTextLines: 2,
        showTextEvery: 1,
        viewWindowMode: 'maximized',
        viewWindow: { min: 0, max: 7 },
      },
      vAxis: {
        title: 'No. of Tasks',
        titleTextStyle: {
          bold: true,
          italic: false
        },
        viewWindow: { min: 0 },
        format: '0',
      },
      series: {
        0: { color: '#22a8ee' },
        1: { color: '#FF8C00' },
      },


    };
    return stackChartOptions;
  }

  /** drawLineChart */
  public drawLineChart(chartContainerRef: ElementRef, noOfTask: any[], chartOptions?: any): void {
    this.ngZone.runOutsideAngular(() => {
      if (noOfTask.length === 0) {
        noOfTask = [{ backlog: 0, period: new Date() }]
        chartOptions.vAxis['viewWindow'] = { min: 0, max: 10 };
      } else {
        chartOptions.vAxis['scaleType'] = 'mirrorLog';
        // can set viewWindow max here by utility.getMaximumFrom & utility.roundToN
      }
      let data: any = this.chartData(noOfTask, CHART_TYPE.Backlog);
      this.lineChartService.drawLineChart(chartContainerRef, chartOptions, data);
    });
  }

  /** chartLineOptions */
  public chartLineOptions(): Object {
    let chartLineOptions: any = {
      height: 350,
      width: '100%',
      maxWidth: '100%',
      pointSize: 5,
      legend: {
        position: 'none',
        // maxLines: 2,
      },
      fontName: 'Poppins',
      fontSize: 13,
      chartArea: {
        height: '70%',
        width: '100%',
        left: 60
      },
      hAxis: {
        title: 'Date',
        titleTextStyle: {
          bold: true,
          italic: false,
        },
        maxAlternation: 1,
        maxTextLines: 2,
        showTextEvery: 1,
        viewWindowMode: 'maximized',
        viewWindow: { min: 0, max: 7 },
      },
      vAxis: {
        title: 'No. of Tasks',
        titleTextStyle: {
          bold: true,
          italic: false,
        },
        viewWindow: { min: 0 },
        // minValue: 0,
        format: '0',
      },
      series: {
        0: { color: '#22a8ee' },
      },

    };
    return chartLineOptions;
  }

  /** requestFullscreen  */
  public requestFullscreen(element: any): any {
    let methodToBeInvoked: any =
      element.requestFullscreen ||
      element['webkitRequestFullScreen'] ||
      element['mozRequestFullscreen'] ||
      element['msRequestFullscreen'];

    return methodToBeInvoked;
  }

  /** taskChartData */
  private chartData(value: any[], chartType: string): any {
    let chartData: string[][];
    let heading: string[] = [];
    if (chartType === CHART_TYPE.Task) {
      heading = ['Period', 'New', 'Completed'];
    } else {
      heading = ['Period', 'Backlog'];
    }
    chartData = [heading];
    value.forEach((res: any) => {
      let data: any[] = [];
      if (chartType === CHART_TYPE.Task) {
        data = [this.datePipe.transform(res.period, 'M/d'), res.new, res.completed];
      } else {
        data = [this.datePipe.transform(res.period, 'M/d'), res.backlog];
      }
      chartData.push(data)
    });
    return chartData;
  }
}
