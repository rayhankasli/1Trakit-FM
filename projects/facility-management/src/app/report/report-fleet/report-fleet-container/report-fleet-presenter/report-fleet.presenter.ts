import { Injectable, NgZone } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
// ------------------------------------------------------------- //
import { innerHeaderObject, FleetList,
  InnerHeader, TableRow, AssestsList, PdfDataType
} from '../../report-fleet.model';
import { FleetGeneratePdfService } from '../../fleet-generate-pdf.service';
import { FilterObject, IdObject } from '../../../report-model';
import { FleetReports } from 'projects/facility-management/src/app/core/base-classes/fleet-report-base';

/** Presenter defined for common logic */
@Injectable()
export class ReportFleetPresenter extends FleetReports {

  /** It will store the fleet lis */
  public tableData: FleetList[];
  /** This is used for subscribing the value of fleet deatail by selected id */
  public fleetDetailById$: Observable<IdObject>;
  /** This is used for subscribing the value of fleet filter */
  public applyFilter$: Observable<FilterObject>;
  /** This is used for subscribing the value of Export Excel File */
  public exportExcelFile$: Observable<FilterObject>;

  /** This property used for the fleet Details Id */
  private fleetDetailById: Subject<IdObject>;
  /** This property used for the fleet Filter Object */
  private applyFilter: Subject<FilterObject>;
  /** This property used for the fleet export Excel File */
  private exportExcelFile: Subject<FilterObject>;

  constructor(
    public fb: FormBuilder,
    public ngZone: NgZone,
    private datePipe: DatePipe,
    private generatePdfService: FleetGeneratePdfService
  ) {
    super(fb)
    this.fleetDetailById = new Subject();
    this.applyFilter = new Subject();
    this.exportExcelFile = new Subject();
    this.fleetDetailById$ = this.fleetDetailById.asObservable();
    this.applyFilter$ = this.applyFilter.asObservable();
    this.exportExcelFile$ = this.exportExcelFile.asObservable();
  }

  /** Set table header which will required in PDF generate */
  public setTableHeader(tableData: FleetList[]): FleetList[] {
    let headerObj: InnerHeader = innerHeaderObject;
    let tableArray: FleetList[] = [];
    tableData.forEach((mainTable: FleetList, index: number) => {
      tableArray.push(mainTable);
      if (tableData.length - 1 !== index) {
        tableArray[index].assets.splice(0, 0, headerObj);
      }
    });
    this.tableData = tableArray
    return tableArray;
  }

  /** Get fleet list by selected filter */
  public getTableDataBySearch(clientId: number, filterForm: FormGroup): void {
    // let filterObj = this.getFilterObject(clientId, filterForm)
    this.applyFilter.next(this.getFilterObject(clientId, filterForm));
  }

  /** For export excel */
  public exportExcel(clientId: number, filterForm: FormGroup): void {
    // let filterObj = this.getFilterObject(clientId, filterForm)
    this.exportExcelFile.next(this.getFilterObject(clientId, filterForm));
  }

  /** Return fleet detail object */
  public getFleetDetail(clientId: number, selectedYear: string): void {
    let idObj: IdObject = {
      'selectedYear': selectedYear,
      'clientId': clientId
    }
    this.fleetDetailById.next(idObj);
  }

  /** exportToPdf */
  public exportAsPDF(header: string[], clientName: string): void {
    this.ngZone.runOutsideAngular(() => {
      let tableHeaderText: string = 'Fleet'; 
      let dateString: string = this.datePipe.transform(new Date(), 'y-MM-d-h_mm_ss');
      let pdfName: string = 'report-fleet-' + dateString + '.pdf';
      let jsPDFData: PdfDataType = this.dataForPDFTable(header, this.tableData);

      this.generatePdfService.fleetExportAsPDF(tableHeaderText, pdfName, jsPDFData, clientName);
    });
  }

  /** get row-object and bind in modal */
  private bindRowData(row: any, dataType: number): TableRow {
    let rowData: TableRow;
    if (dataType === 0) {
      rowData = {
        month: row.manufacturer,
        totalMachineCount: row.assetNo + ' | ' + row.modelNo,
        totalCalls: row.totalCalls,
        totalServiceCalls: row.serviceCalls,
        totalFleetTimeup: row.fleetTimeup + '%',
        totalImpressionCount: row.impressionCount
      }
    } else {
      rowData = {
        month: '',
        totalMachineCount: '',
        totalCalls: '',
        totalServiceCalls: '',
        totalFleetTimeup: '',
        totalImpressionCount: '',
      }
    }

    return rowData;
  }

  /** Prepare data for PDF */
  private dataForPDFTable(header: string[], tableData: FleetList[]): PdfDataType {
    let pdfTableData: TableRow[] = [];
    tableData.forEach((mainTable: FleetList) => {
      let rowData: TableRow = {
        month: mainTable.month,
        totalMachineCount: mainTable.totalMachineCount,
        totalCalls: mainTable.totalCalls,
        totalServiceCalls: mainTable.totalServiceCalls,
        totalFleetTimeup: mainTable.totalFleetTimeup + '%',
        totalImpressionCount: mainTable.totalImpressionCount
      }
      pdfTableData.push(rowData)
      if (mainTable.assets.length === 1) {
        mainTable.assets.forEach((innerTable: AssestsList) => {
          rowData = this.bindRowData(innerTable, 0);
          pdfTableData.push(rowData);
          rowData = this.bindRowData(innerTable, 1);
          pdfTableData.push(rowData)
        });
      } else if (mainTable.assets.length > 1) {
        mainTable.assets.forEach((innerTable: AssestsList) => {
          rowData = this.bindRowData(innerTable, 0);
          pdfTableData.push(rowData)
        });
      }

    });
    let pdfData: PdfDataType = {
      tableHeader: header,
      tableValue: pdfTableData
    }
    return pdfData;
  }

  /** get selected ids and returen filtered object */
  private getFilterObject(clientId: number, filterForm): FilterObject {
    let filterObj: FilterObject = {
      'year': filterForm.year ? filterForm.year : '',
      'clientId': clientId,
      'months': filterForm.months !== null ? filterForm.months : [],
      'assets': filterForm.fleets !== null ? filterForm.fleets : []
    }
    return filterObj;
  }
}