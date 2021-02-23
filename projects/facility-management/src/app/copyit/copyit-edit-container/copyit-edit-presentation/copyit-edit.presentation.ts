import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { AuthPolicyService } from 'auth-policy';
import { Observable, Subject } from 'rxjs';
import { distinctUntilChanged, takeUntil } from 'rxjs/operators';
// ---------------------------------- //
import { BasePresentation } from '../../../core/base-classes/base.presentation';
import { Permission, PolicyRoles } from '../../../core/enums/role-permissions.enum';
import { StatusEnum } from '../../../core/enums/status.enum';
import { CoreDataService } from '../../../core/services/core-data.service';
import { CopyCenterInfo, CopyItConfiguration, CopyItInfo, CopyItPickAsset, FileResponse, PrintDetailInfo, RequestInfo, ScheduleInfo, ShippingDetailInfo } from '../../../shared/modules/copy-it-print-details/models/copyit-info';
import { PrintDetailsFormPresentationComponent } from '../../../shared/modules/copy-it-print-details/print-details-form-presentation/print-details-form.presentation';
import { CopyItAssignee, CopyItUser, CopyItUserList } from '../../../shared/modules/copyit-shared/copyit-shared.model';
import { Conversation, ConversationResponse } from '../../../shared/modules/custom-chat-box/models/custom-chat-box.model';
import { ShippingDetailsFormPresentationComponent } from '../../../shared/modules/shipping-details/shipping-details-form-presentation/shipping-details-form.presentation';
import { CopyitSharedService } from '../../copyit-shared.service';
import { Client, Status, UserDetails } from '../../copyit.model';
import { RequestInformationDetailsFormPresentationComponent } from '../../shared/request-information-details-form-presentation/request-information-details-form.presentation';
import { SchedulingDetailsFormPresentationComponent } from '../../shared/scheduling-details-form-presentation/scheduling-details-form.presentation';
import { CopyItEditPresenter } from '../copyit-edit-presenter/copyit-edit.presenter';
import { CopyCenterPresentationComponent } from './copy-center/copy-center-presentation/copy-center.presentation';
import { PickAssetsPresentationComponent } from './pick-assets/pick-assets-presentation/pick-assets.presentation';

@Component({
  selector: 'app-copyit-edit-ui',
  templateUrl: './copyit-edit.presentation.html',
  viewProviders: [CopyItEditPresenter],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CopyItEditPresentationComponent extends BasePresentation implements OnInit, OnDestroy, AfterViewInit {

  /** List of available assets for the selected client */
  @Input() public assetList: CopyItPickAsset[];
  /** User Details */
  @Input() public userDetails: UserDetails;
  /** set requestor detail for the first time */
  @Input() public requestorDetail: UserDetails;

  /** 
   * callback for successful message sent
   * update status on success
   */
  @Input() public set chatMessageSend(message: Conversation) {
    if (message) {
      const status = new Status();
      status.copyItStatusId = StatusEnum.requestForInformation;
      if (message.userId === this.copyItDetail.requestForId) {
        status.copyItStatusId = StatusEnum.inProgress;
      }
      this.onStatusChange(status);
    }
  }
  /** 
   * callback for status update
   * set assignTo null on status set to re-open
   */
  @Input() public set updatedStatus(data: any) {
    if (data) {
      this.copyItDetailBase = { ...this.copyItDetail, ...{ copyItStatusId: this.status }, ...{ associateId: this.assignee } };
      this.statusList = this.allStatus;
      if (this.status === StatusEnum.reOpen) {
        this.onAssignToChange(null);
      } else {
        this.loadCopyItDetail.emit(true);
      }
    }
  }
  /** 
   * callback for assignTo update 
   * update status on success
   */
  @Input() public set updateAssignTo(data: any) {
    if (data) {
      this.copyItDetailBase = { ...this.copyItDetail, ...{ copyItStatusId: this.status }, ...{ associateId: this.assignee } };
      if (this.assignee) {
        const status = new Status();
        status.copyItStatusId = StatusEnum.inProgress;
        this.onStatusChange(status);
      } else {
        this.navigateBack.emit();
      }
    }
  }

  /** Get User list */
  @Input() public set usersListAndConfiguration(value: any) {
    if (value) {
      this._usersListAndConfiguration = value;
      this.usersList = value.usersList || null;
      this.configurations = value.configurations || null;
      this.enableShipping = this.copyitSharedService.isEnableShipping(this.configurations.requestorSections);
      setTimeout(() => {
        this.disableAllForm(this.disableForm);
      });
    }
  }
  public get usersListAndConfiguration(): any {
    return this._usersListAndConfiguration;
  }

  /** Client List */
  @Input() public set clientsList(value: Client[]) {
    if (value) {
      this._clientsList = value;
      // get client details for selected client of copyit request
      this.clientDetail = value.find(client => client.clientId === this.copyItDetail.clientId);
    }
  }
  public get clientsList(): Client[] {
    return this._clientsList;
  }

  /** set copyItId */
  @Input() public set copyItId(id: number) {
    if (id) {
      this.copyItEditPresenter.copyItId = id;
    }
  }
  public get copyItId(): number {
    return this.copyItEditPresenter.copyItId;
  }

  /** List of available statuses */
  @Input() public set statusList(statusList: Status[]) {
    if (statusList) {
      this.allStatus = [...statusList];
      this.copyItEditPresenter.setStatusList(statusList, this.status);
    }
  };
  /** get list of available status */
  public get filteredStatus(): Observable<Status[]> {
    return this._statusList;
  }

  /** List of available assignTo List */
  @Input() public set assignToList(assignTo: CopyItAssignee[]) {
    if (assignTo) {
      this._assignToList = this.copyItEditPresenter.setAssignToList(assignTo);
    }
  }
  public get assignToList(): CopyItAssignee[] {
    return this._assignToList;
  }

  /** Set conversation observable for chat box */
  @Input() public set conversationResponse(conversation: ConversationResponse) {
    if (conversation) {
      this.copyItEditPresenter.setConversationResponse(conversation);
    }
  }

  /** copyIt detail base-from container */
  @Input() public set copyItDetailBase(detail: CopyItInfo) {
    if (detail) {
      this._copyItDetail = { ...detail };
      this.isEstimates = !this.statusForCharges.includes(this._copyItDetail.copyItStatusId)
      this.setRequestInfo(this.copyItDetail);
      this.setScheduleInfo(this.copyItDetail);
      this.setPrintDetailInfo(this.copyItDetail);
      this.setShippingDetailInfo(this.copyItDetail);
      this.setCopyCenterInfo(this.copyItDetail);
      this.setCopyItPickAssets(this.copyItDetail.pickAssets);
      this.status = this.copyItDetail.copyItStatusId;
      // disable message box if role is requestor or current user is in requestor
      const checkRole: boolean = this.isRequestor || (this.coreDataService.userInfo.userId === this.copyItDetail.requestForId);
      this.copyItEditPresenter.onStatusAllowedAction(this.status, checkRole);
      this.copyItEditPresenter.onAssigneeAllowedActions(this.copyItDetail);
      this.assignee = this.copyItDetail.associateId;
      setTimeout(() => {
        this.disableAllForm(this.disableForm);
      });
    }
  }

  /** get copyit detail manually on [status-change] */
  @Output() public loadCopyItDetail: EventEmitter<boolean>;
  /** load conversation event */
  @Output() public loadConversation: EventEmitter<boolean>;
  /** Send message event */
  @Output() public sendMessage: EventEmitter<Conversation>;
  /** Set copyIt status event */
  @Output() public setStatus: EventEmitter<number>;
  /** Set Assignee event */
  @Output() public setAssignTo: EventEmitter<number>;
  /** on clientId change */
  @Output() public clientIdChange: EventEmitter<number>;
  /** on userId change */
  @Output() public userIdChange: EventEmitter<number>;
  /** On copyit detail update */
  @Output() public updateCopyItDetail: EventEmitter<CopyItInfo>;
  /** On export to PDF */
  @Output() public exportToPDF: EventEmitter<number>;
  /** On print PDF */
  @Output() public printCopyItPDF: EventEmitter<number>;
  /** On status changes to re-open, navigate back to list */
  @Output() public navigateBack: EventEmitter<number | void>;
  /** On file download from request info */
  @Output() public downloadAttachedFile: EventEmitter<FileResponse>;

  @ViewChild(RequestInformationDetailsFormPresentationComponent, { static: false }) public set requestInfoUI(ui: RequestInformationDetailsFormPresentationComponent) {
    this.copyItEditPresenter.requestInfoUI = ui;
  }
  public get requestInfoUI(): RequestInformationDetailsFormPresentationComponent {
    return this.copyItEditPresenter.requestInfoUI;
  }
  @ViewChild(SchedulingDetailsFormPresentationComponent, { static: false }) public set scheduleUI(ui: SchedulingDetailsFormPresentationComponent) {
    this.copyItEditPresenter.scheduleUI = ui;
  }
  public get scheduleUI(): SchedulingDetailsFormPresentationComponent {
    return this.copyItEditPresenter.scheduleUI;
  }
  @ViewChild(PrintDetailsFormPresentationComponent, { static: false }) public set printUI(ui: PrintDetailsFormPresentationComponent) {
    this.copyItEditPresenter.printUI = ui;
  }
  public get printUI(): PrintDetailsFormPresentationComponent {
    return this.copyItEditPresenter.printUI;
  }
  @ViewChild(ShippingDetailsFormPresentationComponent, { static: false }) public set shippingDetailUI(ui: ShippingDetailsFormPresentationComponent) {
    this.copyItEditPresenter.shippingDetailUI = ui;
  }
  public get shippingDetailUI(): ShippingDetailsFormPresentationComponent {
    return this.copyItEditPresenter.shippingDetailUI;
  }
  @ViewChild(PickAssetsPresentationComponent, { static: false }) public set pickAssetsUI(ui: PickAssetsPresentationComponent) {
    this.copyItEditPresenter.pickAssetsUI = ui;
  }
  public get pickAssetsUI(): PickAssetsPresentationComponent {
    return this.copyItEditPresenter.pickAssetsUI;
  }
  @ViewChild(CopyCenterPresentationComponent, { static: false }) public set copyCenterUI(ui: CopyCenterPresentationComponent) {
    this.copyItEditPresenter.copyCenterUI = ui;
  }
  public get copyCenterUI(): CopyCenterPresentationComponent {
    return this.copyItEditPresenter.copyCenterUI;
  }
  public set copyItDetail(detail: CopyItInfo) {
    this._copyItDetail = detail;
  }
  public get copyItDetail(): CopyItInfo {
    return this._copyItDetail;
  }

  public get disableForm(): boolean {
    return this.copyItEditPresenter.disableForm;
  }
  public get disableStatus(): boolean {
    return this.isArchived || (!this.policyService.hasPermission(this.copyItPermissions.changeStatus) && this.copyItEditPresenter.disableStatusForRequestor);
  }
  public get disableAssignTo(): boolean {
    return !this.policyService.hasPermission(this.copyItPermissions.changeAssignTo) || this.copyItEditPresenter.disableAssignTo;
  }
  public get disableChatBox(): boolean {
    return this.copyItEditPresenter.disableChatBox;
  }
  public get copyItPermissions(): typeof Permission.CopyIt {
    return Permission.CopyIt;
  }
  /* ChatBox Status */
  public get isChatBoxOpen(): boolean {
    return this.copyItEditPresenter.isChatBoxOpen;
  };
  /** check archive mode true/false */
  public get isArchived(): boolean {
    return this.copyItEditPresenter.isArchived;
  }

  /** usersList from master */
  public usersList: CopyItUserList[];
  /** configurations from master */
  public configurations: CopyItConfiguration;
  /** Selected status from the drop-down */
  public status: number;
  /** Selected assignee from the drop-down */
  public assignee: number;
  /** Initial active accordion ids */
  public activeIds: string[];
  /** Set form next event to validate and get updated data */
  public isNext: number;
  /** shadow of copyitInfo for request info */
  public requestInfo: RequestInfo;
  /** shadow of copyitInfo for schedule info */
  public scheduleInfo: ScheduleInfo;
  /** shadow of copyitInfo for print detail Info */
  public printDetailInfo: PrintDetailInfo;
  /** shadow of copyitInfo for shipping detail Info */
  public shippingDetailInfo: ShippingDetailInfo;
  /** shadow of copyitInfo for copy center */
  public copyItCopyCenterInfo: CopyCenterInfo;
  /** shadow of copyitInfo for pick assets */
  public copyItPickAssets: CopyItPickAsset[];
  /** show/hide shipping detail */
  public enableShipping: boolean;
  /** selected client detail */
  public clientDetail: Client;
  /** role of loggedIn user is Requestor */
  public isRequestor: boolean;
  /** flag to identify form state is disabled or not */
  public isDisabled: boolean;
  /** flag to show estimates or charges */
  public isEstimates: boolean;

  /** Selected statuses from the drop-down */
  private _statusList: Observable<Status[]>;
  /** Selected statuses from the drop-down */
  private _assignToList: CopyItAssignee[];
  /** list of clients */
  private _clientsList: Client[];
  /** list of status */
  private allStatus: Status[];
  /** User List and Configuration */
  private _usersListAndConfiguration: any;
  /** CopyIt detail */
  private _copyItDetail: CopyItInfo;
  /** Observable for unsubscribe */
  private destroy: Subject<boolean>;
  private readonly statusForCharges: StatusEnum[];

  constructor(
    private coreDataService: CoreDataService,
    private copyitSharedService: CopyitSharedService,
    private copyItEditPresenter: CopyItEditPresenter,
    private cdr: ChangeDetectorRef,
    private policyService: AuthPolicyService
  ) {
    super();
    this.activeIds = ['0'];
    this.destroy = new Subject();
    this.loadCopyItDetail = new EventEmitter<boolean>(true);
    this.setStatus = new EventEmitter<number>(true);
    this.setAssignTo = new EventEmitter<number>(true);
    this.sendMessage = new EventEmitter<Conversation>(true);
    this.loadConversation = new EventEmitter<boolean>(true);
    this.clientIdChange = new EventEmitter(true);
    this.userIdChange = new EventEmitter(true);
    this.updateCopyItDetail = new EventEmitter(true);
    this.exportToPDF = new EventEmitter(true);
    this.printCopyItPDF = new EventEmitter(true);
    this.navigateBack = new EventEmitter(true);
    this.downloadAttachedFile = new EventEmitter(true);
    this._statusList = this.copyItEditPresenter.statusList$;
    this.isRequestor = this.policyService.isInRole(PolicyRoles.requestor);
    this.statusForCharges = [StatusEnum.completed, StatusEnum.close];
  }

  public ngOnInit(): void {
    // check role and status for enable/disable form
    this.copyItEditPresenter.checkFormAccess(this.copyItDetail, this.isRequestor);
    this.copyItEditPresenter.loadConversation$.pipe(takeUntil(this.destroy)).subscribe(() => this.loadConversation.emit(true));
    this.copyItEditPresenter.sendMessage$.pipe(takeUntil(this.destroy)).subscribe((message: Conversation) => this.sendMessage.emit(message));
    this.copyItEditPresenter.setAssignTo$.pipe(takeUntil(this.destroy)).subscribe((assignTo: number) => {
      this.assignee = assignTo;
      this.setAssignTo.emit(assignTo);
    });
    this.copyItEditPresenter.setStatus$.pipe(takeUntil(this.destroy), distinctUntilChanged()).subscribe((statusId: number) => {
      this.status = statusId;
      this.setStatus.emit(statusId);
    });
  }

  public ngAfterViewInit(): void { }

  /** validate and save panel detail */
  public savePanelDetails(panelId: string): void {
    switch (panelId) {
      case '0':
        this.copyItEditPresenter.validatePanel(panelId);
        break;
      case '1':
        this.saveSchedulingDetails();
        break;
      case '2':
        this.savePrintDetails();
        break;
      case '3':
        this.saveShippingDetails();
        break;
    }
    // pick asset & copy center is not part of panels
    // this.savePickAssetDetails();
    // this.saveCopyCenterDetails();
    setTimeout(() => {
      this.cdr.detectChanges();
    });
  }

  /** validate status drop-down change before raising event */
  public validateStatusChange(status: Status): void {
    if (this.copyItEditPresenter.validateStatus(status.copyItStatusId, this.copyItDetail)) {
      this.status = status.copyItStatusId;
      this.onStatusChange(status);
    }
  }

  /** This Method is used for change the status */
  public onStatusChange(status: Status): void {
    // this.status = status.copyItStatusId;
    this.copyItEditPresenter.onStatusChange(status.copyItStatusId);
  }
  /** This Method is used for change the AssignTo */
  public onAssignToChange(assignee: CopyItUser): void {
    // this.assignee = assignee ? assignee.userId : null;
    this.copyItEditPresenter.onAssignToChange(assignee ? assignee.userId : null);
  }

  /** Open chat box */
  public openChatBox(): void {
    this.copyItEditPresenter.openChatBox();
  }

  /** Get detail by clientId */
  public getDetailByClientId(clientId: number): void {
    this.clientIdChange.emit(clientId);
  }

  /** On userId change */
  public onUserChange(id: number): void {
    this.userIdChange.emit(id);
  }

  /** Save copyItInfo changes */
  public saveChanges(): void {
    // validate each panel and save data if all are valid
    // rail save changes for each panel to get updated data
    const { flag, activeIds }: any = this.copyItEditPresenter.validateEachPanel();
    this.activeIds = activeIds;
    setTimeout(() => {
      if (this.copyItEditPresenter.validateStatus(this.copyItDetail.copyItStatusId, this.copyItDetail)) {
        if (flag) {
          this.updateCopyItDetail.emit(this.copyItDetail);
        }
      }
    }, 10);

  }

  /** save request info changes */
  public saveRequestDetails(copyitInfo: CopyItInfo): void {
    this.setRequestInfo(copyitInfo);
    this.copyItDetail = { ...this.copyItDetail, ...this.requestInfo };
    this.activeIds = [];
  }
  /** save scheduling detail changes */
  public saveSchedulingDetails(copyItInfo?: CopyItInfo): void {
    if (this.scheduleUI.schedulingDetailsFormGroup.valid) {
      this.setScheduleInfo(copyItInfo || { ...this.scheduleUI.schedulingDetailsFormGroup.getRawValue() });
      this.copyItDetail = { ...this.copyItDetail, ...this.scheduleInfo };
      this.activeIds = [];
    } else {
      this.scheduleUI.isNext = this.getUnique();
    }
  }
  /** save print detail changes */
  public savePrintDetails(copyItInfo?: CopyItInfo): void {
    if (this.printUI.printDetailsFormGroup.valid) {
      this.setPrintDetailInfo(copyItInfo || { ...this.printUI.printDetailsFormGroup.getRawValue() });
      this.copyItDetail = { ...this.copyItDetail, ...this.printDetailInfo };
      this.activeIds = [];
    } else {
      this.printUI.isNext = this.getUnique();
    }
  }
  /** save shipping detail changes */
  public saveShippingDetails(copyitInfo?: CopyItInfo): void {
    if (this.shippingDetailUI.shippingDetailsFormGroup.valid) {
      this.setShippingDetailInfo(copyitInfo || { ...this.shippingDetailUI.shippingDetailsFormGroup.getRawValue() });
      this.copyItDetail = { ...this.copyItDetail, ...this.shippingDetailInfo };
      this.activeIds = [];
    } else {
      this.shippingDetailUI.isNext = this.getUnique();
    }
  }

  /** save copy center info */
  public saveCopyCenterInfo(info: CopyItInfo): void {
    this.setCopyCenterInfo(info);
    this.copyItDetail = { ...this.copyItDetail, ...info };
  }

  /** save copyIt pick assets */
  public saveCopyItPickAssets(copyItInfoForAssets: CopyItInfo): void {
    // this.setCopyItPickAssets(assets);
    this.copyItDetail = { ...this.copyItDetail, ...{ pickAssets: copyItInfoForAssets.pickAssets, assets: copyItInfoForAssets.assets } };
  }

  /** export copyit detail to PDF */
  public exportCopyItDetailToPDF(): void {
    this.exportToPDF.emit(this.copyItId);
  }

  /** print copyit detail */
  public printCopyItDetail(): void {
    this.printCopyItPDF.emit(this.copyItId);
  }

  /** open accordion panel */
  public openAccordionPanel(panelId: string): void {
    this.activeIds = [panelId];
  }
  /** close accordion panel */
  public closeAccordionPanel(panelId: string): void {
    this.activeIds.splice(this.activeIds.indexOf(panelId), 1);
  }

  /** download file */
  public downloadFile(file: FileResponse): void {
    this.downloadAttachedFile.emit(file);
  }

  public ngOnDestroy(): void {
    this.destroy.next(true);
    this.destroy.complete();
  }

  /** Get unique number */
  private getUnique(): number {
    return new Date().getMilliseconds();
  }

  /** set request info */
  private setRequestInfo(copyItInfo: CopyItInfo): void {
    this.requestInfo = new RequestInfo(copyItInfo);
  }
  /** set schedule info */
  private setScheduleInfo(copyItInfo: CopyItInfo): void {
    this.scheduleInfo = new ScheduleInfo(copyItInfo);
  }
  /** set print detail info */
  private setPrintDetailInfo(copyItInfo: CopyItInfo): void {
    this.printDetailInfo = new PrintDetailInfo(copyItInfo);
  }
  /** set shipping detail info */
  private setShippingDetailInfo(copyItInfo: CopyItInfo): void {
    this.shippingDetailInfo = new ShippingDetailInfo(copyItInfo);
  }

  /** set copy center info */
  private setCopyCenterInfo(copyItInfo: CopyItInfo): void {
    this.copyItCopyCenterInfo = new CopyCenterInfo(copyItInfo);
  }
  /** set copyit pick asset info */
  private setCopyItPickAssets(pickAssets: CopyItPickAsset[]): void {
    this.copyItPickAssets = [...pickAssets || []];
  }
  /** disable all forms based on status */
  private disableAllForm(flag: boolean): void {
    this.isDisabled = flag;
    if (flag) {
      this.copyItEditPresenter.disableAllForms();
      this.cdr.detectChanges();
    }
  }
}