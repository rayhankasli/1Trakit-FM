/** 
 * @author Shahbaz Shaikh.
 * @description TimelinessPresenter service for TimelinessPresentationComponent component.
 */

import { Injectable, ElementRef, OnDestroy, NgZone } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
// ------------------------------------------------ //
import { ReportPresenterBase } from '../../../../../core/base-classes/report.presenter.base';
import { ReportType } from '../../../../../core/model/chart-data.model';
import { LineChartService } from '../../../../../core/services/chart-service/line-chart.service';
import { GeneratePdfService } from '../../../../../core/services/generate-pdf-service/generate-pdf.service';
import { dataForChart, dataForJsPDF } from '../../../../../core/utility/report.utility';
import { TimelinessResponse } from '../../timeliness.model';

@Injectable()
export class TimelinessPresenter extends ReportPresenterBase implements OnDestroy {

  /** destroy */
  public destroy: Subject<void>;

  /** ChartData */
  private timelinessChartData: any[];

  /** Google Chart Obj */
  private timelinessChartObj: any;

  constructor(
    public ngZone: NgZone,
    private lineChartService: LineChartService,
    private generatePDFService: GeneratePdfService,
    private datePipe: DatePipe
  ) {
    super(ngZone)
    this.destroy = new Subject();
  }

  public ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }

  /**
   * Get Table Header
   * @param timelinessList Get the list of timeliness report
   */
  public getTableHeader(timelinessList: TimelinessResponse[]): string[] {

    this.tableHeader(timelinessList);
    return this.headings;
  }

  /**
   * Prepared Chart Data
   * @param timelinessList Get the list of timeliness report
   */
  public setChartData(timelinessList: TimelinessResponse[]): void {
    this.ngZone.runOutsideAngular(() => {
      let filterList: TimelinessResponse[];
      filterList = timelinessList.filter((value: TimelinessResponse) => !value.onlyForTable);
      this.timelinessChartData = dataForChart(filterList);
    });
  }

  /**
   * Draw Copy Center IMP Black and White Chart 
   * @param chartContainerRef Get the refrence for chart container
   */
  public drawTimelinessChart(chartContainerRef: ElementRef): void {
    this.ngZone.runOutsideAngular(() => {

      let timelinesschartOptions: any = {
        // title: 'TIMELINESS',
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
          title: 'MONTHS',
          titleTextStyle: {
            bold: true,
            italic: false
          }
        },
        vAxis: {
          title: 'PERCENT JOBS DELIVERED ON TIME',
          // ticks: 1000,
          titleTextStyle: {
            bold: true,
            italic: false
          },
          minValue: 0,
          maxValue: 100,
          format: '#\'%\''
        },
        series: {
          0: { color: '#5b616d' },
          1: { color: '#DA2028' }
        }
      };

      this.lineChartService.drawLineChart(chartContainerRef, timelinesschartOptions, this.timelinessChartData);
    });

    this.lineChartService.lineChartRef$.pipe(takeUntil(this.destroy)).subscribe((timelinessChartObj: any) => {
      this.timelinessChartObj = timelinessChartObj;
    });

  }

  /**
   * Export PDF Timeliness report 
   * @param timelinessList Get the list of timeliness report
   * @param clientName Get the client name
   */
  public exportAsPDF(timelinessList: TimelinessResponse[], clientName: string): void {

    this.ngZone.runOutsideAngular(() => {
      let jsPDFData: any[] = dataForJsPDF(timelinessList);

      let tableHeaderText: string = 'Copy Center Timeliness';
      let dateString: string = this.datePipe.transform(new Date(), 'y-MM-d-h_mm_ss');
      let pdfName: string = 'report-copy-center-timeliness-' + dateString + '.pdf';

      if (this.timelinessChartObj) {
        this.generatePDFService.exportAsPDF(tableHeaderText, pdfName, this.timelinessChartObj, jsPDFData, clientName, ReportType.copyIt);
      }
    });
  }
}