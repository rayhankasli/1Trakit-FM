import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
// ------------------------------------------------------------ //
import { WeekDays } from '../../../../core/model/common.model';
import { Repeat_Type } from '../../../../core/model/repeats-on.model';
import { RepeatOnPresenter } from '../repeat-on-presenter/repeat-on-presenter';
import { LableValuePair, RepeatsOn, REPORT_TYPE_LIST } from '../repeats-on.model';

@Component({
  selector: 'app-repeat-on-presentation',
  templateUrl: './repeat-on-presentation.component.html',
  viewProviders: [RepeatOnPresenter]
})
export class RepeatOnPresentationComponent implements OnInit, OnDestroy {

  /** show/hide Weekly or Others */
  @Input() public isWeekly: boolean;

  /** Get the repeats on details object */
  @Input() public set repeatOn(value: RepeatsOn | any) {
    if (value) {
      value.repeatType = value.repeatType;
      this._repeatOn = value;
      if (!this.weekDays) return;
    }
  }
  public get repeatOn(): RepeatsOn | any {
    return this._repeatOn;
  }

  /** Get the repeats on master array */
  @Input() public set weekDays(value: WeekDays[]) {
    if (value) {
      this._weekDays = value;
      this.weekDaysList = this.repeatOnPresenter.getDaysList(this._weekDays, Repeat_Type.WEEKLY);
      this.othersDaysList = this.repeatOnPresenter.getDaysList(this._weekDays, Repeat_Type.OTHERS);
      this.addWeekControls(this.formGroup, this.weekDaysList, Repeat_Type.WEEKLY);
      if (!this.repeatOn) return;
      if (this._repeatOn.repeatType === Repeat_Type.WEEKLY) {
        this.bindControlValue(this.formGroup, this.repeatOn, this.weekDaysList);
      } else {
        this.isOthers = true;
        this.setEveryValidation(this.formGroup, Repeat_Type.OTHERS);
        this.addWeekControls(this.formGroup, this.othersDaysList, Repeat_Type.OTHERS);
        this.bindControlValue(this.formGroup, this.repeatOn, this.othersDaysList);
      }
    }
  }
  public get weekDays(): WeekDays[] {
    return this._weekDays;
  }

  /** This property is used for emit data to component */
  @Output() public save: EventEmitter<any>;
  /** This property is used for emit data to component */
  @Output() public cancel: EventEmitter<void>;

  /** From Group */
  public formGroup: FormGroup;
  /** isValid */
  public isValid: boolean;
  /** Destroy are use for unsubscribe the subscribe observable  */
  public destroy: Subject<void>;
  /** repeatsTypeList */
  public repeatsTypeList: LableValuePair[];
  /** is others or not */
  public isOthers: boolean;
  /** WeekDays list */
  public weekDaysList: WeekDays[];
  /** others day list */
  public othersDaysList: WeekDays[];

  /** Determines whether form submitted is ture or false */
  public get isFormSubmitted(): boolean {
    return this.repeatOnPresenter.isFormSubmitted;
  }


  /** _repeatsOnDetail */
  private _repeatOn: RepeatsOn | any;
  /** Repeat on master array */
  private _weekDays: WeekDays[];

  constructor(
    private repeatOnPresenter: RepeatOnPresenter
  ) {
    this.initProp();
  }

  /** ngOnInit */
  public ngOnInit(): void {
    this.repeatOnPresenter.save$.pipe(takeUntil(this.destroy)).subscribe((repeatsOn: any) => {
      this.save.emit(repeatsOn);
    });
  }

  /** This method used for unsubscribe */
  public ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }

  /** Public Method */

  /** on Change Repeats */
  public onChangeRepeats(repeats: LableValuePair): void {
    const repeatType: number = repeats.value;
    if (repeatType === Repeat_Type.WEEKLY) {
      this.isOthers = false;
      this.setEveryValidation(this.formGroup, repeatType);
      this.addWeekControls(this.formGroup, this.weekDaysList, Repeat_Type.WEEKLY)
    } else {
      this.isOthers = true;
      this.setEveryValidation(this.formGroup, repeatType);
      this.addWeekControls(this.formGroup, this.othersDaysList, Repeat_Type.OTHERS)
    }
  }

  /** Save */
  public onSave(): void {
    this.isValid = true;
    if (this.isOthers) {
      this.repeatOnPresenter.saveRepeatsOn(this.formGroup, this.othersDaysList);
    } else {
      this.repeatOnPresenter.saveRepeatsOn(this.formGroup, this.weekDaysList);
    }
  }

  /** Cancel */
  public onCancel(): void {
    this.cancel.emit();
    if (!this.repeatOn) return;
    if (this.repeatOn.repeatType === Repeat_Type.WEEKLY) {
      this.isOthers = false;
      this.addWeekControls(this.formGroup, this.weekDaysList, Repeat_Type.WEEKLY);
      this.bindControlValue(this.formGroup, this.repeatOn, this.weekDaysList);
    } else {
      this.isOthers = true;
      this.addWeekControls(this.formGroup, this.othersDaysList, Repeat_Type.OTHERS);
      this.bindControlValue(this.formGroup, this.repeatOn, this.othersDaysList);
    }
  }

  /** to optimize DOM */
  public trackBy(key: string, index: number, data: any): number {
    return data[key];
  }

  /** Private Method */

  /** initProp */
  private initProp(): void {
    this.repeatsTypeList = REPORT_TYPE_LIST;
    this.save = new EventEmitter();
    this.cancel = new EventEmitter();
    this.destroy = new Subject();
    this.isValid = false;
    this.formGroup = this.repeatOnPresenter.buildForm();
  }

  /**
   * Add week controls array
   * @param formGroup 
   * @param weekDaysList 
   * @param repeatType 
   */
  private addWeekControls(formGroup: FormGroup, daysList: WeekDays[], repeatType: number): void {
    this.formGroup = this.repeatOnPresenter.addWeekControls(formGroup, daysList, repeatType);
  }

  /**
   * Bind Controls Value
   * @param formGroup 
   * @param repeatOn 
   * @param weekDaysList 
   */
  private bindControlValue(formGroup: FormGroup, repeatOn: RepeatsOn | any, daysList: WeekDays[]): void {
    this.formGroup = this.repeatOnPresenter.bindControlValue(formGroup, repeatOn, daysList);
  }

  /**
   * Set Validation in every form controls
   * @param formGroup 
   * @param repeatType 
   */
  private setEveryValidation(formGroup: FormGroup, repeatType: number): void {
    this.repeatOnPresenter.validateEvery(formGroup, repeatType);
  }
}
