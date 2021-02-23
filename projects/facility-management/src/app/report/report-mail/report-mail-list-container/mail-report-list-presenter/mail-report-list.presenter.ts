import { Overlay } from '@angular/cdk/overlay';
/** 
 * @author Enter Your Name Here.
 * @description MailReportpresenter service for MailReportpresentation component.
 */

import { Injectable, NgZone, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// ---------------------------------------------- //
import { ConfirmationModalService, TableProperty } from 'common-libs';
// ---------------------------------------------- //
import { Pictures } from '../../../../core/model/common.model';
import { openGalleryModal, resetTableProps } from '../../../../core/utility/utility';
import { BaseTablePresenter } from '../../../../shared/base-presenter/base-table.presenter';
import { MailReport, MailReportFilterRecord } from '../../report-mail.model';

/**
 * MailReportListPresenter
 */
@Injectable()
export class MailReportListPresenter extends BaseTablePresenter<TableProperty | TableProperty<MailReportFilterRecord>>{


  /** This property is used to store the MailReports that has been retrieved from the API. */
  public mailReports: MailReport[];

  /** Bs config of customer form presentation component */
  public minDate: Date;

  /** isFormSubmitted */
  public isFormSubmitted: boolean;

  /** This property is used to store the criteria that are selected by the user */
  public tableProperty: TableProperty;
  
  /** This property is used to store filterData.  */
  private filterData: MailReportFilterRecord;
  /** clientId */
  private clientId: number;
  /** Start Date */
  private startDate: Date;

  constructor(
    public renderer: Renderer2,
    public ngZone: NgZone,
    public modalService: ConfirmationModalService,
    private formBuilder: FormBuilder,
    private overlay: Overlay,
  ) {
    super(modalService,renderer,ngZone)
    this.initProperty();
  }

  /** Build Filter Form */
  public buildForm(): FormGroup {
    return this.formBuilder.group({
      startDate: [this.tableProperty.filter.startDate, [Validators.required]],
      endDate: [this.tableProperty.filter.endDate, [Validators.required]]
    })
  }
  
  /**
   * Sets table data
   */
  public setTableData(): void {
    if (this.tableProperty.pageNumber > 0 && this.mailReports.length === 0) {
      // this.toaster.info('No more records found', 'alert');
      return;
    } else if (this.mailReports.length === 0) {
      this.tableProperty.pageNumber = 0;
    }
    const mailReportLength: number = this.mailReports.length;
    this.tableProperty = this.getTableProperty(this.tableProperty, mailReportLength);
  }

  /** Set Client Id */
  public clientChange(clientId?: number): void {
    this.clientId = clientId;
    let filterData: MailReportFilterRecord = { clientId: this.clientId, startDate: this.filterData.startDate, endDate: this.filterData.endDate };
    this.tableProperty.filter = filterData;
    this.setTableProperty(this.tableProperty);
  }

  /** Start Date */
  public onStartDateChange(formGroup: FormGroup, startDate: Date): void {
    if (startDate) {
      formGroup.get('endDate').patchValue(null);
      formGroup.get('endDate').markAsTouched();
      this.minDate = startDate;
    }
  }


  /** openGallery */
  public openGallery(images: Pictures[]): void {
    openGalleryModal(images,this.overlay,true);
  }

  /**
   * used to call api for filter
   * @param filterData filter record 
   */
  public taskFilter(formGroup: FormGroup): void {
    if (formGroup.valid) {
      this.isFormSubmitted = false;
      this.filterData = formGroup.value;

      Object.keys(this.filterData).forEach((key: string) => {
        if (!this.filterData[key] && this.filterData[key] !== false) {
          delete this.filterData[key];
        }
      });
      this.tableProperty.filter = { clientId: this.clientId, ...this.filterData };
      if (!this.clientId) {
        delete this.tableProperty.filter['clientId'];
      }
      this.tableProperty = resetTableProps(this.tableProperty);
      this.setTableProperty(this.tableProperty);
    } else {
      this.isFormSubmitted = true;
    }
  }

  /** Initializes default properties for the component */
  private initProperty(): void {
    const todayDate: Date = new Date();
    this.filterData = new MailReportFilterRecord({});
    this.filterData.clientId = this.clientId;
    this.filterData.startDate = new Date(todayDate.getFullYear(), todayDate.getMonth(), 1);
    this.filterData.endDate = new Date(todayDate.getFullYear(), todayDate.getMonth() + 1, 0);
    this.minDate = this.startDate;
    this.mailReports = [];
    this.tableProperty = new TableProperty<MailReportFilterRecord>();
    this.tableProperty.filter = new MailReportFilterRecord(this.filterData);
  }
}

