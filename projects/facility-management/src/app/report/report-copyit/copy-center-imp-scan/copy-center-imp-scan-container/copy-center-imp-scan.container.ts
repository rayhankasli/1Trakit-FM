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
import { CopyCenterImpScanService } from '../copy-center-imp-scan.service';
import { CopyIMPScanResponse } from '../copy-center-imp-scan.model';

@Component({
  selector: 'app-copy-center-imp-scan-container',
  templateUrl: './copy-center-imp-scan.container.html'
})
export class CopyCenterImpScanContainerComponent {

  /** hostBinding */
  @HostBinding('class') public class: string = 'd-flex flex-grow-1 overflow-hidden';

  /** Get Copy Center IMP scan list */
  public copyCenterIMPScanList$: Observable<CopyIMPScanResponse[]>;

  /** Store client info */
  public clientMaster$: Observable<ClientMaster>;

  /** Copy Center Impression Report ID */
  private reportId: number;

  constructor(
    private copyCenterImpScanService: CopyCenterImpScanService,
    private coreDataService: CoreDataService
  ) {
    this.reportId = 3;
  }

  /**
   * Copy Center IMP Scan list
   * @param clientId Get the client Id
   */
  public copyCenterIMPScan(clientId?: number): void {
    this.copyCenterIMPScanList$ = this.copyCenterImpScanService.getCopyCenterIMPScan(this.reportId, clientId);
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