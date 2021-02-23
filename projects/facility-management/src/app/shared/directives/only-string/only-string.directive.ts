import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[trackitOnlyString]'
})
export class OnlyStringDirective {

  constructor() { }

  /** Check  Invalid character, prevent input on key down */
  @HostListener('keypress', ['$event']) onKeyDown(event: any) {
    if (event.charCode !== 0) {
      const pattern: RegExp = /^[a-zA-Z ]*$/;
      const inputChar: string = String.fromCharCode(event.charCode);
      
      if (!pattern.test(inputChar)) {
        // invalid character, prevent input
        event.preventDefault();
        return;
      }
    }
    
    if (
      event.keyCode === 32 &&
      event.target.selectionStart === 0 &&
      event.keyCode !== 9
    ) {
      event.preventDefault();
    }
  }
}
