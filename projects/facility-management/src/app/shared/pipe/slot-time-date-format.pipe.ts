import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import { TimeFormatPipe } from './time-format.pipe';

@Pipe({
  name: 'slotDateFormatPipe',
})
export class SlotTimeDateFormatPipe implements PipeTransform {
  /** transform */
  public transform(value: string, args: string): string {
    if(value && args) {
      var dif: number = Math.floor( ( (Date.now() - +new Date(value)) / 1000 ) / 86400 );
      let time: TimeFormatPipe = new TimeFormatPipe();
      args = time.transform(args)
    
      if (dif < 30) {
      return this.convertToNiceDate(value, args);
    } else {
      let datePipe: DatePipe = new DatePipe('en-US');
      value = datePipe.transform(value, 'MMMM d, y');
      return value+', '+args;
    }
    }
  }

  /** convertToNiceDate */
  // tslint:disable-next-line: cyclomatic-complexity
  public convertToNiceDate(time: string, args: string): string {
    var date: Date = new Date(time),
      diff: number = (new Date().getTime() - date.getTime()) / 1000,
      daydiff: number = Math.floor(diff / 86400);
    let datePipe: DatePipe = new DatePipe('en-US');
    time = datePipe.transform(time, 'MMMM d, y');

    if (isNaN(daydiff) || daydiff >= 31) {
      return '';
    }
    return (
      (daydiff === 0 &&
        ((diff < 60 && 'Today, '+ args) ||
          (diff < 120 && 'Today, '+ args) ||
          (diff < 3600 && 'Today, '+ args) ||
          (diff < 7200 && 'Today, '+ args) ||
          (diff < 86400 &&  'Today, '+ args))) ||
          (daydiff === 1 && 'Yesterday, '+ args) ||
          (daydiff < 7 && time +', '+ args) ||
          (daydiff < 31 && time +', '+ args)|| 
          (daydiff < 0 && time + ', '+ args) 
    );
  }
}
