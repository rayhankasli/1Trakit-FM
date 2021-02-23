import { Injectable } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
// ---------------------------------------- //
import { minSelectedCheckboxes } from 'common-libs';
// ------------------------------------------------------------------ //
import { WeekDays } from '../../../../core/model/common.model';
import { Repeat_Type } from '../../../../core/model/repeats-on.model';

@Injectable()
export class RepeatOnPresenter {

  /** Determines whether form submitted is ture or false */
  public isFormSubmitted: boolean;
  /** This is used for subscribing the value of subject add */
  public save$: Observable<any>;
  /** This is used for set the data */
  private save: Subject<any>;

  constructor(
    private formBuilder: FormBuilder
  ) {
    this.isFormSubmitted = false;
    this.save = new Subject();
    this.save$ = this.save.asObservable();
  }

  /**
   * buildsForm used for load the form
   * @returns form
   */
  public buildForm(): FormGroup {
    return this.formBuilder.group({
      repeatType: ['', [Validators.required]],
      every: ['', [Validators.required, Validators.min(1), Validators.max(53)]],
      repeatsOnDay: this.formBuilder.array([], [minSelectedCheckboxes(1)])
    });
  }

  /**
   * Validate Every control
   * @param formGroup 
   * @param repeatType 
   */
  public validateEvery(formGroup: FormGroup, repeatType: number): any {

    const everyControl: AbstractControl = formGroup.get('every');

    if (repeatType === Repeat_Type.WEEKLY) {
      everyControl.setValidators([Validators.required]);
    } else if (repeatType === Repeat_Type.OTHERS) {
      everyControl.setValidators([]);
    }
    everyControl.updateValueAndValidity();
  }

  /** Get week Days list */
  public getDaysList(weekDays: WeekDays[], repeatType: number): WeekDays[] {

    let daysList: WeekDays[] = weekDays && weekDays.map((weekDay: WeekDays) => weekDay)
      .filter((weekDay: WeekDays) => weekDay.repeatType === repeatType);

    return [...daysList];
  }

  /**
   * Add week days controls
   * @param formGroup
   * @param weekDays
   */
  public addWeekControls(formGroup: FormGroup, weekDays: WeekDays[], repeatType: number): FormGroup {
    if (formGroup.value) {
      formGroup.reset();
    }

    const repeatsControl: AbstractControl = formGroup.get('repeatType');
    repeatsControl.setValue(repeatType);

    let formArrayControls: FormArray = formGroup.get('repeatsOnDay') as FormArray;
    formArrayControls.clear();

    weekDays && weekDays.forEach((c) => {
      formArrayControls.push(new FormControl(false));
    });

    formGroup.setControl('repeatsOnDay', this.formBuilder.array(formArrayControls.controls, [minSelectedCheckboxes(1)]));
    return formGroup;
  }

  /**
   * Bind Form Control Value
   * @param formGroup
   * @param repeatsOnObj
   */
  public bindControlValue(formGroup: FormGroup, repeatOn: any, weekDays: WeekDays[]): FormGroup {
    let repeatOnControls: FormArray = formGroup.get('repeatsOnDay') as FormArray;
    repeatOn.repeatsOnDay && repeatOn.repeatsOnDay.forEach((res) => {
      let findIndexRepeatOn: number = weekDays.findIndex((v: WeekDays) => {
        return v.weekDayId === res.weekDayId;
      });
      let findControl: AbstractControl = repeatOnControls.at(findIndexRepeatOn);
      findControl.setValue(true)
    })
    if (repeatOn.repeats) {
      formGroup.get('repeats').setValue(repeatOn.repeats);
    }
    if (repeatOn.every) {
      formGroup.get('every').setValue(repeatOn.every);
    }

    return formGroup;
  }

  /**
   * Save Repeats on weekday
   * @param formGroup
   * @param weekDays
   */
  public saveRepeatsOn(formGroup: FormGroup, weekDays: WeekDays[]): void {
    if (formGroup.valid) {
      this.isFormSubmitted = false;
      const formValue: any = formGroup.getRawValue();
      const selectedWeekDay = formValue.repeatsOnDay
        .map((value, index) => value ? weekDays[index].weekDayId : null)
        .filter(value => value !== null);
      formGroup.value.repeatsOnDay = selectedWeekDay;
      formGroup.value.repeats = parseInt(formGroup.value.repeats);
      formGroup.value.every = parseInt(formGroup.value.every);
      this.save.next(formGroup.value);
    } else {
      this.isFormSubmitted = true;
    }
  }
}
