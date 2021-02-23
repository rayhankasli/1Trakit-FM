

/**
 * @name FloorPresentationComponent
 * @author Ronak Patel
 * @description This is a presentation component for floorwhich contains the ui and business logic
 */

import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormGroup, } from '@angular/forms';
import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/operators';
//-------------------------------------------------------------------------------//
import { FloorFormPresenter } from '../floor-form-presenter/floor-form.presenter';
import { Floor } from '../../../office.model';

/** 
 * FloorFormPresentationComponent
 */
@Component({
  selector: 'app-floor-form-ui',
  templateUrl: './floor-form.presentation.html',
  viewProviders: [FloorFormPresenter],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FloorFormPresentationComponent implements OnInit, OnDestroy {
  /** This will set the data */
  @Input() public set floor(value: Floor) {
    this._floor = value;
    if (value) {
      this.floorFormGroup = this.floorPresenter.bindControlValue(this.floorFormGroup, this._floor);
    }
  }

  public get floor(): Floor {
    return this._floor;
  }

  /** Customer form group of customer form presentation component */
  public floorFormGroup: FormGroup;
  public dropdownState: boolean;
  /*** Output of customer form presentation component */
  @Output() public add: EventEmitter<Floor>;
  /*** Output of customer form presentation component */
  @Output() public update: EventEmitter<Floor>;
  /** Determines whether form submitted */
  public isFormSubmitted: boolean = false;


  /** Destroy of customer form presentation component */
  private destroy: Subject<void>;
  /** Customer of customer form presentation component */
  private _floor: Floor;



  constructor(
    private floorPresenter: FloorFormPresenter,
    private cdrRef: ChangeDetectorRef
  ) {
    this.destroy = new Subject();
    this.add = new EventEmitter();
    this.update = new EventEmitter();
    this.dropdownState = true;
    this.floorFormGroup = this.floorPresenter.buildForm();
  }

  public ngOnInit(): void {
    // This will subscribe the save event and emit to container component
    this.floorPresenter.add$.pipe(takeUntil(this.destroy)).subscribe((floor: Floor) => {
      if (this.floor) {
        this.update.emit(floor);
      } else {
        this.add.emit(floor);
      }
    });
  }

  public ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }

  /** This is used to save the data */
  public saveFloor(): void {
    this.isFormSubmitted = true;
    this.floorPresenter.saveFloor(this.floorFormGroup);
  }

  /** When user click on cancel */
  public cancel(): void {
    // do something here
  }


}

