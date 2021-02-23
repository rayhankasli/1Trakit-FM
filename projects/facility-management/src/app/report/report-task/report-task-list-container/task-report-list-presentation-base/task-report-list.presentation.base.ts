
/**
 * @author Rayhan Kasli.
 * @description This is base class to represent the common members of desktop and mobile component.
 */

import { ChangeDetectorRef, Input } from '@angular/core';
import { TableProperty } from 'common-libs';
// --------------------------------------------- //
import { BasePresentation } from '../../../../core/base-classes/base.presentation';
import { ClientMaster } from '../../../../core/model/common.model';
import { TaskReport } from '../../report-task.model';
import { TaskReportChartPresenter } from '../task-report-chart-presenter/task-report-chart-presenter';
import { TaskReportListPresenter } from '../task-report-list-presenter/task-report-list.presenter';

/**
 * taskReport list presentation base
 */
export class TaskReportListPresentationBase extends BasePresentation {

  /** This property is used to store the taskReports that has been retrieved from the API. */
  @Input() public set taskReports(value: TaskReport[]) {
    if (value) {
      this._taskReports = value;
    }
    this.changeDetection.detectChanges();
  };

  public get taskReports(): TaskReport[] {
    return this._taskReports;
  }

  /** list of offices */
  @Input() public set clients(value: ClientMaster[]) {
    if (value) {
      this._clients = value;
    }
  }

  public get clients(): ClientMaster[] {
    return this._clients;
  }

  /** This property is used for filter apply or not. */
  public isFilterApply: boolean;

  /** This property is used to store the criteria that are selected by the user */
  public tableProperty: TableProperty;

  public picture: string;

  /** TaskReports of taskReport list presentation base */
  private _taskReports: TaskReport[];
  /** TaskReports of taskReport list presentation base */
  private _clients: ClientMaster[];

  constructor(
    public changeDetection: ChangeDetectorRef,
    public taskReportPresenter?: TaskReportListPresenter,
    public taskReportChartPresenter?: TaskReportChartPresenter,
  ) {
    super();
  }

  /**
   * This method is invoked when the user changes the current page size.
   * @param pageSize The page number that needs to be set.
   */
  public onPageSizeChange(pageSize: number): void {
    this.taskReportPresenter.onPageSizeChange(pageSize);
  }

  /**
   * This method is invoked when the user changes the page number from the pagination toolbar.
   * @param pageNumber The number to which the table should switch to
   */
  public onPageChange(pageNumber: number): void {
    this.taskReportPresenter.onPageChange(pageNumber);
  }

}
