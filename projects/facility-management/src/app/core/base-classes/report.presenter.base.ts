import { NgZone, OnDestroy, ElementRef } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
// -------------------------------------------------------- //
import { ColumnChartService } from '../services/chart-service/column-chart.service';
import { dataForChart } from '../utility/report.utility';
import { getMaximumFrom } from '../utility/utility';

/**
 * Report Presenter base
 */
export class ReportPresenterBase implements OnDestroy {

    /** Table Heading */
    public headings: string[];

    /** isScaleData */
    public isScaleData: boolean;

    /** ChartData */
    public chartData: any[];

    /** Google Chart Obj */
    public googleChartObj: any;

    /** destroy */
    public destroy: Subject<void>;

    constructor(
        public ngZone?: NgZone,
        public columnChartService?: ColumnChartService,
    ) {
        this.destroy = new Subject();
    }

    public ngOnDestroy(): void {
        this.destroy.next();
        this.destroy.complete();
    }

    /** Get Table Header */
    public tableHeader(arrayList: any[]): string[] {
        const years: string[] = arrayList[0].data.map((res: any) => res.year);
        this.headings = ['Month', ...years];

        return this.headings;
    }

    /** Set Chart Data */
    public preparChartData(arrayList: any[]): void {
        this.ngZone.runOutsideAngular(() => {

            let filterList: any[];
            filterList = arrayList.filter((value: any) => !value.onlyForTable);

            this.chartData = dataForChart(filterList);

            this.isScaleData = this.chartData && getMaximumFrom(this.chartData, 0) ? true : false;
        });
    }

    /** Draw Column Chart */
    public drawColumnChart(chartContainerRef: ElementRef, chartOptions: any, chartData: any): void {
        this.ngZone.runOutsideAngular(() => {

            this.columnChartService.drawColumnChart(chartContainerRef, chartOptions, chartData);

            this.columnChartService.columnChartRef$.pipe(takeUntil(this.destroy)).subscribe((googleChartObj: any) => {
                this.googleChartObj = googleChartObj;
            });
        });
    }
}