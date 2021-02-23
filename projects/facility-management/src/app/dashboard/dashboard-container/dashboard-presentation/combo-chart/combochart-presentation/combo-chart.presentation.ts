/**
 * @author : Bikash Das
 * @description : This is a presentation component class for combo chart
 */

import { ChangeDetectionStrategy, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { ChartService } from '../../../../dashboard-chart.service';
import { ComboChartResponseStatus } from '../../../../dashboard.model';
import { BaseChartPresentation } from '../../base-chart.presentation';
import { CombochartPresenter } from './../combochart-presenter/combochart-presenter.service';

@Component({
  selector: 'app-combo-chart-ui',
  templateUrl: './combo-chart.presentation.html',
  viewProviders: [CombochartPresenter],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComboChartPresentationComponent extends BaseChartPresentation {

  /** setter method to get all combochart legends as input */
  @Input() public set comboChartLegends(value: string[]) {
    this.getLegends = value;
  }

  /**
   * setter method to get combo cfart charts as input properties for copyit,bookit and fleet
   * Here generates the combo chart chart as per specific parameters and values
   */
  @Input() public set comboChartData(data: ComboChartResponseStatus) {
    if (data) {
      this.comboChartDetail = this.comboChartService.setComboChartData(data, this.getLegends);
      this.optionsBarChart = this.comboChartService.setOptionCombo(data.period);
      this.chartService.buildComboChart(
        this.comboChartContainer,
        this.comboChartDetail,
        this.optionsBarChart
      );
    }
  }

  @ViewChild('comboChartContainer', { static: false }) public comboChartContainer: ElementRef<HTMLDivElement>;

  public comboChartDetail: Object[];
  public optionsBarChart: Object;
  public getLegends: string[] = [];

  constructor(
    private comboChartService: CombochartPresenter,
    private chartService: ChartService
  ) {
    super();
  }

}
