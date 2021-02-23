import {
  Directive, HostListener, Renderer2, forwardRef, ElementRef, ModuleWithProviders
} from '@angular/core';
import { NG_VALUE_ACCESSOR, DefaultValueAccessor } from '@angular/forms';

@Directive({
  selector: '[trakcitTrim]',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => InputTrimDirective),
    multi: true
  }]
})
export class InputTrimDirective extends DefaultValueAccessor {

  /** HTMLInputElement */
  private _el: HTMLInputElement;

  /**
   * Creates an instance of InputTrimDirective.
   *
   * @param {Renderer} _renderer
   * @param {ElementRef} _elementRef
   *
   * @memberOf InputTrimDirective
   */
  constructor(
    _renderer: Renderer2,
    _elementRef: ElementRef
  ) {
    super(_renderer, _elementRef, false);
    this._el = _elementRef.nativeElement;
  }

  /**
   * Updates the  value on the blur event.
   *
   */
  @HostListener('blur', ['$event.target.value']) public onBlur(value: string): void {
    this.trimValue(value);
  }

  /**
   * Write a value to the element.
   *
   * @param {string} value - new value.
   *
   * @memberOf InputTrimDirective
   */
  public writeValuewriteValue(value: string): void {
    super.writeValue(value);
  }

  /**
   * Trims the value and sets it to the element.
   *
   * @private
   * @param {string} value - value
   *
   * @memberOf InputTrimDirective
   */
  private trimValue(value: string): void {

    value = value.trim();

    this._el.value = value;

    this.onChange(value);
  }
}
