/**
 * /**
 * @author: Bikash Das
 * @description : This is a presenter class for Notificstion which is responsible to do
 *                business logic for notifiaction data. 
 */

import { Injectable } from '@angular/core';
import { TableProperty } from 'common-libs';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class NotificationPresenter {
  
  public isLastRecord: boolean;
  public tableProperty: TableProperty;
  /** This property is used for subscribing the value of subject setTableProp */
  public setTableProp$: Observable<TableProperty>;
  /** This is used for user info object */
  private setTableProp: BehaviorSubject<TableProperty>;

  constructor() {
    this.initProperty();
  }

  /** Get lazy loaded data on scroll */
  public onScroll(): void {
    this.tableProperty.pageNumber = this.tableProperty.pageNumber + 1;
    this.setTableProperty(this.tableProperty);
  }

  /** This method is invoke when table property change. */
  public setTableProperty(tableProperty: TableProperty): void {
    this.tableProperty = tableProperty;
    this.setTableProp.next(this.tableProperty);
  }

  /** initProperty */
  private initProperty(): void {
    this.tableProperty = new TableProperty();
    this.setTableProp = new BehaviorSubject(this.tableProperty);
    this.setTableProp$ = this.setTableProp.asObservable();
  }
}
