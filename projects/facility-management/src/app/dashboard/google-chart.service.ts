/**
 * @author: Bikash Das
 * @description:  google chart base service which provide packages to load.
 */

import { Injectable } from '@angular/core';

declare var google: any;

@Injectable()
/** GoogleChartsBaseService */
export class GoogleChartsBaseService {
  constructor() {
    google.charts.load('current', { packages: ['corechart'] });
  }
  /**
   * buildChart encapsulate the callback definition,
   * the data mapping (Array to DataTable),
   * and the setOnLoadCallback method call
   * @param data
   * @param chartFunc
   * @param options
   */
  protected buildChart(data: Object[], chartFunc: any, options: any): void {
    const func: any = (chartFunc, options) => {
      const datatable: any = google.visualization.arrayToDataTable(data);
      chartFunc().draw(datatable, options);
    };
    const callback = () => func(chartFunc, options);
    google.charts.setOnLoadCallback(callback);
  }
}
