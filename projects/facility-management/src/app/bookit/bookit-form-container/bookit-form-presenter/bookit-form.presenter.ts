
/**
 * @name BookitPresenter
 * @author Nitesh Sharma
 * @description This is a presenter service for bookitwhich contains all logic for presentation component
 */

import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ChangeDetectorRef, Injectable, NgZone, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthPolicyService } from 'auth-policy';
import { BehaviorSubject } from 'rxjs';
import { Observable } from 'rxjs/Observable';
import { take, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';
//---------------------------------------------------------------------//
import { PolicyRoles } from '../../../core/enums/role-permissions.enum';
import { StatusEnum } from '../../../core/enums/status.enum';
import { ClientMaster, WeekDays } from '../../../core/model/common.model';
import { ArchiveModeService } from '../../../core/services/archive-mode/archive-mode.service';
import { CoreDataService } from '../../../core/services/core-data.service';
import { PHONE_PATTERN } from '../../../core/utility/constants';
import { FileOptions } from '../../../core/utility/enums';
import { compareDates, compareTimes, validateFileSize } from '../../../core/utility/validations';
import { CustomChatBoxService } from '../../../shared/modules/custom-chat-box/custom-chat-box.service';
import { Conversation, ConversationResponse } from '../../../shared/modules/custom-chat-box/models/custom-chat-box.model';
import { BookIt, Status } from '../../models/bookit.model';
import { RoomFormPresenter } from './room-from.presenter';

/** 
 * BookitFormPresenter 
 */
@Injectable()
export class BookitFormPresenter extends RoomFormPresenter implements OnDestroy {

    /** enable copyit form based on status */
    public disableForm: boolean;
    /** enable assignTo based on status */
    public disableAssignTo: boolean;
    /** enable status based on status for requestor; rest will have default configuration */
    public disableStatusForRequestor: boolean;
    /** disable chat-box based on status & assignTo === requestFor */
    public disableChatBox: boolean;
    /** This is used for subscribing the value of subject add */
    public add$: Observable<BookIt>;
    /** This is used to take action on get user based on clientId */
    public getUsersByClientId$: Observable<number>;
    /** This is used to take action on get account number */
    public getAccountNumber$: Observable<number>;
    /** This is used to take action on clear account number */
    public clearAccountNumbers$: Observable<void>;


    /** copyItId for the co */
    public bookItId: number;
    /** flag for chat box open state */
    public isChatBoxOpen: boolean;
    /** load conversation observable */
    public loadConversation$: Observable<boolean>;
    /** load send message observable */
    public sendMessage$: Observable<Conversation>;
    /** set copyIt status observable */
    public setStatus$: Observable<number>;
    /** set copyIt assignee observable */
    public setAssignTo$: Observable<number>;
    /** set copyIt status list observable */
    public statusList$: Observable<Status[]>;
    /** flag for role super user */
    public isSuperUser: boolean;
    /** flag for role manager */
    public isManager: boolean;
    /** flag for role requestor */
    public isRequestor: boolean;
    /** flag for role associate */
    public isAssociate: boolean;

    /** flag for checking archive mode */
    public isArchived: boolean;

    /** This is used for add object */
    private add: Subject<BookIt>;
    /** used to raise get user by client id */
    private getUsersByClientId: BehaviorSubject<number>;
    private getAccountNumber: BehaviorSubject<number>;
    private clearAccountNumbers: Subject<void>;

    /** observable unsubscribe for chat subject */
    private destroyChat: Subject<boolean>;
    /** observable unsubscribe subject */
    private destroy: Subject<boolean>;
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
    /** set copyIt assignee subject */
    private setAssignTo: Subject<number>;
    /** enable/disable message box based on status */
    private enableMessageBox: BehaviorSubject<boolean>;
    /** conversation response */
    private conversationRes: ConversationResponse;
    /** set copyIt status list subject */
    private statusList: Subject<Status[]>;
    /** This property is used to store overlayRef. */
    private overlayRef: OverlayRef;

    constructor(
        private chatBoxService: CustomChatBoxService,
        public fb?: FormBuilder,
        public overlay?: Overlay,
        public cdr?: ChangeDetectorRef,
        public ngZone?: NgZone,
        public coreService?: CoreDataService,
        public archiveModeService?: ArchiveModeService,
    ) {
        super();
        this.destroyChat = new Subject();
        this.destroy = new Subject();
        this.statusList = new Subject();
        this.statusList$ = this.statusList.asObservable();
        this.loadConversation = new Subject();
        this.loadConversation$ = this.loadConversation.asObservable();
        this.sendMessage = new Subject();
        this.sendMessage$ = this.sendMessage.asObservable();
        this.setAssignTo = new Subject();
        this.setAssignTo$ = this.setAssignTo.asObservable();
        this.setStatus = new Subject();
        this.setStatus$ = this.setStatus.asObservable();
        this.conversationRes = new ConversationResponse();
        this.conversationResponse = new Subject();
        this.conversationResponse$ = this.conversationResponse.asObservable();
        this.add = new Subject<BookIt>();
        this.add$ = this.add.asObservable();
        this.getUsersByClientId = new BehaviorSubject<number>(null);
        this.getUsersByClientId$ = this.getUsersByClientId.asObservable();
        this.getAccountNumber = new BehaviorSubject<number>(null);
        this.getAccountNumber$ = this.getAccountNumber.asObservable();
        this.clearAccountNumbers = new Subject<void>();
        this.clearAccountNumbers$ = this.clearAccountNumbers.asObservable();
        this.enableMessageBox = new BehaviorSubject(false);

        this.userId = this.coreService.userInfo.userId;
        this.disableAssignToStatus();
        this.disableChatBoxStatus();
        this.isChatBoxOpen = false;
        this.setArchivedView();
    }

    /**
     * This will create all the controls for the form group
     * @param bookitFormGroup is the form group
     * @param fb is the form builder which will create the controls
     * @returns It will return the bookitFromGroup with all the controls
     */
    public buildForm(): FormGroup {
        return this.fb.group(
            {
                eventName: ['', [Validators.required, Validators.maxLength(50)]],
                name: ['', [Validators.required, Validators.maxLength(30)]],
                date: ['', [Validators.required]],
                startTime: ['', [Validators.required]],
                endTime: ['', [Validators.required]],
                isRecurring: [{ value: null, disabled: true }],
                repeatsOn: this.fb.group(
                    {
                        recurringId: [''],
                        endDate: [''],
                        repeatBy: [],
                        repeatsOnDay: this.fb.array([])
                    },
                    {
                        validator: [compareDates('date', 'endDate')]
                    }
                ),
                setupBuffer: [''],
                cleanupBuffer: [''],
                noOfPeople: ['', [Validators.required, Validators.min(1), Validators.maxLength(10)]],
                clientAccountId: [''],
                clientAccount: ['', [Validators.required, Validators.maxLength(30)]],
                description: [''],
                clientId: [null, [Validators.required]],
                userId: [null, [Validators.required]],
                roomId: [null, [Validators.required]],
                roomLayoutId: [null, [Validators.required]],
                facility: [null, [Validators.required]],
                amenities: [null],
                catering: [null, [Validators.required]],
                cateringCompanyInformation: this.fb.group({
                    companyName: ['', Validators.maxLength(30)],
                    contactPersonName: ['', Validators.maxLength(30)],
                    phoneNumber: ['', [Validators.pattern(PHONE_PATTERN)]],
                    arrivalTime: [''],
                }),
                fileOptionId: [FileOptions.UPLOAD_FILE],
                filePath: [''],
                files: ['',[validateFileSize(51200)]],
                fileName: []
            },
            {
                validator: [compareTimes('startTime', 'endTime')]
            }
        );
    };

    /**
     * This method will validate the form
     * If form is valid then it will 
     * @param bookitFormGroup 
     */
    public saveBookit(bookitFormGroup: FormGroup, bookit: BookIt, weekDays: WeekDays[]): void {
        if (bookitFormGroup.valid) {
            let bookitObj: BookIt;
            const formValue: any = bookitFormGroup.getRawValue();
            if (bookit) {
                bookitObj = { ...bookit, ...formValue };
            } else {
                bookitObj = formValue;
            }

            const selectedWeekDay: number[] = formValue.repeatsOn && formValue.repeatsOn.repeatsOnDay.map((value: boolean, index: number) =>
                value ? weekDays[index].weekDayId : null).filter((value: number) => value !== null);
            bookitObj.repeatsOn.repeatsOnDay = selectedWeekDay;
            this.add.next(bookitObj);
        }
        else {
            // show any custom validation here 
            bookitFormGroup.markAllAsTouched();
        }
    }

    /**
     * This will bind the form control value
     * @param userFormGroup is the form group containing all the controls
     * @param bookitis the object storing all the values  
     */
    public bindControlValue(bookitFormGroup: FormGroup, { ...bookit }: BookIt): FormGroup {
        if (bookit) {
            if (bookit && !bookitFormGroup.getRawValue().clientId) {
                if (!this.isRequestor) {
                    this.getUsersByClientId.next(bookit.clientId);
                }
                if (bookit.isPopulateAccountNumber) {
                    this.getAccountNumber.next(bookit.clientId);
                }
            }
            bookitFormGroup.patchValue(bookit);
        }
        return bookitFormGroup;
    }

    /** it will check user role */
    public checkUserRole(policyService: AuthPolicyService): void {
        this.isSuperUser = policyService.isInRole(PolicyRoles.superUser);
        this.isManager = policyService.isInRole(PolicyRoles.manager);
        this.isAssociate = policyService.isInRole(PolicyRoles.associate);
        this.isRequestor = policyService.isInRole(PolicyRoles.requestor);
    }

    /** when user change the client */
    public onClientChange(
        bookitFormGroup: FormGroup, client: ClientMaster, bookit: BookIt, clearData: boolean = true): void {
        if (clearData) {
            bookitFormGroup.get('userId').setValue(null);
            bookitFormGroup.get('roomId').setValue(null);
            bookitFormGroup.get('roomLayoutId').setValue(null);
            if (bookit) {
                bookit.userId = null;
                bookit.roomId = null;
                bookit.roomLayoutId = null;
            }
        }
        const clientId: number = bookitFormGroup.get('clientId').value;
        if (clientId) {
            // load details based on selected client for all role type
            this.getUsersByClientId.next(clientId);

            if (client.accountNumber) {
                if (clearData) {
                    if (bookit) {
                        bookit.clientAccount = null;
                    }
                    bookitFormGroup.get('clientAccount').setValue(null);
                }
                bookitFormGroup.get('clientAccountId').setValidators([Validators.required]);
                bookitFormGroup.get('clientAccountId').updateValueAndValidity();
                bookitFormGroup.get('clientAccount').clearValidators();
                bookitFormGroup.get('clientAccount').updateValueAndValidity();

                this.getAccountNumber.next(clientId);
            } else {
                if (clearData) {
                    if (bookit) {
                        bookit.clientAccountId = null;
                    }
                }
                bookitFormGroup.get('clientAccountId').setValue(null);
                bookitFormGroup.get('clientAccount').setValidators([Validators.required]);
                bookitFormGroup.get('clientAccount').updateValueAndValidity();
                bookitFormGroup.get('clientAccountId').clearValidators();
                bookitFormGroup.get('clientAccountId').updateValueAndValidity();

                this.clearAccountNumbers.next();
            }
        }
        if (bookitFormGroup.getRawValue().date && clientId) {
            bookitFormGroup.get('isRecurring').enable();
        } else {
            bookitFormGroup.get('isRecurring').disable();
            bookitFormGroup.get('isRecurring').setValue(false);
            bookitFormGroup.get('repeatsOn').patchValue({});
        }
    }

    public ngOnDestroy(): void {
        this.destroy.next(true);
        this.destroy.complete();
        this.destroyChat.next(true);
        this.destroyChat.complete();
    }

    /** Set copyit status list */
    public setStatusList(list: Status[], currentStatusId: number): void {
        let allowedStatus: number[] = list.map((status: Status) => status.statusId);
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
        list = list.filter((status: Status) => allowedStatus.includes(status.statusId));
        this.statusList.next(list);
    }

    /** enable/disable based on status */
    public onStatusAllowedAction(statusId: Status['statusId'], isRequestor: boolean = false): void {
        this.disableAssignToStatus();
        this.disableRequestorForStatus();
        // this.disableChatBoxStatus();
        // this.enableMessageBoxBasedOnStatus(false);
        switch (statusId) {
            case 1: // new
            case 2: // assigned
                this.disableChatBoxStatus();
                !this.isArchived && !isRequestor && this.disableAssignToStatus(false);
                break;
            case 3: // in-progress
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
            case 4: // complete
                this.disableRequestorForStatus(false);
                this.disableChatBoxStatus(false);
                this.enableMessageBoxBasedOnStatus(false);
                break;
            case 5: // re-open
                this.disableChatBoxStatus(false);
                !this.isArchived && !isRequestor && this.disableAssignToStatus(false);
                this.enableMessageBoxBasedOnStatus(false);
                break;
            case 6: // on-hold
                this.disableChatBoxStatus(false);
                this.enableMessageBoxBasedOnStatus(false);
                break;
            case 7: // request-for-info
                this.disableChatBoxStatus(false);
                !this.isArchived && this.disableFormStatus(false);
                !this.isArchived && this.enableMessageBoxBasedOnStatus();
                break;
            case 9: // closed
                this.disableChatBoxStatus(false);
                this.disableFormStatus();
                this.enableMessageBoxBasedOnStatus(false);
                break;

            default:
                break;
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
    /** enable/disable based on assignee and requestor */
    public onAssigneeAllowedActions(bookit: BookIt): void {
        if (bookit.userId === bookit.assignToId) {
            this.disableChatBoxStatus();
        }
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

    /** This method is invoked when the user click on chat button. */
    public openChatBox(): void {
        this.isChatBoxOpen = true;
        // attach component portal 
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
        componentRef.instance.moduleId = this.bookItId;
        // Subscribe to get-conversation
        this.conversationResponse$.pipe(takeUntil(this.destroyChat), takeUntil(this.destroy))
            .subscribe((res: ConversationResponse) => {
                if (res) {
                    this.ngZone.run(() => {
                        this.conversationRes = res;
                        componentRef.instance.conversation = res.conversations;
                        componentRef.instance.isEnable = res.isEnabled;
                        componentRef.instance.userId = this.userId;
                        componentRef.instance.moduleId = this.bookItId;
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
    public setConversationResponse(response: Observable<ConversationResponse>): void {
        response.pipe(take(1), takeUntil(this.destroy))
            .subscribe((res: ConversationResponse) => this.conversationResponse.next(res));
    }
    /** On copyIt status change */
    public onStatusChange(statusId: number): void {
        this.setStatus.next(statusId);
    }
    /** On copyIt assignee change */
    public onAssignToChange(assignToId: number): void {
        this.setAssignTo.next(assignToId);
    }

    /** validate copyit status before get changed */
    public validateStatus(statusId: number): boolean {
        if (!statusId) { return }
        let flag: boolean = false;
        if (statusId !== StatusEnum.completed || (statusId === StatusEnum.completed)) {
            flag = true;
        }
        return flag;
    }


    /** Recurring Enable/Disable */
    public recurringEnableDisable(
        value: any, bookitFormGroup: FormGroup,
        repeatsOnControls: any, weekDays: WeekDays[], date: Date
    ): void {

        if (value) {
            bookitFormGroup.get('isRecurring').enable();
        } else {
            bookitFormGroup.get('isRecurring').disable();
            bookitFormGroup.get('isRecurring').setValue(false);
            bookitFormGroup.get('repeatsOn').patchValue({});
        }

        if (repeatsOnControls.recurringId.value) {
            this.onRepeatsOnChange(repeatsOnControls.recurringId.value, bookitFormGroup.get('repeatsOn') as FormGroup, weekDays, date)
        }

    }

    /** enable/disable message box based on status changes */
    private enableMessageBoxBasedOnStatus(flag: boolean = true): void {
        this.enableMessageBox.next(flag);
    }
}
