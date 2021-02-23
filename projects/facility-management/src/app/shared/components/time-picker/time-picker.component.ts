import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Host, Input, OnDestroy, OnInit, Optional, Renderer2, SkipSelf, ViewChild } from '@angular/core';
import { AbstractControl, ControlContainer, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { PopoverDirective } from 'ngx-bootstrap';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
// ---------------------------------------------------------- //
import { TIME_FORMAT } from '../../../core/utility/constants';

@Component({
  selector: 'app-time-picker',
  templateUrl: './time-picker.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: TimePickerComponent,
      multi: true
    }
  ],
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TimePickerComponent implements OnInit, ControlValueAccessor, OnDestroy {

  /** show/hide meridian */
  @Input() public meridian: boolean = true;
  /** show/hide spinners */
  @Input() public spinners: boolean = true;
  /** to set hour step */
  @Input() public hourStep: number = 1;
  /** to set minute step */
  @Input() public minuteStep: number = 1;
  /** It will store the form control name */
  @Input() public formControlName: string;
  /** enable/disable float label */
  @Input() public allowFloatLabel: boolean = true;
  /** instance of popover */
  @ViewChild(PopoverDirective, { static: true }) public popover: PopoverDirective;

  /** Value of the control */
  public control: AbstractControl;
  /** disable flag for control */
  public disabled: boolean;
  /** String format for timePicker value  */
  public readonly dateFormat: string = TIME_FORMAT;
  /** to stop subscription on ngOnDestroy */
  private destroy: Subject<void>;

  constructor(
    @Optional() @Host() @SkipSelf() private controlContainer: ControlContainer,
    private cdr: ChangeDetectorRef,
    private element: ElementRef,
    private renderer: Renderer2,
  ) {
    this.destroy = new Subject();
  }

  public ngOnInit(): void {
    if (this.controlContainer) {
      if (this.formControlName) {
        // get control as reactive form control
        this.control = this.controlContainer.control.get(this.formControlName);
        // add css class to parent node to adopt design changes dynamically
        this.renderer.addClass(this.element.nativeElement.parentNode, 'combined-time-picker');
        // watch over control value changes to toggle css class for floating label
        this.allowFloatLabel && this.control.valueChanges.pipe(takeUntil(this.destroy)).subscribe(val => {
          this.toggleFloatingLabel(val);
        })
      } else {
        console.warn('Missing FormControlName directive from host element of the component');
      }
    } else {
      console.warn('Can\'t find parent FormGroup directive');
    }
  }

  /** Determines whether changed on */
  public onChange: Function = () => { };
  /** Determines whether touched on */
  public onTouch: Function = () => { };

  /** writeValue */
  public writeValue(obj: any): void {
    this.setTime(obj);
  }

  /** registerOnChange */
  public registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  /** registerOnTouched */
  public registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  /** setDisabledState */
  public setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this.cdr.markForCheck();
  }

  /** on destroy life cycle to cleaning memory */
  public ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }
  /**
   * clear value of the control
   * @private
   * @param {string} value - value
   * @memberOf InputTrimDirective
   */
  public clearValue(): void {
    this.control.reset();
  }

  /** Set value for the control */
  private setTime(value: any): void {
    this.onChange(value);
    this.onTouch(value);
    this.allowFloatLabel && this.toggleFloatingLabel(value);
    this.cdr.markForCheck();
  }

  /**
   * Toggles floating label
   * @param isToggle flag
   */
  private toggleFloatingLabel(isToggle: boolean): void {
    if (isToggle) {
      this.renderer.addClass(this.element.nativeElement.parentNode, 'float-above')
    } else {
      this.renderer.removeClass(this.element.nativeElement.parentNode, 'float-above');
    }
  }

}
