import { AbstractControl } from '@angular/forms';

export class ValidateFormGroup {

    /** ValidateForm */
    public static ValidateForm(abstractControl: AbstractControl): any {
        if (
            abstractControl.get('currentColorRead').value > 0
            || abstractControl.get('currentBwRead').value > 0
            || abstractControl.get('currentScanRead').value > 0) {
            if (abstractControl.get('currentColorRead').hasError('ValidateForm')) {
                abstractControl.get('currentColorRead').setErrors({
                    ValidateForm: null
                });
                abstractControl.get('currentColorRead').updateValueAndValidity();
            }
            return null;

        } else {
            abstractControl.get('currentColorRead').setErrors({
                ValidateForm: true
            })

        }
    }

}