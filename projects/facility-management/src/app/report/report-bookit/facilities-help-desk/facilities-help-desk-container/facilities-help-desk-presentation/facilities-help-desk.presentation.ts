import { Component, ChangeDetectionStrategy, Input, ViewChild, ElementRef, Output, EventEmitter, HostListener, OnInit, OnDestroy } from '@angular/core';
import { takeUntil } from 'rxjs/operators/takeUntil';
import { Subject } from 'rxjs/Subject';
// ---------------------------------- //
import { SidebarService } from 'common-libs';
// ----------------------------------------------------- //
import { BasePresentation } from '../../../../../core/base-classes/base.presentation';
import { CoreDataService } from '../../../../../core/services/core-data.service';
import { Permission } from '../../../../../core/enums/role-permissions.enum';
import { ClientMaster } from '../../../../../core/model/common.model';
import { FacilitiesHelpDeskPresenter } from '../facilities-help-desk-presenter/facilities-help-desk.presenter';
import { TableHeader, FacilitiesHelpDesk } from '../../facilities-help-desk.model';

/** Presentation component */
@Component({
  selector: 'app-facilities-help-desk-ui',
  templateUrl: './facilities-help-desk.presentation.html',
  preserveWhitespaces: false,
  viewProviders: [FacilitiesHelpDeskPresenter],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FacilitiesHelpDeskPresentationComponent extends BasePresentation implements OnInit, OnDestroy {

  /** FACILITIES HELP DESK LIST */
  @Input() public set facilitiesHelpDeskList(value: FacilitiesHelpDesk[]) {
    if (value) {
      this._facilitiesHelpDeskList = value;
      this.facilitiesHelpDeskPresenter.setChartData(this.tableHeader, this._facilitiesHelpDeskList);
      this.facilitiesHelpDeskPresenter.drawHelpDeskChart(this.chartContainer);
    }
  }

  public get facilitiesHelpDeskList(): FacilitiesHelpDesk[] {
    return this._facilitiesHelpDeskList;
  }

  /** This will set the data */
  @Input() public set clients(value: ClientMaster[]) {
    if (value) {
      this._clients = [...value];
    }
  }

  public get clients(): ClientMaster[] {
    return this._clients;
  }

  /** Event emitter set the clientId when component are initialize and change client ID. */
  @Output() public getListById: EventEmitter<number>;

  /** Get continer refrence */
  @ViewChild('facilitiesHelpDesk', { static: false }) public chartContainer: ElementRef<HTMLDivElement>;

  /** Current Months */
  public currentMonth: Date;
  /** tableHeader */
  public tableHeader: string[];
  /** client list */
  public _clients: ClientMaster[];
  /** client ID */
  public clientId: number;

  /** This enum is return users enum props. */
  public get facilityHelpDeskEnum(): typeof Permission.ReportsBookIt {
    return Permission.ReportsBookIt;
  }

  /** destroy */
  private destroy: Subject<void>;
  /** FACILITIES HELP DESK LIST */
  private _facilitiesHelpDeskList: FacilitiesHelpDesk[];

  constructor(
    private coreDataService: CoreDataService,
    private sidebarService: SidebarService,
    private facilitiesHelpDeskPresenter: FacilitiesHelpDeskPresenter
  ) {
    super();
    this.getListById = new EventEmitter(true);
    this.currentMonth = new Date();
    this.tableHeader = TableHeader;
    this.destroy = new Subject();
  }

  /** Redraw Chart on window size change */
  @HostListener('window:resize', ['$event']) public onResize(): void {
    setTimeout(() => {
      this.facilitiesHelpDeskPresenter.drawHelpDeskChart(this.chartContainer);
     }, 500);
  }

  /** OnInit method */
  public ngOnInit(): void {
    this.coreDataService.globalClientId$.pipe(takeUntil(this.destroy)).subscribe((clientId: number) => {
      if (clientId > 0) {
        this.getHelpDeskList(clientId);
      } else {
        this.getHelpDeskList();
      }
      this.clientId = clientId;
    });

    this.sidebarService.isCollapsed.pipe(takeUntil(this.destroy)).subscribe(flag => {
      if (this._facilitiesHelpDeskList) {
        setTimeout(() => {
          this.facilitiesHelpDeskPresenter.drawHelpDeskChart(this.chartContainer);
        }, 500)
      }
    });
  }

  /** On Destroy component */
  public ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }

  /** Export PDF */
  public exportAsPDF(): void {
    let clientName: string = this.clientId > 0 ? this._clients[0].client : 'All';
    this.facilitiesHelpDeskPresenter.exportAsPDF(this.tableHeader, this._facilitiesHelpDeskList, clientName);
  }

  /** For emit output */
  private getHelpDeskList(id?: number): void {
    this.getListById.next(id);
  }
}
