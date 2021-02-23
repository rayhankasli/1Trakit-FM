
/**
 * @author Enter Your Name Here.
 * @description This is base class to represent the common members of desktop and mobile component.
 */

import { ChangeDetectorRef, Input } from '@angular/core';
// --------------------------------------------- //
import { TableProperty } from 'common-libs';
// --------------------------------------------- //
import { BasePresentation } from '../../../../core/base-classes/base.presentation';
import { MailReport, MailReportFilterRecord } from '../../report-mail.model';
import { MailReportListPresenter } from '../mail-report-list-presenter/mail-report-list.presenter';

/**
 * mailReport list presentation base
 */
export class MailReportListPresentationBase extends BasePresentation {

  /** This property is used to store the mailReports that has been retrieved from the API. */
  @Input() public set mailReports(value: MailReport[]) {
    this._mailReports = value;
    this.changeDetection.detectChanges();
  };

  public get mailReports(): MailReport[] {
    return this._mailReports;
  }

  /** This property is used for filter apply or not. */
  public isFilterApply: boolean;

  /** This property is used to store the criteria that are selected by the user */
  public tableProperty: TableProperty<MailReportFilterRecord>;

  /** MailReports of mailReport list presentation base */
  private _mailReports: MailReport[];

  constructor(
    public mailReportPresenter: MailReportListPresenter,
    public changeDetection: ChangeDetectorRef
  ) {
    super();
  }

  /**
   * This method is invoked when the user changes the current page size.
   * @param pageSize The page number that needs to be set.
   */
  public onPageSizeChange(pageSize: number): void {
    this.mailReportPresenter.onPageSizeChange(pageSize);
  }

  /**
   * This method is invoked when the user changes the page number from the pagination toolbar.
   * @param pageNumber The number to which the table should switch to
   */
  public onPageChange(pageNumber: number): void {
    this.mailReportPresenter.onPageChange(pageNumber);
  }

  /** create for open modal when action perform */
  public clearFilter(): void {
    this.isFilterApply = false;
    this.mailReportPresenter.setTableProperty(new TableProperty());
  }

}
