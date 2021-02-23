/** 
 * @author Ronak Patel.
 * @description create directive for set focus of any focusable element. 
 */
import { Directive, ElementRef, AfterViewInit } from '@angular/core';

/**
 * Directive
 */
@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[autoFocus]',
  exportAs: 'autoFocus'
})
export class AutoFocusDirective implements AfterViewInit {

  constructor(private elementRef: ElementRef) {
  }

  public ngAfterViewInit(): void {
    this.setFocus();
  }

  /**
   * set focus to the elementRef.
   */
  public setFocus(): void {
    setTimeout(() => {
      this.elementRef.nativeElement.focus();
    }, 100);
  }


}
