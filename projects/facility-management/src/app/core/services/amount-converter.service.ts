/** 
 * @author Shahbaz Shaikh.
 * @description AmountConverterService
 */

import { Injectable } from '@angular/core';
import { DecimalPipe } from '@angular/common';
// ----------------------------------------------------- //
import { Data } from '../../core/model/chart-data.model';

@Injectable()
export class AmountConverterService {

  constructor(
    private decimalPipe: DecimalPipe
  ) { }

  /** To-Do */
  public addCommaSeparate(yearlyList: any[]): any[] {

    let yearlyReportList: any[] = []

    yearlyList.forEach((response: any) => {

      let yearValue: any = []

      response.data.forEach((item: Data) => {
        let yearAndValue: Data = new Data();
        yearAndValue.year = item.year;
        yearAndValue.value = (item.value !== null) ? (this.decimalPipe.transform(item.value)) : '-';

        yearValue.push(yearAndValue);
      });

      let monthAndYear: any = {
        month: response.month,
        data: yearValue
      }

      yearlyReportList.push(monthAndYear);
    })

    return yearlyReportList;

  }
}


