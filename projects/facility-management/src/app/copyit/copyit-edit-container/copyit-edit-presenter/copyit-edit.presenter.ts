import { ChangeDetectorRef, Injectable, NgZone, OnDestroy } from '@angular/core';
import { Overlay,  OverlayRef } from '@angular/cdk/overlay';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthPolicyService } from 'auth-policy';
// ------------------------------------------------------------ //
import { ToastrServiceProvider } from 'common-libs';
// ------------------------------------------------------------ //
import { PolicyRoles, Permission } from '../../../core/enums/role-permissions.enum';
import { StatusEnum } from '../../../core/enums/status.enum';
import { ArchiveModeService } from '../../../core/services/archive-mode/archive-mode.service';
import { CoreDataService } from '../../../core/services/core-data.service';
import { CopyItPickAsset } from '../../../shared/modules/copy-it-print-details/models/copyit-info/copyit-asset';
import { CopyItInfo } from '../../../shared/modules/copy-it-print-details/models/copyit-info/copyit-info';
import { CopyItAssignee } from '../../../shared/modules/copyit-shared/copyit-shared.model';
import { CustomChatBoxService } from '../../../shared/modules/custom-chat-box/custom-chat-box.service';
import { Conversation, ConversationResponse } from '../../../shared/modules/custom-chat-box/models/custom-chat-box.model';
import { Status } from '../../copyit.model';
import { CopyItEditViewPresenter } from './copyit-edit.view.presenter';


@Injectable()
export class CopyItEditPresenter extends CopyItEditViewPresenter implements OnDestroy {

    /** flag for checking archived view enabled */
    public isArchived: boolean;
    /** flag for role type super-user */
    public isSuperUser: boolean;
    /** enable assignTo based on status */
    public disableAssignTo: boolean;
    /** enable status based on status for requestor; rest will have default configuration */
    public disableStatusForRequestor: boolean;
    /** disable chat-box based on status & assignTo === requestFor */
    public disableChatBox: boolean;
    /** load conversation observable */
    public loadConversation$: Observable<boolean>;
    /** load send message observable */
    public sendMessage$: Observable<Conversation>;
    /** set copyIt status observable */
    public setStatus$: Observable<number>;
    /** set copyIt status list observable */
    public statusList$: Observable<Status[]>;
    /** set copyIt assignee observable */
    public setAssignTo$: Observable<number>;
    /** copyItId for the co */
    public copyItId: number;
    /** flag for chat box open state */
    public isChatBoxOpen: boolean;
    public get copyItPermissions(): typeof Permission.CopyIt {
        return Permission.CopyIt;
    }
    /** userId of loggedIn user */
    private userId: number;
    /** conversation response observable */
    private conversationResponse$: Observable<ConversationResponse>;
    /** load conversation subject */
    private loadConversation: Subject<boolean>;
    /** conversation response subject */
    private conversationResponse: Subject<ConversationResponse>;
    /** send message subject */
    private sendMessage: Subject<Conversation>;
    /** set copyIt status subject */
    private setStatus: Subject<number>;
    /** set copyIt status list subject */
    private statusList: Subject<Status[]>;
    /** set copyIt assignee subject */
    private setAssignTo: Subject<number>;
    /** This property is used to store overlayRef. */
    private overlayRef: OverlayRef;
    /** conversation response */
    private conversationRes: ConversationResponse;
    /** enable/disable message box based on status */
    private enableMessageBox: BehaviorSubject<boolean>;
    /** observable unsubscribe subject */
    private destroy: Subject<boolean>;
    /** observable unsubscribe for chat subject */
    private destroyChat: Subject<boolean>;

    constructor(
        private overlay: Overlay,
        private coreService: CoreDataService,
        private cdr: ChangeDetectorRef,
        private ngZone: NgZone,
        private toast: ToastrServiceProvider,
        private archiveModeService: ArchiveModeService,
        private authPolicyService: AuthPolicyService,
        private chatBoxService: CustomChatBoxService
    ) {
        super();
        this.initProp();
    }

    /** to open the chat box and load messages */
    public openChatBox(): void {
        this.isChatBoxOpen = true;
        const { componentRef, overlayRef }: any = this.chatBoxService.getComponent();
        this.overlayRef = overlayRef;
        this.overlayRef.backdropClick().pipe(takeUntil(this.destroyChat), takeUntil(this.destroy))
            .subscribe(() => {
                this.overlayRef.detach();
                this.destroyChat.next(true);
                this.isChatBoxOpen = false;
                this.cdr.detectChanges();
            });

        componentRef.instance.conversation = this.conversationRes.conversations;
        componentRef.instance.isEnable = this.conversationRes.isEnabled;
        componentRef.instance.userId = this.userId;
        componentRef.instance.moduleId = this.copyItId;

        // Subscribe to get-conversation
        this.conversationResponse$.pipe(takeUntil(this.destroyChat), takeUntil(this.destroy))
            .subscribe((res: ConversationResponse) => {
                if (res) {
                    this.ngZone.run(() => {
                        this.conversationRes = res;
                        componentRef.instance.conversation = res.conversations;
                        componentRef.instance.isEnable = res.isEnabled;
                        componentRef.instance.userId = this.userId;
                        componentRef.instance.moduleId = this.copyItId;
                    });
                }
                // Subscribe to enable/disable message box
                this.enableMessageBox.pipe(takeUntil(this.destroyChat), takeUntil(this.destroy)).subscribe((isEnableFlag: boolean) => {
                    componentRef.instance.isEnable = res.isEnabled && isEnableFlag;
                });
            });
        // Subscribe to listen refresh event
        componentRef.instance.refreshE.pipe(takeUntil(this.destroyChat), takeUntil(this.destroy))
            .subscribe(() => this.loadConversationDetail());
        // Subscribe to listen send event
        componentRef.instance.sendE.pipe(takeUntil(this.destroyChat), takeUntil(this.destroy))
            .subscribe((message: Conversation) => this.sendMessage.next(message));

    }

    /** Load conversation detail */
    public loadConversationDetail(): void {
        this.loadConversation.next(true);
    }
    /** Set conversation */
    public setConversationResponse(response: ConversationResponse): void {
        this.conversationResponse.next(response);
    }
    /** On copyIt status change */
    public onStatusChange(statusId: number): void {
        // this.onStatusAllowedAction(statusId)
        this.setStatus.next(statusId);
    }
    /** validate copyit status before get changed */
    public validateStatus(statusId: number, copyItInfo: CopyItInfo): boolean {
        if (!statusId) { return }
        let flag = false;
        if (statusId !== StatusEnum.completed || (statusId === StatusEnum.completed && copyItInfo.assets.length > 0)) {
            flag = true;
        } else {
            this.toast.error('Please submit at least one asset to complete.')
        }
        return flag;
    }
    /** On copyIt assignee change */
    public onAssignToChange(assignToId: number): void {
        this.setAssignTo.next(assignToId);
    }

    /** On asset change */
    public saveAssets(copyItDetail: CopyItInfo, copyItAssets: CopyItPickAsset[]): CopyItInfo {
        return { ...copyItDetail, ...{ assets: copyItAssets } }
    }

    /** Set copyit status list */
    public setStatusList(list: Status[], currentStatusId: number): void {
        let allowedStatus: number[] = list.map((status: Status) => status.copyItStatusId);
        switch (currentStatusId) {
            case 2:
            case 3:
            case 6:
                allowedStatus = [3, 4, 6];
                break;
            case 4:
                allowedStatus = [4, 5, 9];
                break;
            case 1:
            case 5:
            case 7:
            case 9:
                allowedStatus = [];
                break;
        }
        list = list.filter((status: Status) => allowedStatus.includes(status.copyItStatusId));
        this.statusList.next(list);
    }

    /** enable/disable based on status */
    public onStatusAllowedAction(statusId: Status['copyItStatusId'], isRequestor: boolean = false): void {
        this.disableAssignToStatus();
        this.disableRequestorForStatus();
        switch (statusId) {
            case 1:
            case 2:
                this.disableChatBoxStatus();
                !this.isArchived && !isRequestor && this.disableAssignToStatus(false);
                break
            case 3:
                // on in-progress hide chat box 
                if (isRequestor) { this.disableFormStatus(); }
                if (this.overlayRef) {
                    this.overlayRef.detach();
                    this.destroyChat.next(true);
                    this.isChatBoxOpen = false;
                    this.cdr.detectChanges();
                }
                this.disableChatBoxStatus(false);
                !this.isArchived && !isRequestor && this.enableMessageBoxBasedOnStatus();
                break;
            case 4:
                this.disableRequestorForStatus(false);
                this.disableChatBoxStatus(false);
                this.enableMessageBoxBasedOnStatus(false);
                break;
            case 5:
                this.disableChatBoxStatus(false);
                !this.isArchived && !isRequestor && this.disableAssignToStatus(false);
                this.enableMessageBoxBasedOnStatus(false);
                break
            case 6:
                this.disableChatBoxStatus(false);
                this.enableMessageBoxBasedOnStatus(false);
                break;
            case 7:
                this.disableChatBoxStatus(false);
                !this.isArchived && this.disableFormStatus(false);
                !this.isArchived && this.enableMessageBoxBasedOnStatus();
                break;
            case 9:
                this.disableChatBoxStatus(false);
                this.disableFormStatus();
                this.enableMessageBoxBasedOnStatus(false);
                break;

            default:
                break;
        }
    }
    /** enable/disable based on assignee and requestor */
    public onAssigneeAllowedActions({ requestForId, associateId }: CopyItInfo): void {
        if (requestForId === associateId) {
            this.disableChatBoxStatus();
        }
    }

    /** set enable/disable flag for Form */
    public disableFormStatus(flag: boolean = true): void {
        this.disableForm = flag;
    }
    /** set enable/disable flag for AssignTo */
    public disableAssignToStatus(flag: boolean = true): void {
        this.disableAssignTo = flag;
    }
    /** set enable/disable flag for AssignTo */
    public disableRequestorForStatus(flag: boolean = true): void {
        this.disableStatusForRequestor = flag;
    }
    /** set enable/disable flag for chat-box */
    public disableChatBoxStatus(flag: boolean = true): void {
        this.disableChatBox = flag;
    }

    /** set readonly mode is archived view is enabled */
    public setArchivedView(): void {
        this.archiveModeService.archiveMode$.pipe(takeUntil(this.destroy)).subscribe(flag => {
            this.isArchived = !this.isSuperUser ? flag : false;
            if (flag) {
                this.disableFormStatus();
                this.disableAssignToStatus();
                this.disableRequestorForStatus();
                this.enableMessageBoxBasedOnStatus(false);
            }
        })
    }

    /** enable/disable form based on role and status */
    public checkFormAccess(copyItDetail: CopyItInfo, isRequestor: boolean): void {
        /** 
         * enable for all roles except requester
         * enable form only if role is requestor & status is requester for info.(7)
         * disable for rest of the case
         */
        const formStatus: number = copyItDetail.copyItStatusId;
        let allowEdit: boolean;
        allowEdit = this.authPolicyService.hasPermission(this.copyItPermissions.update);
        if (!allowEdit) { allowEdit = (isRequestor && formStatus === StatusEnum.requestForInformation); }
        if (!allowEdit) {
            this.disableFormStatus();
        }
    }
    public ngOnDestroy(): void {
        this.destroy.next(true);
        this.destroy.complete();
        this.destroyChat.next(true);
        this.destroyChat.complete();
    }

    /** set 'My self for active user in assignee list */
    public setAssignToList(assignTo: CopyItAssignee[]): CopyItAssignee[] {
        return [...assignTo].map(assignee => {
            assignee.fullName = (assignee.userId === this.coreService.userInfo.userId) ? 'My self' : assignee.fullName;
            return assignee;
        });
    }

    /** enable/disable message box based on status changes */
    private enableMessageBoxBasedOnStatus(flag: boolean = true): void {
        this.enableMessageBox.next(flag);
    }

    /** Init Prop */
    private initProp(): void {
        this.isSuperUser = this.authPolicyService.isInRole(PolicyRoles.superUser);
        this.destroy = new Subject();
        this.destroyChat = new Subject();
        this.loadConversation = new Subject();
        this.loadConversation$ = this.loadConversation.asObservable();
        this.conversationResponse = new Subject();
        this.conversationResponse$ = this.conversationResponse.asObservable();
        this.sendMessage = new Subject();
        this.sendMessage$ = this.sendMessage.asObservable();
        this.setStatus = new Subject();
        this.setStatus$ = this.setStatus.asObservable();
        this.setAssignTo = new Subject();
        this.setAssignTo$ = this.setAssignTo.asObservable();
        this.conversationRes = new ConversationResponse();
        this.userId = this.coreService.userInfo.userId;
        this.statusList = new Subject();
        this.statusList$ = this.statusList.asObservable();
        this.enableMessageBox = new BehaviorSubject(false);
        this.disableAssignToStatus();
        this.disableChatBoxStatus();
        this.isChatBoxOpen = false;
        this.setArchivedView();
    }
}