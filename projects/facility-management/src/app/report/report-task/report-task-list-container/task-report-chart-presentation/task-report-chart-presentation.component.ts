/**
 * @author Rayhan Kasli.
 */
import { DOCUMENT } from '@angular/common';
import {
  AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef,
  EventEmitter, HostListener, Inject, Input, OnDestroy, OnInit, Output, ViewChild
} from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
// ------------------------------------------------------------ //
import { SidebarService } from 'common-libs';
// ------------------------------------------------------------ //
import { ClientYearFilter } from '../../../report-model';
import { BacklogChart, BARS_PER_WINDOW, ChartObject, CHART_TYPE, TaskReportChart } from '../../report-task.model';
import { TaskReportChartPresenter } from '../task-report-chart-presenter/task-report-chart-presenter';
import { TaskReportListPresentationBase } from '../task-report-list-presentation-base/task-report-list.presentation.base';

@Component({
  selector: 'app-task-report-chart-presentation',
  templateUrl: './task-report-chart-presentation.component.html',
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [TaskReportChartPresenter]
})
export class TaskReportChartPresentationComponent extends TaskReportListPresentationBase implements OnInit, AfterViewInit, OnDestroy {

  /** This property is used to get filter data from parent component */
  @Input() public set filter(filter: ClientYearFilter) {
    if (filter) {
      const { clientId, year } = filter;
      if (clientId > 0 && (this.selectedClientId != clientId || this.selectedYear != year)) {
        this.selectedClientId = clientId;
        this.selectedYear = year;
        this.getChart();
      }
    }
  }

  /** This property is used to store the taskReports that has been retrieved from the API. */
  @Input() public set taskChart(value: TaskReportChart[]) {
    if (value) {
      this._taskChart = value;
      this.optionsTaskChart = this.taskReportChartPresenter.stackChartOption();
      if (value.length === 0) {
        this.optionsTaskChart.height = 350;
        this.optionsTaskChart.vAxis['viewWindow'] = { min: 0, max: 10 };
      }
      setTimeout(() => {
        this.taskReportChartPresenter.drawStackChart(this.taskChartContainer, this._taskChart, this.optionsTaskChart);
        // this.setChartHeightWidth(this._taskChart, this._backlogChart)
        this.setNextPreviousView(CHART_TYPE.Task);
      });
    }
  };

  public get taskChart(): TaskReportChart[] {
    return this._taskChart;
  }

  /** This property is used to store the taskReports that has been retrieved from the API. */
  @Input() public set backlogChart(value: BacklogChart[]) {
    if (value) {
      this._backlogChart = value;
      this.optionsBacklogChart = this.taskReportChartPresenter.chartLineOptions();
      if (value.length === 0) {
        this.optionsBacklogChart.height = 350;
        this.optionsBacklogChart.vAxis['viewWindow'] = { min: 0, max: 10 };
      }
      setTimeout(() => {
        this.taskReportChartPresenter.drawLineChart(this.backlogChartContainer, this._backlogChart, this.optionsBacklogChart);
        // this.setChartHeightWidth(this._taskChart, this._backlogChart)
        this.setNextPreviousView(CHART_TYPE.Backlog);
      });
    }
  };

  public get backlogChart(): BacklogChart[] {
    return this._backlogChart;
  }

  /** getChartList */
  @Output() public getChartList: EventEmitter<ChartObject>;

  /** To-Do */
  @ViewChild('taskChartRef', { static: false }) public taskChartContainer: ElementRef<HTMLDivElement>;
  /** To-Do */
  @ViewChild('backlogChartRef', { static: false }) public backlogChartContainer: ElementRef<HTMLDivElement>;
  /** provide  chartPrevBtn */
  @ViewChild('taskChartPrevBtn', { static: false }) public taskChartPrevBtn: ElementRef<HTMLButtonElement>;
  /** provide  chartNextBtn */
  @ViewChild('taskChartNextBtn', { static: false }) public taskChartNextBtn: ElementRef<HTMLButtonElement>;
  /** provide  chartPrevBtn */
  @ViewChild('backlogChartPrevBtn', { static: false }) public backlogChartPrevBtn: ElementRef<HTMLButtonElement>;
  /** provide  chartNextBtn */
  @ViewChild('backlogChartNextBtn', { static: false }) public backlogChartNextBtn: ElementRef<HTMLButtonElement>;
  /** provide  taskContent */
  @ViewChild('taskContent', { static: false }) public taskContent: ElementRef<any>;
  /** provide  backlogContent */
  @ViewChild('backlogContent', { static: false }) public backlogContent: ElementRef<any>;

  /** Client Id */
  public selectedClientId: number;
  /** Selected year */
  public selectedYear: number;

  /** Workflow data for chart */
  public noOfTask: any[];

  public isFullScreenTaskChart: boolean;
  public isFullScreenBacklogChart: boolean;

  public currentClientId: number;
  public optionsTaskChart: any;
  public optionsBacklogChart: any;

  private _taskChart: TaskReportChart[];
  private _backlogChart: BacklogChart[];
  /** create for  */
  private destroy: Subject<boolean>;

  constructor(
    private sidebarService: SidebarService,
    public taskReportChartPresenter: TaskReportChartPresenter,
    public changeDetection: ChangeDetectorRef,
    @Inject(DOCUMENT) private document: any
  ) {
    super(changeDetection);
    this.getChartList = new EventEmitter();
    this.destroy = new Subject();
  }

  /** ngOnInit method of life cycle hook */
  public ngOnInit(): void {
    this.sidebarService.isCollapsed.pipe(takeUntil(this.destroy)).subscribe(flag => {
      setTimeout(() => {
        this.reSize();
      }, 300);
    })
  }

  /** ngAfterViewInit method of life cycle hook */
  public ngAfterViewInit(): void {
    this.disableTaskChartPrevBtn();
    this.disableBackLogChartPrevBtn();
  }

  /** clickNextButton */
  public clickNextButton(chartType: string): void {
    if (chartType === CHART_TYPE.Task) {
      this.disableTaskChartPrevBtn(false);
      this.optionsTaskChart.hAxis.viewWindow.min += 7;
      this.optionsTaskChart.hAxis.viewWindow.max += 7;
      this.taskReportChartPresenter.drawStackChart(this.taskChartContainer, this._taskChart, this.optionsTaskChart);

      if ((this._taskChart.length - this.optionsTaskChart.hAxis.viewWindow.max) <= BARS_PER_WINDOW.Bar_Min) {
        this.disableTaskChartNextBtn();
      }
    } else {
      this.disableBackLogChartPrevBtn(false);
      this.optionsBacklogChart.hAxis.viewWindow.min += 7;
      this.optionsBacklogChart.hAxis.viewWindow.max += 7;
      this.taskReportChartPresenter.drawLineChart(
        this.backlogChartContainer,
        this._backlogChart,
        this.optionsBacklogChart
      );

      if ((this._backlogChart.length - this.optionsBacklogChart.hAxis.viewWindow.max) <= BARS_PER_WINDOW.Bar_Min) {
        this.disableBackLogChartNextBtn();
      }
    }

  }

  /** clickPrevButton */
  public clickPrevButton(chartType: string): void {
    if (chartType === CHART_TYPE.Task) {
      this.disableTaskChartNextBtn(false);
      this.optionsTaskChart.hAxis.viewWindow.min -= 7;
      this.optionsTaskChart.hAxis.viewWindow.max -= 7;
      this.taskReportChartPresenter.drawStackChart(
        this.taskChartContainer,
        this._taskChart,
        this.optionsTaskChart
      );
      if (this.optionsTaskChart.hAxis.viewWindow.min === BARS_PER_WINDOW.Bar_Min) {
        this.disableTaskChartPrevBtn();
      }
    } else {
      this.disableBackLogChartNextBtn(false);
      this.optionsBacklogChart.hAxis.viewWindow.min -= 7;
      this.optionsBacklogChart.hAxis.viewWindow.max -= 7;
      this.taskReportChartPresenter.drawLineChart(this.backlogChartContainer, this._backlogChart, this.optionsBacklogChart);
      if (this.optionsBacklogChart.hAxis.viewWindow.min === BARS_PER_WINDOW.Bar_Min) {
        this.disableBackLogChartPrevBtn();
      }
    }
  }

  /** openFullScreen */
  public openFullscreen(chartType: string): void {
    let taskChart: any = this.taskContent.nativeElement;
    let backlogChart: any = this.backlogContent.nativeElement;
    let methodToBeInvoked: any = this.taskReportChartPresenter.requestFullscreen(chartType === CHART_TYPE.Task ? taskChart : backlogChart);
    if (chartType === CHART_TYPE.Task) {
      this.isFullScreenTaskChart = true;
      this.optionsTaskChart = this.taskReportChartPresenter.stackChartOption(this.isFullScreenTaskChart);
      setTimeout(() => {
        this.optionsTaskChart.width = '50%';
        this.optionsTaskChart.height = 650;
        this.optionsTaskChart.hAxis.viewWindow.min = 0;
        this.optionsTaskChart.hAxis.viewWindow.max = this._taskChart.length;
        this.optionsTaskChart.hAxis.maxTextLines = 2;
        this.taskReportChartPresenter.drawStackChart(this.taskChartContainer, this._taskChart, this.optionsTaskChart);
      },
        500);
    } else {
      this.isFullScreenBacklogChart = true;
      this.optionsBacklogChart = this.taskReportChartPresenter.chartLineOptions();

      setTimeout(() => {
        this.optionsBacklogChart.width = '50%';
        this.optionsBacklogChart.height = 650;
        this.optionsBacklogChart.hAxis.viewWindow.min = 0;
        this.optionsBacklogChart.hAxis.viewWindow.max = this._backlogChart.length;
        this.optionsBacklogChart.hAxis.maxTextLines = 2;
        this.taskReportChartPresenter.drawLineChart(this.backlogChartContainer, this._backlogChart, this.optionsBacklogChart);
      },
        500);
    }
    if (methodToBeInvoked) methodToBeInvoked.call(chartType === CHART_TYPE.Task ? taskChart : backlogChart);
  }

  /** HostListener */
  // tslint:disable-next-line: prefer-inline-decorator
  @HostListener('document:webkitfullscreenchange', ['$event'])
  @HostListener('document:mozfullscreenchange', ['$event'])
  @HostListener('document:MSFullscreenChange', ['$event'])
  @HostListener('document:fullscreenchange', ['$event'])
  /** onKeydownHandler */
  public onKeydownHandler(event: KeyboardEvent): void {
    if (this.optionsTaskChart.width === '50%') {
      this.closeFullscreen(CHART_TYPE.Task);
    }
    if (this.optionsBacklogChart.width === '50%') {
      this.closeFullscreen(CHART_TYPE.Backlog);
    }
  }

  @HostListener('window:resize', ['$event'])
  public reSize(event?): void {
    if (this.taskChart) {
      this.taskReportChartPresenter.drawStackChart(this.taskChartContainer, this._taskChart, this.optionsTaskChart);
    }
    if (this.backlogChart) {
      this.taskReportChartPresenter.drawLineChart(this.backlogChartContainer, this._backlogChart, this.optionsBacklogChart);
    }
  }

  /** This method is responsible for zoom in functionality of barchart */
  public closeFullscreen(chartType: string): void {
    this.isFullScreenTaskChart = false;
    this.optionsTaskChart = this.taskReportChartPresenter.stackChartOption();
    if (this._taskChart.length <= 0) {
      this.optionsTaskChart.vAxis['viewWindow'] = { min: 0, max: 10 };
    }
    this.isFullScreenBacklogChart = false;
    this.optionsBacklogChart = this.taskReportChartPresenter.chartLineOptions();
    if (this._backlogChart.length <= 0) {
      this.optionsBacklogChart.vAxis['viewWindow'] = { min: 0, max: 10 };
    }

    setTimeout(() => {
      this.setNextPreviousView(CHART_TYPE.Task);
      this.taskReportChartPresenter.drawStackChart(this.taskChartContainer, this._taskChart, this.optionsTaskChart);
      this.setNextPreviousView(CHART_TYPE.Backlog);
      this.taskReportChartPresenter.drawLineChart(this.backlogChartContainer, this._backlogChart, this.optionsBacklogChart);
    }, 500);

    if (this.document.isFullScreenTaskChart || this.document.isFullScreenBacklogChart) {
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

  /** destroy */
  public ngOnDestroy(): void {
    this.destroy.next(true);
    this.destroy.unsubscribe();
  }

  /**
   *  This method is used to ebable and diasble next and previous 
   *  button as per requirement.
   */
  private setNextPreviousView(chartType: string): void {
    if (chartType === CHART_TYPE.Task) {
      if (this._taskChart.length > BARS_PER_WINDOW.Bar_Max) {
        this.disableTaskChartNextBtn(false);
      } else {
        this.disableTaskChartNextBtn();
      }
      this.disableTaskChartPrevBtn();
    } else {
      if (this._backlogChart.length > BARS_PER_WINDOW.Bar_Max) {
        this.disableBackLogChartNextBtn(false);
      } else {
        this.disableBackLogChartNextBtn();
      }
      this.disableBackLogChartPrevBtn();
    }
  }

  /** Get chart data */
  private getChart(): void {
    const options: ChartObject = {
      clientId: this.selectedClientId,
      year: this.selectedYear,
    }
    if (this.selectedClientId && this.selectedYear) {
      this.getChartList.emit(options);
    }
  }

  /** to enable/disable task-previous button */
  private disableTaskChartPrevBtn(flag: boolean = true): void {
    if (this.taskChartPrevBtn) {
      this.taskChartPrevBtn.nativeElement.disabled = flag;
    }
  }

  /** to enable/disable task-next button */
  private disableTaskChartNextBtn(flag: boolean = true): void {
    if (this.taskChartNextBtn) {
      this.taskChartNextBtn.nativeElement.disabled = flag;
    }
  }

  /** to enable/disable backlog-previous button */
  private disableBackLogChartPrevBtn(flag: boolean = true): void {
    if (this.backlogChartPrevBtn) {
      this.backlogChartPrevBtn.nativeElement.disabled = flag;
    }
  }

  /** to enable/disable backlog-next button */
  private disableBackLogChartNextBtn(flag: boolean = true): void {
    if (this.backlogChartNextBtn) {
      this.backlogChartNextBtn.nativeElement.disabled = flag;
    }
  }

  /** setChartWidth */
  private setChartHeightWidth(task: TaskReportChart[], backlog: BacklogChart[]): void {
    if ((task && task.length > 0) && (backlog && backlog.length <= 0)) {
      this.optionsBacklogChart.height = 350;
    }
    if ((task && task.length <= 0) && (backlog && backlog.length > 0)) {
      this.optionsTaskChart.height = 350;
    }
  }
}
