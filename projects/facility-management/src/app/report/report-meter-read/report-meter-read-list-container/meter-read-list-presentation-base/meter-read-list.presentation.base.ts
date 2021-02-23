  
/**
 * @author Rayhan Kasli.
 * @description This is base class to represent the common members of desktop component.
 */

import { ChangeDetectorRef } from '@angular/core';
import { TableProperty } from 'common-libs';
// --------------------------------------------- //
import { MeterReadListPresenter } from '../meter-read-list-presenter/meter-read-list.presenter';
import { MeterRead } from '../../report-meter-read.model';
import { BasePresentation } from 'projects/facility-management/src/app/core/base-classes/base.presentation';

/**
 * meterRead list presentation base
 */
export class MeterReadListPresentationBase extends BasePresentation {

  /** This property is used for filter apply or not. */
  public isFilterApply: boolean;

  /** This property is used to store the criteria that are selected by the user */
  public tableProperty: TableProperty;

  constructor(public meterReadPresenter: MeterReadListPresenter, public changeDetection: ChangeDetectorRef) { 
    super()
  }

  /**
   * This method is invoked when the user changes the current page size.
   * @param pageSize The page number that needs to be set.
   */
  public onPageSizeChange(pageSize: number): void {
    this.meterReadPresenter.onPageSizeChange(pageSize);
  }

  /**
   * This method is invoked when the user changes the page number from the pagination toolbar.
   * @param pageNumber The number to which the table should switch to
   */
  public onPageChange(pageNumber: number): void {
    this.meterReadPresenter.onPageChange(pageNumber);
  }

}
