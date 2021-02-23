/** 
 * @author Rayhan Kasli.
 * @description TaskReportpresenter service for TaskReportpresentation component.
 */

import { Injectable, Renderer2,  NgZone, ComponentRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OverlayRef, Overlay } from '@angular/cdk/overlay';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
// ---------------------------------------------- //
import { TableProperty, ConfirmationModalService } from 'common-libs';
// ---------------------------------------------- //
import { TaskReport, TaskReportFilterRecord } from '../../report-task.model';
import { GalleryPresentationComponent } from '../../../../shared/components/gallery/gallery-presentation/gallery-presentation.component';
import { openGalleryModal, resetTableProps } from '../../../../core/utility/utility';
import { Pictures } from '../../../../core/model/common.model';
import { ReportDateRangeFilterBasePresenter } from 'projects/facility-management/src/app/core/base-classes/report-date-range-filter.base';

/**
 * TaskReportListPresenter
 */
@Injectable()
export class TaskReportListPresenter extends ReportDateRangeFilterBasePresenter {
  
  /** Table prop$ of taskReport list presenter */
  public tableProp$: Observable<TableProperty>;

  /** This property is used to store the TaskReports that has been retrieved from the API. */
  public taskReports: TaskReport[];

  /** This property is used to store TaskReport  of the selected TaskReports */
  public selectedTaskReports: Set<TaskReport>;

  /** This property is used to store the criteria that are selected by the user */
  public tableProperty: TableProperty;

  /** Stores the current sorting order */
  public isAscending: boolean;

  /** The message that will be shown in template when no record found */
  public message: string;

  /** Stores the ID of the TaskReport that needs to be deleted */
  public taskReportId: number;

  /** This property is sue to store selected items. */
  public selectedItems: string[];

  /** Bs config of customer form presentation component */
  public minDate: Date;

  /** isFormSubmitted */
  public isFormSubmitted: boolean;

  /** This property is used to store overlayRef. */
  private overlayRef: OverlayRef;

  /** Table prop of TaskReportlist presenter */
  private tableProp: Subject<TableProperty>;

  /** Component ref of data table presentation component */
  private componentRef: ComponentRef<GalleryPresentationComponent>;
  /** TaskReport data of taskReport list presenter */
  private taskReportData: Subject<TaskReport[]>;

  /** This property is used to store filterData. */
  private filterData: TaskReportFilterRecord;
 
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
  public buildForm(): FormGroup {
      return this.formBuilder.group({
          startDate: [this.startDate, [Validators.required]],
          endDate: [this.endDate, [Validators.required]]
      })
  }


  /** openGallery */
  public openGallery(images: Pictures[]): void {
    openGalleryModal(images,this.overlay);
  }

   /** Set Client Id */
  public clientChange(clientId?: number): void {
    if (clientId > 0) {
      this.clientId = clientId;
      let filterData: TaskReportFilterRecord = { clientId: this.clientId, startDate: this.filterData.startDate, endDate: this.filterData.endDate };
      this.tableProperty.filter = filterData;
    } else {
      let filterData: TaskReportFilterRecord = { startDate: this.filterData.startDate, endDate: this.filterData.endDate };
      this.tableProperty.filter = filterData;
    }
    this.setTableProperty(this.tableProperty);
  }

 
  
  /** Sets table data */
  public setTableData(): void {
    if (this.tableProperty.pageNumber > 0 && this.taskReports.length === 0) {
      return;
    } else if (this.taskReports.length === 0) {
      this.tableProperty.pageNumber = 0;
    }
    const taskReportLength: number = this.taskReports.length;
    this.taskReportData.next(this.taskReports);
    this.tableProperty = this.getTableProperty(this.tableProperty, taskReportLength);
    this.tableProp.next(this.tableProperty);
  }

  /**
   * used to call api for filter
   * @param filterData filter record 
   */
  public taskFilter(formGroup: FormGroup): void {
    if (formGroup.valid) {
      this.isFormSubmitted = false;
      let filterData: TaskReportFilterRecord = formGroup.value;
      this.filterData = filterData;
      Object.keys(filterData).forEach((key: string) => {
        if (!filterData[key] && filterData[key] !== false) {
          delete filterData[key];
        }
      });
      this.tableProperty.filter = { clientId: this.clientId, ...filterData };
      this.tableProperty = resetTableProps(this.tableProperty);
      if (!this.clientId) {
        delete this.tableProperty.filter['clientId'];
      }
      this.setTableProperty(this.tableProperty);
    } else {
      this.isFormSubmitted = true;
    }
  }

  /** Initializes default properties for the component */
  private initProperty(): void {
    this.filterData = { startDate: this.startDate, endDate: this.endDate };
    this.taskReports = [];
    this.selectedTaskReports = new Set();
    this.isAscending = false;
    this.tableProperty = new TableProperty<TaskReportFilterRecord>();
    this.tableProperty.filter = new TaskReportFilterRecord(this.clientId, this.startDate, this.endDate);
    this.selectedItems = [];
    this.tableProp = new Subject();
    this.taskReportData = new Subject();
    this.tableProp$ = this.tableProp.asObservable();
  }
}

