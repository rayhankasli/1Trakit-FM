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
import { TotalCopyVolumeService } from '../total-copy-volume.service';
import { TotalCopyVolumeResponse } from '../total-copy-volume.model';

@Component({
  selector: 'app-total-copy-volume-container',
  templateUrl: './total-copy-volume.container.html'
})
export class TotalCopyVolumeContainerComponent {

  /** hostBinding */
  @HostBinding('class') public class: string = 'd-flex flex-grow-1 overflow-hidden';

  /** Get Total copy Volume list */
  public totalCopyVolumeList$: Observable<TotalCopyVolumeResponse>;

  /** Store client info */
  public clientMaster$: Observable<ClientMaster>;

  constructor(
    private totalCopyVolumeService: TotalCopyVolumeService,
    private coreDataService: CoreDataService
  ) {
  }

  /**
   *  Get the list of total copy Volume
   * @param clientId Get the client Id
   */
  public totalCopyCenterVolume(clientId?: number): void {
    this.totalCopyVolumeList$ = this.totalCopyVolumeService.getTotalCopyVolume(clientId);
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