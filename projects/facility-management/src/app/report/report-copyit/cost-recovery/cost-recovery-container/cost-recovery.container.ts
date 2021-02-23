/** 
 * @author Shahbaz Shaikh.
 * @description This is a container component.
 */

import { Component, HostBinding } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { DatePipe } from '@angular/common';
// ----------------------------------------------------- //
import { TableProperty } from 'common-libs';
// ------------------------------------------------------- //
import { downloadFile } from '../../../../core/utility/utility';
import { CostRecoveryService } from '../cost-recovery.service';
import { CostRecovery } from '../cost-recovery.model';

/** CostRecoveryContainerComponent */
@Component({
  selector: 'app-cost-recovery-container',
  templateUrl: './cost-recovery.container.html'
})
export class CostRecoveryContainerComponent {

  /** hostBinding */
  @HostBinding('class') public class: string = 'd-flex flex-grow-1 overflow-hidden';

  /** Store Cost Recovery */
  public costRecoverys$: Observable<CostRecovery>;

  constructor(
    private costRecoveryService: CostRecoveryService,
    private datePipe: DatePipe
  ) {
  }

  /**
   * This Method is used to get data cost-recovery list from server
   * @param tableProperty Get the table property
   */
  public costRecoverys(tableProperty: TableProperty): void {
    this.costRecoverys$ = this.costRecoveryService.getCostRecovery(tableProperty);
  }

  /**
   * This Method is used to get download cost-recovery Excel file from server
   * @param tableProperty Get the table property
   */
  public onExportAsExcel(tableProperty: TableProperty): void {
    this.costRecoveryService.exportAsExcel(tableProperty).subscribe((response: Blob) => {
      downloadFile(response, `report-cost-recovery-${this.datePipe.transform(new Date(), 'yyyy-MM-d')}.xlsx`);
    });
  }
}