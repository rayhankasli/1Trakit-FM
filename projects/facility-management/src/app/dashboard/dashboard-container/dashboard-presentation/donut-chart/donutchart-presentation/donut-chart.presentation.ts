/**
 * @author : Bikash das
 * @description: This is a presentation component for DonutChart
 */
import { ChangeDetectionStrategy, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { ChartService } from '../../../../dashboard-chart.service';
import { BookItChartStatusResponse, CopyItBookItParentResponse, CopyItChartStatusResponse, FleetChartStatus } from '../../../../dashboard.model';
import { BaseChartPresentation } from '../../base-chart.presentation';
import { DonutchartPresenter } from './../donutchart-presenter/donutchart-presenter.service';

@Component({
  selector: 'app-donut-chart-ui',
  templateUrl: './donut-chart.presentation.html',
  viewProviders: [DonutchartPresenter],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DonutChartPresentationComponent extends BaseChartPresentation {

  /**
   * input property to define chart type
   */
  @Input() public chartType: string;


  /** setter method to get all chart legends */
  @Input() public set chartLagends(val: string[]) {
    this.legends = val;
  }
  /**
   * setter method to get donut charts as input properties for copyit,bookit and fleet
   * Here generates the donut chart as per specific parameters and values
   */
  @Input() public set donutChartData(data: any) {
    if (this.chartType === 'fleet') {
      this.isFleet = true;
    }
    if (data) {
      this.isEmpty = Object.values(data).every((o: number) => o === 0);
      this.getLegend = data;
      this.getDonutData = data;
      this.donutChartDetail = this.chartPresenter.setDonutChartDataForCopyIt(
        this.getDonutData,
        this.legends
      );

      this.optionsDonut = this.chartPresenter.setOptionsDonut();
      this.chartService.buildDonutChart(
        this.donutChartContainer,
        this.donutChartDetail,
        this.optionsDonut
      );
    }
  }

  @ViewChild('donutChartContainer', { static: false }) public donutChartContainer: ElementRef<HTMLDivElement>;

  public isFleet: boolean = false;
  public donutChartDetail: Object[];
  public optionsDonut: Object;
  public getLegend: CopyItBookItParentResponse;
  public legends: string[] = [];
  public isEmpty: boolean;

  private getDonutData: CopyItChartStatusResponse | BookItChartStatusResponse | FleetChartStatus;

  constructor(
    private chartPresenter: DonutchartPresenter,
    private chartService: ChartService
  ) {
    super()
  }
}
