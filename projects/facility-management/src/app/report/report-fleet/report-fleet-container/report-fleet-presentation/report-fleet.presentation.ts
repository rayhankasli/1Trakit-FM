import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { getMonthList } from 'projects/facility-management/src/app/core/utility/utility';
import { takeUntil } from 'rxjs/operators/takeUntil';
import { Subject } from 'rxjs/Subject';
// ---------------------------------- //
import { BasePresentation } from '../../../../core/base-classes/base.presentation';
import { Permission } from '../../../../core/enums/role-permissions.enum';
import { ClientMaster } from '../../../../core/model/common.model';
import { CoreDataService } from '../../../../core/services/core-data.service';
import { FilterObject, FleetDetailList, IdObject, monthListArray, YearList } from '../../../report-model';
import { FleetList, FleetMainHeader } from '../../report-fleet.model';
import { ReportFleetPresenter } from '../report-fleet-presenter/report-fleet.presenter';

/** Component presentation for fleet report */
@Component({
  selector: 'app-report-fleet-ui',
  templateUrl: './report-fleet.presentation.html',
  viewProviders: [ReportFleetPresenter],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReportFleetPresentationComponent extends BasePresentation implements OnInit {

  /** It will store the list of offices */
  @Input() public set clients(list: ClientMaster[]) {
    if (list) {
      this._clients = [...list];
    }
  }

  public get clients(): ClientMaster[] {
    return this._clients;
  }

  /** It will store the Year List */
  @Input() public set years(list: YearList[]) {
    if (list) {
      this._years = list;
      this.monthList = getMonthList(this.selectedYear);

    }
  }

  public get years(): YearList[] {
    return this._years;
  }

  /** It will store the FLEET LIST */
  @Input() public set fleetList(value: FleetList[]) {
    if (value) {
      this._fleetList = value;
      this.tableArray = this.reportFleetPresenter.setTableHeader(this._fleetList)
      this.isShowExportButton = this.tableArray.length > 0 ? true : false;
    }
  }

  public get fleetList(): FleetList[] {
    return this._fleetList;
  }

  /** It will store the FLEET DETAIL LIST */
  @Input() public set fleetDetailList(value: FleetDetailList[]) {
    if (value) {
      this._fleetDetailList = value;
    }
  }

  public get fleetDetailList(): FleetDetailList[] {
    return this._fleetDetailList;
  }

  /** Output emitter defined for emit IdObject and get Fleet detail by selected Id */
  @Output() public getFleetDetailById: EventEmitter<IdObject> = new EventEmitter(true);
  /** Output emitter defined for emit FilterObject and get Fleet List by selected Id , assests and months */
  @Output() public getFleetTableByFilterData: EventEmitter<FilterObject> = new EventEmitter(true);
  /** Output emitter defined for emit and export Excel file */
  @Output() public exportExcelFile: EventEmitter<FilterObject> = new EventEmitter(true);

  /** It will store the Main table header  */
  public mainTableHeader: string[];
  /** It will store the selected years */
  public selectedYear: string;
  /** It will store the Month list */
  public monthList: monthListArray[];
  /** It will store the Fleet Detail list */
  public _fleetDetailList: FleetDetailList[];
  /** It will store the Client Id */
  public clientId: number;
  /** It will store the clientFormControl */
  public clientFormControl: FormControl;
  /** for show hide export button   */
  public isShowExportButton: boolean;
  /**  It will store the client name */
  public clientName: string;
  /**  It will store the clients Form */
  public clientsForm: FormGroup;
  /**  It will store the Table array with bind header */
  public tableArray: FleetList[];
  /**  It will store the filter FormGroup */
  public filterFormGroup: FormGroup;

  /** This enum is return users enum props */
  public get reportFleetEnum(): typeof Permission.ReportsFleet {
    return Permission.ReportsFleet;
  }

  /** FACILITIES ASSISTANTS LIST */
  private _fleetList: FleetList[];
  /** list of clients */
  private _clients: ClientMaster[];
  /** list of Years */
  private _years: YearList[];
  /** destroy */
  private destroy: Subject<void>;

  constructor(
    private reportFleetPresenter: ReportFleetPresenter,
    private coreDataService: CoreDataService
  ) {
    super();
    this.initProp();
  }

  /** Method for subscribe table value and call init methods */
  public ngOnInit(): void {
    this.afterInitProp();
  }

  /** On Change year update month list */
  public onChangeYear(): void {
    let year: string = this.reportFleetPresenter.onChangeYear(this.filterFormGroup);
    this.monthList = getMonthList(year);
    this.getFleetDetail();
  }

  /** On Change Month  value set as null if no month selected */
  public onChangeMonth(): void {
    this.reportFleetPresenter.onChangeMonth(this.filterFormGroup);
  }

  /** On Change fleet value set as null if no fleet selected */
  public onChangeFleet(): void {
    this.reportFleetPresenter.onChangeFleet(this.filterFormGroup);
  }

  /** Get fleet list on click of search button */
  public searchTableData(): void {
    this.reportFleetPresenter.getTableDataBySearch(this.clientId, this.filterFormGroup.value);
  }

  /** For Export Excel file */
  public exportExcel(): void {
    this.reportFleetPresenter.exportExcel(this.clientId, this.filterFormGroup.value);
  }

  /** For Export PDF file */
  public exportPdf(): void {
    this.reportFleetPresenter.exportAsPDF(this.mainTableHeader, this.clientName)
  }

  /** Get fleet detail - Methid called on change client and change year */
  private getFleetDetail(): void {
    this.filterFormGroup.controls['fleets'].patchValue(null);
    let idObj: IdObject = {
      selectedYear: this.filterFormGroup.value.year,
      clientId: this.clientId
    }
    this.getFleetDetailById.next(idObj);
  }

  /** Init Prop */
  private initProp(): void {
    this.clientFormControl = new FormControl();
    this.mainTableHeader = FleetMainHeader;
    this.filterFormGroup = this.reportFleetPresenter.buildForm();
    this.destroy = new Subject();
    this.isShowExportButton = true;
    this.selectedYear = new Date().getFullYear().toString();
  }

  /** After Init Prop */
  private afterInitProp(): void {
    this.coreDataService.globalClientId$.pipe(takeUntil(this.destroy)).subscribe((clientId: number) => {
      this.clientId = clientId !== -1 ? clientId : null;
      let clientArray: ClientMaster[] = this._clients.filter((c: ClientMaster) => (c.clientId === this.clientId))
      this.clientName = clientArray.length > 0 ? clientArray[0].client : 'All';

      this.getFleetDetail();
      this.searchTableData();
    });

    this.reportFleetPresenter.applyFilter$.pipe(takeUntil(this.destroy)).subscribe((filterObj: FilterObject) => {
      this.getFleetTableByFilterData.emit(filterObj);
    });

    this.reportFleetPresenter.exportExcelFile$.pipe(takeUntil(this.destroy)).subscribe((filterObj: FilterObject) => {
      this.exportExcelFile.emit(filterObj);
    });
    this.reportFleetPresenter.getTableDataBySearch(this.clientId, this.filterFormGroup.value);
  }
}
