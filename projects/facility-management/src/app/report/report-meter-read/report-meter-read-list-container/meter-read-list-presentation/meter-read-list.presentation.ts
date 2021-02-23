
/**
 * @author Rayhan Kasli
 * @description This is data table presentation component.To represent get data from container component and render to dom.
 */
import {
  Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy, OnDestroy,
  ChangeDetectorRef, HostBinding
} from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/operators/takeUntil';
// ---------------------------------------------------------- //
import { TableProperty, pageCount } from 'common-libs';
import { MeterRead } from '../../report-meter-read.model';
import { MeterReadListPresenter } from '../meter-read-list-presenter/meter-read-list.presenter';
import { MeterReadListPresentationBase } from '../meter-read-list-presentation-base/meter-read-list.presentation.base';
import { FormGroup } from '@angular/forms';
import { FilterObject, FleetDetailList, IdObject, monthListArray, YearList } from '../../../report-model';
import { Permission } from '../../../../core/enums/role-permissions.enum'
import { getMonthList } from 'projects/facility-management/src/app/core/utility/utility';

/**
 * MeterReadListPresentationComponent
 */
@Component({
  selector: 'app-meter-read-list-ui',
  templateUrl: './meter-read-list.presentation.html',
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [MeterReadListPresenter]
})
export class MeterReadListPresentationComponent extends MeterReadListPresentationBase implements OnInit, OnDestroy {

  /** This property is used for add class host element */
  @HostBinding('class') public class: string;
  /** clientId */
  @Input() public set clientId(clientId: any) {
    if (clientId) {
      this.currentClientId = clientId;
      this.getFleetDetail();
      this.meterReadPresenter.clientChange(this.currentClientId, this.filterFormGroup.value);
    }
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

  /** It will store the FLEET DETAIL LIST */
  @Input() public set fleetDetailList(value: FleetDetailList[]) {
    if (value) {
      this._fleetDetailList = value;
    }
  }

  public get fleetDetailList(): FleetDetailList[] {
    return this._fleetDetailList;
  }

  /** This property is used for get data from container component */
  @Input() public set baseResponse(baseResponse: MeterRead[]) {
    if (baseResponse) {
      this._baseResponse = baseResponse;
      this.setTableData();
    }
  };
  public get baseResponse(): MeterRead[] {
    return this._baseResponse;
  }


  /** This property is used for emit data to container component */
  @Output() public getMeterRead: EventEmitter<TableProperty>;
  /** Output emitter defined for emit IdObject and get Fleet detail by selected Id */
  @Output() public getFleetDetailById: EventEmitter<IdObject>;
  /** Output emitter defined for emit IdObject and get Fleet detail by selected Id */
  @Output() public exportExcelData: EventEmitter<FilterObject>;

  /** This property is used to store the selected MeterReads */
  public selectedMeterReads: Set<MeterRead>;

  /** This property is used to store the criteria that are selected by the user */
  public tableProperty: TableProperty;

  /** This property is used to store the options that are available in the Page Size selection drawdown */
  public pageSize: number[];

  /** It will store the Month list */
  public monthList: monthListArray[];
  /** It will store the selected years */
  public selectedYear: string;
  /** It will store the selected years */
  public currentClientId: number;

  /** Table prop of customer list presentation component */
  public tableProp: Subject<TableProperty>;

  /** This property is used for checking filter applied or not. */
  public isFilterApply: boolean;

  /** This property is used for checking sort applied or not. */
  public isSortApply: boolean;
  /**  It will store the filter FormGroup */
  public filterFormGroup: FormGroup;

  /**
   * This enum is return users enum props.
   */
  public get reportsMeterReadEnum(): typeof Permission.ReportsMeterReads {
    return Permission.ReportsMeterReads;
  }

  /** create for getter setter */
  private _baseResponse: MeterRead[];
  /** create for getter setter */
  private _years: YearList[];
  /** create for getter setter */
  private _fleetDetailList: FleetDetailList[];

  /** create for  */
  private destroy: Subject<boolean>;

  constructor(
    public meterReadPresenter: MeterReadListPresenter,
    public changeDetection: ChangeDetectorRef,
  ) {
    super(meterReadPresenter, changeDetection);
    this.initProperty();
    this.class = 'd-flex flex-column h-100 overflow-hidden';
  }

  public ngOnInit(): void {
    this.meterReadPresenter.setTableProp$.pipe(takeUntil(this.destroy)).subscribe((tableProperty: TableProperty) => {
      this.getMeterRead.emit(tableProperty);
      this.tableProperty = tableProperty;
    });
    this.meterReadPresenter.tableProp$.subscribe((value: TableProperty) => {
      this.tableProperty = value;
    });
  }

  /** On Change year update month list */
  public changeYear(): void {
    let year: string = this.meterReadPresenter.onChangeYear(this.filterFormGroup);
    this.monthList = getMonthList(year);
    this.getFleetDetail();
  }

  /** On Change Month  value set as null if no month selected */
  public changeMonth(): void {
    this.meterReadPresenter.onChangeMonth(this.filterFormGroup);
  }

  /** On Change fleet value set as null if no fleet selected */
  public changeFleet(): void {
    this.meterReadPresenter.onChangeFleet(this.filterFormGroup);
  }

  /** Get fleet list on click of search button */
  public searchData(): void {
    this.meterReadPresenter.getTableDataBySearch(this.currentClientId, this.filterFormGroup.value);
  }

  /** export excel data */
  public exportExcel(): void {
    let filterObj: FilterObject = this.meterReadPresenter.filterObject(this.currentClientId, this.filterFormGroup.value)
    this.exportExcelData.emit(filterObj);
  }

  /**
   * Sets table data
   */
  public setTableData(): void {
    this.isSortApply = this.meterReadPresenter.sortApply(this.tableProperty.sort);
    this.meterReadPresenter.meterReads = this.baseResponse;
    this.meterReadPresenter.setTableData();
  }

  /** onSerach */
  public onSearch(searchTerm: string): void {
    this.meterReadPresenter.onMeterReadSearch(searchTerm, this.currentClientId, this.filterFormGroup.value);
  }

  /** destroy */
  public ngOnDestroy(): void {
    this.destroy.next(true);
    this.destroy.unsubscribe();
  }

  /** Get fleet detail - Methid called on change client and change year */
  private getFleetDetail(): void {
    this.filterFormGroup.controls['fleets'].patchValue(null);
    let idObj: IdObject = {
      selectedYear: this.filterFormGroup.value.year,
      clientId: this.currentClientId
    }
    this.getFleetDetailById.emit(idObj);
  }

  /** Initializes default properties for the component */
  private initProperty(): void {
    this.filterFormGroup = this.meterReadPresenter.buildForm();
    this.selectedYear = `${(this.filterFormGroup.getRawValue()).year}`;
    this.selectedMeterReads = new Set();
    this.tableProp = new Subject();
    this.tableProperty = new TableProperty();
    this.pageSize = pageCount;
    this.destroy = new Subject();
    this.getMeterRead = new EventEmitter<TableProperty>();
    this.getFleetDetailById = new EventEmitter(true);
    this.exportExcelData = new EventEmitter(true);
  }
}
