

/**
 * @name UserContainerComponent
 * @author Nitesh Sharma
 * @description This is a container component for User. This is responsible for all data retrieving and posting to the server by http calls.
 */
import { DatePipe } from '@angular/common';
import { Component, OnInit, HostBinding } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { forkJoin, Subject } from 'rxjs';
import { Observable } from 'rxjs/Observable';
import { map, takeUntil } from 'rxjs/operators';
//--------------------------------------------------------------------//
import { TableProperty } from 'common-libs';
//--------------------------------------------------------------------//
import { ClientMaster, FloorMaster, OfficeMaster, RoleMaster, TimezoneMaster } from '../../core/model/common.model';
import { UserInfo } from '../../core/model/core.model';
import { CommonHttpService } from '../../core/services/common-http.service';
import { CoreDataService } from '../../core/services/core-data.service';
import { base64ToBlob, downloadFile } from '../../core/utility/utility';
import { BulkUploadUser, BulkUploadUserResponse, User, UserFilterRecord, UserMasterData, UserListResult } from '../user.model';
import { UserService } from '../user.service';

/**
 * UserListContainerComponent
 */
@Component({
  selector: 'app-user-list-container',
  templateUrl: './user-list.container.html'
})
export class UserListContainerComponent implements OnInit {
  /** This property is used for add class host element */
  @HostBinding('class') public class: string;
  /** This is a observable which passes the list of user to its child component */
  public users$: Observable<UserListResult>;
  /** This is a observable which passes the list of offices to its child component */
  public offices$: Observable<OfficeMaster[]>;
  /** This is a observable which passes the list of floors to its child component */
  public floors$: Observable<FloorMaster[]>;
  /** This is a observable which passes the master data to its child component */
  public userMasterData$: Observable<UserMasterData>;
  /** This is a observable which passes the client data to its child component */
  public clients$: Observable<ClientMaster[]>
  /** Determines whether  deleted */
  public isDeleted: boolean;
  /** get the client id from global service */
  public globalClientId$: Observable<number>;

  /** This is a subject which set the master data */
  private userMasterData: Subject<UserMasterData>;
  /** call this on destroy */
  private destroy: Subject<void>;
  /** it will store the table property */
  private tableProperty: TableProperty<UserFilterRecord>;

  constructor(
    private toasterService: ToastrService,
    private userService: UserService,
    private commonHttpService: CommonHttpService,
    private coreDataService: CoreDataService,
    private datePipe: DatePipe,
  ) {
    this.userMasterData = new Subject<UserMasterData>();
    this.userMasterData$ = this.userMasterData.asObservable();
    this.destroy = new Subject<void>();
    this.class = 'flex-grow-1 h-100 overflow-hidden';
  }

  /** ngOnInit */
  public ngOnInit(): void {
    this.globalClientId$ = this.coreDataService.globalClientId$;
    this.getMasterData();
  }

  /** This Method is used to get data from server  */
  public getUsers(tableProperty: TableProperty<UserFilterRecord>): void {
    this.tableProperty = tableProperty;
    this.users$ = this.userService.getUsers(tableProperty);
  }

  /** This Method is delete data from server  */
  public deleteUser(user: User): void {
    this.userService.deleteUser(user).subscribe(() => {
      this.getUsers(this.tableProperty);
    });
  }

  /** When presentation layer emits the save event, then this will post data on server */
  public addUser(user: User): void {
    this.userService.addUser(user).subscribe(
      () => {
        this.getUsers(this.tableProperty);
      });
  }

  /** When presentation layer emits the save event, then this will post data on server */
  public updateUser(user: User): void {
    this.userService.updateUser(user).subscribe(
      () => {
        this.getUsers(this.tableProperty);
      });
  }

  /** it will to change the status of user */
  public onChangeStatus(user: User): void {
    // api call here
    this.userService.toggleStatus(user).subscribe(
      () => {
        this.getUsers(this.tableProperty);
      });
  }

  /** get list of floores from server */
  public getOffices(clientId: number): void {
    this.offices$ = this.commonHttpService.getOffices(clientId);
  }

  /** get list of floores from server */
  public getFloors(officeId: number): void {
    this.floors$ = this.commonHttpService.getFloors(officeId);
  }

  /** it will download the sample excel file for bulk upload  */
  public downloadSampleFile(): void {
    this.userService.downloadSampleFile().subscribe((response: Blob) => {
      downloadFile(response, 'Sample-user-upload.xlsx');
    });
  }

  /** Bulk upload users for the selected client */
  public bulkUploadUsers(data: BulkUploadUser): void {
    this.userService.bulkUploadUsers(data).subscribe((response: BulkUploadUserResponse) => {
      if (response.file) {
        this.showBulkUploadStatus(response);
      } else {
        // Show custom toast
        this.toasterService.success(response.message);
      }
      this.getUsers(this.tableProperty);
    });
  }

  /** Allow user to download import-user status file */
  private showBulkUploadStatus(response: BulkUploadUserResponse): void {
    const file: Blob = base64ToBlob(response.file, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    // const fileUrl: SafeUrl = this.sanitizer.bypassSecurityTrustUrl(objectURLFromBlob(file));
    // Show custom toast
    this.toasterService.success(`${response.message}`, null, {
      disableTimeOut: true,
      closeButton: true,
      // @ts-ignore
      buttons: [{ id: 1, title: 'Download Error File' }]
    }).onAction.subscribe(action => {
      if (action.id === 1) {
        downloadFile(file, `import-user-status-${this.datePipe.transform(new Date(), 'MMM-d-y')}.xlsx`);
      }
    });
  }

  /** it will used to call master data api for user form */
  private getMasterData(): void {
    const roles$: Observable<RoleMaster[]> = this.commonHttpService.getRoles();
    const timezones$: Observable<TimezoneMaster[]> = this.commonHttpService.getTimezones();
    this.clients$ = this.coreDataService.userInfo$.pipe(
      map((data: UserInfo) => data.clients)
    );

    // tslint:disable-next-line: deprecation
    forkJoin(roles$, timezones$).pipe(takeUntil(this.destroy)).subscribe(
      ([roles, timezones]: [RoleMaster[], TimezoneMaster[]]) => {
        const userMasterData: UserMasterData = {
          roles,
          timezones
        };
        this.userMasterData.next(userMasterData);
      }
    )
  }
}
