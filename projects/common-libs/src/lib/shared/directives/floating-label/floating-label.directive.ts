/** 
 * @author Ronak Patel.
 * @description create directive for set class when input property has focus and remove class when blur. 
 */

import { Directive, ElementRef, Renderer2, HostListener, OnInit, Optional, OnDestroy } from '@angular/core';
import { NgControl } from '@angular/forms';
import { take } from 'rxjs/operators/take';
import { takeUntil } from 'rxjs/operators/takeUntil';
import { Subject } from 'rxjs';
import { delay } from 'rxjs/operators';

/**
 * Directive
 */
@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[floatingLabel]',
  exportAs: 'floatingLabel'
})
export class FloatingLabelDirective implements OnInit, OnDestroy {

  /** on directive destroy */
  public destroy: Subject<void>;
  private isFocus: boolean;
  constructor(
    private element: ElementRef,
    private renderer: Renderer2,
    @Optional() private ngControl: NgControl
  ) {
    this.destroy = new Subject();
  }

  /**
   * after view init
   */
  public ngOnInit(): void {
    if ((this.ngControl && this.ngControl.value) || (this.ngControl && this.ngControl.value === 0)) {
      this.toggleFloatingLabel(true);
    } else {
      this.ngControl && this.ngControl.valueChanges.pipe(
        delay(100),
        takeUntil(this.destroy)).subscribe((value) => {
          if (this.isFocus) { return; }
          value ? this.toggleFloatingLabel(true) : value === 0 ? this.toggleFloatingLabel(true) : this.toggleFloatingLabel(false);
        })
    }
  }

  public ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }

  /**
   * Host listener set class when focus set on any input fields .
   */
  @HostListener('focus') public onFocus(): void {
    this.isFocus = true;
    if (this.ngControl && !this.ngControl.value) {
      this.toggleFloatingLabel(true);
    }
  }

  /**
   * Host listener remove class when input fields lost focus .
   */
  @HostListener('blur') public onblur(): void {
    this.isFocus = false;
    setTimeout(() => {
      if (this.ngControl && !this.ngControl.value && this.ngControl.value !== 0) {
        this.toggleFloatingLabel(false);
      }
    }, 100);
  }

  /**
   * Toggles floating label
   */
  private toggleFloatingLabel(isToggle: boolean): void {
    if (isToggle) {
      this.renderer.addClass(this.element.nativeElement.parentNode, 'float-above')
    } else {
      this.renderer.removeClass(this.element.nativeElement.parentNode, 'float-above');
    }
  }
}
