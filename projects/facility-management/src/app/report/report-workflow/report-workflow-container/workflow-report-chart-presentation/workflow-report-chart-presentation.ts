/**
 * @author YOUR_NAME_HERE
 * @description This is data table presentation component.To represent get data from container component and render to dom.
 */

import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, HostListener, Inject, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
// ------------------------------------------------------ //
import { SidebarService } from 'common-libs';
// ------------------------------------------------------ //
import { ClientYearFilter } from '../../../report-model';
import { ChartObject, ChartType, CHART_TYPE_OPTION, WorkFlowReportGraph } from '../../report-workflow.model';
import { WorkflowReportChartPresenter } from '../workflow-report-chart-presenter/workflow-report-chart-presenter';

@Component({
  selector: 'app-workflow-report-chart-ui',
  templateUrl: './workflow-report-chart-presentation.html',
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [WorkflowReportChartPresenter]
})
export class WorkflowReportChartPresentationComponent implements OnInit, OnDestroy {

  /** This property is used to get filter data from parent component */
  @Input() public set filter(filter: ClientYearFilter) {
    if (filter) {
      const { clientId, year } = filter;
      if (clientId > 0 && (this.selectedClientId != clientId || this.selectedYear != year)) {
        this.selectedClientId = clientId;
        this.selectedYear = year;
        this.getWorkFlowGraphListByClient();
      }
    }
  }

  /** Workflow Graph List */
  @Input() public set workFlowReportGraph(value: WorkFlowReportGraph[]) {
    if (value) {
      this._workFlowReportGraph = value;
      this.workFlowGraphData = this.workflowReportChartPresenter.prepareData(this._workFlowReportGraph, this.statusOption);
      this.chartOptions = this.workflowReportChartPresenter.chartOptions(this.statusOption, null);
      if (this.isFullScreenChart) {
        this.setFullScreenOption();
      }
      setTimeout(() => {
        this.workflowReportChartPresenter.drawChart(this.chartContainer, this.workFlowGraphData, this.chartOptions);
        value.length && this.setNextPreviousButton();
      });
    }
  }

  public get workFlowReportGraph(): WorkFlowReportGraph[] {
    return this._workFlowReportGraph;
  }

  /** Output emitter defined for emit IdObject and get chart and list by selected Id */
  @Output() public workFlowGraphListByClient: EventEmitter<ChartObject>;

  /** Chart contanier Ref */
  @ViewChild('workflowChartRef', { static: false }) public chartContainer: ElementRef<HTMLDivElement>;

  /** Prev button Ref */
  @ViewChild('chartPrevBtn', { static: false }) public chartPrevBtn: ElementRef<HTMLButtonElement>;

  /** Next button Ref */
  @ViewChild('chartNextBtn', { static: false }) public chartNextBtn: ElementRef<HTMLButtonElement>;

  /** To-Do */
  @ViewChild('content', { static: false }) public content: ElementRef<any>;

  /** Chart Option */
  public chartOptions: any;

  /** Full Screen Chart or not */
  public isFullScreenChart: boolean;

  /** Client Id */
  public selectedClientId: number;

  /** selected year */
  public selectedYear: number;

  /** Chart Type List */
  public chartType: ChartType[] = CHART_TYPE_OPTION;

  /** Graph Category */
  public statusOption: number;

  /** Graph Data */
  private workFlowGraphData: any[];

  /** WorkFlowReportGraph list */
  private _workFlowReportGraph: WorkFlowReportGraph[];

  /** destroy */
  private destroy: Subject<void>;

  constructor(
    private sidebarService: SidebarService,
    private workflowReportChartPresenter: WorkflowReportChartPresenter,
    @Inject(DOCUMENT) private document: any
  ) {
    this.destroy = new Subject();
    this.workFlowGraphListByClient = new EventEmitter(true);
    this.statusOption = 1;
    this.isFullScreenChart = false;
  }

  public ngOnInit(): void {
    this.sidebarService.isCollapsed.pipe(takeUntil(this.destroy)).subscribe(flag => {
      setTimeout(() => {
        if (this.workFlowGraphData) this.workflowReportChartPresenter.drawChart(this.chartContainer, this.workFlowGraphData, this.chartOptions);
      }, 300);
    })
  }


  public ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }

  /** Change graph status daily or monthly */
  public onStatusChange(status: ChartType): void {
    this.getWorkFlowGraphListByClient();
  }

  /** clickNextButton */
  public clickNextButton(): void {
    this.disableChartPrevBtn(false);
    this.chartOptions.hAxis.viewWindow.min += 7;
    this.chartOptions.hAxis.viewWindow.max += 7;
    this.workflowReportChartPresenter.drawChart(this.chartContainer, this.workFlowGraphData, this.chartOptions);

    if ((this._workFlowReportGraph.length - this.chartOptions.hAxis.viewWindow.max) <= 0) {
      this.disableChartNextBtn();
    }

  }

  /** This method is called clicking on previous button of bar chart to show previous 5 bar chart status */
  public clickPrevButton(): void {
    this.disableChartNextBtn(false);
    this.chartOptions.hAxis.viewWindow.min -= 7;
    this.chartOptions.hAxis.viewWindow.max -= 7;
    this.workflowReportChartPresenter.drawChart(this.chartContainer, this.workFlowGraphData, this.chartOptions);

    if (this.chartOptions.hAxis.viewWindow.min === 0) {
      this.disableChartPrevBtn();
    }

  }

  /** Open Full Screen Chart */
  public openFullscreen(): void {
    this.isFullScreenChart = true;
    let elem: any = this.content.nativeElement;
    let methodToBeInvoked: any =
      elem.requestFullscreen ||
      elem['webkitRequestFullScreen'] ||
      elem['mozRequestFullscreen'] ||
      elem['msRequestFullscreen'];
    this.chartOptions = this.workflowReportChartPresenter.chartOptions(this.statusOption, this.isFullScreenChart);

    setTimeout(() => {
      this.setFullScreenOption();
      this.workflowReportChartPresenter.drawChart(this.chartContainer, this.workFlowGraphData, this.chartOptions);
    }, 500);

    if (methodToBeInvoked) methodToBeInvoked.call(elem);

  }

  /** HostListener */
  // tslint:disable-next-line: prefer-inline-decorator
  @HostListener('document:webkitfullscreenchange', ['$event'])
  @HostListener('document:mozfullscreenchange', ['$event'])
  @HostListener('document:MSFullscreenChange', ['$event'])
  @HostListener('document:fullscreenchange', ['$event'])
  /** onKeydownHandler */
  public onKeydownHandler(event: KeyboardEvent): void {
    if (this.chartOptions.width === '50%') {
      this.closeFullscreen();
    }
  }

  /**
   * Redraw Chart on resize window
   * @param event 
   */
  @HostListener('window:resize', ['$event']) public reSize(): void {
    if (this.workFlowGraphData) {
      setTimeout(() => {
        this.workflowReportChartPresenter.drawChart(this.chartContainer, this.workFlowGraphData, this.chartOptions);
      }, 500);
    }
  }

  /** Close Screen Chart */
  public closeFullscreen(): void {
    this.isFullScreenChart = false;
    this.chartOptions = this.workflowReportChartPresenter.chartOptions(this.statusOption);

    setTimeout(() => {
      this.setNextPreviousButton();
      this.workflowReportChartPresenter.drawChart(this.chartContainer, this.workFlowGraphData, this.chartOptions);
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

  /** Get WorkFlowGraph List */
  private getWorkFlowGraphListByClient(): void {
    let chartObj: ChartObject = {
      clientId: this.selectedClientId,
      graphCategory: this.statusOption,
      year: this.selectedYear
    }
    if (this.selectedClientId && this.selectedYear) {
      this.workFlowGraphListByClient.emit(chartObj);
    }
  }

  /**
   *  This method is used to enable and diasble next and previousbutton as per requirement.
   */
  private setNextPreviousButton(): void {
    if (this._workFlowReportGraph.length > 7) {
      this.disableChartNextBtn(false);
    } else {
      this.disableChartNextBtn();
    }
    this.disableChartPrevBtn();
  }

  /** set full screen chart options */
  private setFullScreenOption(): void {
    this.chartOptions.width = '50%';
    this.chartOptions.height = 650;
    this.chartOptions.hAxis.viewWindow.min = 0;
    this.chartOptions.hAxis.viewWindow.max = this._workFlowReportGraph.length;
    this.chartOptions.hAxis.maxTextLines = 2;
  }

  /** to enable/disable previous button */
  private disableChartPrevBtn(flag: boolean = true): void {
    if (this.chartPrevBtn) {
      this.chartPrevBtn.nativeElement.disabled = flag;
    }
  }

  /** to enable/disable next button */
  private disableChartNextBtn(flag: boolean = true): void {
    if (this.chartNextBtn) {
      this.chartNextBtn.nativeElement.disabled = flag;
    }
  }

}
