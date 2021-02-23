/**
 * @description: Used to restict user inputs
 * it allows only numbers
 * user can customize number inputs by allowing Negative() and/or Period signs.
 * ----------------------------------------------------------------------------
 * allowNegative: boolean; Default false
 * allowPeriod: boolean; Default false
 * @class: OnlyNumberDirective
 *
 */

import { Directive, ElementRef, Input, HostListener } from '@angular/core';

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[trakitOnlyNumber]',
})
export class OnlyNumberDirective {

  /** Wether Period allowed or not */
  @Input() public allowPeriod: boolean;
  /** Wether Negative allowed or not */
  @Input() public allowNegative: boolean;
  /** digit Allowed After Dot Point */
  @Input() public digitAllowedAfterDotPoint: number = 4;

  /** Number RegExp */
  private numberRegex: RegExp = new RegExp(/^(0|[0-9]\d*)?$/);
  /** Negative Number Regex */
  private negativeNumberRegex: RegExp = new RegExp(/^-?(0|[0-9]\d*)?$/);
  /** Period Regex */
  private periodRegex: RegExp = new RegExp(/^(\d{0,4})([.]{1}\d{0,4})?$/g);
  /** Negative Period Regex */
  private negativePeriodRegex: RegExp = new RegExp(/^(-?\d{0,4})([.]{1}\d{0,4})?$/g);

  /** Special Keys */
  private specialKeys: Array<string> = ['Backspace', 'Tab', 'End', 'Home', 'ArrowLeft', 'ArrowRight', 'Del', 'Delete'];

  constructor(
    private el: ElementRef
  ) { }

  /**
   * Updates the  value on the keydown event.
   */
  @HostListener('keydown', ['$event']) public onKeyDown(event: KeyboardEvent): void {
    if (this.specialKeys.includes(event.key)) {
      return;
    }
    const current: string = this.el.nativeElement.value;
    const position = this.el.nativeElement.selectionStart;
    const next: string = [current.slice(0, position), event.key === 'Decimal' ? '.' : event.key, current.slice(position)].join('');
    this.checkNumber(next, event);
  }

  /** watch over paste event */
  @HostListener('paste', ['$event']) public _paste(e): void {
    const data = e.clipboardData.getData('Text');
    this.checkNumber(data, e);
  }

  /** check if it is valid number */
  private checkNumber(data: string, event: any): void {
    if (this.allowPeriod && this.allowNegative) {
      if (data && !String(data).match(this.negativePeriodRegex)) {
        event.preventDefault();
      }
      return;
    } else if (this.allowPeriod) {
      if (data && !String(data).match(this.periodRegex)) {
        event.preventDefault();
      }
      return;
    }
    else if (this.allowNegative) {
      if (data && !String(data).match(this.negativeNumberRegex)) {
        event.preventDefault();
      }
      return;
    } else {
      if (data && !String(data).match(this.numberRegex)) {
        event.preventDefault();
      }
      return;
    }
  }
}