/**
 * @name CopyitDefaultValuesFormAccordionPresenter
 * @author Enter Your Name Here
 * @description This is a presenter service for accordion which contains all logic for presentation component
 */

import { Injectable, OnDestroy } from '@angular/core';
import { RequestInformationDetailsFormPresentationComponent } from '../copyit-default-values-form-presentation/request-information-details-form-presentation/request-information-details-form.presentation';
// ----------------------------------------------- //
import { BaseAccordionPresenter } from '../../../core/base-classes/accordion.presenter';
import { PrintDetailsFormPresentationComponent } from '../../../shared/modules/copy-it-print-details/print-details-form-presentation/print-details-form.presentation';
import { ShippingDetailsFormPresentationComponent } from '../../../shared/modules/shipping-details/shipping-details-form-presentation/shipping-details-form.presentation';
import { Observable, Subject } from 'rxjs';
import { CopyitDefaultValues } from '../../copyit-configurations.model';
import { take, takeUntil } from 'rxjs/operators';


/**
 * CopyitDefaultValuesFormPresenter
 */
@Injectable()
export class CopyitDefaultValuesFormPresenter extends BaseAccordionPresenter implements OnDestroy {

  /** to observe the default config value */
  public defaultValues$: Observable<CopyitDefaultValues>;
  /** to observe form next event to validate and get updated data */
  public isRequestFormNext$: Observable<number>;
  /** to observe form next event to validate and get updated data */
  public isPrintFormNext$: Observable<number>;
  /** to observe form next event to validate and get updated data */
  public isShippingFormNext$: Observable<number>;
  /** to observe save default data event */
  public saveDefaultData$: Observable<CopyitDefaultValues>;
  /** requestor detail component instance */
  public requestComponent: RequestInformationDetailsFormPresentationComponent;
  /** print detail component instance */
  public printDetailsComponent: PrintDetailsFormPresentationComponent;
  /** shipping detail component instance */
  public shippingComponent: ShippingDetailsFormPresentationComponent;

  /** to preserve state for default value */
  private defaultValues: Subject<CopyitDefaultValues>;
  /** to preserve state for form next event to validate and get updated data */
  private isRequestFormNext: Subject<number>;
  /** to preserve state for form next event to validate and get updated data */
  private isPrintFormNext: Subject<number>;
  /** to preserve state for form next event to validate and get updated data */
  private isShippingFormNext: Subject<number>;
  /** to preserve state for save default data event */
  private saveDefaultData: Subject<CopyitDefaultValues>;
  /** to stop subscription */
  private destroy: Subject<void>;

  /** default value instance to perform operations */
  private _defaultValuesInstance: CopyitDefaultValues;
  private set defaultValuesInstance(value: CopyitDefaultValues) {
    this._defaultValuesInstance = value;
  };
  private get defaultValuesInstance(): CopyitDefaultValues {
    return this._defaultValuesInstance;
  }

  constructor() {
    super();
    this.initiateProperties();
    this.defaultValues$.pipe(takeUntil(this.destroy)).subscribe((defaultValues: CopyitDefaultValues) => {
      this.defaultValuesInstance = defaultValues;
    })
  }

  /**
   * set initial default value
   * @param value Copyit default value
   */
  public setInitialDefaultValues(value: CopyitDefaultValues): void {
    this.defaultValues.next(value);
  }

  /**
   * on submitting the form
   * validate each panel and conecate data
   * raise save-default-data event to presentation
   */
  public submiteDefaultValues(): void {
    if (!this.requestComponent.requestInformationDetailsFormGroup.valid) {
      this.activeIds = ['0'];
      this.isRequestFormNext.next(Date.now());
      return;
    }
    if (!this.printDetailsComponent.printDetailsFormGroup.valid) {
      this.activeIds = ['2'];
      this.isPrintFormNext.next(Date.now());
      return;
    }
    if (!this.shippingComponent.shippingDetailsFormGroup.valid) {
      this.activeIds = ['3'];
      this.isShippingFormNext.next(Date.now());
      return;
    }
    this.saveDefaultData.next(this.defaultValuesInstance);
  }

  /** 
   * Save Details based on panel id
   * @param panelId 
   */
  public saveDetails(panelId: string): void {
    switch (panelId) {
      case '0':
        this.saveRequestDetails();
        break;
      case '2':
        this.savePrintDetails();
        break;
      case '3':
        this.saveShppingDetails();
        break;
    }
  }

  /** save requestor section details */
  private saveRequestDetails(): void {
    if (this.requestComponent.requestInformationDetailsFormGroup.valid) {
      this.defaultValuesInstance = { ...this.defaultValuesInstance, ...this.requestComponent.requestInformationDetailsFormGroup.getRawValue() };
      this.defaultValues.next(this.defaultValuesInstance);
      this.activeIds = [];
    } else {
      this.isRequestFormNext.next(new Date().getMilliseconds());
    }
  }

  /** save printing section details */
  private savePrintDetails(): void {
    if (this.printDetailsComponent.printDetailsFormGroup.valid) {
      this.defaultValuesInstance = { ...this.defaultValuesInstance, ...this.printDetailsComponent.printDetailsFormGroup.getRawValue() };
      this.defaultValues.next(this.defaultValuesInstance);
      this.activeIds = [];
    } else {
      this.isPrintFormNext.next(new Date().getMilliseconds());
    }
  }

  /** save shipping section details */
  private saveShppingDetails(): void {
    if (this.shippingComponent.shippingDetailsFormGroup.valid) {
      this.defaultValuesInstance = { ...this.defaultValuesInstance, ...this.shippingComponent.shippingDetailsFormGroup.getRawValue() };
      this.defaultValues.next(this.defaultValuesInstance);
      this.activeIds = [];
    } else {
      this.isShippingFormNext.next(new Date().getMilliseconds());
    }
  }

  /** initiate properties of the class */
  private initiateProperties(): void {
    this.destroy = new Subject();
    this.saveDefaultData = new Subject();
    this.saveDefaultData$ = this.saveDefaultData.asObservable();
    this.defaultValues = new Subject();
    this.defaultValues$ = this.defaultValues.asObservable();
    this.isRequestFormNext = new Subject();
    this.isRequestFormNext$ = this.isRequestFormNext.asObservable();
    this.isPrintFormNext = new Subject();
    this.isPrintFormNext$ = this.isPrintFormNext.asObservable();
    this.isShippingFormNext = new Subject();
    this.isShippingFormNext$ = this.isShippingFormNext.asObservable();
  }

  // tslint:disable-next-line: member-ordering
  public ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }

}
