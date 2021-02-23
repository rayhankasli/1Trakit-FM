import { FormGroup, AbstractControl } from '@angular/forms';

/** compare two dates */
export function dateLessThan(from: string, to: string): any {
    return (group: FormGroup): { [key: string]: any } => {
        const fromDate: AbstractControl = group.controls[from];
        const endDate: AbstractControl = group.controls[to];
        if (fromDate.value && endDate.value) {
            if (fromDate.value >= endDate.value) {
                return {
                    dates: 'Start date should be less than end date'
                };
            }
        }
        return {};
    };
}

/**
 * Compare two dates
 * @param from Get the From date
 * @param to Get the TO date
 */
export function compareDates(from: string, to: string): any {
    return (group: FormGroup): { [key: string]: any } => {
        if (group.parent) {
            const fromDate: AbstractControl = group.parent.controls[from];
            // const repeatsOnFormGroup: FormGroup = group.controls.repeatsOn as FormGroup;
            const endDate: AbstractControl = group.controls[to];
            if (fromDate.value && endDate && endDate.value) {
                if (fromDate.value > endDate.value) {
                    return {
                        dates: 'Start date should be less than end date'
                    };
                }
            }
        }
        return {};
    };
}

/** compare two time */
export function compareTimes(from: string, to: string): any {
    return (group: FormGroup): { [key: string]: any } => {
        const fromTime: AbstractControl = group.controls[from];
        const endTime: AbstractControl = group.controls[to];
        if (fromTime.value && endTime.value) {
            // const pattern: RegExp = new RegExp('^[0-9]*$');
            // if (pattern.test(fromTime.value) && pattern.test(endTime.value)) {
            if (Number(fromTime.value.replace(':', '.')) >= Number(endTime.value.replace(':', '.'))) {
                return {
                    invalidTime: 'Error'
                };
            }
            // }
        }
        return {};
    };
}

/**
 * Validates single uploaded file size
 * @param maxSize 
 * @returns file size 
 */
export function validateSingleFileSize(maxSize: number): { [key: string]: any } {
    return (c: any): any => {
        return maxSize && c.value && c.value.size / 1024 > maxSize ? { maxFileSize: true } : null;
    }
}

/**
 * Validates file size
 * @param maxSize 
 * @returns file size 
 */
export function validateFileSize(maxSize: number): { [key: string]: any } {
    return (files: any): any => {
        if (files && !files.value) { return null; };
        let flag: any;
        for (const file of files.value) {
            flag = maxSize && file.size && file.size / 1024 > maxSize ? { maxFileSize: true } : null;
            if (flag) { break; }
        }
        return flag;
    }
}