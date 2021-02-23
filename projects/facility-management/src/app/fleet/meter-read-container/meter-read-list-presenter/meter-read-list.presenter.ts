/** 
 * @author Ronak Patel.
 * @description MeterReadpresenter service for MeterReadpresentation component.
 */

import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ConfirmationModalComponent, ConfirmationModalService, TableProperty } from 'common-libs';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
// ---------------------------------------------- //
import { ConformationDelete } from '../../../core/utility/enums';
import { BaseTablePresenter } from '../../../shared/base-presenter/base-table.presenter';
import { AssetMeter, AssetMeterReadResult } from '../../fleet.model';

/**
 * MeterReadListPresenter
 */
@Injectable()
export class MeterReadListPresenter extends BaseTablePresenter<TableProperty | AssetMeter> {

  /** Table prop$ of meterRead list presenter */
  public tableProp$: Observable<TableProperty>;
  /** This property is used to store the MeterReads that has been retrieved from the API. */
  public meterReads: AssetMeter[];
  /** This property is used to store the criteria that are selected by the user */
  public tableProperty: TableProperty;
  /** The message that will be shown in template when no record found */
  public message: string;

  /** Table prop of MeterReadlist presenter */
  private tableProp: Subject<TableProperty>;
  /** MeterRead data of meterRead list presenter */
  private meterReadData: Subject<AssetMeter[]>;
  /** preserve previous record */
  private previousRecord: AssetMeter;

  constructor(
    public modalService: ConfirmationModalService,
    private _sanitizer: DomSanitizer
  ) {
    super(modalService)
    this.initProperty();
  }

  /** This method is invoke when data successfully get */
  public getTableProperty(tableProperty: TableProperty, length: number): TableProperty {
    this.tableProperty = tableProperty;
    return this.tableProperty;
  }

  /** Get lazy loaded data on scroll */
  public onScroll(): void {
    this.tableProperty.pageNumber = this.tableProperty.pageNumber + 1;
    this.setTableProperty(this.tableProperty);
  }

  /**
   * This method is invoked when the user performs a global search. It resets the selected rows, updates the criteria
   * and then gets the new list of MeterReadbased on updated criteria.
   * @param searchTerm The search string that has been searched by the user
   */
  public onSearch(searchTerm: string): void {
    if (this.tableProperty.search === searchTerm) { return; }
    this.tableProperty.search = searchTerm;
    this.resetList();
    this.setTableProperty(this.tableProperty);
  }

  /** Create for set missing entry. */
  public setMissingMeterRead(baseResponse: AssetMeterReadResult): AssetMeterReadResult {
    let newBaseResponse: AssetMeter[] = [];
    if (this.tableProperty.pageNumber > 0) { newBaseResponse = this.meterReads; }
    baseResponse && baseResponse.assetMeterList.forEach((meterRead: AssetMeter) => {
      if (this.previousRecord
        && (this.previousRecord.previousColorRead !== meterRead.currentColorRead
          || this.previousRecord.previousBwRead !== meterRead.currentBwRead
          || this.previousRecord.previousScanRead !== meterRead.currentScanRead)) {

        this.previousRecord.isMissingEntry = true;
        meterRead.downAssetMeterId = meterRead.assetMeterId;
        meterRead.upAssetMeterId = this.previousRecord.assetMeterId;
        newBaseResponse.push(this.previousRecord);
        baseResponse.total++;
      }
      newBaseResponse.push(meterRead);
      this.previousRecord = { ...meterRead };
    });

    return { assetMeterList: [...newBaseResponse], total: baseResponse.total };
  }

  /**
   * Sets table data
   */
  public setTableData(): void {
    if (this.tableProperty.pageNumber > 0 && this.meterReads.length === 0) {
      return;
    } else if (this.meterReads.length === 0) {
      this.resetList();
    }
    const meterReadLength: number = this.meterReads.length;
    this.meterReadData.next(this.meterReads);
    this.tableProperty = this.getTableProperty(this.tableProperty, meterReadLength);
    this.tableProp.next(this.tableProperty);
  }

  /** reset list if new record added */
  public resetList(): void {
    this.previousRecord = null;
    this.tableProperty.pageNumber = 0;
  }

  /** On succesful deletion of record reload the list */
  public onDeleteSuccessCallback(): void {
    this.resetList();
    this.setTableProperty(this.tableProperty);
  }

  /**
   * open delete confirmation with custom copyit request link
   * @param data Asset meter detail
   */
  public openDeleteConfirmationModal(data: AssetMeter): void {
    let message: string = ConformationDelete.Conformation_Massage;
    if (data.copyItId) {
      message = `There is a Copy It request associated to this meter read (Refer: <a title="Open CopyIt Request" target="_blank" href="/copyit/${data.copyItId}">${data.copyItId}</a>). Are you sure to delete this record?`
    }
    this.openModal(data, { confirmationMessage: this._sanitizer.bypassSecurityTrustHtml(message) as string });
  }

  /** Initializes default properties for the component */
  private initProperty(): void {
    this.meterReads = [];
    this.tableProperty.pageLimit = 20;
    this.tableProp = new Subject();
    this.meterReadData = new Subject();
    this.tableProp$ = this.tableProp.asObservable();
  }
}

