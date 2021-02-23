import { ValidatorFn, FormArray } from '@angular/forms';

/**
 * Validate form array against 'min' records is having min checkboc check requied
 * @param min Minimum length
 */
export function minSelectedCheckboxes(min = 1) {
  const validator: ValidatorFn = (formArray: FormArray) => {
    const totalSelected = formArray.controls
      .map(control => control.value)
      .reduce((prev, next) => next ? prev + next : prev, 0);
    return totalSelected >= min ? null : { requireOneCheckbox: true };
  };
  return validator;
}
