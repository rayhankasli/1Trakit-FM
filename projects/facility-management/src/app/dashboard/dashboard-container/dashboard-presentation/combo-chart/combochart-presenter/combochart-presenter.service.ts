/**
 * @author : Bikash Das
 * @description : This is a presenter service for combo chart component
 */

import { Injectable } from '@angular/core';
import { getMaximumFrom, roundToN } from 'projects/facility-management/src/app/core/utility/utility';
import { ChartColor } from '../../../../dashboard.enum';
import { ComboChartResponseStatus, Period } from '../../../../dashboard.model';

@Injectable()
export class CombochartPresenter {
  public legenddata: string[] = [];

  constructor() { }

  /**
   * getting all data require to form a combo chart including legends and it's values
   * @param comboChartDetail
   * @param value
   * @param legends
   */
  public setComboChartData(value: ComboChartResponseStatus, legends: string[]): Object[] {
    this.legenddata = legends;
    return this.returnComboChart(value);
  }


  /**
   * provide to setOptionCombo for combo chart configurations and properties.
   */
  public setOptionCombo(data: Period[]): Object {
    // find and set max vAxis: default 10
    const vAxisMax: number = roundToN(getMaximumFrom(data));
    return {
      minHeight: 400,
      minWidth: 450,
      maxWidth: '100%',
      hAxis: {
        maxValue: 11,
        maxAlternation: 1,
        maxTextLines: 2,
        showTextEvery: 1,
      },
      vAxis: {
        viewWindow: { min: 0, max: vAxisMax }
      },
      seriesType: 'bars',
      chartArea: {
        width: '100%',
        top: 20,
        left: 30,
      },
      bar: {
        groupWidth: 10,
      },
      series: {
        0: { color: ChartColor.Gray },
        1: { color: ChartColor.Red, type: 'line' },
      },
      fontName: 'Poppins',
      fontSize: 13,
      legend: {
        position: 'none',
      },
    };
  }


  /**
   * This method is responsible for creating a proper array Object
   * structure format to form  a combo chart
   * @param newVal
   */
  private returnComboChart(newVal: ComboChartResponseStatus): Object[] {
    let arr: any[] = [];
    let arrFormat: Array<Object> = [{}];
    arr[0] = this.legenddata;
    if (newVal.period != null) {
      Object.values(newVal.period).forEach((data: Period) => {
        arrFormat.push(Object.values(data));
      });
    }
    arrFormat[0] = arr[0];
    return arrFormat;
  }

}
