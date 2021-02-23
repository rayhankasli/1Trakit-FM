/** 
 * @author Shahbaz Shaikh.
 * @description This is a container component.
 */

import { Component, HostBinding } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { DatePipe } from '@angular/common';
//--------------------------------------------------------------------//
import { TableProperty } from 'common-libs';
//--------------------------------------------------------------------//
import { downloadFile } from '../../../../core/utility/utility';
import { ChargebackService } from '../chargeback.service';
import { ChargeBack, AccountNumber, Job, } from '../chargeback.model';

/**
 * ChargebackListContainerComponent
 */
@Component({
  selector: 'app-chargeback-list-container',
  templateUrl: './chargeback-list.container.html'
})
export class ChargebackListContainerComponent {

  /** hostBinding */
  @HostBinding('class') public class: string = 'd-flex flex-grow-1 overflow-hidden';

  /** This is a observable which passes the list of chargeBackList to its child component */
  public chargeBackLists$: Observable<ChargeBack>;

  /** This observable which passes the list of account number to its child component */
  public accountNumberList$: Observable<AccountNumber[]>;

  /** This observable which passes the list of job list to its child component */
  public jobList$: Observable<Job[]>;

  constructor(
    private chargebackService: ChargebackService,
    private datePipe: DatePipe
  ) {
  }

  /**
   * This Method is used to get the list of Account Number
   * @param clientId  Get the client Id
   */
  public getAccountNumber(clientId?: number): void {
    this.accountNumberList$ = this.chargebackService.getAccountNumber(clientId);
  }

  /**
   * This Method is used to get the list of Jobs
   * @param clientId  Get the client Id
   */
  public getJobList(clientId?: number): void {
    this.jobList$ = this.chargebackService.getJob(clientId);
  }

  /**
   * This Method is used to get the list of Charge Back
   * @param tableProperty  Get the table property
   */
  public getChargeBackLists(tableProperty: TableProperty): void {
    this.chargeBackLists$ = this.chargebackService.getChargeBackList(tableProperty);
  }

  /**
   * This Method is used to get dowanload Excel file from server
   * @param tableProperty Get the table property
   */
  public chargeBackExcel(tableProperty: TableProperty): void {
    this.chargebackService.exportAsExcel(tableProperty).subscribe((response: Blob) => {
      downloadFile(response, `report-charge-back-${this.datePipe.transform(new Date(), 'yyyy-MM-d')}.xlsx`);
    });
  }
}
