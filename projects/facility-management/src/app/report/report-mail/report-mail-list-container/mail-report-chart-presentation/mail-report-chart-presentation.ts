import { Component, ElementRef, EventEmitter, HostListener, Inject, Input, OnDestroy, OnInit, Output, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
// -------------------------------------------------- //
import { SidebarService } from 'common-libs';
// -------------------------------------------------- //
import { MailReportChartPresenter } from '../mail-report-chart-presenter/mail-report-chart.presenter';
import { ChartObject, ChartType, CHART_TYPE_OPTION, MailChartModel } from '../../report-mail.model';
import { ClientYearFilter } from '../../../report-model';

/** Component presentation */
@Component({
  selector: 'app-mail-report-chart-presentation',
  templateUrl: './mail-report-chart-presentation.html',
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [MailReportChartPresenter]
})
export class MailReportChartPresentationComponent implements OnInit, OnDestroy {

  /** This property is used to get filter data from parent component */
  @Input() public set filter(filter: ClientYearFilter) {
    if (filter) {
      const { clientId, year } = filter;
      if (clientId > 0 && (this.selectedClientId != clientId || this.selectedYear != year)) {
        this.selectedClientId = clientId;
        this.selectedYear = year;
        this.getChartData();
      }
    }
  }

  /** This property is used for get data from container component */
  @Input() public set baseResponse(baseResponse: MailChartModel[]) {
    if (!!baseResponse) {
      this._baseResponse = baseResponse;
      this.preparedData = this.mailReportChartPresenter.prepareData(this._baseResponse, this.statusOption);
      this.optionsMailChart = this.mailReportChartPresenter.mailChartOption(this.statusOption);
      if (this.isFullScreenChart) {
        this.setFullScreenOption();
      }
      setTimeout(() => {
        this.mailReportChartPresenter.drawStackChart(this.mailChartContainer, this.optionsMailChart, this.preparedData);
        baseResponse.length && this.setNextPreviousView();
      });
    }
  };
  public get baseResponse(): MailChartModel[] {
    return this._baseResponse;
  }

  /** Output emitter defined for emit IdObject and get chart and list by selected Id */
  @Output() public getChartListDataByClient: EventEmitter<ChartObject> = new EventEmitter(true);
  /** To-Do */
  @ViewChild('mailChartRef', { static: false }) public mailChartContainer: ElementRef<HTMLDivElement>;
  @ViewChild('content', { static: false }) public content: ElementRef<any>;
  /** provide  chartPrevBtn */
  @ViewChild('mailChartPrevBtn', { static: false }) public mailChartPrevBtn: ElementRef<HTMLButtonElement>;
  /** provide  chartNextBtn */
  @ViewChild('mailChartNextBtn', { static: false }) public mailChartNextBtn: ElementRef<HTMLButtonElement>;

  /** for group for  */

  public isFullScreenChart: boolean;
  public optionsMailChart: any;
  /** Client Id */
  public selectedClientId: number;
  public selectedYear: number;
  public chartType: ChartType[] = CHART_TYPE_OPTION;
  public statusOption: number;
  /** create for getter setter */
  private _baseResponse: MailChartModel[];
  private preparedData: any;
  private destroy: Subject<void>;

  constructor(
    private sidebarService: SidebarService,
    private mailReportChartPresenter: MailReportChartPresenter,
    @Inject(DOCUMENT) private document: any
  ) {
    this.destroy = new Subject();
    this.statusOption = 1;
    this.isFullScreenChart = false;
  }

  /** Init method */
  public ngOnInit(): void {
    this.sidebarService.isCollapsed.pipe(takeUntil(this.destroy)).subscribe(flag => {
      setTimeout(() => {
        if (this.preparedData) this.onResize(event);
      }, 500);
    })
  }
  /** Destroy method */
  public ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }

  /** on change status */
  public onStatusChange(status): void {
    this.getChartData();
  }

  /** clickNextButton */
  public clickNextButton(): void {
    this.disableChartPrevBtn(false);
    this.optionsMailChart.hAxis.viewWindow.min += 7;
    this.optionsMailChart.hAxis.viewWindow.max += 7;
    this.mailReportChartPresenter.drawStackChart(this.mailChartContainer, this.optionsMailChart, this.preparedData);

    if ((this._baseResponse.length - this.optionsMailChart.hAxis.viewWindow.max) <= 0) {
      this.disableChartNextBtn();
    }
  }

  /** This method is called clicking on previous button of bar chart to show previous 5 bar chart status */
  public clickPrevButton(): void {
    this.disableChartNextBtn(false);
    this.optionsMailChart.hAxis.viewWindow.min -= 7;
    this.optionsMailChart.hAxis.viewWindow.max -= 7;
    this.mailReportChartPresenter.drawStackChart(this.mailChartContainer, this.optionsMailChart, this.preparedData);
    if (this.optionsMailChart.hAxis.viewWindow.min === 0) {
      this.disableChartPrevBtn();
    }
  }

  /**
   *  This method is used to ebable and diasble next and previous 
   *  button as per requirement.
   */
  public setNextPreviousView(): void {
    if (this._baseResponse.length > 7) {
      this.disableChartNextBtn(false);
    } else {
      this.disableChartNextBtn();
    }
    this.disableChartPrevBtn();
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
    this.optionsMailChart = this.mailReportChartPresenter.mailChartOption(this.statusOption);

    setTimeout(() => {
      this.setFullScreenOption();
      this.mailReportChartPresenter.drawStackChart(this.mailChartContainer, this.optionsMailChart, this.preparedData);
    }, 500);

    if (methodToBeInvoked) methodToBeInvoked.call(elem);
  }

  /**
   * Hosts listener
   * @param event 
   */
  // tslint:disable-next-line: prefer-inline-decorator
  @HostListener('window:resize', ['$event'])
  public onResize(event): void {
    setTimeout(() => {
      this.mailReportChartPresenter.drawStackChart(this.mailChartContainer, this.optionsMailChart, this.preparedData);
    }, 500);
  }

  /** handle full screen */
  // tslint:disable-next-line: prefer-inline-decorator
  @HostListener('document:webkitfullscreenchange', ['$event'])
  @HostListener('document:mozfullscreenchange', ['$event'])
  @HostListener('document:MSFullscreenChange', ['$event'])
  @HostListener('document:fullscreenchange', ['$event'])
  public onKeydownHandler(event: KeyboardEvent): void {
    if (this.optionsMailChart.width === '50%') {
      this.closeFullscreen();
    }
  }
  /** This method is responsible for zoom in functionality of barchart */
  public closeFullscreen(): void {

    this.isFullScreenChart = false;
    this.optionsMailChart = this.mailReportChartPresenter.mailChartOption(this.statusOption, this.isFullScreenChart);

    setTimeout(() => {
      this.setNextPreviousView();
      this.mailReportChartPresenter.drawStackChart(this.mailChartContainer, this.optionsMailChart, this.preparedData);
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

  /** Get chart data */
  private getChartData(): void {
    let chartObj: ChartObject = {
      clientId: this.selectedClientId,
      chartType: this.statusOption,
      year: this.selectedYear
    }
    if (this.selectedClientId && this.selectedYear) {
      this.getChartListDataByClient.next(chartObj);
    }
  }

  /** set full screen chart options */
  private setFullScreenOption(): void {
    this.optionsMailChart.width = '50%';
    this.optionsMailChart.height = 650;
    this.optionsMailChart.hAxis.viewWindow.min = 0;
    this.optionsMailChart.hAxis.viewWindow.max = this.baseResponse.length;
    this.optionsMailChart.hAxis.maxTextLines = 2;
  }

  /** to enable/disable previous button */
  private disableChartPrevBtn(flag: boolean = true): void {
    if (this.mailChartPrevBtn) {
      this.mailChartPrevBtn.nativeElement.disabled = flag;
    }
  }

  /** to enable/disable next button */
  private disableChartNextBtn(flag: boolean = true): void {
    if (this.mailChartNextBtn) {
      this.mailChartNextBtn.nativeElement.disabled = flag;
    }
  }
}