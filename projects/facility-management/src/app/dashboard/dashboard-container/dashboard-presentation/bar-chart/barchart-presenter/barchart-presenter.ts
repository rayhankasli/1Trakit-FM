/**
 * @author : Bikash Das
 * @description : This is a presenter service for barchart component
 */
import { Injectable } from '@angular/core';
import { BAR_LINE, ChartColor } from '../../../../dashboard.enum';
import { AssociateGraph, ClientStatusChart, TimeTaken, UserName } from '../../../../dashboard.model';

@Injectable()
export class BarchartPresenter {
  private isAnnotation: boolean;
  private legendData: any[] = [];
  private associateLabel: string;

  private getAssociateGraph: any[] = [];
  private allNums: number[] = [];
  private allMaxNums: number[] = [];

  private setMaxBarValue: number;
  constructor() { }

  /**
   * getting all data require to form a bar chart including legends and it's values
   * @param barChartDetail
   * @param value
   * @param legends
   * @param annotation
   */
  public setBarChartData(value: Array<Object>, legends: any, annotation?: boolean): Object[] {
    this.legendData = legends;
    this.isAnnotation = annotation;
    if (this.isAnnotation)
      this.getMaxValue(value);
    return this.returnBarChart(value);
  }

  /**
   * provide to setoptionBar for bar chart configurations and properties.
   */

  public setoptionBar(isZoom?: boolean): Object {
    return {
      height: 350,
      minWidth: 400,
      maxWidth: '100%',
      bar: {
        groupWidth: 15,
      },
      chartArea: {
        width: '100%',
        left: isZoom ? 50 : 40,
      },
      isStacked: true,
      legend: {
        position: 'none',
      },
      fontName: 'Poppins',
      fontSize: 13,
      lineWidth: 1,
      hAxis: {
        maxAlternation: 1,
        maxTextLines: 2,
        showTextEvery: 1,
        viewWindowMode: 'maximized',
        viewWindow: { min: 0, max: 5 },
      },
      vAxis: {
        viewWindow: this.isAnnotation ? { min: 0, max: this.setMaxBarValue } : '',
        scaleType: 'mirrorLog'
      },
      annotations: {
        alwaysOutside: true,
        textStyle: {
          color: '#444851',
        },
      },

      series: this.isAnnotation ?
        {
          0: { color: ChartColor.Yellow },
          1: { color: ChartColor.Green },
          2: { color: ChartColor.Purple },
          3: { color: ChartColor.Brown },
          4: { color: ChartColor.Black },
          5: { color: ChartColor.Gray },
        } :
        {
          0: { color: ChartColor.Blue },
          1: { color: ChartColor.Yellow },
          2: { color: ChartColor.Green },
          3: { color: ChartColor.Purple },
          4: { color: ChartColor.Red },
          5: { color: ChartColor.Brown },
          6: { color: ChartColor.Black },
          7: { color: ChartColor.Gray },
        },
    };
  }

  /**
   * This method is responsible for creating a proper array Object
   * structure format to form  a bar chart
   * @param newVal
   */
  private returnBarChart(newVal: any): Object[] {
    let arr: any[] = [];
    for (let i: number = 0; i < newVal.length; i++) {
      if (this.isAnnotation) {
        arr[0] = this.legendData;
        const userName: UserName[] = Object.values(newVal[i].userName);
        const companyName: any = Object.values(newVal[i].associateGraph)[0];
        if (companyName != null) {
          this.associateLabel = userName + ' ' + '[' + companyName + ']';
        } else {
          this.associateLabel = null;
        }
        newVal[i].associateGraph.companyName = this.associateLabel;
        const values: AssociateGraph[] = Object.values(newVal[i].associateGraph);
        const value2: TimeTaken[] = Object.values(newVal[i].timeTaken);
        value2.forEach((x: any) => values.push(x));
        arr.push(values);
      } else {
        arr[0] = this.legendData;
        const values: ClientStatusChart[] = Object.values(newVal[i]);
        arr.push(values);
      }
    }
    return arr;
  }

  /** 
   *  calculating the maximum value coming of associate chart data for 
   *  coming for service and adjust the view accordingly to show bar line
   *  at top.
   */
  private getMaxValue(val: any): void {
    for (let i = 0; i < val.length; i++) {
      this.getAssociateGraph = Object.values(val[i].associateGraph);
      for (let i = this.getAssociateGraph.length - 1; i >= 1; i--) {
        this.allNums[i] = this.getAssociateGraph[i];
      }
      this.allMaxNums.push(this.allNums.reduce((a: number, b: number) => a + b, 0));
    }
    const maxValue: number = Math.max(...this.allMaxNums);
    this.setMaxBarValue = maxValue + BAR_LINE.Line;
  }

}
