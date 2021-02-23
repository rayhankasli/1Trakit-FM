/** 
 * @author Shahbaz Shaikh.
 * @description TotalCopyJobsPresenter service for TotalCopyJobsPresentationComponent component.
 */

import { Injectable, ElementRef, NgZone } from '@angular/core';
import { DatePipe } from '@angular/common';
// ------------------------------------------------ //
import { ReportPresenterBase } from '../../../../../core/base-classes/report.presenter.base';
import { ReportType } from '../../../../../core/model/chart-data.model';
import { ColumnChartService } from '../../../../../core/services/chart-service/column-chart.service';
import { GeneratePdfService } from '../../../../../core/services/generate-pdf-service/generate-pdf.service';
import { dataForJsPDF } from '../../../../../core/utility/report.utility';
import { AmountConverterService } from '../../../../../core/services/amount-converter.service';
import { TotalCopyJobsResponse } from '../../total-copy-jobs.model';
import { chartOptions } from '../../../utility';
import { REPORT_VAXIS_TITLE } from '../../../report-copyit.model';

@Injectable()
export class TotalCopyJobsPresenter extends ReportPresenterBase {

    constructor(
        public ngZone: NgZone,
        public columnChartService: ColumnChartService,
        private datePipe: DatePipe,
        private generatePDFService: GeneratePdfService,
        private amountConverterService: AmountConverterService
    ) {
        super(ngZone, columnChartService)
    }

    /**
     * Get Table Header 
     * @param totalJobsList Get the list of total copy jobs
     */
    public getTableHeader(totalJobsList: TotalCopyJobsResponse[]): string[] {

        this.tableHeader(totalJobsList);
        return this.headings;
    }

    /**
     * Prepared Chart Data
     * @param totalJobsList Get the list of total copy jobs
     */
    public setChartData(totalJobsList: TotalCopyJobsResponse[]): void {
        this.ngZone.runOutsideAngular(() => {
            this.preparChartData(totalJobsList);
        });
    }

    /**
     * Draw Total Copy Jobs Chart
     * @param chartContainerRef Get the refrence for chart container
     */
    public drawChart(chartContainerRef: ElementRef): void {
        this.ngZone.runOutsideAngular(() => {

            let options: any = chartOptions(REPORT_VAXIS_TITLE.Total_Jobs);

            if (this.isScaleData) {
                options.vAxis['scaleType'] = 'mirrorLog';
            } else {
                options.vAxis['viewWindow'] = { min: 0, max: 100 };
            }

            this.drawColumnChart(chartContainerRef, options, this.chartData);
        });

    }

    /**
     * Export PDF total copy jobs 
     * @param totalJobsList Get the list of total copy jobs
     * @param clientName Get the client name
     */
    public exportAsPDF(totalJobsList: TotalCopyJobsResponse[], clientName: string): void {

        this.ngZone.runOutsideAngular(() => {

            let totalCopyJobsData: any = this.amountConverterService.addCommaSeparate(totalJobsList);
            let jsPDFData: any = dataForJsPDF(totalCopyJobsData);

            let tableHeaderText: string = 'Total Copy Jobs';
            let dateString: string = this.datePipe.transform(new Date(), 'y-MM-d-h_mm_ss');
            let pdfName: string = 'report-total-center-copy-job-' + dateString + '.pdf';

            if (this.googleChartObj) {
                this.generatePDFService.exportAsPDF(tableHeaderText, pdfName, this.googleChartObj, jsPDFData, clientName, ReportType.copyIt);
            }
        });
    }
}