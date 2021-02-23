/** 
 * @author Nitesh Sharma
 */

import { Directive, Input, OnChanges, OnDestroy, AfterViewInit } from '@angular/core';
import { FormGroupDirective, AbstractControl, ValidationErrors } from '@angular/forms';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
//------------------------------------------------------//
import { toArray } from './to-array';
import { ErrorDetails, ErrorOptions } from './ngerrors';

/**
 * NgxErrorsDirective
 */
@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[ngxErrors]',
  exportAs: 'ngxErrors'
})
export class NgxErrorsDirective implements OnChanges, OnDestroy, AfterViewInit {

  /**
   * Gets errors
   */
  public get errors(): ValidationErrors {
    if (!this.ready) return;
    return this.control.errors;
  }

  /**
   * Gets whether has errors
   */
  public get hasErrors(): boolean {
    return !!this.errors;
  }

  /**
   * Input  of ngx errors directive
   */
  @Input('ngxErrors') public controlName: string;

  /**
   * Input  of ngx errors directive
   */
  @Input() public isFormSubmitted: boolean;

  /**
   * Subject  of ngx errors directive
   */
  public subject: BehaviorSubject<ErrorDetails>;

  /**
   * Control  of ngx errors directive
   */
  public control: AbstractControl;

  /**
   * Ready  of ngx errors directive
   */
  public ready: boolean = false;

  constructor(
    private form: FormGroupDirective
  ) {
    this.subject = new BehaviorSubject<ErrorDetails>(null);
  }

  /**
   * Determines whether error has
   * @param name 
   * @param conditions 
   * @returns true if error 
   */
  public hasError(name: string, conditions: ErrorOptions): boolean {
    return this.checkPropState('invalid', name, conditions);
  }

  /**
   * Determines whether valid is
   * @param name 
   * @param conditions 
   * @returns true if valid 
   */
  public isValid(name: string, conditions: ErrorOptions): boolean {
    return this.checkPropState('valid', name, conditions);
  }

  /**
   * Gets error
   * @param name 
   * @returns  
   */
  public getError(name: string): any {
    if (!this.ready) return;
    return this.control.getError(name);
  }


  /**
   * on changes
   */
  public ngOnChanges(): void {
    this.control = this.form.control.get(this.controlName);
  }

  /**
   * after view init
   */
  public ngAfterViewInit(): void {
    setTimeout(() => {
      this.checkStatus();
      this.control.statusChanges.subscribe(this.checkStatus.bind(this));
    });
  }

  /**
   * on destroy
   */
  public ngOnDestroy(): void {
    this.subject.unsubscribe();
  }

  /**
   * Checks prop state
   * @param prop 
   * @param name 
   * @param conditions 
   * @returns true if prop state 
   */
  private checkPropState(prop: string, name: string, conditions: ErrorOptions): boolean {
    if (!this.ready) return;
    const controlPropsState: boolean = (
      !conditions || toArray(conditions).every((condition: string) => this.control[condition])
    );
    if (name.charAt(0) === '*') {
      return this.control[prop] && controlPropsState;
    }
    return (
      prop === 'valid' ? !this.control.hasError(name) : this.control.hasError(name) && controlPropsState
    );
  }

  /**
   * Checks status
   * @returns  
   */
  private checkStatus(): void {
    const control: AbstractControl = this.control;
    const errors: ValidationErrors = control.errors;
    this.ready = true;
    if (!errors) return;
    for (const errorName in errors) {
      this.subject.next({ control, errorName });
    }
  }
}