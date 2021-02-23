import { Injectable, ElementRef } from '@angular/core';
import { Observable, Subject } from 'rxjs';
// ---------------------------------------------------- //


declare const google: any;

@Injectable()
export class ColumnChartService {

  /** GoogleChartRef Observable */
  public columnChartRef$: Observable<any>;

  /** GoogleChartRef Subject */
  private columnChartRef: Subject<any>;

  constructor() {
    this.columnChartRef = new Subject();
    this.columnChartRef$ = this.columnChartRef.asObservable();
  }

  /** Draw Column Chart */
  public drawColumnChart(chartContainerRef: ElementRef, customOptions, chartDataValue): any {

    google.charts.load('current', {
      'packages': ['corechart']
    });

    google.charts.setOnLoadCallback(() => {

      let columnChartValue = google.visualization.arrayToDataTable(chartDataValue);

      let columnChartOptions: any = { ...customOptions };

      let googleChartObj = new google.visualization.ColumnChart(chartContainerRef.nativeElement);
      googleChartObj.draw(columnChartValue, columnChartOptions);

      this.setColumnChartObj(googleChartObj);
    });
  }

  /** Google Chart */
  private setColumnChartObj(googleChartObj): void {
    this.columnChartRef.next(googleChartObj);
  }
}
