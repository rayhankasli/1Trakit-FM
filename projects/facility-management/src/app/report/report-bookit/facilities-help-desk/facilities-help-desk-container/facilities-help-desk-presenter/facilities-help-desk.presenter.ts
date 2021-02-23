import { Injectable, ElementRef, NgZone } from '@angular/core';
import { DatePipe } from '@angular/common';
// ------------------------------------------------ //
import { ReportPresenterBase } from '../../../../../core/base-classes/report.presenter.base';
import { ReportType } from '../../../../../core/model/chart-data.model';
import { ColumnChartService } from '../../../../../core/services/chart-service/column-chart.service';
import { dataForBookItChart, dataForJsPDFTable } from '../../../../../core/utility/report.utility';
import { GeneratePdfService } from '../../../../../core/services/generate-pdf-service/generate-pdf.service';
import { FacilitiesHelpDesk } from '../../facilities-help-desk.model';

/** Service for presenter */
@Injectable()
export class FacilitiesHelpDeskPresenter extends ReportPresenterBase {

    /** to check if data can be scaled or not  */
    private scaleOrNot: boolean;

    /** ChartData */
    private helpDeskChartData: any;

    constructor(
        public ngZone: NgZone,
        public columnChartService: ColumnChartService,
        private generatePDFService: GeneratePdfService,
        private datePipe: DatePipe
    ) {
        super(ngZone, columnChartService)
    }

    /** setChartData */
    public setChartData(tableHeader: string[], blackAndWhiteList: FacilitiesHelpDesk[]): void {
        this.ngZone.runOutsideAngular(() => {
            let filterList: FacilitiesHelpDesk[];
            filterList = blackAndWhiteList.filter((value: FacilitiesHelpDesk) => !value.onlyForTable);
            let tableColumn: number = 2;
            this.helpDeskChartData = dataForBookItChart(tableHeader, filterList, tableColumn);
            this.scaleOrNot = blackAndWhiteList && blackAndWhiteList.some((response: FacilitiesHelpDesk) =>
                response.helpDeskValue > 0) ? true : false;
        })
    }

    /** Draw facilities help desk Chart */
    public drawHelpDeskChart(chartContainerRef: ElementRef): void {
        this.ngZone.runOutsideAngular(() => {
            let graphHeight: string;
            let graphWidth: string;
            graphHeight = '70%';
            graphWidth = '80%'
            let helpDeskChartOptions: any = {
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
                    height: graphHeight,
                    width: graphWidth,
                    left: '15%',
                    top: '10%'
                },
                hAxis: {
                    title: 'MONTHS',
                    titleTextStyle: {
                        bold: true,
                        italic: false
                    },
                },
                vAxis: {
                    title: 'WORK ORDER TICKETS',
                    ticks: 1000,
                    titleTextStyle: {
                        bold: true,
                        italic: false
                    },
                },
                series: {
                    0: { color: '#5b616d' }
                }
            };
            if (this.scaleOrNot) {
                helpDeskChartOptions.vAxis['scaleType'] = 'mirrorLog';
            } else {
                helpDeskChartOptions.vAxis['viewWindow'] = { min: 0, max: 100 };
            }

            this.drawColumnChart(chartContainerRef, helpDeskChartOptions, this.helpDeskChartData);
        });

    }

    /** Help Desk exportToPdf */
    public exportAsPDF(header: string[], facilitiesAssistantsList: FacilitiesHelpDesk[], clientName: string): void {
        this.ngZone.runOutsideAngular(() => {
            let tableColumn: number = 2;
            let jsPDFData = dataForJsPDFTable(header, facilitiesAssistantsList, tableColumn);

            let tableHeaderText: string = 'FACILITIES HELP DESK - WORK ORDER TICKETS ' + this.datePipe.transform(new Date(), 'y');
            let dateString: string = this.datePipe.transform(new Date(), 'y-MM-d-h_mm_ss');
            let pdfName: string = 'report-facilities-help-desk-' + dateString + '.pdf';


            if (this.googleChartObj) {
                this.generatePDFService.exportAsPDF(tableHeaderText, pdfName, this.googleChartObj, jsPDFData, clientName, ReportType.bookIt);
            }
        })
    }
} 