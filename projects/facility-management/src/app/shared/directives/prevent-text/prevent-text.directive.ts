import {
  Directive, ElementRef, HostListener, Renderer2, Self
} from '@angular/core';
import { NgControl } from '@angular/forms';


/** 
 * This directive is used to restrict user to type in text box.
 * Used in time-picker
 */
@Directive({
  selector: '[preventText]',
})
export class PreventTextDirective {

  private readonly allowed: number[];
  
  /** HTML input element */
  private _el: HTMLInputElement;

  private ngControl: any;
  /**
   * Creates an instance of InputTrimDirective.
   * @param {Renderer} _renderer
   * @param {ElementRef} _elementRef
   * @memberOf InputTrimDirective
   */
  constructor(
    @Self() ngControl: NgControl,
    _renderer: Renderer2,
    _elementRef: ElementRef
  ) {
    this.ngControl = ngControl;
    this._el = _elementRef.nativeElement;
    this.allowed = [8, 9];
  }

  /** Prevent typing */
  @HostListener('keydown', ['$event']) public onKeyDown(event: Event): void {
    if ((this.allowed.includes(event['keyCode']) || this.allowed.includes(event['which']))) {
      switch (event['keyCode'] || event['which']) {
        case 8:
          this.clearValue();
          break;
      }
    } else {
      event.preventDefault();
    }
  }

  /**
   * Trims the value and sets it to the element.
   * @private
   * @param {string} value - value
   * @memberOf InputTrimDirective
   */
  private clearValue(): void {
    this.ngControl.reset();
    this.ngControl.control.markAsTouched();
    this.ngControl.control.markAsDirty();
  }
}
