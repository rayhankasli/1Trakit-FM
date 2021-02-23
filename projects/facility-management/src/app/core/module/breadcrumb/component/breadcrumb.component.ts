import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
// -------------------------------------------------------------------- //
import { BreadcrumbService } from '../services/breadcrumb.service';
import { IBreadcrumb } from '../services/breadcrumb.shared';
import { trackBy } from '../../../utility/utility';

@Component({
  selector: 'trackit-breadcrumb',
  templateUrl: './breadcrumb.component.html',
})
export class BreadcrumbComponent implements OnInit, OnDestroy {
  @Input() public showIcon: boolean;

  public crumbs: IBreadcrumb[];
  public subscriptions: Array<Subscription> = new Array<Subscription>();
  constructor(public service: BreadcrumbService) {
    this.showIcon = false;
  }

  public ngOnInit(): void {
    this.service.crumbs$.subscribe((x: IBreadcrumb[]) => {
      this.crumbs = x;
    });
  }

  /**
   * Used for performance optimization.
   */
  public trackBy(key: string, index: number, data: any): number {
    return trackBy(key, index, data);
  }

  public ngOnDestroy(): void {
    this.subscriptions.forEach((x: Subscription) => x.unsubscribe());
  }
}
