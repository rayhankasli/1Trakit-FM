

/**
 * @name CalendarPrintContainerComponent
 * @author Ashok Yadav | Rayhan Kasli
 * @description This is a container component for Bookit. This is responsible for all data retrieving and posting to the server by http calls.
 */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subject, of } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
//--------------------------------------------------------------------//
import { Calendar } from '../calender.model';

/**
 * BookitFormContainerComponent
 */
@Component({
  selector: 'trakit-calendar-print-container',
  templateUrl: './calendar-print.container.html'
})
export class CalendarPrintContainerComponent implements OnInit, OnDestroy {
  public clendarEvents$: Observable< Calendar[]>;
  /** Destroy of customer form presentation component */
  public destroy: Subject<void>;
  constructor(private route: ActivatedRoute) {
    this.destroy = new Subject();
  }

  /** ngOnInit */
  public ngOnInit(): void {
    this.route.data.pipe(map(d => d['info']),takeUntil(this.destroy))
      .subscribe((data: Calendar[]) => {
        this.clendarEvents$ = of(data);
      });
  }

  public ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }
}
