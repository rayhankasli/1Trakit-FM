import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, Observable, of, Subject } from 'rxjs';
import { map, takeUntil, tap } from 'rxjs/operators';
import { downloadFile } from '../../core/utility/utility';
import { CopyItSharedConfigurationService } from '../../shared/modules/copy-it-print-details/copyit-shared-configuration.service';
import { CopyItInfo, CopyItPickAsset, FileResponse } from '../../shared/modules/copy-it-print-details/models/copyit-info';
import { CopyItAssignee } from '../../shared/modules/copyit-shared/copyit-shared.model';
import { Conversation, ConversationResponse } from '../../shared/modules/custom-chat-box/models/custom-chat-box.model';
import { Client, Status, UserDetails } from '../copyit.model';
import { CopyitService } from '../copyit.service';


@Component({
  selector: 'app-copyit-edit-container',
  templateUrl: './copyit-edit.container.html'
})
export class CopyItEditContainerComponent implements OnInit, OnDestroy {

  /** asset list observable */
  public assetList$: Observable<CopyItPickAsset[]>;
  /** copyIt detail observable */
  public copyItDetail$: Observable<CopyItInfo>;
  /** status list observable */
  public status$: Observable<Status[]>;
  /** assignTo list observable */
  public assignTo$: Observable<CopyItAssignee[]>;
  /** conversation response observable */
  public conversationResponse$: Observable<ConversationResponse>;
  /** update status callback */
  public updatedStatus$: Observable<void>;
  /** update assignTo callback */
  public updateAssignTo$: Observable<void>;
  /** update message sent callback */
  public chatMessageSend$: Observable<Conversation>;

  /** List of Client */
  public clientsList$: Observable<Client[]>;
  /** To-Do */
  public userDetails$: Observable<UserDetails>;
  /** To-Do */
  public requestorInfo$: Observable<UserDetails>;
  /** user list and configuration observable */
  public usersListAndConfiguration$: Observable<any>;
  /** active copyIt id */
  public copyItId: number;
  /** stop subscription observable */
  private destroy: Subject<boolean>;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private copyitService: CopyitService,
    private copyItConfigService: CopyItSharedConfigurationService,
    private datePipe: DatePipe
  ) {
    this.destroy = new Subject();
    this.status$ = this.copyitService.getStatusForEdit();
    // this.assignTo$ = this.copyitService.getAllAssignedTo();
    this.copyItId = Number(this.route.snapshot.params.id);
    this.copyItDetail$ = this.route.data.pipe(
      map(data => data['info']),
      tap((copyItInfo: CopyItInfo) => {
        this.onClientIdChange(copyItInfo.clientId);
        this.requestorInfo$ = this.copyitService.getUserDetails(copyItInfo.requestForId);
        // this.onUserIdChange(copyItInfo.requestForId)
      }),
    );
  }

  public ngOnInit() {
    // this.copyItDetail$ = this.copyitService.getCopyItDetail(this.copyItId).pipe(
    //   tap(copyItInfo => this.onClientIdChange(copyItInfo.clientId)),
    // );
    this.getClients();
  }

  /** get copyit detail by id */
  public getCopyItDetail(id: number = this.copyItId): void {
    this.copyItDetail$ = this.copyitService.getCopyItDetail(id);
  }

  /** This method is invoke when client get */
  public getClients(): void {
    this.clientsList$ = this.copyitService.getClients();
  }
  /** This method is invoke when client get */
  public getAssetList(clientId: number): void {
    this.assetList$ = this.copyitService.getAssetList(clientId);
  }

  /** On clientId change load userList and copyIt configuration */
  public onClientIdChange(id: number): void {
    this.getAssetList(id);
    this.assignTo$ = this.copyitService.getAssigneeListByClient(id, this.copyItId);
    this.usersListAndConfiguration$ = forkJoin([
      this.copyitService.getUsersListByClient(id, this.copyItId),
      this.copyItConfigService.getCopyItConfigurations(id, this.copyItId),
    ]).pipe(map((response: object) => {
      return {
        usersList: response[0],
        configurations: response[1],
      };
    }));
  }

  /** When presentation layer emits the save event, then this will post data on server */
  public updateCopyItDetail(copyItInfo: CopyItInfo): void {
    this.copyitService.updateCopyItRequest(this.copyItId, copyItInfo).pipe(takeUntil(this.destroy)).subscribe(
      () => {
        this.navigateToList();
      },
      // tslint:disable-next-line: no-any
      (err: any) => {
      });
  }

  /**
   * On cancel changes
   * @param flag boolean 
   */
  public cancelChanges(flag: boolean): void {
    this.navigateToList();
  }

  /** Load conversation */
  public loadConversation(flag?: boolean): void {
    this.conversationResponse$ = this.copyitService.getConversation(this.copyItId);
  }

  /** Send conversation message */
  public sendMessage(message: Conversation): void {
    this.copyitService.sendMessage(message).pipe(takeUntil(this.destroy))
      .subscribe(() => {
        this.loadConversation();
        this.chatMessageSend$ = of(message);
      });
  }
  /** Update copyIt assignee */
  public setAssignTo(id: number): void {
    this.updateAssignTo$ = this.copyitService.updateCopyItAssignTo(this.copyItId, id);
  }
  /** Update copyIt status */
  public setStatus(id: number): void {
    this.updatedStatus$ = this.copyitService.updateCopyItStatus(this.copyItId, id);
  }

  /** On userId change load user details */
  public onUserIdChange(id: number): void {
    this.userDetails$ = this.copyitService.getUserDetails(id);
  }

  /** Export and download copyIt detail as PDF */
  public exportToPDF(copyItId: number): void {
    this.copyitService.exportCopyItToPDF(copyItId).subscribe((response: Blob) => {
      downloadFile(response, `copyIt-${this.datePipe.transform(new Date(), 'MMM-d-y')}.pdf`);
    });
  }

  /** Print downloaded copyIt detail PDF */
  public printCopyItPDF(copyItId: number): void {
    this.router.navigate(['./print'], { state: { data: copyItId }, relativeTo: this.route });
  }

  /** on successful round for status changes to re-open, navigate back to list */
  public navigateBack(statusId?: number): void {
    this.navigateToList();
  }

  /** download attached file */
  public downloadAttachedFile(file: FileResponse): void {
    this.copyitService.downloadAttachedFile(file.filePath).pipe(takeUntil(this.destroy))
      .subscribe((response: Blob) => {
        downloadFile(response, file.actualFileName);
      })
  }

  public ngOnDestroy(): void {
    this.destroy.next(true);
    this.destroy.complete();
  }

  /**
   * Navigate to list screen
   */
  private navigateToList(): void {
    this.router.navigate(['../../'], { relativeTo: this.route });
  }

}