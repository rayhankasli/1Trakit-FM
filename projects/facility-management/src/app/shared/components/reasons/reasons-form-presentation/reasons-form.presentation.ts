

/**
 * @name ReasonsPresentationComponent
 * @author Rayhan Kasli
 * @description This is a presentation component for reasonswhich contains the ui and business logic
 */

import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/operators';
//-------------------------------------------------------------------------------//
import { ReasonsFormPresenter } from '../reasons-form-presenter/reasons-form.presenter';
import { Reasons } from '../reasons.model';

/**
 * ReasonsFormPresentationComponent
 */
@Component({
  selector: '[app-reasons-form-ui]',
  templateUrl: './reasons-form.presentation.html',
  viewProviders: [ReasonsFormPresenter],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReasonsFormPresentationComponent implements OnInit, OnDestroy {
  
  /** This will set the data */
  @Input() public set reasons(value: Reasons) {
    this._reasons = value;
    if (value) {
      this.buildForm()
      this.reasonsFormGroup = this.reasonsPresenter.bindControlValue(
        this.reasonsFormGroup, this._reasons);
      this.isCancel = true;
    }
  }

  public get reasons(): Reasons {
    return this._reasons;
  }

  @Input() public set lastReasonTaskNotCompleted(value: string) {
    this._lastReasonTaskNotCompleted = value;
    if (value) {
      this.newReasonName(this._lastReasonTaskNotCompleted);
    }
    this.buildForm();
  }

  public get lastReasonTaskNotCompleted(): string {
    return this._lastReasonTaskNotCompleted;
  }

  /** Sets input */
  @Input() public set lastReasonNotDelivered(value: string) {
    this._lastReasonNotDelivered = value;
    if(value) {
      this.newReasonName(value);
    }
    this.cdrRef.detectChanges();
    this.buildForm();
  }

  public get lastReasonNotDelivered(): string {
    return this._lastReasonNotDelivered;
  }

  /** Sets input */
  @Input() public set lastReasonNotPicked(value: string) {
    this._lastReasonNotPicked = value;
    if (value) {
      this.newReasonName(value);
    }
    this.buildForm();
  }
  
  public get lastReasonNotPicked(): string {
    return this._lastReasonNotPicked;
  }

  
  /*** Output of customer form presentation component */
  @Output() public add: EventEmitter<Reasons>;
  /*** Output of customer form presentation component */
  @Output() public update: EventEmitter<Reasons>;
  /*** Output of customer form presentation component */
  @Output() public closeReasonForm: EventEmitter<boolean>;
  
  /** Customer form group of customer form presentation component */
  public reasonsFormGroup: FormGroup;
  /** Determines whether form submitted */
  public isFormSubmitted: boolean = false;
  /** this property is used for time picker. */
  public isCancel: boolean;


  /** Destroy of customer form presentation component */
  private destroy: Subject<void>;
  /** Customer of customer form presentation component */
  private _reasons: Reasons;
  /** _lastReasonNotDelivered. */
  private _lastReasonNotDelivered: string;
  /** _lastReasonTaskNotCompleted. */
  private _lastReasonTaskNotCompleted: string;
  /** _lastReasonNotPicked. */
  private _lastReasonNotPicked: string;



  constructor(
    private reasonsPresenter: ReasonsFormPresenter,
    private cdrRef: ChangeDetectorRef
  ) {
    this.destroy = new Subject();
    this.add = new EventEmitter();
    this.update = new EventEmitter();
    this.closeReasonForm = new EventEmitter();
  }

  public ngOnInit(): void {
    // This will subscribe the save event and emit to container component
    this.reasonsPresenter.add$.pipe(takeUntil(this.destroy)).subscribe((reasons: Reasons) => {
      if (this.reasons) {
        reasons.reasonId = this._reasons.reasonId;
        this.update.emit(reasons);
        this.closeForm();
      } else {
        this.add.emit(reasons);
        this.closeForm();
      }
    });
  }

  public ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }

  /** This is used to save the data */
  public saveReasons(): void {
    this.isFormSubmitted = true;
    this.reasonsPresenter.saveReasons(this.reasonsFormGroup);
  }

  /** When user click on cancel */
  public cancel(): void {
    this.closeReasonForm.emit(false);
  }

  /** When user click on cancel */
  public closeForm(): void {
    this.closeReasonForm.emit(false);
  }

  /**
   * Builds form
   */
  private buildForm(): void {
    this.reasonsFormGroup = this.reasonsPresenter.buildForm();
  }

  /**
   * News reason name
   * @param lastReason
   */
  private newReasonName(lastReason: string): void {
    this.reasonsPresenter.newReasonNameId(lastReason);
  }

}

