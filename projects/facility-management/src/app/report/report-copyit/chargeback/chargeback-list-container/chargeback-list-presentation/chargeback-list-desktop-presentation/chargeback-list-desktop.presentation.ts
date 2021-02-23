/** 
 * @author Shahbaz Shaikh.
 * @description ChargeBackListDesktopPresentationComponent component.
 */

import { Component, ChangeDetectorRef, ViewChildren, QueryList, ChangeDetectionStrategy, HostBinding } from '@angular/core';
//-----------------------------------------------------------------------------------------------------//
import { SortingOrderDirective, SortingOrder } from 'common-libs';
//-----------------------------------------------------------------------------------------------------//
import { DATE_FORMAT, MMMM_YY_DATE_FORMAT, DECIMAL_FORMAT } from '../../../../../../core/utility/constants';
import { ChargeBackListPresenter } from '../../chargeback-list-presenter/chargeback-list.presenter';
import { ChargeBackListPresentationBase } from '../../chargeback-list-presentation-base/chargeback-list-presentation.base';


/**
 * ChargeBackListListDesktopPresentationComponent
 */
@Component({
  selector: 'app-chargeback-list-desktop-presentation-ui',
  templateUrl: './chargeback-list-desktop.presentation.html',
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class ChargeBackListDesktopPresentationComponent extends ChargeBackListPresentationBase {

  /** Add Class */
  @HostBinding('class') public class: string;
  
  /** This property is used to store QueryList of SortingOrderDirective */
  @ViewChildren(SortingOrderDirective) public sortingColumns: QueryList<SortingOrderDirective>;

  /** Month Year Format (mmmm-YY) */
  public readonly dateFormat: string = DATE_FORMAT;

  /** Month Year Format (mmmm-YY) */
  public readonly monthYearFormat: string = MMMM_YY_DATE_FORMAT;

  /** Decimal format for showing Amounts */
  public decimal: string = DECIMAL_FORMAT;

  constructor(
    public chargeBackListPresenter: ChargeBackListPresenter,
    public changeDetection: ChangeDetectorRef
  ) {
    super(chargeBackListPresenter, changeDetection);
    this.class = 'd-flex flex-column overflow-hidden';
  }

  /**
   * This method is invoked when the user clicks on sorting icons. It sets the sort related criteria and queries the server
   * to get the updated list of chargeBackLists.
   * @param column The column on which sorting needs to be performed. 
   * @param sortingOrder The sort order by which the column needs to be sorted.
   */
  public onSortOrder(column: string, sortingOrder: SortingOrder): void {
    this.chargeBackListPresenter.onSortOrder(column, sortingOrder, this.sortingColumns);
  }

}
