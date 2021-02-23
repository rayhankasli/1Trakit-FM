import { EventEmitter, Output, Input, HostBinding, NgZone, ChangeDetectorRef, ViewChildren, QueryList } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';
import { Observable, Subject } from 'rxjs';
import { AuthPolicyService } from 'auth-policy';
// ------------------------------------------------------------------ //
import { ClientMaster, UserWithRoleMaster, WeekDays } from '../../../core/model/common.model';
import { BookIt, BookItMaster, BookItFileResponse, BookItAssignee, Status, ClientAccountMaster } from '../../models/bookit.model';
import { RoomMaster, RoomLayoutMaster, BookItRoomLayoutSearchParams, BookItRoomSearchParams, } from '../../models/bookIt-rooms.model';
import { BaseCloseSelectDropdown } from '../../../core/base-classes/base-close-select-dropdown';
import { BookitFormPresenter } from '../bookit-form-presenter/bookit-form.presenter';
import { UserInfo } from '../../../core/model/core.model';
import { Permission } from '../../../core/enums/role-permissions.enum';
import { StatusEnum } from '../../../core/enums/status.enum';
import { Conversation, ConversationResponse } from '../../../shared/modules/custom-chat-box/models/custom-chat-box.model';
import { CustomSelectDropdownComponent } from '../../../shared/modules/custom-select-drop-down/custom-select-dropdown/custom-select-dropdown.component';
import { CoreDataService } from '../../../core/services/core-data.service';

export class BaseBookItFormPresentation extends BaseCloseSelectDropdown {

  /** hostBinding */
  @HostBinding('class') public class: string = 'd-flex flex-grow-1 h-100 overflow-hidden';

  /** This will set the data */
  @Input() public set bookit(value: BookIt) {
    if (value) {
      this._bookit = { ...value };
      this.bookitFormGroup = this.bookitPresenter.bindControlValue(this.bookitFormGroup, this._bookit);
      this.status = this._bookit.statusId;
      this.assignee = this._bookit.assignToId;
      this.onRoomLayoutChange({ roomLayoutImage: value.roomLayoutImage, roomLayout: value.roomLayoutName });
      if (this.status && this.allStatus) {
        this.bookitPresenter.setStatusList(this.allStatus, this.status);
      }
      // disable message box if role is requestor or current user is in requestor
      const checkRole: boolean = this.isRequestor || (this.coreDataService.userInfo.userId === this.bookit.userId);
      this.bookitPresenter.onStatusAllowedAction(this.status, checkRole);
      this.bookitPresenter.onAssigneeAllowedActions(this._bookit);

      this.checkFormAccess();
      this.cdr.detectChanges();
    }
  }

  public get bookit(): BookIt {
    return this._bookit;
  }

  /** This will set the data */
  @Input() public set bookitMasterData(value: BookItMaster) {
    if (value) {
      this._bookitMasterData = { ...value };
      if (this._bookit) {
        this.bookitFormGroup.patchValue({
          facility: this._bookit.facility,
          amenities: this._bookit.amenities,
          catering: this._bookit.catering
        });
      }
    }
  }

  public get bookitMasterData(): BookItMaster {
    return this._bookitMasterData;
  }

  /** This will set the data */
  @Input() public set clients(value: ClientMaster[]) {
    if (value) {
      this._clients = [...value];
    }
  }

  public get clients(): ClientMaster[] {
    return this._clients;
  }

  /** This will set the data */
  @Input() public set userList(value: UserWithRoleMaster[]) {
    if (value) {
      this._userList = [...value];
      if (this._bookit) {
        this.bookitFormGroup.get('userId').setValue(this._bookit.userId);
      }
    }
  }

  public get userList(): UserWithRoleMaster[] {
    return this._userList;
  }

  @Input() public set rooms(value: RoomMaster[]) {
    if (value) {
      this._rooms = [...value];
      if (this._bookit) {
        this.bookitFormGroup.get('roomId').setValue(this._bookit.roomId);
        this.bookitPresenter.onRoomChange(this.bookitFormGroup, this._bookit, this._roomLayouts);
      }
    }
  }

  public get rooms(): RoomMaster[] {
    return this._rooms;
  }

  @Input() public set roomLayouts(value: RoomLayoutMaster[]) {
    if (value) {
      this._roomLayouts = [...value];
      if (this._bookit) {
        this.bookitFormGroup.get('roomLayoutId').setValue(this._bookit.roomLayoutId);
      }
    }
  }

  public get roomLayouts(): RoomLayoutMaster[] {
    return this._roomLayouts;
  }

  @Input() public set accountNumbers(value: ClientAccountMaster[]) {
    if (value) {
      this._accountNumbers = [...value];
      if (this._bookit) {
        this.bookitFormGroup.get('clientAccountId').setValue(this._bookit.clientAccountId);
      }
    }
  }

  public get accountNumbers(): ClientAccountMaster[] {
    return this._accountNumbers;
  }

  @Input() public addSuccess: number;
  @Input() public updateSuccess: number;
  @Input() public successDownloadFile: number;
  @Input() public successExportToPdf: number;

  @Input() public set userInfo(value: UserInfo) {
    if (value) {
      this._userInfo = { ...value };
      this.bookitFormGroup.get('name').setValue(this._userInfo.userDetail.firstName + ' ' + this._userInfo.userDetail.lastName);
      this.currentClient = { ...this._userInfo.clients[0] };
    }
  }

  public get userInfo(): UserInfo {
    return this._userInfo;
  }

  /** callback for successful message sent  */
  @Input() public set chatMessageSend(message: Conversation) {
    if (message) {
      const status: Status = new Status();
      status.statusId = StatusEnum.requestForInformation;
      if (message.userId === this.bookit.userId) {
        status.statusId = StatusEnum.inProgress;
      }
      this.onStatusChange(status);
    }
  }
  /** callback for status update */
  @Input() public set updatedStatus(data: number) {
    if (data) {
      this._bookit = { ...this._bookit, ...{ statusId: this.status } };
      this.statusList = this.allStatus;
      this.bookitPresenter.setStatusList(this.allStatus, this.status);  // reset list based on selected status
      if (this.status === StatusEnum.reOpen) {
        this.onAssignToChange(null);
      }
      // disable message box if role is requestor or current user is in requestor
      const checkRole: boolean = this.isRequestor || (this.coreDataService.userInfo.userId === this.bookit.userId);
      this.bookitPresenter.onStatusAllowedAction(this.status, checkRole);
      if (this.disableForm) {
        this.bookitFormGroup.disable();
        this.disableCustomSelectOptions();
      }
      this.bookitPresenter.onAssigneeAllowedActions(this._bookit);

    }
  }
  /** callback for assignTo update */
  @Input() public set updateAssignTo(data: any) {
    if (data) {
      this._bookit = { ...this._bookit, ...{ assignToId: this.assignee } };
      if (this.assignee) {
        const status: Status = new Status();
        status.statusId = StatusEnum.inProgress;
        this.onStatusChange(status);
      } else {
        this.navigateBack.emit();
      }
    }
  }

  /** List of available statuses */
  @Input() public set assignToAndStatusList(value: any) {
    if (value) {

      this.assignToList = value.assignTo;
      this.statusList = value.statuses;

      this._assignToList = [...value.assignTo].map((assignee: BookItAssignee) => {
        // set 'My self for active user in assignee list
        assignee.fullName = (assignee.userId === this.userInfo.userId) ? 'My self' : assignee.fullName;
        return assignee;
      });

      if (this._bookit) {
        this.assignee = this._bookit.assignToId;
      }

      this.allStatus = [...value.statuses];
      if (this.status) {
        this.bookitPresenter.setStatusList(value.statuses, this.status);
      }
    }
  }

  /** Set conversation observable for chat box */
  @Input() public set conversationResponse(conversation: Observable<ConversationResponse>) {
    if (conversation) {
      this.bookitPresenter.setConversationResponse(conversation);
    }
  }

  /** set copyItId */
  @Input() public set bookItId(id: number) {
    if (id) {
      this.bookitPresenter.bookItId = id;
    }
  }
  public get bookItId(): number {
    return this.bookitPresenter.bookItId;
  }

  /** set copyItId */
  @Input() public set weekDays(value: WeekDays[]) {
    if (value) {
      this._weekDays = [...value];
    }
  }
  public get weekDays(): WeekDays[] {
    return this._weekDays;
  }

  @Input() public set clientMaster(value: ClientMaster) {
    if (value) {
      if (this.isSuperUser) {
        this.bookitFormGroup.get('clientId').setValue(value.clientId);
        this.searchParamsForRooms = {
          clientId: value.clientId
        };
        this.onClientChange(value, false);
      }
    }
  }

  /** Set copyIt status event */
  @Output() public setStatus: EventEmitter<number>;
  /** Set Assignee event */
  @Output() public setAssignTo: EventEmitter<number>;
  /** load conversation event */
  @Output() public loadConversation: EventEmitter<boolean>;
  /** Send message event */
  @Output() public sendMessage: EventEmitter<Conversation>;
  /** On print PDF */
  @Output() public printBookItPDF: EventEmitter<number>;
  /*** Output of customer form presentation component */
  @Output() public add: EventEmitter<BookIt>;
  /*** Output of customer form presentation component */
  @Output() public update: EventEmitter<BookIt>;
  /** it will emit an event to parent component for user list by client id */
  @Output() public getUsersByClientId: EventEmitter<number>;
  /** it will emit an event to parent component for room list by client id */
  @Output() public getRooms: EventEmitter<BookItRoomSearchParams>;
  /** it will emit an event to parent component for toom layout list by room id */
  @Output() public getRoomLayouts: EventEmitter<BookItRoomLayoutSearchParams>;
  /** it will emit an event to parent component for toom layout list by room id */
  @Output() public getAccountNumber: EventEmitter<number>;
  /** emit event to parent component for download file */
  @Output() public downloadFile: EventEmitter<BookItFileResponse>;
  /** On status changes to re-open, navigate back to list */
  @Output() public navigateBack: EventEmitter<number | void>;
  /** On export to PDF */
  @Output() public exportToPDF: EventEmitter<void>;
  /** Get BookIt Data */
  @Output() public getBookItData: EventEmitter<void>;

  /** custom select dropdown reference */
  @ViewChildren(CustomSelectDropdownComponent) public customSelectDropdowns: QueryList<CustomSelectDropdownComponent>;

  /** Customer form group of customer form presentation component */
  public bookitFormGroup: FormGroup;
  /** Customer of customer form presentation component */
  public _bookit: BookIt;
  /** it will store the bookit master data */
  public _bookitMasterData: BookItMaster;
  /** client list */
  public _clients: ClientMaster[];
  /** user list */
  public _userList: UserWithRoleMaster[];
  /** observable for bookit data */
  public bookitData$: Observable<BookIt>;
  /** it will store the room list */
  public _rooms: RoomMaster[];
  /** it will store the room layout list */
  public _roomLayouts: RoomLayoutMaster[];
  /** it will store the accountNumbers list */
  public _accountNumbers: ClientAccountMaster[];
  /** user data */
  public _userInfo: UserInfo;
  /** search params for rooms */
  public searchParamsForRooms: BookItRoomSearchParams;

  public currentClient: ClientMaster;
  /** Store Assign List */
  public assignToList: BookItAssignee[];
  /** statusList */
  public statusList: Status[];

  public get isSuperUser(): boolean {
    return this.bookitPresenter.isSuperUser;
  }
  public get isManager(): boolean {
    return this.bookitPresenter.isManager;
  }
  public get isAssociate(): boolean {
    return this.bookitPresenter.isAssociate;
  }
  public get isRequestor(): boolean {
    return this.bookitPresenter.isRequestor;
  }
  public get bookItPermissions(): typeof Permission.BookIt {
    return Permission.BookIt;
  }
  public get disableForm(): boolean {
    return this.bookitPresenter.disableForm;
  }
  public get formValue(): BookIt {
    return this.bookitFormGroup.getRawValue();
  }
  /** selected status from the drop-down */
  public status: number;
  /** Selected status from the drop-down */
  // public statusId: number;
  /** Selected statuses from the drop-down */
  public _statusList: Observable<Status[]>;
  public allStatus: Status[];
  public roomLayoutPath: SafeUrl;
  public _weekDays: WeekDays[];
  /** Selected assignee from the drop-down */
  public assignee: number;
  public roomLayoutName: string;

  /** subject for bookit data */
  private bookitData: Subject<BookIt>;
  /** assignTo list from the drop-down */
  private _assignToList: BookItAssignee[];
  /** assignTo And Status List */
  private _assignToAndStatusList: any;

  constructor(
    window: Window,
    zone: NgZone,
    public bookitPresenter: BookitFormPresenter,
    public cdr: ChangeDetectorRef,
    public policyService: AuthPolicyService,
    public domSanitizer: DomSanitizer,
    public coreDataService: CoreDataService
  ) {

    super(window, zone);
    this.add = new EventEmitter<BookIt>(true);
    this.update = new EventEmitter<BookIt>(true);
    this.setAssignTo = new EventEmitter<number>(true);
    this.setStatus = new EventEmitter<number>(true);
    this.getUsersByClientId = new EventEmitter<number>(true);
    this.setAssignTo = new EventEmitter<number>(true);
    this.downloadFile = new EventEmitter<BookItFileResponse>(true);
    this.navigateBack = new EventEmitter<number | void>(true);
    this.getRooms = new EventEmitter<BookItRoomSearchParams>(true);
    this.getRoomLayouts = new EventEmitter<BookItRoomLayoutSearchParams>(true);
    this.getAccountNumber = new EventEmitter<number>(true);
    this.exportToPDF = new EventEmitter<void>(true);
    this.getBookItData = new EventEmitter(true);

    this.bookitData = new Subject<BookIt>();
    this.bookitData = new Subject<BookIt>();
    this.bookitData = new Subject<BookIt>();
    this.bookitData$ = this.bookitData.asObservable();
    this.roomLayoutName = '';

    this.bookitPresenter.checkUserRole(policyService);
  }

  /** when user changes the client from dropdown */
  public onClientChange(client: ClientMaster, clearData: boolean = true): void {
    this._userList = [];
    this._rooms = [];
    this._roomLayouts = [];
    this.bookitPresenter.onClientChange(this.bookitFormGroup, client, this._bookit, clearData);
  }

  /** This Method is used for change the status */
  public onStatusChange(status: Status): void {
    // this.statusId = status.statusId;
    this.bookitPresenter.onStatusChange(status.statusId);
  }

  /** This Method is used for change the AssignTo */
  public onAssignToChange(assignee: BookItAssignee): void {
    this.bookitPresenter.onAssignToChange(assignee ? assignee.userId : null);
  }

  /** on room layout change */
  public onRoomLayoutChange(roomLayout: RoomLayoutMaster): void {
    this.roomLayoutPath = null;
    this.roomLayoutName = '';
    if (roomLayout && roomLayout.roomLayoutImage) {
      this.roomLayoutPath = this.domSanitizer.bypassSecurityTrustUrl(roomLayout.roomLayoutImage);
    }
    this.roomLayoutName = roomLayout ? roomLayout.roomLayout : '';
  }

  /** enable/disable form based on role and status */
  public checkFormAccess(): void {
    /** 
     * enable for all roles except requester
     * enable form only if role is requestor & status is requester for info.(7)
     * disable for rest of the case
     */
    this.bookitFormGroup.get('clientId').disable();
    const formStatus: number = this._bookit.statusId;
    let allowEdit: boolean;
    allowEdit = this.policyService.hasPermission(this.bookItPermissions.update);
    if (!allowEdit) { allowEdit = (this.isRequestor && formStatus === StatusEnum.requestForInformation); }
    if (!allowEdit) {
      this.bookitPresenter.disableFormStatus();
    }
    if (this.disableForm) {
      this.bookitFormGroup.disable();
      this.disableCustomSelectOptions();
    }
  }

  /** enable/disable custom-select options */
  private disableCustomSelectOptions(flag: boolean = true): void {
    if (this.customSelectDropdowns) {
      this.customSelectDropdowns.forEach(ctrl => { ctrl.disableOption = flag; });
    }
    if (this.customPageSizeSelectDropdowns) {
      this.customPageSizeSelectDropdowns.forEach(ctrl => { ctrl.disableOption = flag; });
    }
  }
}