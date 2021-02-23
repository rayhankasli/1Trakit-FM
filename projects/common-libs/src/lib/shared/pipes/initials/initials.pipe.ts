import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'initials'
})
export class InitialsPipe implements PipeTransform {

  transform(value: any, max: number = 2): any {
    let matches: any[];
    if (!value) {
      return '-';
    }
    if (value.toString().indexOf(' ') > -1 || value.toString().indexOf('.') > -1) {
      matches = value.match(/\b(\w)/g).slice(0, max);
    } else {
      matches = [value[0], value[1]];
    }
    value = matches.join('').toUpperCase();

    return value;
  }

}
