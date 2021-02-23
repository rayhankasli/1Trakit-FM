import { Pipe, PipeTransform } from '@angular/core';
// ----------------------------------------------- //

/** ngbTimePicker Pipe */
@Pipe({
    name: 'ngbTimePicker'
})
export class NgbTimePickerPipe implements PipeTransform {

    /**
     * Transforms time format pipe
     * @param value 
     * @returns transform 
     */
    public transform(value: string): string | null {
        if (!value) {
            return null;
        }
        let split: string[] = value.toString().split(':');
        const H: number = parseInt(split[0].replace(/[^\x00-\x7F]/g, ''), 10);
        const h: number = (H % 12) || 12;
        const m: string = split[1].replace(/[^\x00-\x7F]/g, '');
        const ampm: string = H < 12 ? 'AM' : 'PM';
        return h + ':' + m + ' ' + ampm;
    }

}
