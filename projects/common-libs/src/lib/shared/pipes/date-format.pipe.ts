/**
 * @name DateFormatPipe
 * @author Nitesh Sharma
 * @description This is a date format pipe which will set the date format as per the language selected
 */

import { Pipe, PipeTransform } from '@angular/core';
import { LanguageDataService } from '../../core/services/language/language-data.service';
/**
 * DateFormatPipe
 */
@Pipe({
    name: 'dateFormat',
    // tslint:disable-next-line: pipe-impure
    pure: false
})
export class DateFormatPipe implements PipeTransform {

    /** It stores the culture value */
    private currentLanguage: string;
    /** It stores the last culture value */
    private lastCulture: string;
    /** It stores the last formatted value */
    private lastFormattedValue: string;
    /** It stores the last input value */
    private lastInputValue: Date;

    constructor(private languageService: LanguageDataService) {
        this.languageService.languageChange$.subscribe((res: string) => {
            this.currentLanguage = res;
        });
    }

    /**
     * Transforms date format pipe
     * @param value 
     * @returns transform 
     */
    public transform(value: Date): string {
        if (value !== this.lastInputValue || this.lastCulture !== this.currentLanguage) {
            this.lastFormattedValue = new Intl.DateTimeFormat(this.currentLanguage).format(value);
            // set the last value
            this.lastCulture = this.currentLanguage;
            this.lastInputValue = value;
        }
        return this.lastFormattedValue;
    }
}