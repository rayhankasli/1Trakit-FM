/**
 * @author Rayhan Kasli.
 * @description This is data filter presentation component. Used for filter data base on field.
 */

import { Component, ChangeDetectionStrategy, Inject,  Optional, OnInit, Input, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subject } from 'rxjs/Subject';
import { BsDatepickerConfig } from 'ngx-bootstrap';
// ---------------------------------------------------------- //
import { VisitorLogFilterPresenter } from '../visitor-log-filter-presenter/visitor-log-filter.presenter';
import { VisitorLogFilterRecord, VISITORLOG_FILTER } from '../../../visitor-log.model';
import { takeUntil } from 'rxjs/operators/takeUntil';

/**
 * VisitorLogFilterPresentationComponent
 */
@Component({
  selector: 'app-visitor-log-filter',
  templateUrl: './visitor-log-filter.presentation.html',
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [VisitorLogFilterPresenter]
})
export class VisitorLogFilterPresentationComponent implements OnInit, OnDestroy{

   /** Sets input for office list */
   @Input() public set isClientChange(value: boolean) {
      if(value) {
        this._isClientChange = value;
        this.buildForm();
        this.onClearFilter();
      }
    }
   public get isClientChange(): boolean {
    return this._isClientChange;
    }

  /** This property is used to create for filter Form. */
   public visitorLogFormGroup: FormGroup;
  /** This property is used for date picker. */
   public bsConfig: BsDatepickerConfig;
  /** This property is used for emit when filter apply. */
   public filterData: Subject<VisitorLogFilterRecord>;
  /** This property is used for emit when filter close. */
   public closeFilter: Subject<boolean>;
  /** This property is used for emit when filter data cleared. */
   public clearFilter: Subject<boolean>;
  /** Determines whether filter apply is */
   public isFilterApply: boolean;
  /** Determines whether form submitted is */
   public isFormSubmitted: boolean;
  /** Bs config of customer form presentation component */
   public minDate: Date;

  /** isClientChange */
   private _isClientChange: boolean;
   /** create for  */
   private destroy: Subject<boolean>;  

   constructor(
    private presenter: VisitorLogFilterPresenter,
    @Optional() @Inject(VISITORLOG_FILTER) private data: VisitorLogFilterRecord,
  ) {
    this.buildForm();
    this.filterData = new Subject();
    this.closeFilter = new Subject();
    this.clearFilter = new Subject();
    this.destroy = new Subject();
    this.bsConfig = new BsDatepickerConfig();
    this.minDate = new Date();
    this.bsConfig.containerClass = 'theme-primary';
    this.bsConfig.customTodayClass = 'current-date'
    this.bsConfig.adaptivePosition = false;
    this.isFilterApply = false;
    if (this.data) {
      this.isFilterApply = true;
      this.visitorLogFormGroup.patchValue(data);
      this.visitorLogFormGroup.markAsDirty();
    }
  }

  /** ngOnInit */
   public ngOnInit(): void {
    this.visitorLogFormGroup.get('fromPeriod').valueChanges.pipe(takeUntil(this.destroy)).subscribe((fromPeriod: string)=>{
      if(fromPeriod) {
        this.minDate = new Date(fromPeriod);
        this.visitorLogFormGroup.get('toPeriod').patchValue('',{emitEvent: false});
      }
    });
  }

  /**
   * This method is invoke when user click on Reset button.
   * Use for reset from value.
   */
   public onReset(): void {
    this.visitorLogFormGroup.reset();
  }

  /**
   * This method is invoke when user click on apply button.
   * Use for emit form value to parent.
   */
   public onApplyFilter(): void {
    this.isFormSubmitted = true;
    if (this.visitorLogFormGroup.valid) {
      this.filterData.next(this.visitorLogFormGroup.value);
      this.filterData.complete();
      this.dismiss();
    }
  }

  /**
   * This method is invoke when user click dismiss button.
   */
   public dismiss(): void {
    this.closeFilter.next(true);
    this.closeFilter.complete();
  }

  /**
   * This method is invoke when user click clear filter button.
   */
   public onClearFilter(): void {
    this.visitorLogFormGroup.reset();
    this.clearFilter.next(true);
    this.clearFilter.complete();
  }

    /** destroy */
   public ngOnDestroy(): void {
      this.destroy.next(true);
      this.destroy.unsubscribe();
    }

   /** buildForm */ 
   private buildForm(): void {
    this.visitorLogFormGroup = this.presenter.buildForm();
   }
}
