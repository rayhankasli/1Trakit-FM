

/**
 * @name BookitPrintContainerComponent
 * @author Enter Your Name Here
 * @description This is a container component for Bookit. This is responsible for all data retrieving and posting to the server by http calls.
 */
import { Component,  OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { map, takeUntil } from 'rxjs/operators';
import { of, Subject } from 'rxjs';
//--------------------------------------------------------------------//
import { BookIt } from '../models/bookit.model';

/**
 * BookitFormContainerComponent
 */
@Component({
  selector: 'trakit-bookit-print-container',
  templateUrl: './bookit-print.container.html'
})
export class BookitPrintContainerComponent implements OnInit, OnDestroy {
  /** Hold bookIt item */
  public bookIt$: Observable<BookIt>;
  /** Destroy of customer form presentation component */
  public destroy: Subject<void>;
  constructor(private route: ActivatedRoute) {
    this.destroy = new Subject();
  }

  public ngOnInit(): void {
    this.route.data.pipe(
      map(d => d['info']),
      takeUntil(this.destroy))
      .subscribe(data => {
        this.bookIt$ = of(data);
      });
  }

  public ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }
}
