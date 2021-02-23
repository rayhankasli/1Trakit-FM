import { Directive, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { BusyService } from '../../../core/services/interceptor/busy.service';
import { Subscription } from 'rxjs';

@Directive({
  selector: '[disableOnAjax]',
  exportAs: 'disableOnAjax'
})
export class DisableOnAjaxDirective implements OnInit, OnDestroy {

  /** subscription instance, to unsubscribe on destroy */
  private subscription: Subscription;

  constructor(
    private busyService: BusyService,
    private el: ElementRef,
  ) { }

  public ngOnInit(): void {
    // watch over busy service and disable the element if busy
    this.subscription = this.busyService.busy$.subscribe((flag: boolean) => {
      this.el.nativeElement.disabled = flag;
    });
  }
  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
