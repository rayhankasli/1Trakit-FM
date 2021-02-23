/** 
 * @author Ronak Patel.
 * @description create directive for set class when input property has focus and remove class when blur. 
 */

import { Directive, ElementRef, Renderer2, HostListener, OnInit, Optional, Input, OnDestroy } from '@angular/core';
import { NgControl } from '@angular/forms';
import { take } from 'rxjs/operators/take';
import { NgSelectComponent } from '@ng-select/ng-select';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

/**
 * Directive
 */
@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[selectFloatingLabel]',
  exportAs: 'selectFloatingLabel'
})
export class SelectFloatingLabelDirective implements OnInit, OnDestroy {

  /** to keep subscription until the view destroyed */
  private destroy: Subject<boolean>;

  constructor(
    private ngSelect: NgSelectComponent,
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
    if (this.ngControl && this.ngControl.value) {
      this.toggleFloatingLabel(true);
    } else {
      this.ngControl && this.ngControl.valueChanges.pipe(takeUntil(this.destroy)).subscribe((value) => {
        if (value) { this.toggleFloatingLabel(true) }
        else { this.toggleFloatingLabel(false) }
      })
    }

    this.ngSelect.openEvent.subscribe(() => {
      if (this.ngControl && !this.ngControl.value) {
        this.toggleFloatingLabel(true);
      }
    });

    this.ngSelect.closeEvent.subscribe(() => {
      // if (this.ngControl && !this.ngControl.value) {
      if (this.ngControl && (this.ngControl.value === '' || this.ngControl.value === null)) {
        this.toggleFloatingLabel(false);
      }
    });
  }

  public ngOnDestroy(): void {
    this.destroy.next(true);
    this.destroy.complete();
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
