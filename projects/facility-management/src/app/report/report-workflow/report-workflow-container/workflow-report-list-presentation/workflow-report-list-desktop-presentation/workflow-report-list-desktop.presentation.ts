/**
 * @author Enter Your Name Here.
 * @description This is data table desktop presentation component.To represent data in the desktop view.
 */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import { SortingOrder, SortingOrderDirective } from 'common-libs';
import { Subject } from 'rxjs/Subject';
//-----------------------------------------------------------------------------------------------------//
import { Pictures } from '../../../../../core/model/common.model';
import { DATE_TIME_FORMAT } from '../../../../../core/utility/constants';
import { WorkflowReportListPresentationBase } from '../../workflow-report-list-presentation-base/workflow-report-list.presentation.base';
import { WorkflowReportListPresenter } from '../../workflow-report-list-presenter/workflow-report-list.presenter';

/**
 * WorkflowReportListDesktopPresentationComponent
 */
@Component({
  selector: 'app-workflow-report-list-desktop-presentation',
  templateUrl: './workflow-report-list-desktop.presentation.html',
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class WorkflowReportListDesktopPresentationComponent extends WorkflowReportListPresentationBase implements OnInit, OnDestroy {

  public dateTimeFormat:string=DATE_TIME_FORMAT;
  /** This property is used to store QueryList of SortingOrderDirective */
  @ViewChildren(SortingOrderDirective) public sortingColumns: QueryList<SortingOrderDirective>;

  /** Destroy of customer list desktop presentation component */
  private destroy: Subject<boolean>;

  constructor(
    public workflowReportPresenter: WorkflowReportListPresenter,
    public changeDetection: ChangeDetectorRef
  ) {
    super(workflowReportPresenter, changeDetection);
    this.destroy = new Subject();
  }

  public ngOnInit(): void {
  }

  /** openGallary */
  public openGallery(images: Pictures[]): void {
    this.workflowReportPresenter.openGallery(images);
  }

  /**
   * This method is invoked when the user clicks on sorting icons. It sets the sort related criteria and queries the server
   * to get the updated list of workflowReports.
   * @param column The column on which sorting needs to be performed. 
   * @param sortingOrder The sort order by which the column needs to be sorted.
   */
  public onSortOrder(column: string, sortingOrder: SortingOrder): void {
    this.workflowReportPresenter.onSortOrder(column, sortingOrder, this.sortingColumns);
  }

  public ngOnDestroy(): void {
    this.destroy.next(true);
    this.destroy.unsubscribe();
  }
}
