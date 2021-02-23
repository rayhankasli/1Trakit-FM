/**
 * @name RequestInformationDetailsPresentationComponent
 * @author Enter Your Name Here
 * @description This is a presentation component for request-information-details which contains the ui and business logic
 */

import { ChangeDetectionStrategy, Component, EventEmitter, Inject, Input, NgZone, OnInit, Output } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthPolicyService } from 'auth-policy';
import { takeUntil } from 'rxjs/operators';
// ---------------------------------------------------- //
import { PolicyRoles } from '../../../core/enums/role-permissions.enum';
import { ClientMaster, IdLabelPair, LableValuePair } from '../../../core/model/common.model';
import { CoreDataService } from '../../../core/services/core-data.service';
import { PHONE_MASK } from '../../../core/utility/constants';
import { CopyItConfiguration, DefaultCopyItConfiguration } from '../../../shared/modules/copy-it-print-details/models/copyit-info';
import { CopyItInfo } from '../../../shared/modules/copy-it-print-details/models/copyit-info/copyit-info';
import { FileResponse } from '../../../shared/modules/copy-it-print-details/models/copyit-info/fileResponse';
import { CopyItUserList, CopyItUser } from '../../../shared/modules/copyit-shared/copyit-shared.model';
import { BaseCopyitStepperPresentation } from '../../copyit-stepper-container/copyit-stepper-presentation/base-copyit-stepper-presentation/base-copyit-stepper.presentation';
import { Client, ProjectCode, UserDetails } from '../../copyit.model';
import { COPYIT_OPTION_LIST, FILE_UPLOAD_LIST, RATE_REQUEST_TYPE } from '../../models/copyit-constant';
import { RequestInformationDetailsFormPresenter } from '../request-information-details-form-presenter/request-information-details-form.presenter';


/**
 * RequestInformationDetailsFormPresentationComponent
 */
@Component({
  selector: 'app-request-information-details-form-ui',
  templateUrl: './request-information-details-form.presentation.html',
  viewProviders: [RequestInformationDetailsFormPresenter],
  changeDetection: ChangeDetectionStrategy.OnPush,
  // tslint:disable-next-line: no-host-metadata-property
  host: {
    class: 'd-flex flex-column h-100 overflow-hidden'
  }
})
export class RequestInformationDetailsFormPresentationComponent extends BaseCopyitStepperPresentation implements OnInit {

  /** Determines Edit Form */
  @Input() public isEditForm: boolean = false;

  /** This will set the data */
  @Input() public set copyItInfo(value: CopyItInfo) {
    if (value) {
      this._copyItInfo = { ...value };
      this.setAccountNumber(this._copyItInfo.isPrepopulateAccountNumber);
      // this.setAccountNumber(this._copyItInfo.accountNumber);
      this.setFiles(this._copyItInfo);
      this.requestInformationDetailsFormGroup =
        this.requestInformationDetailsPresenter.bindControlValue(
          this.requestInformationDetailsFormGroup, this._copyItInfo);
      if (value.copyItNumber) {
        this.requestInformationDetailsPresenter.setClientDisable(this.requestInformationDetailsFormGroup);
      }
    }
  }

  public get copyItInfo(): CopyItInfo {
    return this._copyItInfo;
  }

  /** This will set the data */
  @Input() public set clients(value: Client[]) {
    if (value) {
      this._clients = value;
    }
  }

  public get clients(): Client[] {
    return this._clients;
  }

  /** This will set the data */
  @Input() public set client(value: ClientMaster) {
    if (value) {
      this._client = value;
      this.isClient = true;
      this.updateInfoBasedOnClient(this.client);
      this.setTenants(value);
      this.requestInformationDetailsPresenter.bindControlValue(
        this.requestInformationDetailsFormGroup, { clientId: value.clientId });
    }
  }

  public get client(): ClientMaster {
    return this._client;
  }

  /** Get User list */
  @Input() public set usersList(value: CopyItUserList[]) {
    if (value) {
      this._usersList = value;
    }
  }

  public get usersList(): CopyItUserList[] {
    return this._usersList;
  }

  /** Get thte Defualt Configuration */
  @Input() public set defaultConfigurations(value: DefaultCopyItConfiguration) {
    if (value) {
      this._defaultConfigurations = value;
      this.requestInformationDetailsPresenter.bindControlValue(
        this.requestInformationDetailsFormGroup, this._defaultConfigurations);

      if (value.requestForId) {
        // restrict patch user detail if default available
        this.keepDefaultUserDetail = true;
        /** Load default selected requestor detail */
        const userId: number = value.requestForId;
        this.userId.emit(userId);
      }
    }
  }

  public get defaultConfigurations(): DefaultCopyItConfiguration {
    return this._defaultConfigurations;
  }

  /** Get the configurations */
  @Input() public set configurations(config: CopyItConfiguration) {
    if (config) {
      this._configurations = config;
      // this.setRoleWiseControls();
    }
  }
  public get configurations(): CopyItConfiguration {
    return this._configurations;
  }

  /** Get the Requestor Detail */
  @Input() public set requestorDetail(value: UserDetails) {
    if (value) {
      this.projectCodeList = value.projectCode;
    }
  }

  /** Get User list */
  @Input() public set userDetails(value: UserDetails) {
    if (value) {
      this._userDetails = value;
      this.projectCodeList = this._userDetails.projectCode;

      /**
       * patch user details if default value not exist only for first time 
       * or user manual selected
       */
      if (!this.keepDefaultUserDetail) {
        this.requestInformationDetailsPresenter.setUserDetails(
          this.requestInformationDetailsFormGroup, this._userDetails);
      }
      // reset flag to allow manual selection
      this.keepDefaultUserDetail = false;
    }
  }

  public get userDetails(): UserDetails {
    return this._userDetails;
  }

  /** Event emitter is used for emit client ID */
  @Output() public clientId: EventEmitter<number>;
  /** Event emitter is used for emit User Id */
  @Output() public userId: EventEmitter<number>;
  /** Event emitter is used for save CopyIt Info */
  @Output() public saveCopyItInfo: EventEmitter<CopyItInfo>;
  /** Event emitter is used for download file */
  @Output() public downloadFile: EventEmitter<FileResponse>;

  /** Determines isCilent or not */
  public isClient: boolean;
  /** Current role is requestor flag */
  public isRequestor: boolean;
  /** Current role is Manager flag */
  public isManager: boolean;
  /** Current role is SuperUser flag */
  public isSuperUser: boolean;
  /** It will store the Project code list */
  public projectCodeList: ProjectCode[];
  /** It will store the Request Information Form Data */
  public requestInformationFormData: CopyItInfo;
  /** Customer form group of customer form presentation component */
  public requestInformationDetailsFormGroup: FormGroup;
  /** Determines isFileUpload or not */
  public isFileUpload: boolean;
  /** Determines isShareFilePath or not */
  public isShareFilePath: boolean;
  /** Determines isAccountNumber or not */
  public isAccountNumber: boolean;
  /** isPriceQuote */
  public isPriceQuoteList: LableValuePair[];
  /** It will store the  isProof List */
  public isProofList: LableValuePair[];
  /** It will store the File Upload list */
  public fileUploadList: IdLabelPair[];
  /** Determines isTenants or not */
  public isTenants: boolean;
  /** Tenant List */
  public tenantList: IdLabelPair[];
  /** Determines isEditMode or not */
  public isEditMode: boolean;
  /** Phone number mask */
  public mask: Array<string | RegExp> = PHONE_MASK;
  /** Determines whether form submitted is ture or false */
  public get isFormSubmitted(): boolean {
    return this.requestInformationDetailsPresenter.isFormSubmitted;
  }
  /** Get the read only CopyIt Detail */
  public get readOnlyCopyItDetail(): CopyItInfo {
    return this.requestInformationDetailsFormGroup.getRawValue();
  }

  /** Private Variable */
  /** It will store the client list */
  private _clients: Client[];
  /** It will store the client details */
  private _client: ClientMaster;
  /** It will store the users list */
  private _usersList: CopyItUserList[];
  /** It will store the Default CopyIt Configuration */
  private _defaultConfigurations: DefaultCopyItConfiguration;
  /** It will store the User Deatils */
  private _userDetails: UserDetails;
  /** store copy it info value */
  private _copyItInfo: CopyItInfo;
  /** store copyit configuration */
  private _configurations: CopyItConfiguration;
  /** current userId */
  private currentUserId: number;
  private keepDefaultUserDetail: boolean;

  constructor(
    private requestInformationDetailsPresenter: RequestInformationDetailsFormPresenter,
    private route: ActivatedRoute,
    private coreDataService: CoreDataService,
    private policyService: AuthPolicyService,
    @Inject('Window') window: Window,
    zone: NgZone
  ) {
    super(window, zone);
    this.initProp();
    this.route.data.subscribe(e => {
      this.isEditMode = e.mode === 'add' ? false : true;
    })
  }

  public ngOnInit(): void {
    /** Load requestor detail if current user is requestor */
    if (this.isRequestor && !this.userDetails) {
      this.userId.emit(this.currentUserId);
    }
    this.baseNextStep$.pipe(takeUntil(this.destroy)).subscribe(
      (value: number) => {
        this.requestInformationDetailsPresenter.saveRequestInformationDetails(
          this.requestInformationDetailsFormGroup,
          this._clients, this.userDetails, this.copyItInfo);
      });
    // This will subscribe the save event and emit to container component
    this.requestInformationDetailsPresenter.save$.pipe(takeUntil(this.destroy)).subscribe((requestInformationDetails: CopyItInfo | any) => {
      this.saveCopyItInfo.next(requestInformationDetails);
    });

    this.requestInformationDetailsFormGroup.get('files').valueChanges.pipe(
      takeUntil(this.destroy)).subscribe((files: File[]) => {
        if (files) {
          this.requestInformationDetailsPresenter.setFileName(files, this.requestInformationDetailsFormGroup);
        }
      });
  }

  /**
   * Change method of client Dropdown
   * @param data
   */
  public onChangeClient(client: Client): void {
    this._usersList = [];
    this.projectCodeList = [];
    this.isFileUpload = false;
    this.isShareFilePath = false;
    this.tenantList = [];
    this.requestInformationDetailsPresenter.changeClient(this.requestInformationDetailsFormGroup);
    // on clientId change set isPrepopulateAccountNumber for Add mode
    this.updateInfoBasedOnClient(client);
    this.setTenants(client);
    this.clientId.emit(client.clientId);
  }

  /** update request info based on client details */
  public updateInfoBasedOnClient(client: Client | ClientMaster): void {
    // on clientId change set isPrepopulateAccountNumber for Add mode
    if (!this.isEditForm) {
      this.requestInformationDetailsPresenter.setAccountNumber(this.requestInformationDetailsFormGroup, client);
      this.setAccountNumber(this.readOnlyCopyItDetail.isPrepopulateAccountNumber);
    }
  }

  /**
   * Change method of users dropdown
   * @param data
   */
  public onchangeUser(user: CopyItUser): void {
    this.projectCodeList = [];
    this.requestInformationDetailsPresenter.userChange(this.requestInformationDetailsFormGroup);
    this.userId.emit(user.userId);
  }

  /**
   * Change method of projectCode dropdown
   * @param data
   */
  public onChangeProjectCode(data: ProjectCode): void {
    this.requestInformationDetailsPresenter.changeProjectCode(this.requestInformationDetailsFormGroup, data);
  }

  /**
   * onChangeFile
   */
  public onChangeFile(data: any): void {
    this.requestInformationDetailsPresenter.changeFile(this.requestInformationDetailsFormGroup);
  }

  /**
   * callback for changing rate-request type dropdown
   * @param data Id-Label pair
   */
  public onRateRequestTypeChange(data: IdLabelPair): void {
    this.requestInformationDetailsPresenter.changeRateRequestType(this.requestInformationDetailsFormGroup, data);
  }

  /** download file */
  public download(file): void {
    this.downloadFile.emit(file);
  }

  /** initProp */
  private initProp(): void {
    this.isClient = false;
    this.isRequestor = false;
    this.isEditMode = false;
    this.isFileUpload = false;
    this.isShareFilePath = false;
    this.isAccountNumber = false;
    this.isTenants = false;
    this.clientId = new EventEmitter();
    this.userId = new EventEmitter();
    this.saveCopyItInfo = new EventEmitter();
    this.downloadFile = new EventEmitter(true);
    this.isPriceQuoteList = COPYIT_OPTION_LIST;
    this.isProofList = COPYIT_OPTION_LIST;
    this.fileUploadList = FILE_UPLOAD_LIST;
    this.tenantList = RATE_REQUEST_TYPE;
    this.currentUserId = this.coreDataService.userInfo.userId;
    this.requestInformationDetailsFormGroup = this.requestInformationDetailsPresenter.buildForm();
    this.setRoleWiseControls();

    /** disable client selection if role is not super-user */
    if (!this.isSuperUser) {
      this.requestInformationDetailsPresenter.setClientDisable(this.requestInformationDetailsFormGroup);
    }
  }

  /** Check the wether account number or not */
  private setAccountNumber(accountNumber: boolean): void {
    if (accountNumber) {
      this.isAccountNumber = true;
    } else {
      this.isAccountNumber = false;
    }
  }

  /** Set Tenants */
  private setTenants(client: Client | ClientMaster): void {
    this.isTenants = client.tenants;
    this.tenantList = this.requestInformationDetailsPresenter.setTenants(client);
  }

  /** Set Files */
  private setFiles(copyItInfo: CopyItInfo): void {
    if (copyItInfo.fileOptionId === 1) {
      this.isFileUpload = true;
    } else if (copyItInfo.fileOptionId === 2) {
      this.isShareFilePath = true;
    }
  }

  /** enable/disable client, userName based on roles */
  private setRoleWiseControls(): void {
    this.isRequestor = this.policyService.isInRole(PolicyRoles.requestor);
    this.isManager = this.policyService.isInRole(PolicyRoles.manager);
    this.isSuperUser = this.policyService.isInRole(PolicyRoles.superUser);
  }
}

