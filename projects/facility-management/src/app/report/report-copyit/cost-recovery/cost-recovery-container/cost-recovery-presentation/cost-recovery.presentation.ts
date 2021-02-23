/** 
 * @author Shahbaz Shaikh.
 * @description CostRecoverypresentation component.
 */


import {
  Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy, OnDestroy, ChangeDetectorRef
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/operators/takeUntil';
// ---------------------------------------------------------- //
import { TableProperty, pageCount } from 'common-libs';
// ---------------------------------- //
import { CoreDataService } from '../../../../../core/services/core-data.service';
import { DATE_FORMAT, MMMM_YY_DATE_FORMAT, DECIMAL_FORMAT } from '../../../../../core/utility/constants';
import { Permission } from '../../../../../core/enums/role-permissions.enum';
import { User, CostRecovery } from '../../cost-recovery.model';
import { CostRecoveryPresenter } from '../cost-recovery-presenter/cost-recovery.presenter';
import { CostRecoveryPresentationBase } from '../cost-recovery-presentation-base/cost-recovery.presentation.base';


@Component({
  selector: 'app-cost-recovery-ui',
  templateUrl: './cost-recovery.presentation.html',
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [CostRecoveryPresenter],
})

export class CostRecoveryPresentationComponent extends CostRecoveryPresentationBase implements OnInit, OnDestroy {

  /** This property is used for get data from container component */
  @Input() public set costRecoverys(baseResponse: CostRecovery) {
    if (baseResponse) {
      this._costRecoverys = baseResponse;
      this.costRecoveryList = this.costRecoveryPresenter.setCostRecoveryData(this._costRecoverys);
      this.setTableData();
    }
  };
  public get costRecoverys(): CostRecovery {
    return this._costRecoverys;
  }

  /**  Event emitter is used for emit data to container component */
  @Output() public costRecovery: EventEmitter<TableProperty>;

  /**  Event emitter is used for emit data to container component */
  @Output() public costRecoveryExcel: EventEmitter<TableProperty>;

  /** Month Year Format (mmmm-YY) */
  public readonly dateFormat: string = DATE_FORMAT;
  /** Month Year Format (mmmm-YY) */
  public readonly monthYearFormat: string = MMMM_YY_DATE_FORMAT;
  /** Decimal format for showing Amounts */
  public decimal: string = DECIMAL_FORMAT;
  /** Cost-Recovery List */
  public costRecoveryList: User[];
  /** Filter FormGroup */
  public filterFormGroup: FormGroup;
  /** This property is used to store the criteria that are selected by the user */
  public tableProperty: TableProperty;
  /** This property is used to store the options that are available in the Page Size selection drawdown */
  public pageSize: number[];
  /** Set Start Date */
  public startDate: Date;
  /** Set End  Date */
  public endDate: Date;
  /** Table prop of customer list presentation component */
  public tableProp: Subject<TableProperty>;

  /** Get Min Date */
  public get minDate(): Date {
    return this.costRecoveryPresenter.minDate;
  }

  /** Determines whether form submitted is ture or false */
  public get isFormSubmitted(): boolean {
    return this.costRecoveryPresenter.isFormSubmitted;
  }

  /** Determines whether isMonthSame is ture or false */
  public get isMonthSame(): boolean {
    return this.costRecoveryPresenter.isMonthSame;
  }

  /** This enum is return users enum props. */
  public get costRecoveryEnum(): typeof Permission.ReportsCopyIt {
    return Permission.ReportsCopyIt;
  }

  /** _costRecoverys */
  private _costRecoverys: CostRecovery;

  /** create for  */
  private destroy: Subject<boolean>;

  constructor(
    private coreDataService: CoreDataService,
    public costRecoveryPresenter: CostRecoveryPresenter,
    public changeDetection: ChangeDetectorRef
  ) {
    super(costRecoveryPresenter, changeDetection);
    this.setProperty();
  }

  public ngOnInit(): void {
    this.initProperty();
  }

  /** destroy */
  public ngOnDestroy(): void {
    this.destroy.next(true);
    this.destroy.unsubscribe();
  }

  /**
   * Sets table data
   */
  public setTableData(): void {
    this.costRecoveryPresenter.costRecoveryList = this.costRecoveryList;
    this.costRecoveryPresenter.setTableData();
  }

  /** Export Excel */
  public exportAsExcel(): void {
    this.costRecoveryExcel.emit(this.tableProperty);
  }

  /** Filter of cost-recovery List */
  public costRecoveryFilter(): void {
    this.costRecoveryPresenter.costRecoveryFilter(this.filterFormGroup);
  }

  /** Initializes default properties for the component */
  private setProperty(): void {
    this.destroy = new Subject();
    this.tableProp = new Subject();
    this.tableProperty = new TableProperty();
    this.pageSize = [5, ...pageCount];
    this.costRecovery = new EventEmitter(true);
    this.costRecoveryExcel = new EventEmitter();
    this.filterFormGroup = this.costRecoveryPresenter.buildFilterForm();
    this.filterFormGroup = this.costRecoveryPresenter.bindControlValue(this.filterFormGroup);
  }

  /** After Init Prop */
  private initProperty(): void {
    this.costRecoveryPresenter.setTableProp$.pipe(takeUntil(this.destroy)).subscribe((tableProperty: TableProperty) => {
      this.costRecovery.emit(tableProperty);
      this.tableProperty = tableProperty;
      if (tableProperty) {
        this.compareMonth();
      }
    });

    this.costRecoveryPresenter.tableProp$.subscribe((value: TableProperty) => {
      this.tableProperty = value;
    });

    this.coreDataService.globalClientId$.pipe(takeUntil(this.destroy)).subscribe((clientId: number) => {
      this.costRecoveryPresenter.costRecoveryClientChange(clientId);
    });

    this.filterFormGroup.get('startDate').valueChanges.subscribe((startDate: Date) => {
      if (startDate) {
        // let date: Date = new Date(startDate);
        this.filterFormGroup.get('startDate').patchValue(startDate, { emitEvent: false });
        this.costRecoveryPresenter.setCostRecoveryStartDate(this.filterFormGroup, startDate);
      } else {
        this.filterFormGroup.get('startDate').patchValue('', { emitEvent: false });
      }
    });

  }

  /** Compare two month of period */
  private compareMonth(): void {
    this.startDate = this.tableProperty.filter.startDate;
    this.endDate = this.tableProperty.filter.endDate;
    this.costRecoveryPresenter.compareMonth(this.tableProperty);
  }

}