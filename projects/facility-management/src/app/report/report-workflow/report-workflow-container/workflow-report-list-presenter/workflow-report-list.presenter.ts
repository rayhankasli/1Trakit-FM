/** 
 * @author Enter Your Name Here.
 * @description WorkflowReportpresenter service for WorkflowReportpresentation component.
 */

import { Injectable, Renderer2, NgZone, ComponentRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Overlay } from '@angular/cdk/overlay';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
// ---------------------------------------------------------- //
import { TableProperty, ConfirmationModalService } from 'common-libs';
// ---------------------------------------------------------- //
import { WorkflowReportList, WorkflowReportFilterRecord } from '../../report-workflow.model';
import { ReportDateRangeFilterBasePresenter } from '../../../../core/base-classes/report-date-range-filter.base';
import { WorkflowFilterRecord } from '../../../../workflow-configurations/workflow-configurations.model';
import { openGalleryModal, resetTableProps } from '../../../../core/utility/utility';
import { Pictures } from '../../../../core/model/common.model';
/**
 * WorkflowReportListPresenter
 */
@Injectable()
export class WorkflowReportListPresenter extends ReportDateRangeFilterBasePresenter {

  /** Table prop$ of workflowReport list presenter */
  public tableProp$: Observable<TableProperty<WorkflowFilterRecord>>;

  /** This property is used to store the WorkflowReports that has been retrieved from the API. */
  public workflowReports: WorkflowReportList[];

  /** This property is used to store WorkflowReport  of the selected WorkflowReports */
  public selectedWorkflowReports: Set<WorkflowReportList>;

  /** This property is used to store the criteria that are selected by the user */
  public tableProperty: TableProperty;

  /** Stores the current sorting order */
  public isAscending: boolean;

  /** This property is sue to store selected items. */
  public selectedItems: string[];

  /** Bs config of customer form presentation component */
  public minDate: Date;

  /** isFormSubmitted */
  public isFormSubmitted: boolean;

  /** Table prop of WorkflowReportlist presenter */
  private tableProp: Subject<TableProperty<WorkflowFilterRecord>>;

  /** WorkflowReport data of workflowReport list presenter */
  private workflowReportData: Subject<WorkflowReportList[]>;

  /** This property is used to store filterData. */
  private filterData: WorkflowReportFilterRecord;

  /** clientId */
  private clientId: number;

  constructor(
    public renderer: Renderer2,
    public ngZone: NgZone,
    public modalService: ConfirmationModalService,
    private overlay: Overlay,
    private formBuilder: FormBuilder
  ) {
    super()
    this.initProperty();
  }

  /** Build Filter Form */
  public buildFilterForm(): FormGroup {
    return this.formBuilder.group({
      startDate: [this.startDate, [Validators.required]],
      endDate: [this.endDate, [Validators.required]]
    })
  }

  /** Set Client Id */
  public clientChange(clientId?: number): void {
    if (clientId > 0) {
      this.clientId = clientId;
      let filterData: WorkflowReportFilterRecord = { clientId: this.clientId, startDate: this.filterData.startDate, endDate: this.filterData.endDate };
      this.tableProperty.filter = filterData;
      this.setTableProperty(this.tableProperty);
    }
  }

  /**
   * This method are set null end date and set start date in the mindate 
   * @param formGroup Get the filter form group
   * @param startDate Get the start date
   */
  public setWorkflowStartDate(formGroup: FormGroup, startDate: Date): void {
    this.setStartDate(formGroup, startDate);
  }

  /**
   * used to call api for filter
   * @param filterData filter record 
   */
  public workflowFilter(formGroup: FormGroup): void {
    if (formGroup.valid) {
      this.isFormSubmitted = false;
      let filterData: WorkflowReportFilterRecord = formGroup.value;

      this.filterData = filterData;
      Object.keys(filterData).forEach((key: string) => {
        if (!filterData[key] && filterData[key] !== false) {
          delete filterData[key];
        }
      });

      this.tableProperty.filter = { clientId: this.clientId, ...filterData };
      this.tableProperty = resetTableProps(this.tableProperty);
      this.setTableProperty(this.tableProperty);
    } else {
      this.isFormSubmitted = true;
    }
  }

  /**
   * Sets table data
   */
  public setTableData(): void {
    if (this.tableProperty.pageNumber > 0 && this.workflowReports.length === 0) {
      // this.toaster.info('No more records found', 'alert');
      return;
    } else if (this.workflowReports.length === 0) {
      this.tableProperty.pageNumber = 0;
    }
    const workflowReportLength: number = this.workflowReports.length;
    this.workflowReportData.next(this.workflowReports);
    this.tableProperty = this.getTableProperty(this.tableProperty, workflowReportLength);
    this.tableProp.next(this.tableProperty);
  }


  /** openGallery */
  public openGallery(images: Pictures[]): void {
    openGalleryModal(images, this.overlay);
  }

  /**
   * Sorts apply
   * @param sort 
   * @returns true if apply 
   */
  public sortApply(sort: string): boolean {
    if (sort) {
      return true;
    } else {
      return false;
    }
  }

  /** Initializes default properties for the component */
  private initProperty(): void {
    this.filterData = { startDate: this.startDate, endDate: this.endDate };
    this.workflowReports = [];
    this.selectedWorkflowReports = new Set();
    this.isAscending = false;
    this.tableProperty.filter = new WorkflowReportFilterRecord(this.clientId, this.startDate, this.endDate);
    this.selectedItems = [];
    this.tableProp = new Subject();
    this.workflowReportData = new Subject();
    this.tableProp$ = this.tableProp.asObservable();
  }
}

