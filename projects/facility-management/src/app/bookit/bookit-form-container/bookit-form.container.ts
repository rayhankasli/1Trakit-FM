

/**
 * @name BookitContainerComponent
 * @author Enter Your Name Here
 * @description This is a container component for Bookit. This is responsible for all data retrieving and posting to the server by http calls.
 */
import { Component, OnInit, HostBinding, OnDestroy } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { filter, switchMap, map, tap, takeUntil } from 'rxjs/operators';
import { forkJoin, of, Subject } from 'rxjs';
import { AuthPolicyService } from 'auth-policy';
//--------------------------------------------------------------------//
import { ClientMaster, UserWithRoleMaster, WeekDays } from '../../core/model/common.model';
import { CoreDataService } from '../../core/services/core-data.service';
import { UserInfo } from '../../core/model/core.model';
import { CommonHttpService } from '../../core/services/common-http.service';
import { PolicyRoles } from '../../core/enums/role-permissions.enum';
import { downloadFile } from '../../core/utility/utility';
import { Conversation, ConversationResponse } from '../../shared/modules/custom-chat-box/models/custom-chat-box.model';
import {
  BookIt, BookItMaster, RecurringMaster, Status, BookItFileResponse, BookItAssignee,
} from '../models/bookit.model';

import { Amenity, Facility, Catering, RoomMaster, RoomLayoutMaster, BookItRoomSearchParams } from '../models/bookIt-rooms.model';
import { BookItService } from '../bookit.service';
import { BookItPrintResolver } from '../bookit-print.resolver';
import { Navigate_Option } from '../models/bookit.enum';

/**
 * BookitFormContainerComponent
 */
@Component({
  selector: 'trakit-bookit-form-container',
  templateUrl: './bookit-form.container.html'
})
export class BookitFormContainerComponent implements OnInit, OnDestroy {
  /** hostBinding */
  @HostBinding('class') public class: string = 'd-flex flex-grow-1 px-3 pb-3 h-100 overflow-hidden';
  /** observable for client list */
  public clients$: Observable<ClientMaster[]>;
  /** observable for single client data */
  public client$: Observable<ClientMaster>;
  /** observable for user data */
  public userInfo$: Observable<UserInfo>;
  /** observable for user data */
  public users$: Observable<UserWithRoleMaster[]>;
  /** observable for bookit master data */
  public bookitMasterData$: Observable<BookItMaster>;
  /** observable for room list data */
  public rooms$: Observable<RoomMaster[]>;
  /** observable for room layout list data */
  public roomLayouts$: Observable<RoomLayoutMaster[]>;
  /** observable for account number list data */
  public accountNumbers$: Observable<any[]>;
  /** add succes input for presestation */
  public addSuccess$: Observable<number>;
  /** update succes input for presestation */
  public updateSuccess$: Observable<number>;
  /** update succes input for download file */
  public successDownloadFile$: Observable<number>;
  /** update message sent callback */
  public chatMessageSend$: Observable<Conversation>;
  /** conversation response observable */
  public conversationResponse$: Observable<ConversationResponse>;
  /** update status observable */
  public updatedStatus$: Observable<number>;
  /** week days list observable */
  public weekDays$: Observable<WeekDays[]>;
  /** update assignTo callback */
  public updateAssignTo$: Observable<void>;
  /** This is a observable which passes the Bookit object to its child component */
  public bookit$: Observable<BookIt>;
  /** success export to pdf */
  public successExportToPdf$: Observable<number>;
  public bookItId: number;
  public isSuperUser: boolean;
  public clientMaster$: Observable<ClientMaster>;

  public assignToAndStatusList$: Observable<any>;

  /** stop subscription observable */
  private destroy: Subject<boolean>;

  constructor(
    private bookitService: BookItService,
    private bookitCommonService: BookItPrintResolver,
    private route: ActivatedRoute,
    private coreDataService: CoreDataService,
    private commonService: CommonHttpService,
    private policyService: AuthPolicyService,
    private router: Router,
    private datePipe: DatePipe
  ) {
    this.destroy = new Subject();
    this.bookItId = Number(this.route.snapshot.params.id);
    this.isSuperUser = this.policyService.isInRole(PolicyRoles.superUser);
  }

  public ngOnInit(): void {
    if (!this.bookItId) {
      this.setDefaultClient();
    } else {
      // this.bookit$ = this.route.data.pipe(
      // map((data: Data) => data['info']),
      this.bookit$ = this.route.paramMap.pipe(
        filter((params: ParamMap) => params.has('id')),
        switchMap((params: ParamMap) => this.bookitService.getBookItById(+params.get('id'))),
        tap((bookIt: BookIt) => {
          this.bookItId = bookIt.bookItId;

          const assignTo$: Observable<BookItAssignee[]> = this.bookitService.getAssigneeListByClient(bookIt.clientId, bookIt.bookItId);
          const statuses$: Observable<Status[]> = this.bookitService.getStatusForEdit();

          this.assignToAndStatusList$ = forkJoin(assignTo$, statuses$).pipe(
            map(([assignTo, statuses]: [BookItAssignee[], Status[]]) => {
              const assignToAndStatuses: any = {
                assignTo,
                statuses
              }
              return assignToAndStatuses;
            }));
        }));
    }
    this.getMasterData();
    this.roleWiseChanges();
  }

  public ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }

  /** Send conversation message */
  public sendMessage(message: Conversation): void {
    this.bookitService.sendMessage(message).pipe(takeUntil(this.destroy))
      .subscribe(() => {
        this.loadConversation();
        this.chatMessageSend$ = of(message);
      });
  }

  /** Load conversation */
  public loadConversation(flag?: boolean): void {
    this.conversationResponse$ = this.bookitService.getConversation(this.bookItId);
  }

  /** When presentation layer emits the save event, then this will post data on server */
  public addBookit(bookit: BookIt): void {
    this.addSuccess$ = this.bookitService.addBookIt(bookit).pipe(
      map(() => Date.now()),
      tap(() => this.navigateToList(Navigate_Option.NAVIGATE_TO_ADD))
    );
  }

  /** When presentation layer emits the save event, then this will post data on server */
  public updateBookit(bookit: BookIt): void {
    const id: string = this.route.snapshot.params.id;
    this.updateSuccess$ = this.bookitService.updateBookIt(id, bookit).pipe(
      map(() => Date.now()),
      tap(() => this.navigateToList(Navigate_Option.NAVIGATE_TO_EDIT))
    );
  }

  /** get user list by client id */
  public getUsersByClientId(clientId: number): void {
    this.users$ = this.commonService.getUserList(clientId);
    this.weekDays$ = this.commonService.getWeekDays(clientId, true);
  }

  /** it will get the list of rooms as per user selection */
  public getRooms(searchProps: BookItRoomSearchParams): void {
    this.rooms$ = this.bookitService.getRooms(searchProps, this.bookItId).pipe(
    );
  }

  /** it will get the list of rooms as per user selection */
  public getRoomLayouts(searchParams: any): void {
    this.roomLayouts$ = this.bookitService.getRoomLayouts(searchParams);
  }

  /** get account numbers by client id */
  public getAccountNumbers(clientId: number): void {
    this.accountNumbers$ = this.bookitService.getAccountNumber(clientId);
  }

  /** download attached file */
  public downloadAttachedFile(file: BookItFileResponse): void {
    this.successDownloadFile$ = this.bookitService.downloadAttachedFile(file.filePath).pipe(
      tap((response: Blob) => downloadFile(response, file.actualFileName)),
      map(() => Date.now()));
  }

  /** Export and download bookIt detail as PDF */
  public exportToPDF(): void {
    this.successExportToPdf$ = this.bookitService.exportBookItToPDF(this.bookItId).pipe(
      tap((response: Blob) => downloadFile(response, `bookIt-${this.datePipe.transform(new Date(), 'MMM-d-y')}.pdf`)),
      map(() => Date.now())
    )
  }

  /** Update bookIt status */
  public setStatus(id: number): void {
    this.updatedStatus$ = this.bookitService.updateBookItStatus(this.bookItId, id).pipe(
      map(() => Date.now())
    );
  }
  /** Print downloaded bookIt detail PDF */
  public printBookItPDF(bookItId: number): void {
    this.router.navigate(['./print'], { relativeTo: this.route });
  }

  /** Update bookIt assignee */
  public setAssignTo(id: number): void {
    this.updateAssignTo$ = this.bookitService.updateBookItAssignTo(this.bookItId, id);
  }

  /** on successful round for status changes to re-open, navigate back to list */
  public navigateBack(statusId?: number): void {
    this.navigateToList(Navigate_Option.NAVIGATE_TO_ADD);
  }

  /** get master data */
  private getMasterData(): void {
    const facilities$: Observable<Facility[]> = this.bookitService.getFacilities();
    const amenities$: Observable<Amenity[]> = this.bookitService.getAmenities();
    const caterings$: Observable<Catering[]> = this.bookitService.getCaterings();
    const recurrings$: Observable<RecurringMaster[]> = this.bookitService.getRecurring();
    // const weekDays$: Observable<WeekDays[]> = this.commonService.getWeekDays();

    // tslint:disable-next-line: deprecation
    this.bookitMasterData$ = forkJoin(facilities$, amenities$, caterings$, recurrings$).pipe(
      map(([facilities, amenities, caterings, recurrings]: [Facility[], Amenity[], Catering[], RecurringMaster[]]) => {
        const bookItMasterData: BookItMaster = {
          facilities,
          amenities,
          caterings,
          recurrings
        };
        return bookItMasterData;
      }));
    this.bookitCommonService.bookitMasterData$ = this.bookitMasterData$;
  }

  /** check if user is not super user */
  private roleWiseChanges(): void {
    this.clients$ = this.coreDataService.userInfo$.pipe(map((item: UserInfo) => item.clients));
    this.userInfo$ = this.coreDataService.userInfo$;
  }

  /**
   * Navigate to list screen after add or edit
   */
  private navigateToList(url: string): void {
    this.router.navigate([url], { relativeTo: this.route });
  }

  /** select default client from core data */
  private setDefaultClient(): void {
    if (this.isSuperUser) {
      this.clientMaster$ = this.coreDataService.globalClientId$.pipe(
        switchMap((clientId: number) => {
          return this.coreDataService.userInfo$.pipe(
            map((data: UserInfo) => data.clients && data.clients.find(c => c.clientId === clientId)),
            tap((item: ClientMaster) => item && this.getUsersByClientId(item.clientId)))
        }));
    }
  }
}
