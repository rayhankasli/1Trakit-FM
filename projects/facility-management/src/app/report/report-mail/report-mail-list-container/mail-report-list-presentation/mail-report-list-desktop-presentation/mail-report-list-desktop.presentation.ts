/**
 * @author Enter Your Name Here.
 * @description This is data table desktop presentation component.To represent data in the desktop view.
 */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Subject } from 'rxjs/Subject';
//-------------------------------------------------------------------------------//
import { SortingOrder, SortingOrderDirective } from 'common-libs';
//-------------------------------------------------------------------------------//
import { DATE_TIME_FORMAT } from '../../../../../core/utility/constants';
import { Pictures } from '../../../../../core/model/common.model';
import { MailReportListPresentationBase } from '../../mail-report-list-presentation-base/mail-report-list.presentation.base';
import { MailReportListPresenter } from '../../mail-report-list-presenter/mail-report-list.presenter';

/**
 * MailReportListDesktopPresentationComponent
 */
@Component({
  selector: 'app-mail-report-list-desktop-presentation',
  templateUrl: './mail-report-list-desktop.presentation.html',
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class MailReportListDesktopPresentationComponent extends MailReportListPresentationBase implements OnInit, OnDestroy {

  /** This property is used to store QueryList of SortingOrderDirective */
  @ViewChildren(SortingOrderDirective) public sortingColumns: QueryList<SortingOrderDirective>;

  /** date-time format */
  public dateFormat: string = DATE_TIME_FORMAT;

  /** Destroy of customer list desktop presentation component */
  private destroy: Subject<boolean>;

  constructor(
    public mailReportPresenter: MailReportListPresenter,
    public changeDetection: ChangeDetectorRef
  ) {
    super(mailReportPresenter, changeDetection);
    this.destroy = new Subject();
  }

  public ngOnInit(): void { }

  /**
   * This method is invoked when the user clicks on sorting icons. It sets the sort related criteria and queries the server
   * to get the updated list of mailReports.
   * @param column The column on which sorting needs to be performed. 
   * @param sortingOrder The sort order by which the column needs to be sorted.
   */
  public onSortOrder(column: string, sortingOrder: SortingOrder): void {
    this.mailReportPresenter.onSortOrder(column, sortingOrder, this.sortingColumns);
  }

  /** openGallary */
  public openGallery(images: Pictures[]): void {
    this.mailReportPresenter.openGallery(images);
  }

  public ngOnDestroy(): void {
    this.destroy.next(true);
    this.destroy.unsubscribe();
  }
}
