/**
 * @author Shahbaz Shaikh.
 * @description This is base class to represent the common members of component.
 */

import { ChangeDetectorRef, Input } from '@angular/core';
// --------------------------------------------- //
import { TableProperty } from 'common-libs';
// --------------------------------------------- //
import { BasePresentation } from '../../../../../core/base-classes/base.presentation';
import { ChargeBack } from '../../chargeback.model';
import { ChargeBackListPresenter } from '../chargeback-list-presenter/chargeback-list.presenter';

/**
 * chargeBackList list presentation base
 */
export class ChargeBackListPresentationBase extends BasePresentation {

  /** This property is used to store the chargeBackLists that has been retrieved from the API. */
  @Input() public set chargeBackLists(value: ChargeBack) {
    if (value) {
      this._chargeBackLists = value;
      this.changeDetection.detectChanges();
    }
  };

  public get chargeBackLists(): ChargeBack {
    return this._chargeBackLists;
  }

  @Input() public set tablePropertyObj(value: TableProperty) {
    if (value) {
      this._tablePropertyObj = value;
      this.compareMonth(value);
      this.changeDetection.detectChanges();
    }
  }

  public get tablePropertyObj(): TableProperty {
    return this._tablePropertyObj;
  }

  /** This property is used to store the criteria that are selected by the user */
  public tableProperty: TableProperty;

  /** Set Start Date */
  public startDate: Date;

  /** Set End  Date */
  public endDate: Date;

  /** Determines whether isMonthSame is ture or false */
  public get isMonthSame(): boolean {
    return this.chargeBackListPresenter.isMonthSame;
  }

  /** ChargeBackLists of chargeBackList list presentation base */
  private _chargeBackLists: ChargeBack;

  /** Acoount Number */
  private _tablePropertyObj: TableProperty;

  constructor(
    public chargeBackListPresenter: ChargeBackListPresenter,
    public changeDetection: ChangeDetectorRef
  ) {
    super();
   }

  /**
   * This method is invoked when the user changes the current page size.
   * @param pageSize The page number that needs to be set.
   */
  public onPageSizeChange(pageSize: number): void {
    this.chargeBackListPresenter.onPageSizeChange(pageSize);
  }

  /**
   * This method is invoked when the user changes the page number from the pagination toolbar.
   * @param pageNumber The number to which the table should switch to
   */
  public onPageChange(pageNumber: number): void {
    this.chargeBackListPresenter.onPageChange(pageNumber);
  }

  /**
   * Compare two month in charge back start and end period
   * @param tableProperty Get the table property
   */
  private compareMonth(tableProperty: TableProperty): void {
    this.startDate = tableProperty.filter.startDate;
    this.endDate = tableProperty.filter.endDate;
    this.chargeBackListPresenter.compareMonth(tableProperty);
  }
}
