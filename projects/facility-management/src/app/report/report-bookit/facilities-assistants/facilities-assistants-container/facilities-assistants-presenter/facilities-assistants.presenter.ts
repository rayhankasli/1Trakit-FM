import { Injectable, ElementRef, NgZone } from '@angular/core';
import { DatePipe } from '@angular/common';
// ----------------------------------------------------------- //
import { ReportPresenterBase } from '../../../../../core/base-classes/report.presenter.base';
import { ReportType } from '../../../../../core/model/chart-data.model';
import { ColumnChartService } from '../../../../../core/services/chart-service/column-chart.service';
import { dataForBookItChart, dataForJsPDFTable } from '../../../../../core/utility/report.utility';
import { GeneratePdfService } from '../../../../../core/services/generate-pdf-service/generate-pdf.service';
import { FacilitiesAssistants } from '../../facilities-assistants.model';

/** Sercive for presenter */
@Injectable()
export class FacilitiesAssistantsPresenter extends ReportPresenterBase {

    /** to check if data can be scaled or not  */
    private scaleOrNot: boolean;

    /** ChartData */
    private assistantChartData: any;

    constructor(
        public ngZone: NgZone,
        public columnChartService: ColumnChartService,
        private datePipe: DatePipe,
        private generatePdfService: GeneratePdfService,
    ) {
        super(ngZone, columnChartService)
    }

    /** Set Data */
    public setChartData(tableHeader: string[], blackAndWhiteList: FacilitiesAssistants[]): void {
        this.ngZone.runOutsideAngular(() => {
            let filterList: FacilitiesAssistants[];
            filterList = blackAndWhiteList.filter((value: FacilitiesAssistants) => !value.onlyForTable);
            let tableColumn: number = 3;
            this.assistantChartData = dataForBookItChart(tableHeader, filterList, tableColumn);
            this.scaleOrNot = blackAndWhiteList && blackAndWhiteList.some((response: FacilitiesAssistants) =>
                response.labourbHourPerMonth > 0 || response.workOrderTickets > 0) ? true : false;
        })
    }

    /** Draw facilities assistants Chart */
    public drawChart(chartContainerRef: ElementRef): void {
        this.ngZone.runOutsideAngular(() => {
            let assistantChartOptions: any = {
                // title: 'COPY CENTER IMPRESSIONS - COLOR',
                // curveType: 'function',
                height: 'auto',
                width: 'auto',
                pointSize: 5,
                legend: {
                    position: 'bottom',
                    maxLines: 2
                },
                fontName: 'Poppins',
                fontSize: 13,
                chartArea: {
                    height: '70%',
                    width: '80%',
                    left: '15%',
                    top: '10%'
                },
                hAxis: {
                    title: 'MONTH',
                    titleTextStyle: {
                        bold: true,
                        italic: false
                    },
                },
                vAxis: {
                    title: 'CLOSED WORK ORDER TICKETS VS. LABOR',
                    ticks: 1000,
                    titleTextStyle: {
                        bold: true,
                        italic: false
                    },
                },
                series: {
                    0: { color: '#5b616d' },
                    1: { color: '#DA2028' }
                }
            };
            if (this.scaleOrNot) {
                assistantChartOptions.vAxis['scaleType'] = 'mirrorLog';
            } else {
                assistantChartOptions.vAxis['viewWindow'] = { min: 0, max: 100 };
            }


            this.drawColumnChart(chartContainerRef, assistantChartOptions, this.assistantChartData);

        });

    }

    /** facilities assistants exportToPdf */
    public exportAsPDF(header: string[], facilitiesAssistantsList: FacilitiesAssistants[], clientName: string): void {
        this.ngZone.runOutsideAngular(() => {
            let tableColumn: number = 3;
            let jsPDFData = dataForJsPDFTable(header, facilitiesAssistantsList, tableColumn);

            let tableHeaderText: string = 'LABOR HOURS - WORK ORDER TICKETS ' + this.datePipe.transform(new Date(), 'y');
            let dateString: string = this.datePipe.transform(new Date(), 'y-MM-d-h_mm_ss');
            let pdfName: string = 'report-labor-hours-' + dateString + '.pdf';

            if (this.googleChartObj) {
                this.generatePdfService.exportAsPDF(tableHeaderText, pdfName, this.googleChartObj, jsPDFData, clientName, ReportType.bookIt);
            }
        })
    }

}