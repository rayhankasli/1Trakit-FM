import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class ArchiveModeService {

  /** get archive mode true/false */
  public archiveMode$: Observable<boolean>;

  /** subject to keep watch on archive mode */
  private archiveMode: BehaviorSubject<boolean>;

  constructor() {
    this.archiveMode = new BehaviorSubject(false);
    this.archiveMode$ = this.archiveMode.asObservable();
  }

  /**
   * set archive mode
   * @param flag boolean
   */
  public setArchiveMode(flag: boolean): void {
    this.archiveMode.next(flag);
  }
}
