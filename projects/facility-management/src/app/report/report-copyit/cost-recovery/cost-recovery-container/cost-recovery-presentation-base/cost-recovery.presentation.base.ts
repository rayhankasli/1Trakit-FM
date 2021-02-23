
/**
 * @author Enter Your Name Here.
 * @description This is base class to represent the common members of component.
 */

import { ChangeDetectorRef } from '@angular/core';
// ------------------------------------------------------------ //
import { TableProperty } from 'common-libs';
// ------------------------------------------------------------ //
import { BasePresentation } from '../../../../../core/base-classes/base.presentation';
import { CostRecoveryPresenter } from '../cost-recovery-presenter/cost-recovery.presenter';

/**
 * costRecovery list presentation base
 */
export class CostRecoveryPresentationBase extends BasePresentation {

  /** This property is used to store the criteria that are selected by the user */
  public tableProperty: TableProperty;

  constructor(
    public costRecoveryPresenter: CostRecoveryPresenter,
    public changeDetection: ChangeDetectorRef
  ) {
    super();
  }

  /**
   * This method is invoked when the user changes the current page size.
   * @param pageSize The page number that needs to be set.
   */
  public onPageSizeChange(pageSize: number): void {
    this.costRecoveryPresenter.onPageSizeChange(pageSize);
  }

  /**
   * This method is invoked when the user changes the page number from the pagination toolbar.
   * @param pageNumber The number to which the table should switch to
   */
  public onPageChange(pageNumber: number): void {
    this.costRecoveryPresenter.onPageChange(pageNumber);
  }

}
