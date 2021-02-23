import { Component, OnInit, HostBinding } from '@angular/core';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
})
export class ReportComponent implements OnInit {

  /** hostBinding */
  @HostBinding('class') public class: string = 'd-flex h-100 overflow-hidden';
  
  constructor() { }

  ngOnInit() {
  }

}
