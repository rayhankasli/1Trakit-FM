import { Injectable, ElementRef } from '@angular/core';
// ---------------------------------------------------- //


declare const google: any;
@Injectable()
export class StackedColumnChartService {

    constructor() { }

    /** Draw stacked Chart */
    public drawStackedChart(chartContainerRef: ElementRef, customOptions, chartDataValue): any {

        google.charts.load('current', {
            'packages': ['bar']
        });

        google.charts.setOnLoadCallback(() => {

            let stackedChartValue = google.visualization.arrayToDataTable(chartDataValue);

            let stackedChartOptions: any = { ...customOptions };

            let googleChartObj = new google.charts.Bar(chartContainerRef.nativeElement);
            googleChartObj.draw(stackedChartValue, google.charts.Bar.convertOptions(stackedChartOptions));

        });
    }

}
