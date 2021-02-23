import {
  Directive,
  OnInit,
  OnDestroy,
  ElementRef,
  Renderer2,
  Optional,
  HostListener,
} from '@angular/core';
import { Subject } from 'rxjs';
import { NgControl } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[calendarFlotingLabel]',
  exportAs: 'calendarFlotingLabel',
})
export class CalendarFlotingLabelDirective implements OnInit, OnDestroy {
  private destroy: Subject<boolean>;

  constructor(
    private element: ElementRef,
    private renderer: Renderer2,
    @Optional() private ngControl: NgControl
  ) {
    this.destroy = new Subject();
  }

  /** onInit method of life cycle hook. */
  public ngOnInit(): void {
    if (this.ngControl) {
      if (this.ngControl.value) {
        this.toggleFloatingLabel(true);
      }

      this.ngControl.valueChanges
        .pipe(takeUntil(this.destroy))
        .subscribe((value) => {
         
          if (value) {
            this.toggleFloatingLabel(true);
          } else {
            this.toggleFloatingLabel(false);
          }
        });
    }
  }

  /**
   * Host listener set class when focus set on any input fields .
   */
  @HostListener('focus') public onFocus(): void {
    if (this.ngControl && !this.ngControl.value) {
      this.toggleFloatingLabel(true);
    }
  }

  /**
   * Host listener set class when on click of date input fields .
   */
  @HostListener('click') public onClick(): void {
    if (this.ngControl && !this.ngControl.value) {
      this.toggleFloatingLabel(true);
    }
  }

  /**
   * Host listener set class when on-blur set on any input fields .
   */
  @HostListener('blur') public onblur(): void {
    setTimeout(() => {
      if (
        this.ngControl &&
        !this.ngControl.value &&
        this.ngControl.value !== 0
      ) {
        this.toggleFloatingLabel(false);
      }
    }, 100);
  }

  /**
   * Calling ondestroy lifecycle method
   */

  public ngOnDestroy(): void {
    this.destroy.next(true);
    this.destroy.complete();
  }

  /** Add and Remove Class */
  private toggleFloatingLabel(isToggle: boolean): void {
    if (isToggle) {
      this.renderer.addClass(
        this.element.nativeElement.parentNode,
        'float-above'
      );
    } else {
      this.renderer.removeClass(
        this.element.nativeElement.parentNode,
        'float-above'
      );
    }
  }
}
