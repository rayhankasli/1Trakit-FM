/**
 * @author Rayhan Kasli.
 * @description This is data table desktop presentation component.To represent data in the desktop view.
 */
import { Component, ChangeDetectorRef, OnInit, OnDestroy, ViewChildren, QueryList, ChangeDetectionStrategy, Input, Output, EventEmitter, HostBinding, Inject, NgZone } from '@angular/core';
import { takeUntil } from 'rxjs/operators/takeUntil';
import { Subject } from 'rxjs/Subject';
import { SortingOrderDirective, SortingOrder } from 'common-libs';
//-----------------------------------------------------------------------------------------------------//
import { VisitorLogListPresentationBase } from '../../visitor-log-list-presentation-base/visitor-log-list.presentation.base';
import { VisitorLogListPresenter } from '../../visitor-log-list-presenter/visitor-log-list.presenter';
import { VisitorLog, UploadPicture } from '../../../visitor-log.model';
import { DATE_TIME_FORMAT } from 'projects/facility-management/src/app/core/utility/constants';
import { FormGroup } from '@angular/forms';
import { filter } from 'rxjs/operators';
import { Permission } from '../../../../core/enums/role-permissions.enum'
import { ActivatedRoute } from '@angular/router';
import { ArchiveModeService } from 'projects/facility-management/src/app/core/services/archive-mode/archive-mode.service';


/**
 * VisitorLogListDesktopPresentationComponent
 */
@Component({
  selector: 'trakit-visitor-log-list-desktop-ui',
  templateUrl: './visitor-log-list-desktop.presentation.html',
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class VisitorLogListDesktopPresentationComponent extends VisitorLogListPresentationBase implements OnInit, OnDestroy {

  @HostBinding('class') public class: string;
  /** This property is used to store the visitorLogList that has been retrieved from the API. */
  @Input() public set visitorLogList(value: VisitorLog[]) {
    if (value) {
      this._visitorLogList = value;
      this.changeDetection.detectChanges();
    }
  };

  public get visitorLogList(): VisitorLog[] {
    return this._visitorLogList;
  }

  /** This property is used to store the visitorLogList that has been retrieved from the API. */
  @Input() public set isAddVisitorLog(value: boolean) {
      this._isAddVisitorLog = value;
      this.changeDetection.detectChanges();
  };

  public get isAddVisitorLog(): boolean {
    return this._isAddVisitorLog;
  }

  /**
   * This enum is return users enum props.
   */
  public get visitorLogEnum(): typeof Permission.VisitorLog {
    return Permission.VisitorLog;
  }

  /** it wil used to emit event for edit click to parent component */
  @Output() public edit: EventEmitter<VisitorLog>;
  /** it wil used to emit event for edit click to parent component */
  @Output() public uploadPicture: EventEmitter<UploadPicture>;
  /** This property is used to store QueryList of SortingOrderDirective */
  @ViewChildren(SortingOrderDirective) public sortingColumns: QueryList<SortingOrderDirective>;
  
  /** uploadPictureForm */
  public uploadPictureForm: FormGroup;
  /** Date format for createdAt column */
  public readonly dateFormat: string = DATE_TIME_FORMAT;
  /** history */
  public isHistory: boolean;
  
  
  /** based on its state visitor log form will show or hide */
  private _isAddVisitorLog: boolean;

  /** user list presentation base */
  private _visitorLogList: VisitorLog[];
  /** user list presentation base */
  private visitorLog: VisitorLog;

  constructor(
    public visitorLogPresenter: VisitorLogListPresenter,
    public changeDetection: ChangeDetectorRef,
    public archiveModeService: ArchiveModeService,
    private routes: ActivatedRoute,
    @Inject('Window') window: Window,
    zone: NgZone
  ) {
    super(visitorLogPresenter, changeDetection, archiveModeService, window, zone);
    this.edit = new EventEmitter();
    this.uploadPicture = new EventEmitter();
    this.destroy = new Subject();
    this.uploadPictureForm = this.visitorLogPresenter.getUploadPictureForm();
    this.class = 'd-flex flex-column overflow-hidden';
  }

  public ngOnInit(): void {
   this.visitorLogPresenter.uploadPicture$.pipe(takeUntil(this.destroy)).subscribe((response: UploadPicture)=>{
    if(response) {
      response.visitorId = this.visitorLog.visitorId;
      this.uploadPicture.emit(response);
    } 
   });
   this.uploadPictureForm.get('uploadPicture').valueChanges.subscribe((data)=>{
      this.visitorLogPresenter.convertFileToBase64(data, this.uploadPictureForm);
    });
   this.uploadPictureForm.get('imageName').valueChanges.subscribe((data)=>{
      this.visitorLogPresenter.validateUploadPicture(data, this.uploadPictureForm);
    });
   if(this.routes.snapshot.routeConfig.path.toLowerCase() === 'history') {
      this.isHistory = true;
    }
  }

  /**
   * This method is invoked when the user clicks on sorting icons. It sets the sort related criteria and queries the server
   * to get the updated list of visitorLogs.
   * @param column The column on which sorting needs to be performed. 
   * @param sortingOrder The sort order by which the column needs to be sorted.
   */
  public onSortOrder(column: string, sortingOrder: SortingOrder): void {
    this.visitorLogPresenter.onSortOrder(column, sortingOrder, this.sortingColumns);
  }

  /**
   * when user click on edit button
   * @param user this is the visitor log object
   */
  public onEdit(visitorLog: VisitorLog): void {
    this.edit.emit(visitorLog);
  }

  /**
   * it will hide the form on cancel
   * @param user this is the user object
   */
  public onCancel(visitorLog?: VisitorLog): void {
    this.visitorLogPresenter.cancelVisitorLogForm(visitorLog);
  }

  /** On file selection */
  public onFileChange(event: Event): void {
    this.visitorLogPresenter.onUploadFileChange(event, this.uploadPictureForm.get('uploadPicture'));
  }

  /** uploadPictures */
  public uploadPictures(visitorLog: VisitorLog): void {
    this.visitorLog = visitorLog;
    document.getElementById('uploadPicture').click();
  }
  
}
