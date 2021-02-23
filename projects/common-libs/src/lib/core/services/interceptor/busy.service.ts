import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

/**
 * To keep watch over AJAX call
 * true if request sent
 * false if request completed/not sent
 */
@Injectable()
export class BusyService {

  // boolean observable
  public busy$: Observable<boolean>;
  /** boolean subject to keep trak of AJAX request sent status */
  private _busySource: BehaviorSubject<boolean>;

  constructor() {
    this._busySource = new BehaviorSubject<boolean>(null);
    this.busy$ = this._busySource.asObservable();
  }

  /**
   * set busy status
   * @param flag boolean
   */
  public changeBusy(flag: boolean): void {
    this._busySource.next(flag);
  }

}
