
/**
 * @author YOUR_NAME_HERE
 * @description This is data table presentation component.To represent get data from container component and render to dom.
 */
import {
  ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy,
  OnInit, Output, QueryList, ViewChild, ViewChildren, ViewContainerRef
} from '@angular/core';
import { BreakpointState } from '@angular/cdk/layout';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { takeUntil } from 'rxjs/operators/takeUntil';
import { Subject } from 'rxjs/Subject';
// ---------------------------------------------------------- //
import { pageCount, SortingOrderDirective, TableProperty } from 'common-libs';
// ---------------------------------------------------------- //
import { Permission } from '../../../../core/enums/role-permissions.enum';
import { MailReport, MailReportFilterRecord, MailReportListResponse } from '../../report-mail.model';
import { MailReportListPresentationBase } from '../mail-report-list-presentation-base/mail-report-list.presentation.base';
import { MailReportListPresenter } from '../mail-report-list-presenter/mail-report-list.presenter';

/**
 * MailReportListPresentationComponent
 */
@Component({
  selector: 'app-mail-report-list-ui',
  templateUrl: './mail-report-list.presentation.html',
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [MailReportListPresenter]
})
export class MailReportListPresentationComponent extends MailReportListPresentationBase implements OnInit, OnDestroy {

  @Input() public set clientId(clientId: number) {
    if (clientId) {
      this.mailReportPresenter.clientChange(clientId);
    }
  }
  /** This property is used for get data from container component */
  @Input() public set baseResponse(baseResponse: MailReportListResponse) {
    if (baseResponse) {
      this._baseResponse = baseResponse;
      this.setTableData();
    }
  };
  public get baseResponse(): MailReportListResponse {
    return this._baseResponse;
  }

  /** This property is used for emit filter data to container component */
  @Output() public filterMailReport: EventEmitter<TableProperty<MailReportFilterRecord>>;
  /** This property is used for emit data to container component */
  @Output() public exportExcelData: EventEmitter<TableProperty<MailReportFilterRecord>>;

  /**
   * View child of customer list presentation component
   */
  @ViewChild('container', { read: ViewContainerRef, static: true }) public container: ViewContainerRef;

  /** This property is used to store QueryList of SortingOrderDirective */
  @ViewChildren(SortingOrderDirective) public sortingColumns: QueryList<SortingOrderDirective>;

  /** filterTaskFormGroup */
  public filterTaskFormGroup: FormGroup;

  /** This property is used to store the criteria that are selected by the user */
  public tableProperty: TableProperty<MailReportFilterRecord>;

  /** This property is used to store the options that are available in the Page Size selection drawdown */
  public pageSize: number[];

  /** This boolean is used to indicate whether all rows are selected or not  */
  public isCheckAll: boolean;

  /** Table prop of customer list presentation component */
  public tableProp: Subject<TableProperty<MailReportFilterRecord>>;

  /** isMobile property for mobile screen or not */
  public isMobile: Observable<BreakpointState>;

  /** This property is used for checking filter applied or not. */
  public isFilterApply: boolean;

  /** This property is used for checking sort applied or not. */
  public isSortApply: boolean;

  /** Determines whether form submitted is ture or false */
  public get isFormSubmitted(): boolean {
    return this.mailReportPresenter.isFormSubmitted;
  }
  public get ReportMailPermission(): typeof Permission.ReportsMail {
    return Permission.ReportsMail;
  }

  /** Determines whether form submitted is ture or false */
  public get minDate(): Date {
    return this.mailReportPresenter.minDate;
  }
  public get mailReports(): MailReport[] {
    return this.mailReportPresenter.mailReports;
  }

  public total: number;

  /** create for getter setter */
  private _baseResponse: MailReportListResponse;

  /** create for  */
  private destroy: Subject<boolean>;

  constructor(
    public mailReportPresenter: MailReportListPresenter,
    public changeDetection: ChangeDetectorRef,
  ) {
    super(mailReportPresenter, changeDetection);
    this.initProperty();
  }

  public ngOnInit(): void {
    this.mailReportPresenter.setTableProp$.pipe(takeUntil(this.destroy)).subscribe((tableProperty: TableProperty) => {
      this.filterMailReport.emit(tableProperty);
      this.tableProperty = tableProperty;
    });

    this.filterTaskFormGroup.get('startDate').valueChanges.subscribe((startDate: Date) => {
      if (startDate) {
        this.mailReportPresenter.onStartDateChange(this.filterTaskFormGroup, startDate);
      }
    });
  }

  /**
   * Sets table data
   */
  public setTableData(): void {
    this.mailReportPresenter.mailReports = this.baseResponse.data;
    this.total = this.baseResponse.totalCount;
    this.mailReportPresenter.setTableData();
  }

  /** onSerach */
  public onSearch(searchTerm: string): void {
    this.mailReportPresenter.onSearch(searchTerm);
  }
  /** applyFilter */
  public applyTaskFilter(): void {
    this.mailReportPresenter.taskFilter(this.filterTaskFormGroup);
  }

  /** exportExcel */
  public exportExcel(): void {
    this.exportExcelData.emit(this.tableProperty);
  }

  /** destroy */
  public ngOnDestroy(): void {
    this.destroy.next(true);
    this.destroy.unsubscribe();
  }

  /** Initializes default properties for the component */
  private initProperty(): void {
    this.filterTaskFormGroup = this.mailReportPresenter.buildForm()
    this.isCheckAll = false;
    this.tableProp = new Subject();
    this.tableProperty = new TableProperty();
    this.pageSize = pageCount;
    this.destroy = new Subject();
    this.filterMailReport = new EventEmitter<TableProperty<MailReportFilterRecord>>(true);
    this.exportExcelData = new EventEmitter(true);
  }
}
