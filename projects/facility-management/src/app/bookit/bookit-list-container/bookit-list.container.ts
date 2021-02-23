

/**
 * @name BookItContainerComponent
 * @author Enter Your Name Here
 * @description This is a container component for BookIt. This is responsible for all data retrieving and posting to the server by http calls.
 */
import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { map, takeUntil } from 'rxjs/operators';
import { forkJoin, Subject } from 'rxjs';
//--------------------------------------------------------------------//
import { TableProperty } from 'common-libs';
//--------------------------------------------------------------------//
import { BookItService } from '../bookit.service';
import { BookIt, Users, Status, BookItListResult } from '../models/bookit.model';
import { ClientMaster, MultiSelectFilterRecord } from '../../core/model/common.model';
import { CoreDataService } from '../../core/services/core-data.service';
import { UserInfo } from '../../core/model/core.model';

/**
 * BookItListContainerComponent
 */
@Component({
  selector: 'trakit-bookit-list-container',
  templateUrl: './bookit-list.container.html'
})
export class BookItListContainerComponent implements OnInit, OnDestroy {

  @HostBinding('class') public class: string;
  /** This is a observable which passes the list of bookIt to its child component */
  public bookIts$: Observable<BookItListResult>;
  /** This is a observable which passes the client data to its child component */
  public clients$: Observable<ClientMaster[]>;
  /** Get requestors AssignedTo and Statuses based on client Id */
  public getRequestorsAssignedToStatusesBasedOnClientId$: Observable<any>;

  /** Table property for copyIt listing */
  private tableProperty: TableProperty<MultiSelectFilterRecord>;
  /** for stop subscriptions on component destroy */
  private destroy: Subject<void>;

  constructor(
    private bookItService: BookItService,
    private coreDataService: CoreDataService,
  ) {
    this.destroy = new Subject();
    this.class = 'flex-grow-1 h-100 overflow-hidden';
  }

  public ngOnInit(): void {
    this.clients$ = this.coreDataService.userInfo$.pipe(
      map((data: UserInfo) => data.clients)
    );
  }

  public ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }

  /** This Method is used to get data from server  */
  public getBookItList(tableProperty: TableProperty, forceLoadMasterData?: boolean): void {
    const clientId: number = this.tableProperty && this.tableProperty.filter && this.tableProperty.filter.clientId || 0;
    if (forceLoadMasterData || (clientId !== tableProperty.filter.clientId)) {
      this.loadMasterDataBasedOnClientId(tableProperty.filter.clientId)
    }
    this.tableProperty = { ...tableProperty, ...{ filter: tableProperty.filter } };
    this.bookIts$ = this.bookItService.getBookItList(tableProperty);
  }

  /** This Method is delete data from server  */
  public deleteBookIt(bookIt: BookIt): void {
    this.bookItService.deleteBookIt(bookIt).pipe(takeUntil(this.destroy)).subscribe(() => {
      this.getBookItList(this.tableProperty, true);
    });
  }

  /** get master details based on client filter */
  private loadMasterDataBasedOnClientId(id?: number): void {
    const requestors$: Observable<Users[]> = this.bookItService.getAllRequestedBy(id);
    const assignedTo$: Observable<Users[]> = this.bookItService.getAllAssignedTo(id);
    const statuses$: Observable<Status[]> = this.bookItService.getStatuses(id);

    this.getRequestorsAssignedToStatusesBasedOnClientId$ = forkJoin(requestors$, assignedTo$, statuses$).pipe(
      map(([requestors, assignedTo, statuses]: [Users[], Users[], Status[]]) => {
        const masterData: any = {
          requestors,
          assignedTo,
          statuses
        }
        return masterData;
      }));
  }
}
