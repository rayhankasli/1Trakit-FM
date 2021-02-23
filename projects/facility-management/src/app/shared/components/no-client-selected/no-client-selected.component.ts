import { Component, ChangeDetectionStrategy, HostBinding } from '@angular/core';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'trakit-no-client-selected',
  templateUrl: './no-client-selected.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NoClientSelectedComponent {

  /** Add class */
  @HostBinding('class') public class: string;

  constructor() {
    this.class = 'd-flex flex-column h-100 pb-3';
  }

}
