/**
 * @author Hem Chudgar
 */

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

/**
 * LoaderService
 */
@Injectable()
export class LoaderService {
  /** status  */
  public status: BehaviorSubject<boolean>;

  constructor() {
    this.status = new BehaviorSubject<boolean>(false);
  }

  /** showLoader */
  public showLoader(value: boolean): void {
    this.status.next(value);
  }
}
