import { Component, OnInit, HostBinding } from '@angular/core';
import { DatePipe } from '@angular/common';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
// ----------------------------------------------------------- //
import { CoreDataService } from '../../../core/services/core-data.service';
import { ClientMaster } from '../../../core/model/common.model';
import { UserInfo } from '../../../core/model/core.model';
import { downloadFile } from '../../../core/utility/utility';
import { ReportFleetService } from '../report-fleet.service';
import { FleetList } from '../report-fleet.model';
import { FilterObject, FleetDetailList, IdObject, YearList } from '../../report-model';

/** Container component defined for fleet report */ 
@Component({
  selector: 'app-report-fleet-container',
  templateUrl: './report-fleet.container.html'
})
export class ReportFleetContainerComponent implements OnInit {

  /** hostBinding */
  @HostBinding('class') public class: string = 'd-flex flex-grow-1 overflow-hidden';

  /** This is a observable which passes the client data to its child component */
  public years$: Observable<YearList[]>

  /** Observable for get fleet detail list */
  public fleetDetailList$: Observable<FleetDetailList[]>

  /** Observable for get client list */
  public clients$: Observable<ClientMaster[]>

  /** Observable for get fleet list */
  public fleetList$: Observable<FleetList[]>;

  constructor(
    private coreDataService: CoreDataService,
    private reportFleetService: ReportFleetService,
    private datePipe: DatePipe
    ) { }

  public ngOnInit(): void {
    // this.fleetList$ = this.reportFleetService.getFleetList();
    this.getYears();
    this.getMasterData();
  }

  /** get fleet detail list */
  public getFleetDetailById(idObjct:IdObject): void {
    this.fleetDetailList$ = this.reportFleetService.getFleetDetail(idObjct);
  }

  /** get fleet list */
  public getFleetTableByFilterData(filterObject: FilterObject): void {
    this.fleetList$ = this.reportFleetService.getFleetList(filterObject);
  }

  /** export excel file */
  public exportExcelFile(filterObject: FilterObject): void {
    this.reportFleetService.exportExcel(filterObject).subscribe((response: Blob) => {
      downloadFile(response, `report-fleet-${this.datePipe.transform(new Date(), 'y-MM-d-h_mm_ss')}.xlsx`);
    });
  }
  /** Get User info */
  private getMasterData(): void {
    this.clients$ = this.coreDataService.userInfo$.pipe(
      map((data: UserInfo) => data.clients)
    );
  }

  /** Get year list */
  private getYears(): void {
    this.years$ = this.reportFleetService.getYears();
  }


}
