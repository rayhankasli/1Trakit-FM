

/**
 * @name VisitorLogPresentationComponent
 * @author Rayhan Kasli
 * @description This is a presentation component for visitor-logwhich contains the ui and business logic
 */

import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, ChangeDetectionStrategy, ViewChildren, QueryList, Inject, NgZone, HostBinding } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/operators';
//-------------------------------------------------------------------------------//
import { VisitorLogFormPresenter } from '../visitor-log-form-presenter/visitor-log-form.presenter';
import { VisitorLog, VisitorMaster, VisitorLogStatus } from '../../../../visitor-log.model';
import { BaseCloseSelectDropdown } from 'projects/facility-management/src/app/core/base-classes/base-close-select-dropdown';
import { NgSelectComponent } from '@ng-select/ng-select';
import { DATE_TIME_FORMAT } from 'projects/facility-management/src/app/core/utility/constants';
import { ArchiveModeService } from 'projects/facility-management/src/app/core/services/archive-mode/archive-mode.service';

/** 
 * VisitorLogFormPresentationComponent
 */
@Component({
  selector: 'trakit-visitor-log-form-ui',
  templateUrl: './visitor-log-form.presentation.html',
  viewProviders: [VisitorLogFormPresenter],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VisitorLogFormPresentationComponent extends BaseCloseSelectDropdown implements OnInit, OnDestroy {

  /** hostBinding */
  @HostBinding('class') public class: string = 'd-flex w-100';

  /** This will set the data */
  @Input() public set visitorLog(value: VisitorLog) {
    if (value) {
      this._visitorLog = value;
      this.visitorLogFormGroup = this.visitorLogPresenter.bindControlValue(this.visitorLogFormGroup, this._visitorLog);
    }
  }

  public get visitorLog(): VisitorLog {
    return this._visitorLog;
  }

  /** This will set the data */
  @Input() public set masterData(value: VisitorMaster) {
    this._masterData = value;
  }
  public get masterData(): VisitorMaster {
    return this._masterData;
  }


  /** ng-select dropdown reference */
  @ViewChildren(NgSelectComponent) public ngSelects: QueryList<NgSelectComponent>;
  /*** Output of customer form presentation component */
  @Output() public add: EventEmitter<VisitorLog>;
  /*** Output of customer form presentation component */
  @Output() public update: EventEmitter<VisitorLog>;
  /*** it will used for emit the cancel event to the parent component */
  @Output() public cancel: EventEmitter<void>;

  /** Customer form group of customer form presentation component */
  public visitorLogFormGroup: FormGroup;
  /** Determines whether form submitted */
  public isFormSubmitted: boolean;
  /** Bs config of customer form presentation component */
  public bsConfig: BsDatepickerConfig;
  /** Bs config of customer form presentation component */
  public minDate: Date;
  /** Bs config of customer form presentation component */
  public isValidTime: boolean;
  /** isArchived */
  public isArchived: boolean;
  /** Date format for createdAt column */
  public readonly dateFormat: string = DATE_TIME_FORMAT;

  /** Customer of customer form presentation component */
  private _visitorLog: VisitorLog;
  /** Customer of customer form presentation component */
  private _masterData: VisitorMaster;

  constructor(
    private visitorLogPresenter: VisitorLogFormPresenter,
    private archiveModeService: ArchiveModeService,
    @Inject('Window') window: Window,
    zone: NgZone
  ) {
    super(window, zone);
    this.window = window as Window;
    this.initProps();
  }

  public ngOnInit(): void {
    // This will subscribe the save event and emit to container component
    this.visitorLogPresenter.add$.pipe(takeUntil(this.destroy)).subscribe((visitorLog: VisitorLog) => {
      if (this.visitorLog) {
        this.update.emit(visitorLog);
      } else {
        this.add.emit(visitorLog);
        this.onCancel();
      }
    });

    this.archiveModeService.archiveMode$.pipe(takeUntil(this.destroy)).subscribe((isArchived: boolean) => {
      this.isArchived = isArchived ? isArchived : false;
      this.isArchived && this.visitorLogFormGroup.disable();
    });

    this.visitorLogFormGroup.get('checkInDate').valueChanges.subscribe((checkInDate: string) => {
      if (checkInDate) {
        this.minDate = new Date(checkInDate);
        let date: Date = this.visitorLogPresenter.setDate(checkInDate);
        let time: string = this.visitorLogPresenter.setTime(`${date}`);
        this.visitorLogPresenter.setDateAndTime(this.visitorLogFormGroup, date, time);
        // set status to checked-in
        this.visitorLogPresenter.setLogStatusAuto(VisitorLogStatus.checkedIn, this.visitorLogFormGroup);
      } else {
        this.minDate = new Date();
        this.visitorLogFormGroup.get('checkInTime').patchValue('', { emitEvent: false });
      }
    });
    this.visitorLogFormGroup.get('checkOutDate').valueChanges.subscribe((checkOutDate: string) => {
      if (checkOutDate) {
        let date: Date = this.visitorLogPresenter.setDate(checkOutDate);
        let time: string = this.visitorLogPresenter.setTime(`${date}`);
        this.visitorLogPresenter.setCheckOutDateAndTime(this.visitorLogFormGroup, date, time);
        this.isValidTime = this.visitorLogPresenter.timeValidation(
          this.isFormSubmitted,
          this.visitorLogFormGroup,
          this.visitorLogFormGroup.get('checkInDate').value,
          this.visitorLogFormGroup.get('checkOutDate').value
        )
        // set status to checked-out
        this.visitorLogPresenter.setLogStatusAuto(VisitorLogStatus.checkedOut, this.visitorLogFormGroup);
      } else {
        this.visitorLogFormGroup.get('checkOutTime').patchValue('', { emitEvent: false });
      }
    });
    this.visitorLogFormGroup.get('checkInTime').valueChanges.subscribe((checkInTime: string) => {
      if (checkInTime) {
        this.visitorLogPresenter.changeTime(this.visitorLogFormGroup, checkInTime, this.visitorLogFormGroup.get('checkInDate').value, 'checkInTime');
        // set status to checked-in
        this.visitorLogPresenter.setLogStatusAuto(VisitorLogStatus.checkedOut, this.visitorLogFormGroup);
      }
    });
    this.visitorLogFormGroup.get('checkOutTime').valueChanges.subscribe((checkOutTime: string) => {
      if (checkOutTime) {
        this.visitorLogPresenter.changeTime(this.visitorLogFormGroup, checkOutTime, this.visitorLogFormGroup.get('checkOutDate').value, 'checkOutTime');
        this.isValidTime = this.visitorLogPresenter.timeValidation(
          this.isFormSubmitted,
          this.visitorLogFormGroup,
          this.visitorLogFormGroup.get('checkInDate').value,
          this.visitorLogFormGroup.get('checkOutDate').value
        )
        // set status to checked-out
        this.visitorLogPresenter.setLogStatusAuto(VisitorLogStatus.checkedOut, this.visitorLogFormGroup);
      }
    });
  }

  /** This is used to save the data */
  public saveVisitorLog(): void {
    this.isFormSubmitted = true;
    this.visitorLogPresenter.saveVisitorLog(this.visitorLogFormGroup);
  }

  /** When user click on cancel */
  public onCancel(): void {
    this.cancel.emit();
  }

  /** initialize all the properties */
  private initProps(): void {
    this.destroy = new Subject<void>();
    this.add = new EventEmitter<VisitorLog>();
    this.update = new EventEmitter<VisitorLog>();
    this.cancel = new EventEmitter<void>();
    this.minDate = new Date();
    this.bsConfig = new BsDatepickerConfig();
    this.bsConfig.containerClass = 'theme-primary';
    this.bsConfig.adaptivePosition = true;
    this.bsConfig.dateInputFormat = 'MM/DD/YYYY, h:mm A';
    this.bsConfig.customTodayClass = 'current-date'
    this.visitorLogFormGroup = this.visitorLogPresenter.buildForm();
  }
}

