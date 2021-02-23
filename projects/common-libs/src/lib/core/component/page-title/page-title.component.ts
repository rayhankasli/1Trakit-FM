/** 
 * @author  Nitesh Sharma 
 */

import { Component, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute, Event, Data } from '@angular/router';
import { takeUntil } from 'rxjs/operators/takeUntil';
import { filter } from 'rxjs/operators/filter';
import { map } from 'rxjs/operators/map';
import { switchMap } from 'rxjs/operators/switchMap';
import { Subject } from 'rxjs/Subject';

/**
 * PageTitleComponent
 */
@Component({
  selector: 'lib-page-title',
  templateUrl: './page-title.component.html',
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PageTitleComponent implements OnDestroy {


  /** stores the title of current page */
  public pageTitle: string;

  /** Use to unsubscribe the observable on ngOnDestroy */
  private destroy: Subject<void>;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {
    this.destroy = new Subject();
    this.getPageTitle();
  }

  /**
   * on destroy
   */
  public ngOnDestroy(): void {
    this.destroy.complete();
    this.destroy.unsubscribe();
  }


  /**
   * Gets page title
   * @returns page title 
   */
  private getPageTitle(): void {
    this.router.events.pipe(
      takeUntil(this.destroy),
      filter((event: Event) => event instanceof NavigationEnd),
      map(() => this.activatedRoute),
      map((route: ActivatedRoute) => {
        while (route.firstChild) route = route.firstChild;
        return route;
      }),
      filter((route: ActivatedRoute) =>
        route.outlet === 'primary'),
      switchMap((route: ActivatedRoute) => route.data),
      map((data: Data) => {
        this.pageTitle = '';
        this.cdr.detectChanges();
        return data;
      })).
      subscribe((data: Data) => {
        if (data.title) {
          this.pageTitle = data.title;
          this.cdr.detectChanges();
        }
      });
  }
}
