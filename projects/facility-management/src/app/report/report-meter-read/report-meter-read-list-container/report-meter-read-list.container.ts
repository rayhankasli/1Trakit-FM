

/**
 * @name ReportMeterReadContainerComponent
 * @author Rayhan Kasli
 * @description This is a container component for ReportMeterRead. This is responsible for all data retrieving and posting to the server by http calls.
 */ 
import { Component, OnInit, HostBinding } from '@angular/core';
import { Observable } from 'rxjs/Observable';

//--------------------------------------------------------------------//
import { TableProperty } from 'common-libs';
import { ReportMeterReadService } from '../report-meter-read.service';
import { MeterRead } from '../report-meter-read.model';
import { ClientMaster } from '../../../core/model/common.model';
import { CoreDataService } from '../../../core/services/core-data.service';
import { FilterObject, FleetDetailList, IdObject, YearList } from '../../report-model';
import { downloadFile } from '../../../core/utility/utility';
import { DatePipe } from '@angular/common';

/**
 * ReportMeterReadListContainerComponent
 */
@Component({
  selector: 'app-report-meter-read-list-container',
  templateUrl: './report-meter-read-list.container.html'
})
export class ReportMeterReadListContainerComponent implements OnInit {

  /** This property is used for add class host element */
  @HostBinding('class') public class: string;
   /** This is a observable which passes the list of meterRead to its child component */
  public meterReads$: Observable<MeterRead[]> ;
  /** This is a observable which passes the client data to its child component */
  public clients$: Observable<ClientMaster[]>;
  /** This is a observable which passes the client data to its child component */
  public yearList$: Observable<YearList[]>;
  /** This is a observable which passes the client data to its child component */
  public fleetDetailList$: Observable<FleetDetailList[]>;

  /** tableProperty contain all the properies of table */
  private tableProperty: TableProperty;
    

  constructor(
    private coreDataService: CoreDataService,
    private reportMeterReadService: ReportMeterReadService,
    private datePipe: DatePipe
  ) {
    this.class = 'flex-grow-1 h-100 overflow-hidden';
    this.tableProperty = new TableProperty();
  }

  /** ngOnInit is life cycle hook of component */
  public ngOnInit(): void {
    this.getMasterData();
  }

  /** This Method is used to get data from server  */
  public getMeterReads(tableProperty: TableProperty): void {
    this.tableProperty = tableProperty;
    this.meterReads$ = this.reportMeterReadService.getMeterReadsReports(tableProperty);
  }
 
  /** getMasterData */
  public getFleetDetail(idObjct: IdObject): void {
    this.fleetDetailList$ = this.reportMeterReadService.getFleetDetail(idObjct);
  }

  /** export excel data */
  public exportExcel(filterObject: FilterObject): void {
    this.tableProperty.filter = filterObject;
    this.reportMeterReadService.exportAsExcel(this.tableProperty).subscribe((response: Blob) => {
      downloadFile(response, `report-task-${this.datePipe.transform(new Date(), 'MMM-d-y')}.xlsx`);
    });
  }

  /** getClientList */
  private getMasterData(): void {
    this.clients$ = this.coreDataService.clients$;
    this.yearList$ = this.reportMeterReadService.getYears();
  }
  
}
