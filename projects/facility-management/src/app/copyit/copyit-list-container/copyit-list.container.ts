/**
 * @name CopyItContainerComponent
 * @author Enter Your Name Here
 * @description This is a container component for CopyIt. This is responsible for all data retrieving and posting to the server by http calls.
 */
import { Component, HostBinding, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
//--------------------------------------------------------------------//
import { TableProperty } from 'common-libs';
// ------------------------------------------------------------------- //
import { ClientMaster, MultiSelectFilterRecord, StatusMaster, UsersMaster } from '../../core/model/common.model';
import { UserInfo } from '../../core/model/core.model';
import { CoreDataService } from '../../core/services/core-data.service';
import { CopyitService } from '../copyit.service';
import { CopyItListResult } from '../models/copyit-list.model';
import { forkJoin } from 'rxjs';

/**
 * CopyItListContainerComponent
 */
@Component({
  selector: 'app-copyit-list-container',
  templateUrl: './copyit-list.container.html'
})
export class CopyItListContainerComponent implements OnInit {

  @HostBinding('class') public class: string;

  /** This is a observable which passes the list of copyItList to its child component */
  public copyItLists$: Observable<CopyItListResult>;
  /** List of clients to filter */
  public clientList$: Observable<ClientMaster[]>
  /** Get requestors AssignedTo and Statuses based on client Id */
  public getRequestorsAssignedToStatusesBasedOnClientId$: Observable<any>;

  /** Table property for copyIt listing */
  private tableProperty: TableProperty<MultiSelectFilterRecord>;


  constructor(
    private copyitService: CopyitService,
    private coreDataService: CoreDataService
  ) {
    this.tableProperty = new TableProperty<MultiSelectFilterRecord>();
    this.class = 'flex-grow-1 h-100 overflow-hidden';
  }

  public ngOnInit(): void {
    this.clientList$ = this.coreDataService.userInfo$.pipe(
      map((data: UserInfo) => data.clients)
    );
    // this.loadMasterDataBasedOnClientId();
  }

  /** This Method is used to get data from server  */
  public getCopyItLists(tableProperty: TableProperty<MultiSelectFilterRecord>, forceLoadMasterData?: boolean): void {
    const clientId: number = this.tableProperty && this.tableProperty.filter && this.tableProperty.filter.clientId || 0;
    if (forceLoadMasterData || (clientId !== tableProperty.filter.clientId)) {
      this.loadMasterDataBasedOnClientId(tableProperty.filter.clientId)
    }
    this.tableProperty = { ...tableProperty, ...{ filter: tableProperty.filter } };
    this.copyItLists$ = this.copyitService.getCopyItList(tableProperty);
  }

  /** This Method is delete data from server  */
  public deleteCopyItList(copyItList: number): void {
    this.copyitService.deleteCopyIt(copyItList).subscribe(() => {
      this.getCopyItLists(this.tableProperty, true);
    });
  }

  /** get master details based on client filter */
  private loadMasterDataBasedOnClientId(id?: number): void {
    const requestors$: Observable<UsersMaster[]> = this.copyitService.getAllRequestedBy(id);
    const assignedTo$: Observable<UsersMaster[]> = this.copyitService.getAllAssignedTo(id);
    const statuses$: Observable<StatusMaster[]> = this.copyitService.getStatusForList(id);

    this.getRequestorsAssignedToStatusesBasedOnClientId$ = forkJoin(requestors$, assignedTo$, statuses$).pipe(
      map(([requestors, assignedTo, statuses]: [UsersMaster[], UsersMaster[], StatusMaster[]]) => {
        const masterData: any = {
          requestors,
          assignedTo,
          statuses
        }
        return masterData;
      }));


  }

}
