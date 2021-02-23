
/**
 * @author Rayhan Kasli
 * @description This is data table presentation component.To represent get data from container component and render to dom.
 */
import {
  Component, OnInit, ViewChildren, QueryList, Input, Output, EventEmitter, ChangeDetectionStrategy, OnDestroy,
  ViewContainerRef, ViewChild, ChangeDetectorRef, HostBinding, Inject, NgZone
} from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/operators/takeUntil';
// ---------------------------------------------------------- //
import { TableProperty, SortingOrderDirective, pageCount } from 'common-libs';
import { VisitorLog, VisitorLogFilterRecord, UploadPicture, VisitorLogListResult } from '../../visitor-log.model';
import { VisitorLogListPresenter } from '../visitor-log-list-presenter/visitor-log-list.presenter';
import { VisitorLogListPresentationBase } from '../visitor-log-list-presentation-base/visitor-log-list.presentation.base';
import { Permission } from '../../../core/enums/role-permissions.enum';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ArchiveModeService } from '../../../core/services/archive-mode/archive-mode.service';

/**
 * VisitorLogListPresentationComponent
 */
@Component({
  selector: 'trakit-visitor-log-list-ui',
  templateUrl: './visitor-log-list.presentation.html',
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [VisitorLogListPresenter]
})
export class VisitorLogListPresentationComponent extends VisitorLogListPresentationBase implements OnInit, OnDestroy {

  @HostBinding('class') public class: string;
  /** This property is used for get data from container component */
  @Input() public set baseResponse(value: VisitorLogListResult) {
    if (value) {
      this._baseResponse = {...value}
      this.setTableData();
    }
  };
  public get baseResponse(): VisitorLogListResult {
    return this._baseResponse;
  }


  /**
   * This enum is return users enum props.
   */
  public get visitorLogEnum(): typeof Permission.VisitorLog {
    return Permission.VisitorLog;
  }

  /** This property is used for emit data to container component */
  @Output() public getVisitorLog: EventEmitter<TableProperty<VisitorLogFilterRecord>>;
  /** This property is used for emit data to container component */
  @Output() public deleteVisitorLog: EventEmitter<number>;
  /** This property is used for emit data to container component */
  @Output() public client: EventEmitter<number>;
  /** it wil used to emit event for edit click to parent component */
  @Output() public uploadPicture: EventEmitter<UploadPicture>;
  /** it wil used to emit event for edit click to parent component */
  @Output() public exportExcelData: EventEmitter<number>;
  /** View child of customer list presentation component */
  @ViewChild('container', { read: ViewContainerRef, static: false }) public container: ViewContainerRef;
  /** This property is used to store QueryList of SortingOrderDirective */
  @ViewChildren(SortingOrderDirective) public sortingColumns: QueryList<SortingOrderDirective>;
  
  /** for group for  */
  public clientFormControl: FormControl = new FormControl();
  /** This property is used to store the selected VisitorLogs */
  public selectedVisitorLogs: Set<VisitorLog>;
  /** This property is used to store the criteria that are selected by the user */
  public tableProperty: TableProperty<VisitorLogFilterRecord>;
  /** This property is used to store the options that are available in the Page Size selection drawdown */
  public pageSize: number[];
  /** This boolean is used to indicate whether all rows are selected or not  */
  public isCheckAll: boolean;
  /** Table prop of customer list presentation component */
  public tableProp: Subject<TableProperty<VisitorLogFilterRecord>>;
  /** This property is used for checking filter applied or not. */
  public isFilterApply: boolean;
  /** history */
  public isHistory: boolean;

  /** based on its state visitor log form wilm show or hide */
  public get isAddVisitorLog(): boolean {
    return this.visitorLogPresenter.isAddVisitorLog;
  }

  /** create for getter setter */
  private _baseResponse: VisitorLogListResult;
  /** _clientId */
  private clientId: number;
 
  constructor(
    public visitorLogPresenter: VisitorLogListPresenter,
    public archiveModeService: ArchiveModeService,
    public changeDetection: ChangeDetectorRef, private routes: ActivatedRoute,
    @Inject('Window') window: Window,
    public zone: NgZone) {
    super(visitorLogPresenter, changeDetection, archiveModeService, window, zone);
    this.initProperty();
    this.class = 'd-flex flex-column h-100 overflow-hidden';
  }

  public ngOnInit(): void {
    this.visitorLogPresenter.setTableProp$.pipe(takeUntil(this.destroy)).subscribe((tableProperty: TableProperty<VisitorLogFilterRecord>) => {
      this.getVisitorLog.emit(tableProperty);
      this.tableProperty = tableProperty;
    });
    this.visitorLogPresenter.deleteRecord$.pipe(takeUntil(this.destroy)).subscribe((visitor: VisitorLog) => {
      this.deleteVisitorLog.emit(visitor.visitorId);
    });
    this.visitorLogPresenter.tableProp$.subscribe((value: TableProperty<VisitorLogFilterRecord>) => {
      this.tableProperty = value;
    });

    this.clientFormControl.valueChanges.pipe(takeUntil(this.destroy)).subscribe(
      (value: any) => {
        this.onFilterChange(value);
        this.clientId = value > 0 ? value : 0;
      }
    );

    if(this.routes.snapshot.routeConfig.path.toLowerCase() === 'history') {
      this.isHistory = false;
    }
  }

  /**
   * Sets table data
   */
  public setTableData(): void {
    this.isFilterApply = this.visitorLogPresenter.filterApply(this.tableProperty.filter);
    this.visitorLogPresenter.visitorLogs = this._baseResponse.visitorlogList;
    this.visitorLogPresenter.setTableData();
  }

  /**
   * when user clicks on add button
   */
  public addVisitorLogForm(): void {
    this.client.emit(this.clientId);
    this._baseResponse && this._baseResponse.visitorlogList && this.visitorLogPresenter.addUserForm(this._baseResponse.visitorlogList);
    this.changeDetection.detectChanges();
  }

  /**
   * when user will clicks on edit button
   * @param user this is a user data object
   */
  public editVisitorLogForm(visitorLog: VisitorLog): void {
    this.client.emit(this.clientId);
    this.visitorLogPresenter.editUserForm(visitorLog, this._baseResponse.visitorlogList);
    this.changeDetection.detectChanges();
  }

  /** uploadPictures  */
  public uploadPictures(image: UploadPicture): void {
    this.uploadPicture.emit(image);
  }

  /** exportData */
  public exportData(): void {
    this.exportExcelData.emit(this.clientId);
  }

  /**
   * called on filter value change
   * @param filterValue filter record
   */
  private onFilterChange(clientId: VisitorLogFilterRecord): void {
    this.visitorLogPresenter.onFilterChange(clientId,this.isFilterApply);
  }

  /** Initializes default properties for the component */
  private initProperty(): void {
    this.tableProp = new Subject();
    this.tableProperty = new TableProperty();
    this.pageSize = pageCount;
    this.destroy = new Subject();
    this.getVisitorLog = new EventEmitter<TableProperty<VisitorLogFilterRecord>>();
    this.deleteVisitorLog = new EventEmitter<number>();
    this.client = new EventEmitter<number>();
    this.uploadPicture = new EventEmitter();
    this.exportExcelData = new EventEmitter();
    this.isHistory = true;
  }
}

