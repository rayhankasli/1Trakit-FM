/**
 * @author Rayhan Kasli.
 * @description This is data table desktop presentation component.To represent data in the desktop view.
 */
import { CdkVirtualScrollViewport, ScrollDispatcher } from '@angular/cdk/scrolling';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding, Input, NgZone, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import { DECIMAL_FORMAT } from 'projects/facility-management/src/app/core/utility/constants';
import { debounceTime, filter } from 'rxjs/operators';
import { takeUntil } from 'rxjs/operators/takeUntil';
import { Subject } from 'rxjs/Subject';
//-----------------------------------------------------------------------------------------------------//
import { SortingOrder, SortingOrderDirective } from 'common-libs';
//-----------------------------------------------------------------------------------------------------//
import { MeterRead } from '../../../report-meter-read.model';
import { MeterReadListPresentationBase } from '../../meter-read-list-presentation-base/meter-read-list.presentation.base';
import { MeterReadListPresenter } from '../../meter-read-list-presenter/meter-read-list.presenter';

/**
 * MeterReadListDesktopPresentationComponent
 */
@Component({
  selector: 'app-meter-read-list-desktop-presentation',
  templateUrl: './meter-read-list-desktop.presentation.html',
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class MeterReadListDesktopPresentationComponent extends MeterReadListPresentationBase implements OnInit, OnDestroy, AfterViewInit {

  /** This property is used for add class host element */
  @HostBinding('class') public class: string;
  /** This property is used to store the meterReads that has been retrieved from the API. */
  @Input() public set meterReads(value: MeterRead[]) {
    if (value) {
      this._meterReads = value;
      this.meterReadPresenter.setMeterReadData(value);
      this.scrollingMeterRead = null;
    }
  };

  public get meterReads(): MeterRead[] {
    return this._meterReads;
  }

  /** This property is used to store QueryList of SortingOrderDirective */
  @ViewChildren(SortingOrderDirective) public sortingColumns: QueryList<SortingOrderDirective>;

  public meterReadsData: MeterRead[] = [];

  /** Decimal format for showing Amounts */
  public decimal: string = DECIMAL_FORMAT;

  /** totalBwCopies */
  public get totalBwCopies(): number {
    return this.meterReadPresenter.totalBwCopies;
  }
  /** totalColorCopies */
  public get totalColorCopies(): number {
    return this.meterReadPresenter.totalColorCopies;
  }
  /** totalBwCost */
  public get totalBwCost(): number {
    return this.meterReadPresenter.totalBwCost;
  }
  /** totalColorCost */
  public get totalColorCost(): number {
    return this.meterReadPresenter.totalColorCost;
  }

  /** MeterReads of meterRead list presentation base */
  private _meterReads: MeterRead[];
  /** scrolling MeterRead instance */
  private scrollingMeterRead: MeterRead;
  /** Destroy of customer list desktop presentation component */
  private destroy: Subject<boolean>;

  constructor(
    public meterReadPresenter: MeterReadListPresenter,
    public changeDetection: ChangeDetectorRef,
    private zone: NgZone,
    private scrollDispatcher: ScrollDispatcher
  ) {
    super(meterReadPresenter, changeDetection);
    this.destroy = new Subject();
    this.class = 'd-flex flex-column h-100 overflow-hidden';
  }

  public ngOnInit(): void {
    this.meterReadPresenter.newMeterReads$.pipe(takeUntil(this.destroy)).subscribe((response: MeterRead[]) => {
      this.meterReadsData = response;
    })
  }

  /**
  * provide ng life cycle hook
  */
  public ngAfterViewInit(): void {
    this.zone.runOutsideAngular((fn) => {
      this.scrollDispatcher.scrolled().pipe(
        takeUntil(this.destroy),
        filter((virtualScroll: CdkVirtualScrollViewport) =>
          virtualScroll.measureScrollOffset('bottom') === 0),
        debounceTime(100))
        .subscribe((event: CdkVirtualScrollViewport) => {
          if (this.scrollingMeterRead.meterReadDetail.length < this.scrollingMeterRead.total) {
            this.zone.run(() => {
              this.meterReadPresenter.scrollHandalingEvents(this.scrollingMeterRead);
            })
          }
        });
    })
  }

  /**
   * set current scrolling MeterRead
   * which will be used to make API call using scrollDispatcher
   * @param meterRead MeterRead
   * @param ref CdkVirtualScrollViewPort instance from UI
   */
  public onMeterReadScroll(meterRead: MeterRead, ref: CdkVirtualScrollViewport): void {
    this.scrollingMeterRead = { ...meterRead, meterReadDetail: [...meterRead.meterReadDetail] };
  }

  /**
   * This method is invoked when the user clicks on sorting icons. It sets the sort related criteria and queries the server
   * to get the updated list of meterReads.
   * @param column The column on which sorting needs to be performed. 
   * @param sortingOrder The sort order by which the column needs to be sorted.
   */
  public onSortOrder(column: string, sortingOrder: SortingOrder, meter: MeterRead): void {
    this.meterReadPresenter.onMeterReadSortOrder(column, sortingOrder, this.sortingColumns, meter);
  }

  public ngOnDestroy(): void {
    this.destroy.next(true);
    this.destroy.unsubscribe();
  }
}
