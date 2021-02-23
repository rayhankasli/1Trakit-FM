/**
 * @name MeterReadContainerComponent
 * @author Ronak Patel.
 * @description This is a container component for MeterRead. This is responsible for all data retrieving and posting to the server by http calls.
 */
import { Component } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { filter, switchMap, take } from 'rxjs/operators';
//--------------------------------------------------------------------//
import { TableProperty } from 'common-libs';
import { FleetService } from '../fleet.service';
import { downloadFile } from '../../core/utility/utility';
import {
  MeterRead, AssetMeter, Asset, AssetMeterReadResult,
} from '../fleet.model';
import { DatePipe } from '@angular/common';
import { Subject, of } from 'rxjs';

/**
 * MeterReadContainerComponent
 */
@Component({
  selector: 'app-meter-read-container',
  templateUrl: './meter-read.container.html'
})
export class MeterReadContainerComponent {
  /** This is a observable which passes the list of meterRead to its child component */
  public meterReads$: Observable<AssetMeterReadResult>;
  // removed following lines as initially table property will be loaded from presentations and make call for getMeterReads
  //  = this.route.paramMap.pipe(
  //   filter((params: ParamMap) => params.has('id')),
  //   switchMap((params: ParamMap) => this.fleetService.getMeterReads(this.tableProperty, +params.get('id'))),
  // );
  /** This is a observable which passes the MeterRead object to its child component */
  public meterRead$: Observable<MeterRead>;
  public missingEntry: [AssetMeter, AssetMeter];
  public tableProperty: TableProperty;
  public assetId: number;
  public assetRecord: Asset;
  public isaddNewReader: number;
  public resetList$: Observable<number>;
  public onDeleteSuccess$: Observable<number>;
  private resetList: Subject<number>;
  constructor(
    private fleetService: FleetService,
    private route: ActivatedRoute,
    private router: Router,
    private datePipe: DatePipe
  ) {
    this.tableProperty = new TableProperty();
    this.tableProperty.pageLimit = 20;
    this.assetId = +this.route.snapshot.paramMap.get('id');
    this.assetRecord = this.route.snapshot.data['asset'];
    this.resetList = new Subject();
    this.resetList$ = this.resetList.asObservable();
  }

  /** This Method is used to get data from server  */
  public getMeterReads(tableProperty: TableProperty): void {
    this.meterReads$ = this.fleetService.getMeterReads(tableProperty, this.assetId);
  }

  /** When presentation layer emits the save event, then this will post data on server */
  public addMeterRead(meterRead: MeterRead): void {
    this.fleetService.addMeterRead(meterRead, this.assetId).subscribe(
      () => {
        this.resetList.next(new Date().getMilliseconds());
        this.meterReads$ = this.fleetService.getMeterReads(this.tableProperty, this.assetId);
      },
      // tslint:disable-next-line: no-any
      (err: any) => {
      });
  }

  /** onAddMeterRead  */
  public onAddMeterRead(): void {
    this.meterRead$ = this.fleetService.getMeterReadById(this.assetId);
  }
  /** onAddMeterRead  */
  public addNewReader(value: boolean): void {
    if (value) {
      this.isaddNewReader = new Date().getTime();
    }
  }

  /**
   * addMissingMeterRead
   * @param missingEntry 0 index- previousRecord,1 index-currentRecord
   */
  public addMissingMeterRead(missingEntry: [AssetMeter, AssetMeter]): void {
    this.missingEntry = { ...missingEntry };
  }
  /** onExportAsPDF  */
  public onExportAsPDF(): void {
    this.fleetService.exportAsPDF(this.assetId).subscribe((response: Blob) => {
      downloadFile(response, `meterRead-${this.datePipe.transform(new Date(), 'MMM-d-y')}.pdf`);
    });
  }
  /** onExportAsExcel  */
  public onExportAsExcel(): void {
    this.fleetService.exportAsExcel(this.assetId).subscribe((response: Blob) => {
      downloadFile(response, `meterRead-${this.datePipe.transform(new Date(), 'MMM-d-y')}.xlsx`);
    });
  }

  /** onPrintDetails  */
  public onPrintDetails(totalRecord: number): void {
    this.router.navigate([`./print/${totalRecord}`], { relativeTo: this.route });
  }

  /**
   * delete meter read entry and reload list
   * @param assetMeterId id for asset meter read
   */
  public deleteMeterRead(assetMeterId: number): void {
    this.fleetService.deleteMeterRead(assetMeterId).pipe(take(1)).subscribe(() => {
      this.onDeleteSuccess$ = of(new Date().getTime());
    });
  }

}
