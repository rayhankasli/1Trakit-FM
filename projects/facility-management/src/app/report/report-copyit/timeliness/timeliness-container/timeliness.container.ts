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
import { TimelinessService } from '../timeliness.service';
import { TimelinessResponse } from '../timeliness.model';

@Component({
  selector: 'app-timeliness-container',
  templateUrl: './timeliness.container.html'
})
export class TimelinessContainerComponent {

  /** hostBinding */
  @HostBinding('class') public class: string = 'd-flex flex-grow-1 overflow-hidden';

  /** Get Timeliness list */
  public timelinessList$: Observable<TimelinessResponse[]>;

  /** Store client info */
  public clientMaster$: Observable<ClientMaster>;

  constructor(
    private timelinessService: TimelinessService,
    private coreDataService: CoreDataService
  ) {
  }

  /**
   * Get the Timeliness report list
   * @param clientId Get the client Id
   */
  public timelinessList(clientId?: number): void {
    this.timelinessList$ = this.timelinessService.getTimeliness(clientId);
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