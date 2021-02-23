/**
 * @name SlotsPresenter
 * @author Rayhan Kasli
 * @description This is a presenter service for slotswhich contains all logic for presentation component
 */

import { Injectable } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
//---------------------------------------------------------------------//

import { Slots, RepeatsOn } from '../../../mail-configurations.model';

/**
 * SlotsFormPresenter
 */
@Injectable()
export class SlotsFormPresenter {
  /** This is used for subscribing the value of subject add */
  public add$: Observable<Slots>;
  /** This is used for subscribing the value of subject add */
  public selectedDays$: Observable<RepeatsOn>;
  /** This is used for add camelCaseModelName object */
  private add: Subject<Slots> = new Subject();
  /** This is used for add camelCaseModelName object */
  private selectedDays: Subject<RepeatsOn> = new Subject();
 
  /**
   * Next slot name of slots form presenter
   */
  private nextSlotId: number;


  constructor(
    private fb: FormBuilder,
  ) {
    this.add$ = this.add.asObservable();
    this.selectedDays$ = this.selectedDays.asObservable();
    this.nextSlotId = 1;
  }
  /**
   * This will create all the controls for the form group
   * @param slotsFormGroup is the form group
   * @param fb is the form builder which will create the controls
   * @returns It will return the slotsFromGroup with all the controls
   */
  public buildForm(): FormGroup {
    return this.fb.group({
      slotId: [''],
      slotName: [{ value: 'Slot ' + this.nextSlotId, disabled: true }],
      nickName: ['', [Validators.required, Validators.maxLength(30)]],
      officeId: ['', [Validators.required]],
      slotTime: ['', [Validators.required]],
      repeatsOn: ['', [Validators.required]]
    });
  }

  /**
   * News slot name id
   * @param id 
   */
  public newSlotNameId(lastSlot: string): void {
    if (lastSlot) {
      let nextId: string[] = lastSlot.split(/(\d+)/);
      let convetInt: number = parseInt(nextId[1]);
      this.nextSlotId = this.nextSlotId + convetInt;
    }
  }

  /**
   * This method will validate the form
   * If form is valid then it will
   * @param slotsFormGroup
   */
  public saveSlots(slotsFormGroup: FormGroup): void {
    if (slotsFormGroup.valid ) {
      let slots: Slots = slotsFormGroup.getRawValue();
      this.add.next(slots);
    } else {
      // show any custom validation here
    }
  }

  /**
   * This will bind the form control value
   * @param userFormGroup is the form group containing all the controls
   * @param slotsis the object storing all the values
   */
  public bindControlValue(slotsFormGroup: FormGroup, slots: Slots): FormGroup {
    if (slots) {
      slotsFormGroup.patchValue(slots);
    }
    return slotsFormGroup;
  }
  
}
