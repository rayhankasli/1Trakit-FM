import { Injectable, ElementRef } from '@angular/core';
import { Observable, Subject } from 'rxjs';
// ---------------------------------------------------- //


declare const google: any;

@Injectable()
export class LineChartService {

  /** GoogleChartRef Observable */
  public lineChartRef$: Observable<any>;

  /** GoogleChartRef Subject */
  private lineChartRef: Subject<any>;

  constructor() {
    this.lineChartRef = new Subject();
    this.lineChartRef$ = this.lineChartRef.asObservable();
  }

  /** Draw Line chart */
  public drawLineChart(chartContainerRef: ElementRef, customOptions, chartDataValue): any {

    google.charts.load('current', {
      'packages': ['corechart']
    });

    google.charts.setOnLoadCallback(() => {

      let lineChartValue = google.visualization.arrayToDataTable(chartDataValue);

      let lineChartOptions: any = { ...customOptions };

      let googleChartObj: any = new google.visualization.LineChart(chartContainerRef.nativeElement);
      googleChartObj.draw(lineChartValue, lineChartOptions);

      this.setLineChartObj(googleChartObj);
    });
  }

  /** Google line Chart */
  private setLineChartObj(googleChartObj): void {
    this.lineChartRef.next(googleChartObj);
  }
}
