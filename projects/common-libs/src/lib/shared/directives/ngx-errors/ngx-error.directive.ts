/**  
 * @author Nitesh Sharma 
 */
import { Directive, Input, OnInit, OnDestroy, DoCheck, Inject, HostBinding, forwardRef, ElementRef, Renderer2 } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { distinctUntilChanged } from 'rxjs/operators/distinctUntilChanged';
import { map } from 'rxjs/operators/map';
import { filter } from 'rxjs/operators/filter';
//-----------------------------------------------------------//
import { toArray } from './to-array';
import { NgxErrorsDirective } from './ngx-errors.directive';
import { ErrorOptions } from './ngerrors';

/**
 * NgxErrorDirective
 */
@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[ngxError]',
  exportAs: 'ngxError'

})
export class NgxErrorDirective implements OnInit, OnDestroy, DoCheck {

  /**
   * Sets input
   */
  @Input() public set ngxError(value: ErrorOptions) {
    this.errorNames = toArray(value);
  }

  /**
   * Sets input
   */
  @Input() public set when(value: ErrorOptions) {
    this.rules = toArray(value);
  }

  // @HostBinding('class') errorClass: string = "invalid-feedback d-block";

  /**
   * Host binding of ngx error directive
   */
  @HostBinding('hidden') public hidden: boolean = true;

  /**
   * Rules  of ngx error directive
   */
  public rules: string[];
  /**
   * Error names of ngx error directive
   */
  public errorNames: string[];
  /**
   * Subscription  of ngx error directive
   */
  public subscription: Subscription;
  /**
   * States  of ngx error directive
   */
  public states: Observable<string[]>;
  /**
   * States  of ngx error directive
   */
  public _states: Subject<string[]>;

  constructor(
    // tslint:disable-next-line: no-forward-ref
    @Inject(forwardRef(() => NgxErrorsDirective)) private ngxErrors: NgxErrorsDirective,
    private elementRef: ElementRef,
    private renderer: Renderer2
  ) {
    this.rules = [];
    this.errorNames = [];
  }

  /**
   * on init
   */
  public ngOnInit(): void {
    this._states = new Subject<string[]>();
    this.states = this._states.asObservable().pipe(distinctUntilChanged());

    const errors: Observable<any> = this.ngxErrors.subject.pipe(
      filter(Boolean),
      filter((obj: any) => !!~this.errorNames.indexOf(obj.errorName)));

    const states: Observable<boolean> = this.states.pipe(
      map((state: string[]) => {
        return this.rules.every((rule: string) => !!~state.indexOf(rule));
      }));

    this.subscription = combineLatest(states, errors)
      .subscribe(([state, error]: any): any => {
        if (!state && error.control.hasError(error.errorName) && this.ngxErrors.isFormSubmitted) {
          this.hidden = false;
          this.addRemoveErrorClass()
          return;
        }
        this.hidden = !(state && error.control.hasError(error.errorName));
        this.addRemoveErrorClass()
      });

  }

  /**
   * do check
   */
  public ngDoCheck(): void {
    this._states.next(
      this.rules.filter((rule: string) => (this.ngxErrors.control as any)[rule])
    );
  }

  /**
   * on destroy
   */
  public ngOnDestroy(): void {
    if (!this.subscription) { return;}
    this.subscription.unsubscribe();
  }

  /**
   * Adds remove error class
   */
  private addRemoveErrorClass(): void {
    if (this.hidden) {
      this.renderer.removeClass(this.elementRef.nativeElement, 'd-block');
    } else {
      this.renderer.addClass(this.elementRef.nativeElement, 'invalid-feedback');
      this.renderer.addClass(this.elementRef.nativeElement, 'd-block');
    }
  }
}