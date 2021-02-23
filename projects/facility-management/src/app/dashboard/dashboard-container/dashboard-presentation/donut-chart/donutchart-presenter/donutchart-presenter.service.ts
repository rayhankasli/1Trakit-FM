/**
 * @author: Bikash Das
 * @description: This is a presenter service for DonutChart
 */

import { Injectable } from '@angular/core';
import { ChartColor } from '../../../../dashboard.enum';
import { BookItChartStatusResponse, CopyItChartStatusResponse, FleetChartStatus } from '../../../../dashboard.model';

@Injectable()
export class DonutchartPresenter {
  public getLegends: string[] = [];
  public allLegends: string[] = [];
  public copyItLegends: CopyItChartStatusResponse;
  public bookItLegends: BookItChartStatusResponse;
  public fleetLegends: FleetChartStatus;
  public headerObj: Object;

  public tempData: any;
  public valObj: Array<Object> = [];
  public legends: string[] = [];

  /**
   * This method is responsible for creating a proper array Object format to form
   *  a donut chart
   */
  public extractData(): Object[] {
    this.headerObj = { title: 'Header' };
    let donutMap: any = new Map();
    for (let i: number = 0; i < this.legends.length; i++) {
      donutMap.set([this.legends[i]], Object.values(this.tempData)[i])
    }
    let obj: Object = {};
    donutMap.forEach((value, key) => {
      obj[key] = value
    });

    const concatObj: Object = { ...this.headerObj, ...obj };
    this.valObj = Object.entries(concatObj);
    return this.valObj;
  }

  /**
   * getting all data require to form a donut chart including legends and it's values
   * @param donutChartDetail 
   * @param value 
   * @param legends 
   */
  public setDonutChartDataForCopyIt(value: any, legends: string[]): Object[] {

    this.legends = legends;
    this.getLegends.push(value);
    this.tempData = value;
    return this.extractData();
  }

  /**
   * provide to setOptionsDonut for donut chart configurations and properties.
   */
  public setOptionsDonut(): Object {
    return {
      pieHole: 0.7,
      pieSliceText: 'none',
      width: 200,
      height: 200,
      chartArea: {
        width: '90%',
        height: '90%',
      },
      fontName: 'Poppins',
      fontSize: 13,
      legend: {
        position: 'none',
      },
      slices: {
        0: { color: ChartColor.Green },
        1: { color: ChartColor.Yellow },
        2: { color: ChartColor.Blue },
        3: { color: ChartColor.Purple },
        4: { color: ChartColor.Red },
        5: { color: ChartColor.Brown },
        6: { color: ChartColor.Black },
        7: { color: ChartColor.Gray },
      }
    }
  }
}

