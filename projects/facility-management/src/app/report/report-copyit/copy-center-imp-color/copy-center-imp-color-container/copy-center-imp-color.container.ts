/** 
 * @author Shahbaz Shaikh.
 * @description This is a container component.
 */

import { Component, HostBinding } from '@angular/core';
import { Observable } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
// ---------------------------------------------------- //
import { CoreDataService } from '../../../../core/services/core-data.service';
import { ClientMaster } from '../../../../core/model/common.model';
import { UserInfo } from '../../../../core/model/core.model';
import { CopyCenterImpColorService } from '../copy-center-imp-color.service';
import { CopyIMPColorResponse } from '../copy-center-imp-color.model';

@Component({
  selector: 'app-copy-center-imp-color-container',
  templateUrl: './copy-center-imp-color.container.html'
})
export class CopyCenterImpColorContainerComponent {

  /** hostBinding */
  @HostBinding('class') public class: string = 'd-flex flex-grow-1 overflow-hidden';

  /** Get Copy Center IMP color list */
  public copyCenterIMPColorList$: Observable<CopyIMPColorResponse[]>;

  /** Store client info */
  public clientMaster$: Observable<ClientMaster>;

  /** Copy Center Impression Report ID */
  private reportId: number;

  constructor(
    private copyCenterImpColorService: CopyCenterImpColorService,
    private coreDataService: CoreDataService
  ) {
    this.reportId = 1;
  }

  /**
   * Copy Center IMP Color list
   * @param clientId Get the client Id
   */
  public copyCenterIMPColor(clientId?: number): void {
    this.copyCenterIMPColorList$ = this.copyCenterImpColorService.getCopyCenterIMPColor(this.reportId, clientId);
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