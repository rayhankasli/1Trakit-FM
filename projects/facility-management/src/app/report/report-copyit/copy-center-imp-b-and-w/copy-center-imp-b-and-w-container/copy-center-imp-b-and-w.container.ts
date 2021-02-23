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
import { CopyCenterImpBAndWService } from '../copy-center-imp-b-and-w.service';
import { CopyIMPBAndWResponse } from '../copy-center-imp-b-and-w.model';

@Component({
  selector: 'app-copy-center-imp-b-and-w-container',
  templateUrl: './copy-center-imp-b-and-w.container.html'
})
export class CopyCenterImpBAndWContainerComponent {

  /** hostBinding */
  @HostBinding('class') public class: string = 'd-flex flex-grow-1 overflow-hidden';

  /** Get Copy Center IMP Black and White list */
  public copyCenterIMPBAndWList$: Observable<CopyIMPBAndWResponse[]>;

  /** Store client info */
  public clientMaster$: Observable<ClientMaster>;

  /** Copy Center Impression Report ID */
  private reportId: number;

  constructor(
    private copyCenterImpBAndWService: CopyCenterImpBAndWService,
    private coreDataService: CoreDataService
  ) {
    this.reportId = 2;
  }

  /**
   * Copy Center IMP BAndW list
   * @param clientId Get the client Id
   */
  public copyCenterIMPBAndW(clientId?: number): void {
    this.copyCenterIMPBAndWList$ = this.copyCenterImpBAndWService.getCopyCenterIMPBlackAndWhite(this.reportId, clientId);
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