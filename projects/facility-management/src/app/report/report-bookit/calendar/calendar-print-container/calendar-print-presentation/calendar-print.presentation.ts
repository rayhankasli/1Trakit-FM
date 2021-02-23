/**
 * @author Ashok Yadav.
 * @description
 */
import { Location } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
// ----------------------------------------------- //
import { environment } from '../../../../../../environments/environment';
import { BasePresentation } from '../../../../../core/base-classes/base.presentation';
import { Calendar, Events } from '../../calender.model';

@Component({
  selector: 'app-calendar-print-presentation-ui',
  templateUrl: './calendar-print.presentation.html',
})
export class CalendarPrintPresentationComponent extends BasePresentation implements AfterViewInit {

  @Input() public set calendarFilterItems(value: Calendar[]) {
    if (value) {
      this._filterItems = value.sort((first: Calendar, second: Calendar) => new Date(second.date).getTime() - new Date(first.date).getTime());
    }
  }

  public get calendarFilterItems(): Calendar[] {
    return this._filterItems;
  }

  /** print button reference */
  @ViewChild('printBtn', { static: false }) public printBtn: ElementRef;

  /** host path for absolute URL */
  public get host(): string {
    return environment.redirect_uri;
  }
  /** printEvents */
  public printEvents: Events[];
  /** Hold master data */
  private _filterItems: Calendar[];

  constructor(
    private location: Location,
  ) {
    super();
  }

  public ngAfterViewInit(): void {
    this.printBtn.nativeElement.click();
    this.location.back();
  }
}
