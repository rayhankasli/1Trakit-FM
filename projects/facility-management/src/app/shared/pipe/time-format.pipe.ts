import { Pipe, PipeTransform } from '@angular/core';
// ----------------------------------------------- //

/** Time format Pipe */
@Pipe({
  name: 'timeFormat'
})
export class TimeFormatPipe implements PipeTransform {

  /**
   * Transforms time format pipe
   * @param value 
   * @returns transform 
   */
  public transform(value: string): string {
    let timeString: string = value;
    const H: number = +timeString.substr(0, 2);
    const h: number = (H % 12) || 12;
    const ampm: string = H < 12 ? 'AM' : 'PM';
    timeString = h + timeString.substr(2, 3) + ' ' + ampm;
    return timeString;
  }

}
