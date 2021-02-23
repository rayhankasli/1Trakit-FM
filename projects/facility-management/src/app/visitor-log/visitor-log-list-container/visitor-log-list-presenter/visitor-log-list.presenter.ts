/** 
 * @author Rayhan Kasli.
 * @description VisitorLogpresenter service for VisitorLogpresentation component.
 */

import { ChangeDetectorRef, ComponentRef, Injectable, InjectionToken, Injector, NgZone, Renderer2 } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal, PortalInjector } from '@angular/cdk/portal';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { Observable } from 'rxjs/Observable';
// ----------------------------------------------------------- //
import { ConfirmationModalService, requiredFileType, TableProperty } from 'common-libs';
// ----------------------------------------------------------- //
import { validateSingleFileSize } from '../../../core/utility/validations';
import { convertFileToBase64, resetTableProps } from '../../../core/utility/utility';
import { BaseTablePresenter } from '../../../shared/base-presenter/base-table.presenter';
import { UploadPicture, VisitorLog, VisitorLogFilterRecord, VisitorLogSortRecord, VISITORLOG_FILTER, File_Upload_Info } from '../../visitor-log.model';
import { VisitorLogFilterPresentationComponent } from '../visitor-log-list-presentation/visitor-log-filter-presentation/visitor-log-filter.presentation';


/**
 * VisitorLogListPresenter
 */
@Injectable()
export class VisitorLogListPresenter extends BaseTablePresenter<VisitorLogFilterRecord>{


  /** Table prop$ of visitorLog list presenter */
  public tableProp$: Observable<TableProperty<VisitorLogFilterRecord>>;
  /** This property is used to store the VisitorLogs that has been retrieved from the API. */
  public visitorLogs: VisitorLog[];
  /** This property is used to store VisitorLog  of the selected VisitorLogs */
  public selectedVisitorLogs: Set<VisitorLog>;
  /** This property is used to store the criteria that are selected by the user */
  public tableProperty: TableProperty<VisitorLogFilterRecord>;
  /** Stores the current sorting order */
  public isAscending: boolean;
  /** The message that will be shown in template when no record found */
  public message: string;
  /** Stores the ID of the VisitorLog that needs to be deleted */
  public visitorLogId: number;
  /** This property is sue to store selected items. */
  public selectedItems: string[];
  /** set it true when user clicks on add button */
  public isAddVisitorLog: boolean;
  /** This property is used for subscribing the value of subject saveVisitorLog */
  public saveVisitorLog$: Observable<VisitorLog>;
  /** Bulk upload data observable */
  public uploadPicture$: Observable<UploadPicture>;

  /** Table prop of VisitorLoglist presenter */
  private tableProp: Subject<TableProperty<VisitorLogFilterRecord>>;
  /** VisitorLog data of visitorLog list presenter */
  private visitorLogData: Subject<VisitorLog[]>;
  /** This is used for save visitor log info object */
  private saveVisitorLog: Subject<VisitorLog>;
  /** This property is used to store filterData.  */
  private filterData: VisitorLogFilterRecord;
  /** This property is used to store sortData.  */
  private sortData: VisitorLogSortRecord;
  /** This property is used to store overlayRef. */
  private overlayRef: OverlayRef;
  /** Bulk upload data */
  private uploadPicture: Subject<UploadPicture>;
  /** Component ref of data table presentation component */
  private componentRef: ComponentRef<VisitorLogFilterPresentationComponent>;
  /** clientId */
  private clientId: number;

  constructor(
    public modalService: ConfirmationModalService,
    public renderer: Renderer2,
    public ngZone: NgZone,
    private fb: FormBuilder,
    private overlay: Overlay,
    private injector: Injector,
    private toast: ToastrService,
    private cdrRef: ChangeDetectorRef
  ) {
    super(modalService, renderer, ngZone)
    this.initProperty();
  }

  /*** This method is invoked when the user click on filter button. */
  public openFilter(): void {
    const overlayConfig: OverlayConfig = new OverlayConfig();
    overlayConfig.hasBackdrop = true;
    overlayConfig.backdropClass = '';
    this.overlayRef = this.overlay.create(overlayConfig);
    const injectionTokens: WeakMap<InjectionToken<VisitorLogFilterRecord>, VisitorLogFilterRecord>
      = new WeakMap<InjectionToken<VisitorLogFilterRecord>, VisitorLogFilterRecord>([
        [VISITORLOG_FILTER, this.filterData]
      ]);
    // use injection token for passing value.
    const injector2: PortalInjector = new PortalInjector(this.injector, injectionTokens);
    const portal: ComponentPortal<VisitorLogFilterPresentationComponent>
      = new ComponentPortal<VisitorLogFilterPresentationComponent>(VisitorLogFilterPresentationComponent, null, injector2);
    this.componentRef = this.overlayRef.attach(portal);
    this.overlayRef.backdropClick().subscribe(() => {
      this.overlayRef.detach();
    });
    this.componentRef.instance.filterData.subscribe((data: VisitorLogFilterRecord) => {
      this.sortData.sortBy = this.tableProperty.order;
      this.sortData.sortColumn = this.tableProperty.sort;
      this.selectedVisitorLogs = new Set();
      this.filterData = data;
      Object.keys(data).forEach((key: string) => { if (!data[key]) { delete data[key]; } });
      this.tableProperty = new TableProperty();
      this.tableProperty.filter = data;
      this.tableProperty.filter.clientId = this.clientId;
      this.tableProperty.sort = this.sortData.sortColumn;
      this.tableProperty.order = this.sortData.sortBy;
      this.setTableProperty(this.tableProperty);
    });
    this.componentRef.instance.clearFilter.subscribe(() => {
      this.filterData = null;
      this.overlayRef.detach();
      this.tableProperty.filter = undefined;
      this.tableProperty.filter = { clientId: this.clientId };
      this.setTableProperty(this.tableProperty);
    });
    this.componentRef.instance.closeFilter.subscribe(() => { this.overlayRef.detach() })
  }

  /**
   * Sets table data
   */
  public setTableData(): void {
    this.isAddVisitorLog = false;

    if (this.tableProperty.pageNumber > 0 && this.visitorLogs.length === 0) {
      return;
    } else if (this.visitorLogs.length === 0) {
      this.tableProperty = resetTableProps(this.tableProperty);
    }
    const userLength: number = this.visitorLogs.length;
    this.visitorLogData.next(this.visitorLogs);
    this.tableProperty = this.getTableProperty(this.tableProperty, userLength);
    this.tableProp.next(this.tableProperty);
  }

  /**
   * Filters apply
   * @param filter
   * @returns true if apply
   */
  public filterApply(filter: VisitorLogFilterRecord): boolean {
    if (filter.fromPeriod && filter.toPeriod) {
      return true;
    } else {
      return false;
    }
  }



  /**
   * it will show the add user form
   * @param user this is a user object
   */
  public addUserForm(visitorLogList: VisitorLog[]): void {
    this.isAddVisitorLog = true;
    visitorLogList && visitorLogList.forEach((item) => {
      item.isEdit = false;
    })
  }

  /**
   * it will show the user form for edit
   * @param user this is a user object
   */
  public editUserForm(visitorLog: VisitorLog, userList: VisitorLog[]): boolean {
    this.isAddVisitorLog = false;
    visitorLog.isEdit = true;

    userList && userList.forEach((item) => {
      if (item.visitorId !== visitorLog.visitorId) {
        item.isEdit = false;
      }
    });

    return this.isAddVisitorLog;
  }


  /**
   * it will hide the form on cancel click
   * @param user this is a user object
   */
  public cancelVisitorLogForm(visitorLog?: VisitorLog): boolean {
    if (visitorLog) {
      visitorLog.isEdit = false;
    } else {
      this.isAddVisitorLog = false;
    }
    return this.isAddVisitorLog
  }

  /**
   * used to call api for filter
   * @param filterData filter record 
   */
  public onFilterChange(filterData: any, isFilterApply: boolean): void {
    Object.keys(filterData).forEach((key: string) => {
      if (!filterData[key] && filterData[key] !== false || filterData[key] === -1) {
        delete filterData[key];
      }
    });
    this.clientId = filterData > 0 ? filterData : undefined;
    if (isFilterApply) {
      this.componentRef.instance.isClientChange = true;
    }
    this.tableProperty.filter = { clientId: this.clientId };
    this.tableProperty = resetTableProps(this.tableProperty);
    this.setTableProperty(this.tableProperty);
  }

  /** Generate form for bulk uploading users */
  public getUploadPictureForm(): FormGroup {
    return this.fb.group({
      actualImageName: [null],
      imageName: [null],
      imageExtension: [null],
      uploadPicture: [null, [validateSingleFileSize(2000), requiredFileType(['png', 'jpeg', 'jpg'])]]
    })
  }

  /** On file selection */
  public onUploadFileChange(event: Event, control: AbstractControl): void {
    if (event.target['value'] !== '') {
      const file: File = event.target['files'] && (event.target['files'] as FileList).item(0);
      control.patchValue(file);
      event.target['value'] = null;
    }
  }

  /** convertFileToBase64  */
  public convertFileToBase64(file: File, uploadPictureGroup: FormGroup): void {
    convertFileToBase64(file, uploadPictureGroup, 'imageName', 'actualImageName', 'imageExtension');
  }

  /** uploadPictures */
  public validateUploadPicture(uploadPictureBase64: string, uploadPictureForm: FormGroup): void {
    const uploadPicture: AbstractControl = uploadPictureForm.controls['uploadPicture'];
    if (uploadPicture.errors && uploadPicture.errors.requiredFileType) {
      this.toast.error(File_Upload_Info.File_Type);
    } else if (uploadPicture.errors && uploadPicture.errors.maxFileSize) {
      this.toast.error(File_Upload_Info.File_Size);
    } else {
      this.uploadPicture.next(uploadPictureForm.getRawValue());
    }
  }

  /** Initializes default properties for the component */
  private initProperty(): void {
    this.visitorLogs = [];
    this.isAscending = false;
    this.tableProperty = new TableProperty<VisitorLogFilterRecord>();
    this.sortData = new VisitorLogSortRecord();
    this.tableProp = new Subject();
    this.visitorLogData = new Subject<VisitorLog[]>();
    this.tableProp$ = this.tableProp.asObservable();
    this.saveVisitorLog = new Subject<VisitorLog>();
    this.saveVisitorLog$ = this.saveVisitorLog.asObservable();
    this.uploadPicture = new Subject<UploadPicture>();
    this.uploadPicture$ = this.uploadPicture.asObservable();
  }
}

