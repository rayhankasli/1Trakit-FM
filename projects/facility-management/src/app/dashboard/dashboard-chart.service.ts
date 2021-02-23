/**
 * @author: Bikash Das
 * @description : This is a Service Class For Google chart which
 *  extends google chart service and calls google's inbuilt methods
 *  to form required charts
 */

import { Injectable, ElementRef } from '@angular/core';
import { GoogleChartsBaseService } from './google-chart.service';
declare var google: any;

@Injectable()
export class ChartService extends GoogleChartsBaseService {

  constructor() {
    super();
  }

  /**
   * This method is responsibe for building dount chart for copyit,bookit and 
   * fleet by taking required parameters
   * @param donutChart 
   * @param data 
   * @param options 
   */
  public buildDonutChart(donutChart: ElementRef<HTMLDivElement>, data: Object[], options: Object): void {
    const chartFunc: any = () => {
      return new google.visualization.PieChart(donutChart.nativeElement);
    };
    this.buildChart(data, chartFunc, options);
  }

  /**
   * This method is responsibe for building bar chart for copyit,bookit and 
   * fleet by taking required parameters
   * @param barChart 
   * @param data 
   * @param options 
   */
  public buildBarChart(barChart: ElementRef<HTMLDivElement>, data: Object[], options: any): void {
    const chartFunc: any = () => {
      return new google.visualization.ColumnChart(barChart.nativeElement);
    };
    this.buildChart(data, chartFunc, options);
  }

  /**
   * This method is responsibe for building combo chart for copyit,bookit and 
   * fleet by taking required parameters
   * @param barChart 
   * @param data 
   * @param options 
   */
  public buildComboChart(barChart: ElementRef<HTMLDivElement>, data: Object[], options: Object): void {
    const chartFunc: any = () => {
      return new google.visualization.ComboChart(barChart.nativeElement);
    };
    this.buildChart(data, chartFunc, options);
  }

}
