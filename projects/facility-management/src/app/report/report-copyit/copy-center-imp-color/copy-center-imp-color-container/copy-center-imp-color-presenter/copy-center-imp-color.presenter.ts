/** 
 * @author Shahbaz Shaikh.
 * @description CopyCenterImpColorPresenter service for CopyCenterImpColorPresentationComponent component.
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
import { CopyIMPColorResponse } from '../../copy-center-imp-color.model';
import { chartOptions } from '../../../utility';
import { REPORT_VAXIS_TITLE } from '../../../report-copyit.model';

@Injectable()
export class CopyCenterImpColorPresenter extends ReportPresenterBase {

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
     * @param colorCopyList Get the list of copy center IMP Color 
     */
    public getTableHeader(colorCopyList: CopyIMPColorResponse[]): string[] {

        this.tableHeader(colorCopyList);
        return this.headings;
    }

    /**
     * Prepared Chart Data
     * @param colorCopyList Get the list of color copy center IMP
     */
    public setChartData(colorCopyList: CopyIMPColorResponse[]): void {
        this.ngZone.runOutsideAngular(() => {
            this.preparChartData(colorCopyList);
        });
    }

    /**
     * Draw Copy Center IMP Color Chart 
     * @param chartContainerRef Get the refrence for chart container
     */
    public drawChart(chartContainerRef: ElementRef): void {
        this.ngZone.runOutsideAngular(() => {

            let options: any = chartOptions(REPORT_VAXIS_TITLE.Color_Copy);

            if (this.isScaleData) {
                options.vAxis['scaleType'] = 'mirrorLog';
            } else {
                options.vAxis['viewWindow'] = { min: 0, max: 100 };
            }

            this.drawColumnChart(chartContainerRef, options, this.chartData);
        });
    }

    /**
     * Export PDF Copy Center IMP Color
     * @param blackAndWhiteList Get the list of copy center IMP Color
     * @param clientName Get the client name
     */
    public exportAsPDF(colorCopyList: CopyIMPColorResponse[], clientName: string): void {

        this.ngZone.runOutsideAngular(() => {
            let colorCopyData: any = this.amountConverterService.addCommaSeparate(colorCopyList);
            let jsPDFData: any = dataForJsPDF(colorCopyData);

            let tableHeaderText: string = 'Copy Center Impression - Color';
            let dateString: string = this.datePipe.transform(new Date(), 'y-MM-d-h_mm_ss');
            let pdfName: string = 'report-copy-center-impression-color-' + dateString + '.pdf';

            if (this.googleChartObj) {
                this.generatePDFService.exportAsPDF(tableHeaderText, pdfName, this.googleChartObj, jsPDFData, clientName, ReportType.copyIt);
            }
        });
    }
}