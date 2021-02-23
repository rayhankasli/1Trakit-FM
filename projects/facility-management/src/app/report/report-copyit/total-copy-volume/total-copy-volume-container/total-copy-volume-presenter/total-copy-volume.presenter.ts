/** 
 * @author Shahbaz Shaikh.
 * @description TotalCopyVolumePresenter service for TotalCopyVolumePresentationComponent component.
 */

import { Injectable, ElementRef, OnDestroy, NgZone } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
// ------------------------------------------------ //
import { ReportPresenterBase } from '../../../../../core/base-classes/report.presenter.base';
import { ReportType } from '../../../../../core/model/chart-data.model';
import { ColumnChartService } from '../../../../../core/services/chart-service/column-chart.service';
import { PieChartService } from '../../../../../core/services/chart-service/pie-chart.service';
import { GeneratePdfService } from '../../../../../core/services/generate-pdf-service/generate-pdf.service';
import { dataForJsPDF } from '../../../../../core/utility/report.utility';
import { AmountConverterService } from '../../../../../core/services/amount-converter.service';
import { TotalCopyVolumeResponse } from '../../total-copy-volume.model';
import { chartOptions } from '../../../utility';
import { REPORT_VAXIS_TITLE } from '../../../report-copyit.model';

@Injectable()
export class TotalCopyVolumePresenter extends ReportPresenterBase implements OnDestroy {

    /** destroy */
    public destroy: Subject<void>;

    /** Pie Chart data */
    private avgYTDComparison: any;

    /** Pie Chart Obj */
    private totalVolumePieChartObj: any;

    constructor(
        public ngZone: NgZone,
        public columnChartService: ColumnChartService,
        private datePipe: DatePipe,
        private pieChartService: PieChartService,
        private generatePDFService: GeneratePdfService,
        private amountConverterService: AmountConverterService
    ) {
        super(ngZone, columnChartService)
        this.destroy = new Subject();
    }

    public ngOnDestroy(): void {
        this.destroy.next();
        this.destroy.complete();
    }

    /**
     * Get Table Header 
     * @param totalCopyVolume Get the list of total copy Volume
     */
    public getTableHeader(totalCopyVolume: TotalCopyVolumeResponse): string[] {

        this.tableHeader(totalCopyVolume.period);
        return this.headings;
    }

    /**
     * Prepared Chart Data for column chart and pie chart
     * @param totalCopyVolume Get the list of total copy Volume
     */
    public setChartData(totalCopyVolume: TotalCopyVolumeResponse): void {
        this.ngZone.runOutsideAngular(() => {

            this.preparChartData(totalCopyVolume.period);

            this.avgYTDComparison = [
                ['Title', 'YTD COMPARISON'],
                ['Color Total', totalCopyVolume.avgColorRequest],
                ['B&W Total', totalCopyVolume.avgBwRequest],
                ['Scan Total', totalCopyVolume.avgScanRequest]
            ];
        });
    }

    /**
     * Draw Total Copy Volume Chart
     * @param chartContainerRef Get the refrence for chart container 
     */
    public drawChart(chartContainerRef: ElementRef): void {
        this.ngZone.runOutsideAngular(() => {

            let options: any = chartOptions(REPORT_VAXIS_TITLE.Total_Volume);

            if (this.isScaleData) {
                options.vAxis['scaleType'] = 'mirrorLog';
            } else {
                options.vAxis['viewWindow'] = { min: 0, max: 100 };
            }

            this.drawColumnChart(chartContainerRef, options, this.chartData);
        });

    }

    /**
     * Draw Total Copy Volume Pie Chart
     * @param pieChartContainer Get the refrence for chart container 
     */
    public drawPieChart(pieChartContainer: ElementRef): void {
        this.ngZone.runOutsideAngular(() => {

            let chartOptions: any = {
                // title: 'TOTAL COPY VOLUME',
                // curveType: 'function',
                width: 500,
                height: 250,
                chartArea: {
                    width: '80%',
                    height: '80%',
                },
                fontName: 'Poppins',
                fontSize: 13,
                legend: {
                    position: 'right',
                    alignment: 'center',
                    maxLines: 4,
                },
                slices: {
                    0: { color: '#5b616d' },
                    1: { color: '#DA2028' },
                    2: { color: '#c4c6d1' }
                }
            };

            this.pieChartService.drawPieChart(pieChartContainer, chartOptions, this.avgYTDComparison);
        });

        this.pieChartService.pieChartRef$.pipe(takeUntil(this.destroy)).subscribe((totalVolumePieChartObj: any) => {
            this.totalVolumePieChartObj = totalVolumePieChartObj;
        });

    }

    /** Set Undefine for pie chart object for export report */
    public setPieChartNoData(): void {
        this.totalVolumePieChartObj = undefined;
    }

    /**
     * Export PDF total copy Volume 
     * @param totalCopyVolumeList Get the list of total copy Volume
     * @param clientName Get the client name
     */
    public exportAsPDF(totalCopyVolumeList: TotalCopyVolumeResponse, clientName: string): void {

        this.ngZone.runOutsideAngular(() => {

            let totalCopyVolumeData: any = this.amountConverterService.addCommaSeparate(totalCopyVolumeList.period);
            let jsPDFData: any = dataForJsPDF(totalCopyVolumeData);

            let tableHeaderText: string = 'Total Copy Volume';
            let dateString: string = this.datePipe.transform(new Date(), 'y-MM-d-h_mm_ss');
            let pdfName: string = 'report-copy-center-volume-' + dateString + '.pdf';

            if (this.googleChartObj || this.totalVolumePieChartObj) {
                this.generatePDFService.exportAsPDF(
                    tableHeaderText, pdfName, this.googleChartObj, jsPDFData, clientName,
                    ReportType.copyIt, this.totalVolumePieChartObj, true);
            }
        });
    }
}