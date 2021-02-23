/**
 * @name PackagesContainerComponent
 * @author Rayhan Kasli
 * @description This is a container component for Packages. This is responsible for all data retrieving and posting to the server by http calls.
 */
import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TableProperty } from 'common-libs';
import { Subject } from 'rxjs';
import { Observable } from 'rxjs/Observable';
//--------------------------------------------------------------------//
import { ClientMaster } from '../../core/model/common.model';
import { CoreDataService } from '../../core/services/core-data.service';
import { DATE_FORMAT } from '../../core/utility/constants';
import { DeliveryService, Packages, Slot, SlotParam, UserDetails } from '../packages.model';
import { PackagesService } from '../packages.service';

/**
 * PackagesListContainerComponent
 */
@Component({
  selector: 'app-packages-list-container',
  templateUrl: './packages-list.container.html'
})
export class PackagesListContainerComponent implements OnInit {
  /** This is a observable which passes the list of packages to its child component */
  public packagess$: Observable<Packages[]>;

  /** This is a observable which passes the client data to its child component */
  public clients$: Observable<ClientMaster[]>;

  /** observable for user data */
  public users$: Observable<UserDetails[]>;

  /** observable for slot data */
  public slots$: Observable<Slot[]>;

  /** observable for user details */
  public userDetails$: Observable<UserDetails>;

  /** observable for user delivery service data */
  public deliveryServiceList$: Observable<DeliveryService[]>;

  /** observable for open new form */
  public scanNew$: Observable<number>;

  /** Determines whether  deleted */
  public tableProperty: TableProperty;

  /** observable for open new form */
  private scanNew: Subject<number>;


  constructor(
    private coreDataService: CoreDataService,
    private packagesService: PackagesService,
    private datePipe: DatePipe
  ) {
    this.scanNew = new Subject();
    this.scanNew$ = this.scanNew.asObservable();
  }

  public ngOnInit(): void {
    this.getClientList();
  }

  /** This Method is used to get data from server  */
  public getPackagess(tableProperty: TableProperty): void {
    this.tableProperty = tableProperty;
    this.packagess$ = this.packagesService.getPackagess(tableProperty);
  }

  /** When presentation layer emits the save event, then this will post data on server */
  public addPackages(packages: Packages, saveAndScanNew: boolean = false): void {
    packages.clientId = this.tableProperty.filter.clientId;
    this.packagesService.addPackages(packages).subscribe(() => {
      if (saveAndScanNew) {
        this.scanNew.next((new Date()).getMilliseconds())
      }
      this.getPackagess(this.tableProperty);
    });
  }

  /** When presentation layer emits the save event, then this will post data on server */
  public updatePackages(packages: Packages): void {
    this.packagesService.updatePackages(packages).subscribe(() => {
      this.getPackagess(this.tableProperty);
    });
  }

  /** This Method is delete data from server  */
  public deletePackages(packages: Packages): void {
    this.packagesService.deletePackages(packages).subscribe(() => {
      this.getPackagess(this.tableProperty);
    });
  }

  /** get office details by officeId */
  public getSlotsListByParams({ officeId, deliveryDate }: SlotParam): void {
    this.slots$ = this.packagesService.getSlotsByOffice(officeId,
      `${this.datePipe.transform((deliveryDate as Date), DATE_FORMAT)}`);
  }

  /** getUser based on serchTerm */
  public getUser(search: string): void {
    this.users$ = this.packagesService.getUserList(search);
  }

  /** getUserByClientId */
  public getMasterData(): void {
    this.deliveryServiceList$ = this.packagesService.getDeliveryServiceCompanyList();
  }
  /** getClientList */
  private getClientList(): void {
    this.clients$ = this.coreDataService.clients$;
  }

}
