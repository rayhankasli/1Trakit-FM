/**
 * @author Rayhan Kasli
 */
import { Component, OnInit, HostBinding } from '@angular/core';

@Component({
  selector: 'app-no-record-found',
  templateUrl: './no-record-found.component.html',
})
export class NoRecordFoundComponent implements OnInit {

  public currentYear: number;

  /** hostBinding */
  @HostBinding('class') public class: string = 'd-flex flex-column h-100 w-100';

  constructor() { }

  public ngOnInit(): void {
    this.currentYear = new Date().getUTCFullYear();
  }

}
