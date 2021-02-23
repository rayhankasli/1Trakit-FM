/** 
 * @author Ronak Patel.
 * @description create directive for set class when input property has focus and remove class when blur. 
 */

import { Directive, ElementRef, Renderer2, HostListener, OnInit, Optional, Input } from '@angular/core';
import { NgControl } from '@angular/forms';
import { take } from 'rxjs/operators/take';
import { NgSelectComponent } from '@ng-select/ng-select';
import { PopoverDirective } from 'ngx-bootstrap';

/**
 * Directive
 */
@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[popoverFloatingLabel]',
  exportAs: 'popoverFloatingLabel'
})
export class PopoverFloatingLabelDirective implements OnInit {

  constructor(
    private popover: PopoverDirective,
    private element: ElementRef,
    private renderer: Renderer2,
    @Optional() private ngControl: NgControl
  ) {
  }

  /**
   * after view init
   */
  public ngOnInit(): void {
    if (this.ngControl && this.ngControl.value) {
      this.toggleFloatingLabel(true);
    }

    this.popover.onShown.subscribe(() => {
      if (this.ngControl && !this.ngControl.value) {
        this.toggleFloatingLabel(true);
      }
    });

    this.popover.onHidden.subscribe(() => {
      if (this.ngControl && !this.ngControl.value) {
        this.toggleFloatingLabel(false);
      }
    });
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
