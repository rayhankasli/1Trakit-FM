/** 
 * @author Shahbaz Shaikh.
 * @description CopyCenterImpScanPresenter service for CopyCenterImpScanPresentationComponent component.
 */


import { Injectable, ElementRef, NgZone } from '@angular/core';
import { DatePipe } from '@angular/common';
// --------------------------------------------- //
import { ReportPresenterBase } from '../../../../../core/base-classes/report.presenter.base';
import { ReportType } from '../../../../../core/model/chart-data.model';
import { ColumnChartService } from '../../../../../core/services/chart-service/column-chart.service';
import { GeneratePdfService } from '../../../../../core/services/generate-pdf-service/generate-pdf.service';
import { dataForJsPDF } from '../../../../../core/utility/report.utility';
import { AmountConverterService } from '../../../../../core/services/amount-converter.service';
import { CopyIMPScanResponse, Data } from '../../copy-center-imp-scan.model';
import { chartOptions } from '../../../utility';
import { REPORT_VAXIS_TITLE } from '../../../report-copyit.model';

@Injectable()
export class CopyCenterImpScanPresenter extends ReportPresenterBase {

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
     * @param scanCopyList Get the list of copy center IMP Scan
     */
    public getTableHeader(scanCopyList: CopyIMPScanResponse[]): string[] {

        this.tableHeader(scanCopyList);
        return this.headings;
    }

    /**
     * Prepared Chart Data
     * @param scanCopyList Get the list of copy center IMP Scan
     */
    public setChartData(scanCopyList: CopyIMPScanResponse[]): void {
        this.ngZone.runOutsideAngular(() => {
            this.preparChartData(scanCopyList);
        });
    }

    /**
     * Draw Copy Center IMP Scan Chart 
     * @param chartContainerRef Get the refrence for chart container
     */
    public drawChart(chartContainerRef: ElementRef): void {
        this.ngZone.runOutsideAngular(() => {

            let options: any = chartOptions(REPORT_VAXIS_TITLE.Scan_Copy);

            if (this.isScaleData) {
                options.vAxis['scaleType'] = 'mirrorLog';
            } else {
                options.vAxis['viewWindow'] = { min: 0, max: 100 };
            }

            this.drawColumnChart(chartContainerRef, options, this.chartData);
        });
    }

    /**
     * Export PDF Copy Center IMP Scan
     * @param scanCopyList Get the list of copy center IMP Scan
     * @param clientName Get the client name
     */
    public exportAsPDF(scanCopyList: CopyIMPScanResponse[], clientName: string): void {

        this.ngZone.runOutsideAngular(() => {
            let scanCopyData: any = this.amountConverterService.addCommaSeparate(scanCopyList);
            let jsPDFData: any = dataForJsPDF(scanCopyData);

            let tableHeaderText: string = 'Copy Center Impression - Scan';
            let dateString: string = this.datePipe.transform(new Date(), 'y-MM-d-h_mm_ss');
            let pdfName: string = 'report-copy-center-impression-scan-' + dateString + '.pdf';

            if (this.googleChartObj) {
                this.generatePDFService.exportAsPDF(tableHeaderText, pdfName, this.googleChartObj, jsPDFData, clientName, ReportType.copyIt);
            }
        });
    }
}