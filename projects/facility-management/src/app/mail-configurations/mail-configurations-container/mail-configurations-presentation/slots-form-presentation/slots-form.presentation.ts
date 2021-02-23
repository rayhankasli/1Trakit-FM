/**
 * @name SlotsPresentationComponent
 * @author Rayhan Kasli
 * @description This is a presentation component for slotswhich contains the ui and business logic
 */

import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ViewChildren,
  QueryList,
  Inject,
  NgZone,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/operators';
//-------------------------------------------------------------------------------//
import { SlotsFormPresenter } from '../slots-form-presenter/slots-form.presenter';
import {
  Slots,
  MasterData,
  RepeatsOn,
} from '../../../mail-configurations.model';
import {
  WeekDays
} from 'projects/facility-management/src/app/core/model/common.model';
import { NgSelectComponent } from '@ng-select/ng-select';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { BaseCloseSelectDropdown } from '../../../../core/base-classes/base-close-select-dropdown';
import { weekMap } from 'projects/facility-management/src/app/core/utility/utility';

/**
 * SlotsFormPresentationComponent
 */
@Component({
  selector: '[app-slots-form-ui]',
  templateUrl: './slots-form.presentation.html',
  viewProviders: [SlotsFormPresenter],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SlotsFormPresentationComponent extends BaseCloseSelectDropdown implements OnInit, OnDestroy {
  /** This will set the data */
  @Input() public set slots(value: Slots) {
    if (value) {
      this._slots = value;
      this.buildForm();
      this.selectedDayList = this._slots.repeatsOn.repeatsOnDay;
      this.slotsFormGroup = this.slotsPresenter.bindControlValue(
        this.slotsFormGroup,
        this._slots,
      );
      this.isCancel = true;
    }
  }

  public get slots(): Slots {
    return this._slots;
  }

  /** Sets input */
  @Input() public set lastSlot(value: string) {
    this._lastSlot = value;
    this.slotsPresenter.newSlotNameId(this._lastSlot);
    this.buildForm();
  }
  public get lastSlot(): string {
    return this._lastSlot;
  }

  /** This will set the data */
  @Input() public set masterData(value: MasterData) {
    if (value) {
      this._masterData = value;
    }
  }
  public get masterData(): MasterData {
    return this._masterData;
  }


  /*** Output of customer form presentation component */
  @Output() public add: EventEmitter<Slots>;
  /*** Output of customer form presentation component */
  @Output() public update: EventEmitter<Slots>;
  /*** Output of customer form presentation component */
  @Output() public closeSlotsForm: EventEmitter<boolean>;

  /** ng-select dropdown reference */
  @ViewChildren(NgSelectComponent) public ngSelects: QueryList<NgSelectComponent>;

  /** Customer form group of customer form presentation component */
  public slotsFormGroup: FormGroup;
  /** Determines whether form submitted */
  public isFormSubmitted: boolean = false;
  /** this property is used for time picker. */
  public isCancel: boolean;

  /** Selected day list of slots form presentation component */
  public selectedDayList: WeekDays[] | number[];
  /** show/hide Weekly or Others */
  public isWeekly: boolean;

  /** Bs config of customer form presentation component */
  public bsConfig: BsDatepickerConfig;

  /** Customer of customer form presentation component */
  private _slots: Slots;

  /** Customer of customer form presentation component */
  private _lastSlot: string;
  /** Customer of customer form presentation component */
  private _masterData: MasterData;

  /** repeatsOn */
  private repeatsOn: RepeatsOn;

  constructor(
    private slotsPresenter: SlotsFormPresenter,
    private cdrRef: ChangeDetectorRef,
    @Inject('Window') window: Window,
    zone: NgZone,
  ) {
    super(window, zone);
    this.window = window as Window;
    this.initProperties();
  }

  public ngOnInit(): void {
    this.slotsPresenter.selectedDays$
      .pipe(takeUntil(this.destroy))
      .subscribe((dayList: RepeatsOn) => {
        this.selectedDayList = dayList.repeatsOnDay;
        this.repeatsOn = dayList;
        this.slotsFormGroup.value.repeatsOn = dayList;
        this.cdrRef.detectChanges();
      });
    // This will subscribe the save event and emit to container component
    this.slotsPresenter.add$
      .pipe(takeUntil(this.destroy))
      .subscribe((slots: Slots) => {
        if (this.slots) {
          slots.slotId = this._slots.slotId;
          this.update.emit(slots);
          this.closeForm();
        } else {
          this.add.emit(slots);
          this.closeForm();
        }
      });
  }

  /** This method used for checked work time */
  public get isRepeatOnDays(): boolean {
    if (this.isFormSubmitted) return this.selectedDayList ? false : true;
    return false;
  }


  /** This is used to save the data */
  public saveSlots(): void {
    this.isFormSubmitted = true;
    this.slotsPresenter.saveSlots(this.slotsFormGroup);
  }

  /** When user click on cancel */
  public cancel(): void {
    this.closeSlotsForm.emit(false);
  }

  /**
   * Closes form
   */
  public closeForm(): void {
    this.closeSlotsForm.emit(false);
  }

  /**
   * Builds form
   */
  public buildForm(): void {
    this.slotsFormGroup = this.slotsPresenter.buildForm();
  }


  /** bind control base on repeatOn control */
  public onRepeatOnSave(value: RepeatsOn): void {
    value.repeatsOnDay = weekMap(this.masterData.weekDays, value.repeatsOnDay);
    this.selectedDayList = value.repeatsOnDay;
    this.slotsFormGroup.get('repeatsOn').setValue(value);
  }

  public ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }

  /**
   * Inits properties
   */
  private initProperties(): void {
    this.isWeekly = true;
    this.destroy = new Subject();
    this.add = new EventEmitter();
    this.update = new EventEmitter();
    this.closeSlotsForm = new EventEmitter();
    this.bsConfig = new BsDatepickerConfig();
    this.bsConfig.containerClass = 'theme-primary';
    this.bsConfig.adaptivePosition = true;
  }
}
