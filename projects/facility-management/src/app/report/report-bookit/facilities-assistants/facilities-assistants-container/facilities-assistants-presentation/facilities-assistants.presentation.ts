import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
// ---------------------------------- //
import { SidebarService } from 'common-libs';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';
// ----------------------------------------------------- //
import { BasePresentation } from '../../../../../core/base-classes/base.presentation';
import { Permission } from '../../../../../core/enums/role-permissions.enum';
import { ClientMaster } from '../../../../../core/model/common.model';
import { CoreDataService } from '../../../../../core/services/core-data.service';
import { FacilitiesAssistants, TableHeader } from '../../facilities-assistants.model';
import { FacilitiesAssistantsPresenter } from '../facilities-assistants-presenter/facilities-assistants.presenter';

/** Component for presentation */
@Component({
  selector: 'app-facilities-assistants-ui',
  templateUrl: './facilities-assistants.presentation.html',
  viewProviders: [FacilitiesAssistantsPresenter],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FacilitiesAssistantsPresentationComponent extends BasePresentation implements OnInit, OnDestroy {

  /** FACILITIES HELP DESK LIST */
  @Input() public set facilitiesAssistantsList(value: FacilitiesAssistants[]) {
    if (value) {
      this._facilitiesAssistantsList = value;
      this.facilitiesAssistantsPresenter.setChartData(this.tableHeader, this._facilitiesAssistantsList);
      this.facilitiesAssistantsPresenter.drawChart(this.chartContainer);
    }
  }

  public get facilitiesAssistantsList(): FacilitiesAssistants[] {
    return this._facilitiesAssistantsList;
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
  @ViewChild('facilitiesAssistants', { static: false }) public chartContainer: ElementRef<HTMLDivElement>;


  /** client list */
  public _clients: ClientMaster[];
  /** client ID */
  public clientId: number;
  /** For Table header */
  public tableHeader: string[];
  /** Current Months */
  public currentMonth: Date;

  /** This enum is return users enum props. */
  public get facilityAssistantEnum(): typeof Permission.ReportsBookIt {
    return Permission.ReportsBookIt;
  }

  /** FACILITIES ASSISTANTS LIST */
  private _facilitiesAssistantsList: FacilitiesAssistants[];

  /** destroy */
  private destroy: Subject<void>;

  constructor(
    private coreDataService: CoreDataService,
    private sidebarService: SidebarService,
    private facilitiesAssistantsPresenter: FacilitiesAssistantsPresenter
  ) {
    super();
    this.getListById = new EventEmitter(true);
    this.currentMonth = new Date();
    this.tableHeader = TableHeader;
    this.destroy = new Subject();
  }

  /**
   * Hosts listener
   * @param event 
   */
  @HostListener('window:resize', ['$event']) public onResize(): void {
    setTimeout(() => { 
      this.facilitiesAssistantsPresenter.drawChart(this.chartContainer);
    }, 500);
  }

  /** OnInit method  */
  public ngOnInit(): void {
    this.coreDataService.globalClientId$.pipe(takeUntil(this.destroy)).subscribe((clientId: number) => {
      if (clientId > 0) {
        this.getAssistantsList(clientId);
      } else {
        this.getAssistantsList();
      }
      this.clientId = clientId;
    });

    this.sidebarService.isCollapsed.pipe(takeUntil(this.destroy)).subscribe(flag => {
      if (this._facilitiesAssistantsList) {
        setTimeout(() => {
          this.facilitiesAssistantsPresenter.drawChart(this.chartContainer);
        }, 500)
      }
    });
  }

  /** Call on destroy component */
  public ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }

  /** For export PDF */
  public exportPdf(): void {
    let clientName: string = this.clientId > 0 ? this._clients[0].client : 'All';
    this.facilitiesAssistantsPresenter.exportAsPDF(this.tableHeader, this._facilitiesAssistantsList, clientName);
  }

  /** For get assistant list  */
  private getAssistantsList(id?: number): void {
    this.getListById.next(id);
  }
}
