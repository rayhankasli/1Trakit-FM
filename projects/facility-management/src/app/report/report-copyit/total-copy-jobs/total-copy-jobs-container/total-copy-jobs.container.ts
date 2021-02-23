/** 
 * @author Shahbaz Shaikh.
 * @description This is a container component.
 */

import { Component, HostBinding } from '@angular/core';
import { Observable } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
// ------------------------------------------ //
import { CoreDataService } from '../../../../core/services/core-data.service';
import { ClientMaster } from '../../../../core/model/common.model';
import { UserInfo } from '../../../../core/model/core.model';
import { TotalCopyJobsService } from '../total-copy-jobs.service';
import { TotalCopyJobsResponse } from '../total-copy-jobs.model';

@Component({
  selector: 'app-total-copy-jobs-container',
  templateUrl: './total-copy-jobs.container.html'
})
export class TotalCopyJobsContainerComponent {

  /** hostBinding */
  @HostBinding('class') public class: string = 'd-flex flex-grow-1 overflow-hidden';

  /** Get Total copy jobs list */
  public totalCopyJobsList$: Observable<TotalCopyJobsResponse[]>;

  /** Store client info */
  public clientMaster$: Observable<ClientMaster>;

  constructor(
    private totalCopyJobsService: TotalCopyJobsService,
    private coreDataService: CoreDataService
  ) {
  }

  /**
   *  Get the list of total copy Jobs
   * @param clientId Get the client Id
   */
  public totalCopyJob(clientId?: number): void {
    this.totalCopyJobsList$ = this.totalCopyJobsService.getTotalCopyJobs(clientId);
    this.setDefaultClient();
  }

  /** Get Client info from core data */
  private setDefaultClient(): void {
    this.clientMaster$ = this.coreDataService.globalClientId$.pipe(
      switchMap((clientId: number) => {
        return this.coreDataService.userInfo$.pipe(
          map((data: UserInfo) => data.clients && data.clients.find((client: ClientMaster) => client.clientId === clientId)))
      }));
  }
}