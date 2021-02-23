import { Directive, ElementRef, HostListener, Input } from '@angular/core';

/**
 * This directive is used to scroll to the first invalid control of the current screen
 * fetches class ".ng-invalid" to check invalid controls
 */
@Directive({
  selector: '[focusInvalidInput]'
})
export class FocusInvalidInputDirective {

  /**
   * Force check the invalid controls of an active form
   */
  @Input() public set forceCheck(check: any) {
    if (check) {
      this.onFormSubmit();
    }
  }

  constructor(
    private el: ElementRef
  ) { }

  /**
   * listen submit event of a form
   */
  @HostListener('submit') public onFormSubmit(): void {

    const invalidControl = this.el.nativeElement.querySelector('.ng-invalid');
    
    if (invalidControl) {
      setTimeout(() => {
        // invalidControl.focus();
        invalidControl.scrollIntoView();
      });
    }
  }
}