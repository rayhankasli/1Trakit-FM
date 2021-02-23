/**
 * @author: Bikash Das
 * @description : This is a prsentation class for Dashboard which also a parent component for
 * all dashboard charts
 */

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, Input, NgZone, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TableProperty } from 'projects/common-libs/src/projects';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
// ---------------------------------------- //
import { Dashboard } from '../../../core/enums/role-permissions.enum';
import { ClientMaster, MultiSelectFilterRecord } from '../../../core/model/common.model';
import { ArchiveModeService } from '../../../core/services/archive-mode/archive-mode.service';
import { CoreDataService } from '../../../core/services/core-data.service';
import { AssociateLegends, ClientLegends, ComboChartDrop, ComboChartLegends, DonutChartLegend, DonutFleetLegends } from '../../dashboard.constant';
import { AssociateStatusChart, BookItChartStatusResponse, BookItRequestStatus, ClientStatusChart, CopyItChartStatusResponse, CopyItRequestStatus, FleetChartStatus, FleetRequestStatus, ModuleLicense, OpenRequest } from '../../dashboard.model';
import { DashboardPresenter } from '../dashboard-presenter/dashboard.presenter';
import { BaseDashboardPresentation } from './base-dashboard.presentation';
/**
 * DashboardPresentationComponent
 */
@Component({
  selector: 'app-dashboard-presentation-ui',
  templateUrl: './dashboard.presentation.html',
  viewProviders: [DashboardPresenter],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardPresentationComponent extends BaseDashboardPresentation implements OnInit, OnDestroy {

  /** setter method to store chart status copyit value */
  @Input() public set chartStatusCopyIt(val: CopyItChartStatusResponse) {
    this.getCopyItChartStatus = val;
  }
  /** getter method to return chart status copyit value */
  public get chartStatusCopyIt(): CopyItChartStatusResponse {
    return this.getCopyItChartStatus;
  }

  /** setter method to store chart status bookit value */
  @Input() public set chartStatusBookIt(val: BookItChartStatusResponse) {
    this.getBookItChartStatus = val;
  }
  /** getter method to return chart status bookit value */
  public get chartStatusBookIt(): BookItChartStatusResponse {
    return this.getBookItChartStatus;
  }

  /** setter method to store chart status fleet value */
  @Input() public set chartStatusFleet(val: FleetChartStatus) {
    this.getFleetChartStatus = val;
  }
  /** getter method to return chart status copyit value */
  public get chartStatusFleet(): FleetChartStatus {
    return this.getFleetChartStatus;
  }

  /** setter method to store chartstatus client value */
  @Input() public set chartStatusClient(val: ClientStatusChart[]) {
    this.getClientChartStatus = val;
  }
  /** getter method to return chartstatus client value */
  public get chartStatusClient(): ClientStatusChart[] {
    return this.getClientChartStatus;
  }

  /** setter method to store chartstatus associate value */
  @Input() public set chartStatusAssociate(val: AssociateStatusChart[]) {
    this.getAssociatesChartStatus = val;
  }
  /** getter method to return chartstatus associate value */
  public get chartStatusAssociate(): AssociateStatusChart[] {
    return this.getAssociatesChartStatus;
  }

  /** setter method to store chartstatus copyit request value */
  @Input() public set chartStatusCopyItRequest(val: CopyItRequestStatus[]) {
    this.getCopyitRequestChartStatus = val;
  }
  /** getter method to return chartstatus copyit request value */
  public get chartStatusCopyItRequest(): CopyItRequestStatus[] {
    return this.getCopyitRequestChartStatus;
  }

  /** setter method to store chartstatus bookit request value */
  @Input() public set chartStatusBookItRequest(val: BookItRequestStatus[]) {
    this.getBookItRequestChartStatus = val;
  }
  /** getter method to return chartstatus bookit request value */
  public get chartStatusBookItRequest(): BookItRequestStatus[] {
    return this.getBookItRequestChartStatus;
  }

  /** setter method to store chartstatus fleet request value */
  @Input() public set chartStatusFleetRequest(val: FleetRequestStatus[]) {
    this.getFleetRequestChartStatus = val;
  }
  /** getter  method to return chartstatus fleet request value */
  public get chartStatusFleetRequest(): FleetRequestStatus[] {
    return this.getFleetRequestChartStatus;
  }

  /** setter method to store open request value for copyit bookit and fleet */
  @Input() public set openRequest(val: OpenRequest[]) {
    this.getOpenRequest = val;
  }
  /** getter method to return open request value for copyit bookit and fleet */
  public get openRequest(): OpenRequest[] {
    return this.getOpenRequest;
  }

  /** List of clients */
  @Input() public set clients(list: ClientMaster[]) {
    if (list) {
      this.getClients = [...list];
    }
  }
  public get clients(): ClientMaster[] {
    return this.getClients;
  }

  public isNotificationOpen: boolean;
  /** get doghnut chart related legends */
  public readonly donutChartLegend: string[] = DonutChartLegend;
  /** get fleet doghnut chart related legends */
  public readonly donutChartFleetLegend: string[] = DonutFleetLegends;
  /** get client bar chart related legends */
  public readonly clientLegends: string[] = ClientLegends;
  /** get associates bar chart related legends */
  public readonly associateLegends: any[] = AssociateLegends;
  /** get combo chart related legends */
  public readonly comboChartLegends: string[] = ComboChartLegends;
  /** dashboard filter form */
  public dashboardFilterForm: FormGroup;
  /** license related checks */
  public licensedFeat: ModuleLicense;
  /** archive related checks */
  public archivedFeat: ModuleLicense;
  /** Table prop of customer list presentation component */
  public tableProp: Subject<TableProperty<MultiSelectFilterRecord>>;
  /** default notification parameter */
  public getNotification: number = 0;
  /** to check if role is super-user */
  public isSuperUser: boolean;
  /** client detail observable */
  public clientDetail: ClientMaster;
  /** get list of options for combo charts */
  public comboChartDropList: typeof ComboChartDrop = ComboChartDrop;
  /** get dashboard permissions */
  public get DashboardPermission(): typeof Dashboard {
    return Dashboard;
  }

  public isArchived$: Observable<boolean>;
  public archivedModuleName: string;

  private getOpenRequest: OpenRequest[];
  private getClients: any[];
  private getCopyItChartStatus: CopyItChartStatusResponse;
  private getBookItChartStatus: BookItChartStatusResponse;
  private getFleetChartStatus: FleetChartStatus;
  private getClientChartStatus: ClientStatusChart[];
  private getAssociatesChartStatus: AssociateStatusChart[];
  private getCopyitRequestChartStatus: CopyItRequestStatus[];
  private getBookItRequestChartStatus: BookItRequestStatus[];
  private getFleetRequestChartStatus: FleetRequestStatus[];
  // private destroy: Subject<boolean>;

  constructor(
    private dashboardPresenter: DashboardPresenter,
    private cdr: ChangeDetectorRef,
    private coreDataService: CoreDataService,
    private archiveModeService: ArchiveModeService,
    @Inject('Window') window: Window,
    zone: NgZone
  ) {
    super(window, zone);
    this.dashboardFilterForm = this.dashboardPresenter.buildClientFilterForm();
    this.initProperty();

    // set license/archive related flags
    this.licensedFeat = dashboardPresenter.setLicensingFlags();
    this.archivedFeat = dashboardPresenter.setArchiveLicensingFlags();
  }

  public ngOnInit(): void {

    /** check if user activated archived mode or not */
    this.isArchived$ = this.archiveModeService.archiveMode$;

    /** get module names which are archived to show in the notification */
    this.isSuperUser && this.coreDataService.clientDetail$().pipe(takeUntil(this.destroy)).subscribe((client: ClientMaster) => {
      this.clientDetail = client;
      if (client.clientId) {
        this.archivedModuleName = this.dashboardPresenter.getArchivedModules(this.clientDetail);
      } else {
        this.archivedModuleName = null;
      }
      this.cdr.markForCheck();
    });

    /** On filter form changes */
    this.dashboardFilterForm.valueChanges
      .pipe(takeUntil(this.destroy))
      .subscribe((filter: MultiSelectFilterRecord) => {
        this.dashboardPresenter.onFilterChange({ ...filter });
        this.closeNotification();
        this.chartInputFilter = { ...filter };
        this.cdr.detectChanges();
      });

    this.dashboardPresenter.setTableProp$
      .pipe(takeUntil(this.destroy))
      .subscribe((tableProperty: TableProperty<MultiSelectFilterRecord>) => {
        this.copyItComboChartOption.clientId = tableProperty.filter.clientId;
        this.bookItComboChartOption.clientId = tableProperty.filter.clientId;
        this.fleetComboChartOption.clientId = tableProperty.filter.clientId;
        this.getNotification = tableProperty.filter.clientId;
        this.tableProperty = tableProperty;
      });
  }
  /** open notification based on boolean value */
  public openNotification(): void {
    this.isNotificationOpen = true;
  }
  /** close notification based on boolean value */
  public closeNotification(): void {
    this.isNotificationOpen = false;
  }

  /**
   * get all copyit combo chart status data
   * while clicking on monthly,quaterly and annually buttons
   * based on different parameters
   * @param val
   */
  public getCopyitCombochartdata(val: any): void {
    this.copyItCombochartData.emit(this.copyItComboChartOption);
  }

  /**
   * get all bookit combo chart status data
   * while clicking on monthly,quaterly and annually buttons
   * based on different parameters
   * @param val
   */
  public getBookitCombochartdata(val: any): void {
    this.bookItCombochartData.emit(this.bookItComboChartOption);
  }

  /**
   * get all fleet combo chart status data
   * while clicking on monthly,quaterly and annually buttons
   * based on different parameters
   * @param val
   */
  public getFleetCombochartdata(val: any): void {
    this.fleetCombochartData.emit(this.fleetComboChartOption);
  }


  /** Initializes default properties for the component */
  private initProperty(): void {
    this.isSuperUser = this.dashboardPresenter.isSuperUser;
    this.tableProp = new Subject();
    this.isNotificationOpen = false;
    this.tableProperty = new TableProperty<MultiSelectFilterRecord>();
    this.destroy = new Subject();
  }

  /** destroy */
  // tslint:disable-next-line: member-ordering
  public ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.unsubscribe();
  }
}
