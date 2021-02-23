

/**
 * @name BookitPresentationComponent
 * @author Enter Your Name Here
 * @description This is a presentation component for bookitwhich contains the ui and business logic
 */

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Inject, NgZone, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthPolicyService } from 'auth-policy';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { debounceTime, map, tap } from 'rxjs/operators';
import { distinctUntilChanged } from 'rxjs/operators/distinctUntilChanged';
import { filter } from 'rxjs/operators/filter';
import { takeUntil } from 'rxjs/operators/takeUntil';
//-------------------------------------------------------------------------------//
import { FileOption } from '../../../core/model/file-option.model';
import { CoreDataService } from '../../../core/services/core-data.service';
import { DATE_FORMAT, FILE_OPTIONS, PHONE_MASK } from '../../../core/utility/constants';
import { FileOptions } from '../../../core/utility/enums';
import { Conversation } from '../../../shared/modules/custom-chat-box/models/custom-chat-box.model';
import { BookItRepeatByOption } from '../../models/bookit.enum';
import { BookIt, BookItFileResponse, Status, ClientAccountMaster } from '../../models/bookit.model';
import { BookItRoomLayoutSearchParams, BookItRoomSearchParams, } from '../../models/bookIt-rooms.model';
import { BookitFormPresenter } from '../bookit-form-presenter/bookit-form.presenter';
import { BaseBookItFormPresentation } from './base-bookit-form-presentation';

/** 
 * BookitFormPresentationComponent
 */
@Component({
  selector: 'app-bookit-form-ui',
  templateUrl: './bookit-form.presentation.html',
  viewProviders: [BookitFormPresenter],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BookitFormPresentationComponent extends BaseBookItFormPresentation implements OnInit {

  /** This variable is use to hold is edit or not  */
  public isEditmode$: Observable<boolean>;
  /** Determines whether form submitted */
  public isFormSubmitted: boolean = false;
  public submitEvent: number;
  /** fileUploadList */
  public fileUploadList: FileOption[];
  /** phone number mask */
  public mask: Array<string | RegExp> = PHONE_MASK;
  /** it will return all controls in form group */
  public get formControls(): any {
    return this.bookitFormGroup.controls;
  }

  /** get list of available status */
  public get filteredStatus(): Observable<Status[]> {
    return this._statusList;
  }

  public get disableChatBox(): boolean {
    return this.bookitPresenter.disableChatBox;
  }

  /** check archive mode true/false */
  public get isArchived(): boolean {
    return this.bookitPresenter.isArchived;
  }

  /** it will return all controls in child form group repeatsOn */
  public get repeatsOnControls(): any {
    let repeatsOnFormGroup: FormGroup = this.bookitFormGroup.controls.repeatsOn as FormGroup;
    return repeatsOnFormGroup.controls;
  }
  public get repeatsOnFormGroup(): any {
    return this.bookitFormGroup.controls.repeatsOn as FormGroup;
  }
  public get disableStatus(): boolean {
    return this.isArchived || (!this.policyService.hasPermission(this.bookItPermissions.changeStatus) && this.bookitPresenter.disableStatusForRequestor);
  }
  public get disableAssignTo(): boolean {
    return !this.policyService.hasPermission(this.bookItPermissions.changeAssignTo) || this.bookitPresenter.disableAssignTo;
  }
  public showAccountNumberDropdown: boolean;
  public isRecurring: boolean;
  public dateFormat: string = DATE_FORMAT;
  public get repeatByOptionEnum(): typeof BookItRepeatByOption {
    return BookItRepeatByOption;
  }
  public get bookItFormValue(): BookIt {
    return this.bookitFormGroup.getRawValue();
  }
  /** flag for whether user will upload file or not */
  public get isFileUpload(): boolean {
    return this.bookitPresenter.isFileUpload;
  }
  /* ChatBox Status */
  public get isChatBoxOpen(): boolean {
    return this.bookitPresenter.isChatBoxOpen;
  };

  public showDailyOptions$: Observable<boolean>;
  public showMonthlyOptions$: Observable<boolean>;
  public summaryLabel$: Observable<string>;
  public showRepeatOnOptions: boolean;
  public minuteStep: number;

  /** check if room api is already called */
  private isFirstRoomApiDispatched: boolean;
  /** check if room layout api is already called */
  private isFirstRoomLayoutApiDispatched: boolean;

  constructor(
    bookitPresenter: BookitFormPresenter,
    private cdrRef: ChangeDetectorRef,
    @Inject('Window') window: Window,
    zone: NgZone,
    policyService: AuthPolicyService,
    domSanitizer: DomSanitizer,
    coreDataService: CoreDataService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    super(window, zone, bookitPresenter, cdrRef, policyService, domSanitizer, coreDataService);
    this.isEditmode$ = of(false);
    this.isEditmode$ = this.route.data.pipe(map(item => item.mode === 'edit'));
    this.initProps();
    // this.onInitProps();
  }

  public ngOnInit(): void {
    // this.checkFormAccess();
    this.onInitProps();
    if (!this.isSuperUser) {
      this.bookitFormGroup.get('clientId').disable();
    }
    if (!this.isSuperUser && !this.route.snapshot.params.id) {
      this.bookitFormGroup.get('clientId').setValue(this.currentClient.clientId);
      this.onClientChange(this.currentClient, false);
      if (this.isRequestor) {
        this.bookitFormGroup.get('userId').setValue(this._userInfo.userId);
      }
      // this.searchParamsForRooms = {
      //   clientId: this.currentClient ? this.currentClient.clientId : null
      // }
    }
  }

  /** This is used to save the data */
  public saveBookit(): void {
    this.isFormSubmitted = true;
    this.submitEvent = (new Date()).getMilliseconds();
    this.bookitPresenter.saveBookit(this.bookitFormGroup, this.bookit, this.weekDays);
  }

  /** When user click on cancel */
  public cancel(): void {
    let path: string = '/bookit';
    if (this.isArchived) { path = '/archive/bookit'; }
    this.router.navigate([path], { relativeTo: this.route });
  }

  /**
   * onChangeFile
   */
  public onChangeFile(data: FileOption): void {
    this.bookitPresenter.onChangeFile(data.id, this.bookitFormGroup);
  }

  /** on room change */
  public onRoomChange(): void {
    this._roomLayouts = [];
    this.roomLayoutPath = null;
    this.bookitPresenter.onRoomChange(this.bookitFormGroup, this.bookit, this._roomLayouts, true);
  }

  /** when user changes repeats on days */
  public onRepeatsDayChange(): void {
    this.bookitPresenter.onRepeatsDayChange(this.repeatsOnFormGroup, this.weekDays);
  }

  /** Open chat box */
  public openChatBox(): void {
    this.bookitPresenter.openChatBox();
  }

  /** download file */
  public download(file: BookItFileResponse): void {
    this.downloadFile.emit(file);
  }

  /** export copyit detail to PDF */
  public exportCopyItDetailToPDF(): void {
    this.exportToPDF.emit();
  }

  /** validate status drop-down change before raising event */
  public validateStatusChange(status: Status): void {
    // if (this.bookitPresenter.validateStatus(status.statusId)) {
    this.status = status.statusId;
    this.onStatusChange(status);
    // }
  }

  /** print copyit detail */
  public printCopyItDetail(): void {
    this.printBookItPDF.emit(this.bookItId);
  }

  /** set client-account-number for the selected client-account-detail */
  public setAccountNo(data: ClientAccountMaster): void {
    this.bookitFormGroup.get('clientAccount').setValue(data.accountNo);
  }

  /** initialize the all properties */
  private initProps(): void {
    this.minuteStep = 15;
    this.fileUploadList = FILE_OPTIONS;
    this.loadConversation = new EventEmitter<boolean>(true);
    this.sendMessage = new EventEmitter<Conversation>();
    this.setStatus = new EventEmitter<number>();
    this.printBookItPDF = new EventEmitter(true);

    this.bookitFormGroup = this.bookitPresenter.buildForm();
    this._statusList = this.bookitPresenter.statusList$;
  }

  /** initialize props on ngOnInit */
  private onInitProps(): void {
    this.bookitPresenter.onChangeFile(FileOptions.UPLOAD_FILE, this.bookitFormGroup);
    this.controlValueChanges();
    // This will subscribe the save event and emit to container component
    this.bookitPresenter.add$.pipe(takeUntil(this.destroy)).subscribe((bookit: BookIt) => {
      if (this.bookit) {
        this.update.emit(bookit);
      } else {
        this.add.emit(bookit);
      }
    });

    this.bookitPresenter.getRooms$.pipe(takeUntil(this.destroy)).subscribe((searchValue: BookItRoomSearchParams) => {
      this.isFirstRoomApiDispatched = true;
      this.getRooms.emit(searchValue);
    });
    this.bookitPresenter.loadConversation$.pipe(takeUntil(this.destroy)).subscribe(() => this.loadConversation.emit(true));
    this.bookitPresenter.sendMessage$.pipe(takeUntil(this.destroy)).subscribe((message: Conversation) => this.sendMessage.emit(message));
    this.bookitPresenter.setAssignTo$.pipe(takeUntil(this.destroy)).subscribe((assignTo: number) => {
      this.assignee = assignTo;
      this.setAssignTo.emit(assignTo);
    });
    this.bookitPresenter.setStatus$.pipe(takeUntil(this.destroy), distinctUntilChanged()).subscribe((statusId: number) => {
      this.status = statusId;
      this.setStatus.emit(statusId);
    });

    this.bookitPresenter.clearRooms$.pipe(takeUntil(this.destroy)).subscribe(() => {
      this._rooms = [];
      this._roomLayouts = [];
    });

    this.bookitPresenter.getUsersByClientId$.pipe(takeUntil(this.destroy)).subscribe((clientId: number) => {
      if (clientId) {
        this.getUsersByClientId.emit(clientId);
      }
    });

    this.bookitPresenter.getAccountNumber$.pipe(takeUntil(this.destroy)).subscribe((clientId: number) => {
      if (clientId) {
        this.showAccountNumberDropdown = true;
        this.getAccountNumber.emit(clientId);
      }
    });

    this.bookitPresenter.clearAccountNumbers$.pipe(takeUntil(this.destroy)).subscribe(() => {
      this.showAccountNumberDropdown = false;
      this._accountNumbers = [];
    });

    this.bookitPresenter.getRoomLayouts$.pipe(takeUntil(this.destroy)).subscribe((clientId: BookItRoomLayoutSearchParams) => {
      this.isFirstRoomLayoutApiDispatched = true;
      this.getRoomLayouts.emit(clientId);
    });

    this.showDailyOptions$ = this.bookitPresenter.showDailyOptions$;
    this.showMonthlyOptions$ = this.bookitPresenter.showMonthlyOptions$;
    this.summaryLabel$ = this.bookitPresenter.summaryLabel$;
  }

  /** subscribe the control value */
  private controlValueChanges(): void {
    const searchPropsList: string[] = this.bookitPresenter.getRoomSearchPropsList();
    if (searchPropsList) {
      for (const key of searchPropsList) {
        this.formControls[key].valueChanges.pipe(
          takeUntil(this.destroy), tap((value: string) => {
            if (key === 'date' && this.formValue.clientId) {
              this.bookitPresenter.recurringEnableDisable(value, this.bookitFormGroup, this.repeatsOnControls, this.weekDays, this.formValue.date);
            }
          }),
          filter((value: string | number | Date) => this.bookitPresenter.isValueChanged(key, value, this.searchParamsForRooms))).subscribe((value: string | number | Date) => {
            if (!this.searchParamsForRooms) {
              this.searchParamsForRooms = {
                [key]: value
              }
            } else {
              this.searchParamsForRooms[key] = value;
            }
            this._rooms = [];
            this._roomLayouts = [];
            this.bookitFormGroup.get('roomId').setValue(null);
            if (this.isFirstRoomApiDispatched && this._bookit) {
              this._bookit.roomId = null;
            }
            this.bookitFormGroup.get('roomLayoutId').setValue(null);
            if (this.isFirstRoomLayoutApiDispatched && this._bookit) {
              this._bookit.roomLayoutId = null;
            }
            this.bookitPresenter.getRoomBySearchProps(this.searchParamsForRooms);
          });
      }
    }

    this.setControlValueChanges();
  }

  /** Set Control Value Changes */
  private setControlValueChanges(): void {
    this.formControls.isRecurring.valueChanges.pipe(takeUntil(this.destroy)).subscribe((value: boolean) => {
      this.showRepeatOnOptions = value;
      this.bookitPresenter.onRecurringChange(value, this.repeatsOnControls, this.repeatsOnFormGroup)
    });

    this.repeatsOnControls.recurringId.valueChanges.pipe(takeUntil(this.destroy)).subscribe((value: number) => {
      this.bookitPresenter.onRepeatsOnChange(
        value, this.bookitFormGroup.get('repeatsOn') as FormGroup,
        this.weekDays, this.formValue.date);
    });

    this.repeatsOnControls.repeatBy.valueChanges.pipe(takeUntil(this.destroy)).subscribe((value: BookItRepeatByOption) => {
      this.bookitPresenter.onRepeatsByChange(value, this.formValue.date);
    });

    this.formControls.noOfPeople.valueChanges.pipe(
      takeUntil(this.destroy),
      filter((value: number) => this.formValue.roomId !== null && this.formValue.roomLayoutId !== undefined),
      debounceTime(100)).subscribe((value: number) => {
        if (this.bookitFormGroup && this.bookitFormGroup.value.roomId) {
          this.onRoomChange();
        }
      });

    this.bookitFormGroup.get('files').valueChanges.pipe(takeUntil(this.destroy)).subscribe(
      (file: File[]) => {
        this.setFileName(file);
      });
  }

  /** it will set the fileName */
  private setFileName(files: any[]): void {
    if (files) {
      let name: string[] = files.map((file: File) => {
        return file.name;
      });
      this.bookitFormGroup.get('fileName').setValue(name.filter(name => name !== undefined));
    } else {
      this.bookitFormGroup.get('fileName').setValue(null);
    }
  }
}

