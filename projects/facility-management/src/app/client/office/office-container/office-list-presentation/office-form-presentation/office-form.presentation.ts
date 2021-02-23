

/**
 * @name OfficePresentationComponent
 * @author Ronak Patel
 * @description This is a presentation component for office which contains the ui and business logic
 */

import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, ChangeDetectionStrategy, ViewChildren, QueryList, Inject } from '@angular/core';
import { FormGroup, } from '@angular/forms';
import { NgSelectComponent } from '@ng-select/ng-select';
import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/operators';
//-------------------------------------------------------------------------------//
import { OfficeFormPresenter } from '../office-form-presenter/office-form.presenter';
import { Office, State, City } from '../../../office.model';

/** 
 * OfficeFormPresentationComponent
 */
@Component({
  selector: '[app-office-form-ui]',
  templateUrl: './office-form.presentation.html',
  viewProviders: [OfficeFormPresenter],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OfficeFormPresentationComponent implements OnInit, OnDestroy {
  /** This will set the data */
  @Input() public set office(value: Office) {
    if (value) {
      this._office = value;
      this.onChange({ state: value.state, stateId: value.stateId });
      this.officeFormGroup = this.officePresenter.bindControlValue(this.officeFormGroup, this._office);
    }
  }

  public get office(): Office {
    return this._office;
  }

  /** This will set the data */
  @Input() public set states(states: State[]) {
    if (states) {
      this._states = states;
    }
  };
  public get states(): State[] {
    return this._states;
  }

  /** This will set the data */
  @Input() public set cites(cites: City[]) {
    if (cites) {
      this._cites = cites;
    }
  };
  public get cites(): City[] {
    return this._cites;
  }
  /** LastOffice */
  @Input() public set lastOffice(lastOffice: string) {
    if (lastOffice) {
      this.officePresenter.setOfficeName(lastOffice);
      this.officeFormGroup = this.officePresenter.buildForm();
    }

  };


  /** Customer form group of office form presentation component */
  public officeFormGroup: FormGroup;

  /** ng-select dropdown reference */
  @ViewChildren(NgSelectComponent) public ngSelects: QueryList<NgSelectComponent>;


  /*** Output of office form presentation component */
  @Output() public add: EventEmitter<Office>;
  /*** Output of office form presentation component */
  @Output() public update: EventEmitter<Office>;
  /*** Output of office form presentation component */
  @Output() public getCites: EventEmitter<State>;
  /*** Output of office form presentation component */
  @Output() public cancel: EventEmitter<void>;
  /** Determines whether form submitted */
  public isFormSubmitted: boolean = false;
  /** Destroy of office form presentation component */
  private destroy: Subject<void>;
  /** This property for get set */
  private _office: Office;
  /** This property for get set */
  private _states: State[];
  /** This property for get set */
  private _cites: City[];
  private _lastOffice: string;
  /** This property is use to store Window object. */
  private window: Window;

  constructor(
    private officePresenter: OfficeFormPresenter,
    @Inject('Window') window: Window
  ) {
    this.window = window as Window;
    this.destroy = new Subject();
    this.add = new EventEmitter();
    this.update = new EventEmitter();
    this.getCites = new EventEmitter();
    this.cancel = new EventEmitter();
    this.officeFormGroup = this.officePresenter.buildForm();
  }

  public ngOnInit(): void {
    // This will subscribe the save event and emit to container component
    this.officePresenter.add$.pipe(takeUntil(this.destroy)).subscribe((office: Office) => {
      if (this.office) {
        this.update.emit(office);
      } else {
        this.add.emit(office);
      }
    });
    /** on stateId change, reset the cityId */
    this.officeFormGroup.get('stateId').valueChanges.pipe(takeUntil(this.destroy))
      .subscribe((stateId: number) => {
        this.officeFormGroup.get('cityId').patchValue(null);
      })
    this.window.addEventListener('scroll', this.scroll, true);

  }

  public ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }

  /** This is used to save the data */
  public saveOffice(): void {
    this.isFormSubmitted = true;
    this.officePresenter.saveOffice(this.officeFormGroup);
  }
  /** This method is used for get city base on state */
  public onChange(state: State): void {
    this.getCites.emit(state);
  }


  /** When user click on cancel */
  public onCancel(): void {
    this.cancel.emit();
  }

  /** on scroll event for hide the ng-select dropdown */
  private scroll = (event: any): void => {
    this.ngSelects.forEach((item: NgSelectComponent) => {
      if (item && item.isOpen && event.target.className) {
        const isScrollingInScrollHost: boolean = (event.target.className as string).indexOf('ng-dropdown-panel-items') > -1;
        if (isScrollingInScrollHost) { return; }
        item.close();
      }
    });
  };

}

