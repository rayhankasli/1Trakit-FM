/**
 * @author : Bikash Das
 * @description : This is a presentation component class for barchart
 */

import { DOCUMENT } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, HostListener, Inject, Input, ViewChild } from '@angular/core';
import { getMaximumFrom } from 'projects/facility-management/src/app/core/utility/utility';
import { ChartService } from '../../../../dashboard-chart.service';
import { BARS_PER_WINDOW } from '../../../../dashboard.enum';
import { BaseChartPresentation } from '../../base-chart.presentation';
import { BarchartPresenter } from './../barchart-presenter/barchart-presenter';

@Component({
  selector: 'app-bar-chart-ui',
  templateUrl: './bar-chart.presentation.html',
  viewProviders: [BarchartPresenter],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BarChartPresentationComponent extends BaseChartPresentation implements AfterViewInit {

  /** Input property to define chart type */
  @Input() public chartType: string;
  public isAnnotation: boolean = false;

  /** setter method to accept all barchart legends as input */
  @Input() public set barChartLegends(val: string[]) {
    this.getLegends = val;
  }
  /** getter method to return all barchart legends. */
  public get barChartLegends(): string[] {
    return this.getLegends;
  }

  /** 
   * setter method to get bar charts as input properties for client and associates
   * Here generates the bar chart as per specific parameters and values
   */
  @Input() public set barChartData(data: any) {
    if (this.chartType === 'annotation') {
      this.isAnnotation = true;
    }
    if (data) {
      if (this.isAnnotation) {
        this.isEmpty = data.every((o: any) =>
          (o.associateGraph.assigned === 0 && o.associateGraph.close === 0 &&
            o.associateGraph.completed === 0 && o.associateGraph.inProgress === 0 &&
            o.associateGraph.onhold === 0 && o.associateGraph.requestForInformation === 0
            && o.associateGraph.companyName === null)
        );
      }
      else {
        this.isEmpty = !getMaximumFrom(data, 0) ? true : false;
      }

      this.getDataForBarChart = data;
      this.barChartDetail = this.chartPresenter.setBarChartData(this.getDataForBarChart, this.barChartLegends, this.isAnnotation);
      this.optionsBarChart = this.chartPresenter.setoptionBar();
      this.generateBarChart();
      this.setNextPreviousView();
    }
  }

  /** element for chart container */
  @ViewChild('barChartContainer', { static: false }) public barChartContainer: ElementRef<HTMLDivElement>;
  /** element for outer DOM element */
  @ViewChild('content', { static: false }) public content: ElementRef<any>;
  /** provide  chartPrevBtn */
  @ViewChild('chartPrevBtn', { static: false }) public chartPrevBtn: ElementRef<any>;
  /** provide  chartNextBtn */
  @ViewChild('chartNextBtn', { static: false }) public chartNextBtn: ElementRef<any>;

  /** to check if chart opened to fullscreen */
  public isFullScreenChart: boolean;
  /** to show/hide no data */
  public isEmpty: boolean = false;
  /** actual data */
  public barChartDetail: Object[];
  /** chart options */
  public optionsBarChart: any;
  /** to set chart data */
  public getDataForBarChart: any[] = [];
  /** to set legends */
  public getLegends: string[] = [];

  constructor(
    private chartPresenter: BarchartPresenter,
    private chartService: ChartService,
    @Inject(DOCUMENT) private document: any
  ) {
    super();
  }

  /** ngAfterViewInit method of life cycle hook */
  public ngAfterViewInit(): void {
    this.chartPrevBtn.nativeElement.disabled = true;
  }

  /** listen to full screen change event */
  // tslint:disable-next-line: prefer-inline-decorator
  @HostListener('document:webkitfullscreenchange', ['$event'])
  @HostListener('document:mozfullscreenchange', ['$event'])
  @HostListener('document:MSFullscreenChange', ['$event'])
  @HostListener('document:fullscreenchange', ['$event'])
  public onKeydownHandler(event: KeyboardEvent): void {
    if (this.optionsBarChart.width === '80%') {
      this.closeFullscreen();
    }
  }

  /** This method is called clicking on next button of bar chart to show next 5 bar chart status */
  public clickNextButton(): void {
    this.chartPrevBtn.nativeElement.disabled = false;
    this.optionsBarChart.hAxis.viewWindow.min += 5;
    this.optionsBarChart.hAxis.viewWindow.max += 5;
    this.generateBarChart();

    if (
      ((this.barChartDetail.length - 1) - this.optionsBarChart.hAxis.viewWindow.max) <= BARS_PER_WINDOW.Bar_Min) {
      this.chartNextBtn.nativeElement.disabled = true;
    }
  }

  /** This method is called clicking on previous button of bar chart to show previous 5 bar chart status */
  public clickPrevButton(): void {
    this.chartNextBtn.nativeElement.disabled = false;
    this.optionsBarChart.hAxis.viewWindow.min -= 5;
    this.optionsBarChart.hAxis.viewWindow.max -= 5;
    this.generateBarChart();
    if (this.optionsBarChart.hAxis.viewWindow.min === BARS_PER_WINDOW.Bar_Min) {
      this.chartPrevBtn.nativeElement.disabled = true;
    }
  }

  /** This method is responsible for zoom out functionality of barchart */
  public openFullscreen(): void {
    this.isFullScreenChart = true;
    let elem: any = this.content.nativeElement;
    let methodToBeInvoked: any =
      elem.requestFullscreen ||
      elem['webkitRequestFullScreen'] ||
      elem['mozRequestFullscreen'] ||
      elem['msRequestFullscreen'];
    this.optionsBarChart = this.chartPresenter.setoptionBar(this.isFullScreenChart);

    setTimeout(() => {
      this.optionsBarChart.width = '80%';
      this.optionsBarChart.height = '80%';
      this.optionsBarChart.hAxis.viewWindow.min = 0;
      this.optionsBarChart.hAxis.viewWindow.max = 'auto';
      this.optionsBarChart.hAxis.maxTextLines = 'auto';
      this.generateBarChart();
    },
      500);

    if (methodToBeInvoked) methodToBeInvoked.call(elem);
  }

  /** This method is responsible for zoom in functionality of barchart */
  public closeFullscreen(): void {

    this.isFullScreenChart = false;
    this.optionsBarChart = this.chartPresenter.setoptionBar();

    setTimeout(() => {
      this.setNextPreviousView();
      this.generateBarChart();
    }, 500);

    if (this.document.isFullScreenChart) {
      this.document.exitFullscreen();
    } else if (this.document.mozCancelFullScreen) {
      /* Firefox */
      this.document.mozCancelFullScreen();
    } else if (this.document.webkitExitFullscreen) {
      /* Chrome, Safari and Opera */
      this.document.webkitExitFullscreen();
    } else if (this.document.msExitFullscreen) {
      /* IE/Edge */
      this.document.msExitFullscreen();
    }
  }

  /**
   *  This method is used to ebable and diasble next and previous 
   *  button as per requirement.
   */
  private setNextPreviousView(): void {
    if (this.barChartDetail.length > BARS_PER_WINDOW.Bar_Max) {
      this.chartNextBtn.nativeElement.disabled = false;
    } else {
      this.chartNextBtn.nativeElement.disabled = true;
    }
    this.chartPrevBtn.nativeElement.disabled = true;
  }

  /** generate bar chart if data available */
  private generateBarChart(): void {
    if (!this.isEmpty) {
      this.chartService.buildBarChart(this.barChartContainer, this.barChartDetail, this.optionsBarChart);
    }
  }

}
