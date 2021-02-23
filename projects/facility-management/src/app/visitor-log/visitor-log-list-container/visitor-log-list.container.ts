

/**
 * @name VisitorLogContainerComponent
 * @author Rayhan Kasli.
 * @description This is a container component for VisitorLog. This is responsible for all data retrieving and posting to the server by http calls.
 */
import { Component, HostBinding, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { takeUntil } from 'rxjs/operators';
import { Subject, forkJoin } from 'rxjs';
//--------------------------------------------------------------------//
import { TableProperty } from 'common-libs';
//--------------------------------------------------------------------//
import { environment } from '../../../environments/environment';
import { ClientMaster, UserWithRoleMaster } from '../../core/model/common.model';
import { CoreDataService } from '../../core/services/core-data.service';
import { downloadFile } from '../../core/utility/utility';
import { VisitorLogService } from '../visitor-log.service';
import {
  VisitorLog, VisitorLogFilterRecord, VisitorMaster, VisitorStatus,
  IdentificationProof, UploadPicture, Employee, VisitorLogListResult
} from '../visitor-log.model';

/**
 * VisitorLogListContainerComponent
 */
@Component({
  selector: 'trakit-visitor-log-list-container',
  templateUrl: './visitor-log-list.container.html'
})
export class VisitorLogListContainerComponent implements OnInit {

  @HostBinding('class') public class: string;
  /** This is a observable which passes the list of visitorLog to its child component */
  public visitorLogs$: Observable<VisitorLogListResult>;
  /** This is a observable which passes the client data to its child component */
  public clients$: Observable<ClientMaster[]>;
  /** This is a observable which passes the client data to its child component */
  public employee$: Observable<UserWithRoleMaster[]>;
  /** This is a observable which passes the client data to its child component */
  public identificationProof$: Observable<IdentificationProof[]>;
  /** This is a observable which passes the client data to its child component */
  public visitorStatus$: Observable<VisitorStatus[]>;
  /** This is a observable which passes the client data to its child component */
  public employeeList$: Observable<Employee[]>;
  /** This is a observable which passes the master data to its child component */
  public masterData$: Observable<VisitorMaster>;

  /** This is a subject which set the master data */
  private masterData: Subject<VisitorMaster>;
  /** call this on destroy */
  private destroy: Subject<void>;
  /** call this on destroy */
  private clientId: number;
  /** history */
  private isHistory: boolean;
  /** it will store the table property */
  private tableProperty: TableProperty<VisitorLogFilterRecord>;

  constructor(
    private visitorLogService: VisitorLogService,
    private coreDataService: CoreDataService,
    private datePipe: DatePipe,
    private routes: ActivatedRoute
  ) {
    this.masterData = new Subject<VisitorMaster>();
    this.masterData$ = this.masterData.asObservable();
    this.destroy = new Subject<void>();
    this.isHistory = false;
    this.class = 'flex-grow-1 h-100 overflow-hidden';
  }

  public ngOnInit(): void {
    if (this.routes.snapshot.routeConfig.path.toLowerCase() === 'history') {
      this.isHistory = true;
    }
    this.getClientList();
  }

  /** This Method is used to get data from server  */
  public getVisitorLogs(tableProperty: TableProperty<VisitorLogFilterRecord>): void {
    if (tableProperty.filter) { tableProperty.filter.isHistory = this.isHistory };
    this.tableProperty = tableProperty;
    this.visitorLogs$ = this.visitorLogService.getVisitorLogs(tableProperty);
  }

  /** When presentation layer emits the save event, then this will post data on server */
  public addVisitorLog(visitorLog: VisitorLog): void {
    visitorLog.clientId = this.clientId;
    this.visitorLogService.addVisitorLog(visitorLog).subscribe(
      () => {
        this.getVisitorLogs(this.tableProperty);
      });
  }

  /** When presentation layer emits the save event, then this will post data on server */
  public updateVisitorLog(visitorLog: VisitorLog): void {
    this.visitorLogService.updateVisitorLog(visitorLog).subscribe(
      () => {
        this.getVisitorLogs(this.tableProperty);
      });
  }

  /** This Method is delete data from server  */
  public deleteVisitorLog(visitorLogId: number): void {
    this.visitorLogService.deleteVisitorLog(visitorLogId).subscribe(() => {
      this.getVisitorLogs(this.tableProperty);
    });
  }

  /** uploadPicture */
  public uploadPicture(uploadPicture: UploadPicture): void {
    this.visitorLogService.uploadPicture(uploadPicture).subscribe(() => {
      this.getVisitorLogs(this.tableProperty);
    });
  }

  /** downloadPicture */
  public downloadPicture(visitorLog: VisitorLog): void {
    this.visitorLogService.downloadPicture(visitorLog).subscribe((response: Blob) => {
      downloadFile(response, visitorLog.actualImageName);
    });
  }

  /** previewPicture */
  public previewPicture(visitorLog: VisitorLog): void {
    if (visitorLog) {
      window.open(`${environment.base_host_url}Visitors/${visitorLog.imageName}`, '_blank');
    }
  }

  /** it will load the all master details */
  public getMasterData(clientId: number): void {
    this.clientId = clientId;
    this.identificationProof$ = this.visitorLogService.getIdentificationProofs();
    this.visitorStatus$ = this.visitorLogService.getVisitorStatus();
    this.employeeList$ = this.visitorLogService.getEmployeeList(clientId);
    // tslint:disable-next-line: deprecation
    forkJoin(this.identificationProof$, this.visitorStatus$, this.employeeList$).pipe(takeUntil(this.destroy)).subscribe(
      ([identificationProofs, visitorStatus, employeeList]: [IdentificationProof[], VisitorStatus[], Employee[]]) => {
        const masterData: VisitorMaster = {
          identificationProofs,
          visitorStatus,
          employeeList
        };
        this.masterData.next(masterData);
      }
    )
  }

  /** exportPdfData */
  public exportExcelData(clientId: number): void {
    this.visitorLogService.exportAsExcel(this.tableProperty).subscribe((response: Blob) => {
      downloadFile(response, `visitors-log-${this.datePipe.transform(new Date(), 'MMM-d-y')}.xlsx`);
    });
  }

  /** getClientList */
  private getClientList(): void {
    this.clients$ = this.coreDataService.clients$;
  }
}
