/** 
 * @author Shahbaz Shaikh.
 * @description CopyCenterImpBAndWPresenter service for CopyCenterImpBAndWPresentationComponent component.
 */

import { Injectable, ElementRef, NgZone } from '@angular/core';
import { DatePipe } from '@angular/common';
// ------------------------------------------------ //
import { ReportPresenterBase } from '../../../../../core/base-classes/report.presenter.base';
import { ReportType } from '../../../../../core/model/chart-data.model';
import { dataForJsPDF } from '../../../../../core/utility/report.utility';
import { ColumnChartService } from '../../../../../core/services/chart-service/column-chart.service';
import { GeneratePdfService } from '../../../../../core/services/generate-pdf-service/generate-pdf.service';
import { AmountConverterService } from '../../../../../core/services/amount-converter.service';
import { CopyIMPBAndWResponse } from '../../copy-center-imp-b-and-w.model';
import { chartOptions } from '../../../utility';
import { REPORT_VAXIS_TITLE } from '../../../report-copyit.model';

@Injectable()
export class CopyCenterImpBAndWPresenter extends ReportPresenterBase {

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
     * @param blackAndWhiteList Get the list of copy center IMP black and white
     */
    public getTableHeader(blackAndWhiteList: CopyIMPBAndWResponse[]): string[] {

        this.tableHeader(blackAndWhiteList);
        return this.headings;
    }

    /**
     * Prepared Chart Data
     * @param blackAndWhiteList Get the list of black and white copy center IMP
     */
    public setChartData(blackAndWhiteList: CopyIMPBAndWResponse[]): void {
        this.ngZone.runOutsideAngular(() => {
            this.preparChartData(blackAndWhiteList);
        });
    }

    /**
     * Draw Copy Center IMP Black and White Chart 
     * @param chartContainerRef Get the refrence for chart container
     */
    public drawChart(chartContainerRef: ElementRef): void {
        this.ngZone.runOutsideAngular(() => {

            let options: any = chartOptions(REPORT_VAXIS_TITLE.BAndW_Copy);

            if (this.isScaleData) {
                options.vAxis['scaleType'] = 'mirrorLog';
            } else {
                options.vAxis['viewWindow'] = { min: 0, max: 100 };
            }

            this.drawColumnChart(chartContainerRef, options, this.chartData);
        });

    }

    /**
     * Export PDF Copy Center IMP Black and White 
     * @param blackAndWhiteList Get the list of copy center IMP black and white
     * @param clientName Get the client name
     */
    public exportAsPDF(blackAndWhiteList: CopyIMPBAndWResponse[], clientName: string): void {
        this.ngZone.runOutsideAngular(() => {

            let blackAndWhiteData: any = this.amountConverterService.addCommaSeparate(blackAndWhiteList);
            let jsPDFData: any = dataForJsPDF(blackAndWhiteData);

            let tableHeaderText: string = 'Copy Center Impression - B&W';
            let dateString: string = this.datePipe.transform(new Date(), 'y-MM-d-h_mm_ss');
            let pdfName: string = 'report-copy-center-impression-B&W-' + dateString + '.pdf';

            if (this.googleChartObj) {
                this.generatePDFService.exportAsPDF(tableHeaderText, pdfName, this.googleChartObj, jsPDFData, clientName, ReportType.copyIt);
            }
        });
    }
}