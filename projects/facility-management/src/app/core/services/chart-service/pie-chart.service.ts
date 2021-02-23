import { Injectable, ElementRef } from '@angular/core';
import { Observable, Subject } from 'rxjs';
// ---------------------------------------------------- //


declare const google: any;

@Injectable()
export class PieChartService {

  /** GoogleChartRef Observable */
  public pieChartRef$: Observable<any>;

  /** GoogleChartRef Subject */
  private pieChartRef: Subject<any>;

  constructor() {
    this.pieChartRef = new Subject();
    this.pieChartRef$ = this.pieChartRef.asObservable();
  }

  /** Draw Pie Chart */
  public drawPieChart(chartContainerRef: ElementRef, customOptions, chartDataValue): any {

    google.charts.load('current', { 'packages': ['corechart'] });

    google.charts.setOnLoadCallback(() => {

      let pieChartValue = google.visualization.arrayToDataTable(chartDataValue);

      let pieChartOptions: any = { ...customOptions };

      let googleChartObj = new google.visualization.PieChart(chartContainerRef.nativeElement);

      googleChartObj.draw(pieChartValue, pieChartOptions);

      this.setPieChartObj(googleChartObj);
    });
  }

  /** Google Chart */
  private setPieChartObj(googleChartObj): void {
    this.pieChartRef.next(googleChartObj);
  }
}
