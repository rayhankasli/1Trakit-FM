/**
 * @author Rayhan Kasli.
 * @description This is data table desktop presentation component.To represent data in the desktop view.
 */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, QueryList, ViewChildren } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Subject } from 'rxjs/Subject';
//-----------------------------------------------------------------------------------------------------//
import { SortingOrder, SortingOrderDirective } from 'common-libs';
//-----------------------------------------------------------------------------------------------------//
import { Pictures } from '../../../../../core/model/common.model';
import { DATE_TIME_FORMAT } from '../../../../../core/utility/constants';
import { TaskReportListPresentationBase } from '../../task-report-list-presentation-base/task-report-list.presentation.base';
import { TaskReportListPresenter } from '../../task-report-list-presenter/task-report-list.presenter';

/**
 * TaskReportListDesktopPresentationComponent
 */
@Component({
  selector: 'app-task-report-list-desktop-presentation',
  templateUrl: './task-report-list-desktop.presentation.html',
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class TaskReportListDesktopPresentationComponent extends TaskReportListPresentationBase implements OnDestroy {

  public dateTimeFormat: string = DATE_TIME_FORMAT
  /** This property is used to store QueryList of SortingOrderDirective */
  @ViewChildren(SortingOrderDirective) public sortingColumns: QueryList<SortingOrderDirective>;

  /** Destroy of customer list desktop presentation component */
  private destroy: Subject<boolean>;
  
  constructor(
    public taskReportPresenter: TaskReportListPresenter,
    public changeDetection: ChangeDetectorRef,
    private sanitizer: DomSanitizer
  ) {
    super(changeDetection);
    this.destroy = new Subject();
  }
 
  /**
   * This method is invoked when the user clicks on sorting icons. It sets the sort related criteria and queries the server
   * to get the updated list of taskReports.
   * @param column The column on which sorting needs to be performed. 
   * @param sortingOrder The sort order by which the column needs to be sorted.
   */
  public onSortOrder(column: string, sortingOrder: SortingOrder): void {
    this.taskReportPresenter.onSortOrder(column, sortingOrder, this.sortingColumns);
  }

  /** openGallary */
  public openGallery(images: Pictures[]): void {
    this.taskReportPresenter.openGallery(images);
  }

  public ngOnDestroy(): void {
    this.destroy.next(true);
    this.destroy.unsubscribe();
  }
}
