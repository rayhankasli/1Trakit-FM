import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class SidebarService {
  /**
   * Determines whether sidebar collapsed or not.
   */
  public isCollapsed: BehaviorSubject<boolean>;

  constructor() {
    this.isCollapsed = new BehaviorSubject<boolean>(false);
  }

  /**
   * Sets dashboard collapsed
   * @param flagCollapsed 
   */
  public setDashboardCollapsed(flagCollapsed: boolean): void {
    this.isCollapsed.next(flagCollapsed);
  }
}
