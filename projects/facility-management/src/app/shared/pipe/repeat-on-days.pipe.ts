import { Pipe, PipeTransform } from '@angular/core';
// ----------------------------------------------- //

/** ngbTimePicker Pipe */
@Pipe({
    name: 'repeatOnDays'
})
export class RepeatOnDaysPipe implements PipeTransform {

    /** omit provided texts for replacement */
    private readonly matchings: string[] = ['1st day', '2nd day', '3rd day', '5th day', 'last day'];

    /**
     * Transforms repeat-on days to readable text
     * Converts week days to short texts
     * @param value string
     * @returns string | null
     */
    public transform(value: string): string | null {
        if (!value) {
            return null;
        }

        if (this.matchings.indexOf(value.toLowerCase()) > -1) {
            return value;
        } else {
            return value.slice(0, 2);
        }
    }

}
