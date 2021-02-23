/**
 * @name DecimalFormatPipe
 * @author Nitesh Sharma
 * @description This is a decimal format pipe which will set the decimal value as per the language selected
 */

import { Pipe, PipeTransform } from '@angular/core';
import { LanguageDataService } from '../../core/services/language/language-data.service';

/**
 * DecimalFormatPipe
 */
@Pipe({
  name: 'decimalFormat',
  // tslint:disable-next-line: pipe-impure
  pure: false
})
export class DecimalFormatPipe implements PipeTransform {

  /** It stores the culture value */
  private currentLanguage: string;
  /** It stores the last culture value */
  private lastCulture: string;
  /** It stores the last formatted value */
  private lastFormattedValue: string;
  /** It stores the last input value */
  private lastInputValue: number;

  constructor(private languageService: LanguageDataService) {
    this.languageService.languageChange$.subscribe((res: string) => {
      this.currentLanguage = res;
    });
  }

  /**
   * Transforms decimal format pipe
   * @param value 
   * @returns transform 
   */
  public transform(value: number): string {
    if (value !== this.lastInputValue || this.lastCulture !== this.currentLanguage) {
      this.lastFormattedValue = new Intl.NumberFormat(this.currentLanguage).format(value);
      // set the last value
      this.lastCulture = this.currentLanguage;
      this.lastInputValue = value;
    }
    return this.lastFormattedValue;
  }
}