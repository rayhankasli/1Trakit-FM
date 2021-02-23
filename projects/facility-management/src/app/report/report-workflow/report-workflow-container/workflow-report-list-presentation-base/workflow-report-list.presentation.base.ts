
/**
 * @author Enter Your Name Here.
 * @description This is base class to represent the common members of desktop and mobile component.
 */

import { ChangeDetectorRef, Input } from '@angular/core';
// --------------------------------------------- //
import { TableProperty } from 'common-libs';
// --------------------------------------------- //
import { BasePresentation } from '../../../../core/base-classes/base.presentation';
import { WorkflowReportList } from '../../report-workflow.model';
import { WorkflowReportListPresenter } from '../workflow-report-list-presenter/workflow-report-list.presenter';

/**
 * workflowReport list presentation base
 */
export class WorkflowReportListPresentationBase extends BasePresentation {

  /** This property is used to store the workflowReports that has been retrieved from the API. */
  @Input() public set workflowReportList(value: WorkflowReportList[]) {
    if (value) {
      this._workflowReports = value;
      this.changeDetection.detectChanges();
    }
  };

  public get workflowReportList(): WorkflowReportList[] {
    return this._workflowReports;
  }

  /** This property is used for filter apply or not. */
  public isFilterApply: boolean;

  /** This property is used to store the criteria that are selected by the user */
  public tableProperty: TableProperty;

  /** WorkflowReports of workflowReport list presentation base */
  private _workflowReports: WorkflowReportList[];

  constructor(
    public workflowReportPresenter: WorkflowReportListPresenter,
    public changeDetection: ChangeDetectorRef
  ) {
    super();
  }

  /**
   * This method is invoked when the user changes the current page size.
   * @param pageSize The page number that needs to be set.
   */
  public onPageSizeChange(pageSize: number): void {
    this.workflowReportPresenter.onPageSizeChange(pageSize);
  }

  /**
   * This method is invoked when the user changes the page number from the pagination toolbar.
   * @param pageNumber The number to which the table should switch to
   */
  public onPageChange(pageNumber: number): void {
    this.workflowReportPresenter.onPageChange(pageNumber);
  }

}
