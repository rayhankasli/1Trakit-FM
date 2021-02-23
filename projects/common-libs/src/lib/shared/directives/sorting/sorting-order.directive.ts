/**
 * @author Ronak Patel.
 * @description Create directive for ascending or descending order sorting .
 */
import { Directive, ElementRef, Renderer2, HostListener, Output, EventEmitter, Input } from '@angular/core';
import { SortingOrder } from './sorting-order.model';

/**
 * SortingOrderDirective
 */
@Directive({
// tslint:disable-next-line: directive-selector
  selector: '[appSortingOrder]',
  exportAs: 'appSortingOrder'
})
export class SortingOrderDirective {

  /**
   * Input  of sorting order directive
   */
  @Input() public column: string;
  /** create for pass sorting order to parent. */
  @Output() public orderType: EventEmitter<SortingOrder>;
  /** store ascending or not */
  public isAscending: boolean;

  constructor(
    public elementRef: ElementRef,
    private renderer: Renderer2
  ) {
    this.orderType = new EventEmitter<SortingOrder>();
    this.isAscending = false;
  }

  /** create for listen click event and base on event set class and emit sorting order. */
  @HostListener('click') public onClick(): void {
    if (this.isAscending) {
      this.renderer.addClass(this.elementRef.nativeElement, 'sort-asc');
      this.renderer.removeClass(this.elementRef.nativeElement, 'sort-desc');
      this.orderType.emit(SortingOrder.Ascending);
    } else {
      this.renderer.addClass(this.elementRef.nativeElement, 'sort-desc');
      this.renderer.removeClass(this.elementRef.nativeElement, 'sort-asc');
      this.orderType.emit(SortingOrder.Descending);
    }
    this.isAscending = !this.isAscending;
  }
}

