/**
 * @author Mitul Patel
 * @description To manage copy-center presentation
 */
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { CopyItInfo } from '../../../../../shared/modules/copy-it-print-details/models/copyit-info/copyit-info';
import { NgbTimePickerPipe } from '../../../../../shared/pipe/ngb-time-picker.pipe';

@Injectable()
export class CopyCenterPresenter {

  /** Form submitted flag */
  public isFormSubmitted: boolean;
  /** save changes observable used from presentation */
  public saveChanges$: Observable<CopyItInfo>;
  /** save changes subject */
  private saveChanges: Subject<CopyItInfo>;

  constructor(
    private fb: FormBuilder,
    private NgbTimePickerPipe: NgbTimePickerPipe
  ) {
    this.saveChanges = new Subject();
    this.saveChanges$ = this.saveChanges.asObservable();
  }

  /** Generate copy center form */
  public getCopyCenterForm(): FormGroup {
    return this.fb.group({
      associateName: [{ value: null, disabled: true }],
      completedDate: [{ value: null, disabled: true }],
      completedTime: [{ value: null, disabled: true }],
      isQualityCheck: [null],
    });
  }

  /** Patch form control */
  public bindControlValue(form: FormGroup, copyItInfo: CopyItInfo): FormGroup {
    if (copyItInfo) {
      copyItInfo.completedTime = this.NgbTimePickerPipe.transform(copyItInfo.completedTime);
      form.patchValue(copyItInfo);
    }
    return form;
  }

  /** Validate copyIt form controls and return patched value  */
  public validateForm(form: FormGroup, copyItInfo: CopyItInfo): void {
    if (form.valid) {
      this.isFormSubmitted = false;
      // update existing info if exist
      const detail: CopyItInfo = copyItInfo ? { ...copyItInfo, ...form.getRawValue() } : form.getRawValue();
      this.saveChanges.next(detail);
    } else {
      // actions to show validation message
      this.isFormSubmitted = true;
    }
  }
}
