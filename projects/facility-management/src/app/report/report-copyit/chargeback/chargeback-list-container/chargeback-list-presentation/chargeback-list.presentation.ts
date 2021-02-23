/** 
 * @author Shahbaz Shaikh.
 * @description ChargeBackListPresentationComponent component.
 */

import {
  Component, OnInit, ViewChildren, QueryList, Input, Output, EventEmitter, ChangeDetectionStrategy, OnDestroy, ChangeDetectorRef, HostBinding
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/operators/takeUntil';
// ---------------------------------------------------------- //
import { TableProperty, SortingOrderDirective, pageCount } from 'common-libs';
// ---------------------------------------------------------- //
import { CoreDataService } from '../../../../../core/services/core-data.service';
import { Permission } from '../../../../../core/enums/role-permissions.enum';
import { ChargeBack, Job, AccountNumber } from '../../chargeback.model';
import { ChargeBackListPresenter } from '../chargeback-list-presenter/chargeback-list.presenter';
import { ChargeBackListPresentationBase } from '../chargeback-list-presentation-base/chargeback-list-presentation.base';

/**
 * ChargeBackListListPresentationComponent
 */
@Component({
  selector: 'app-chargeback-list-ui',
  templateUrl: './chargeback-list.presentation.html',
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [ChargeBackListPresenter]
})
export class ChargeBackListPresentationComponent extends ChargeBackListPresentationBase implements OnInit, OnDestroy {

  /** Add Class */
  @HostBinding('class') public class: string;

  /** This property is used for get data from container component */
  @Input() public set baseResponse(baseResponse: ChargeBack) {
    if (baseResponse) {
      this._baseResponse = baseResponse;
      this.setTableData();
    }
  };
  public get baseResponse(): ChargeBack {
    return this._baseResponse;
  }

  /** Account Number List */
  @Input() public set accountNumberList(value: AccountNumber[]) {
    if (value) {
      this._accountNumberList = value;
    }
  }
  public get accountNumberList(): AccountNumber[] {
    return this._accountNumberList;
  }

  /** job List */
  @Input() public set jobList(value: Job[]) {
    if (value) {
      this._jobList = value;
    }
  }
  public get jobList(): Job[] {
    return this._jobList;
  }

  /** This property is used for emit data to container component */
  @Output() public getChargeBackList: EventEmitter<TableProperty>;

  /**  Event emitter is used for emit data to container component */
  @Output() public accountsNumber: EventEmitter<number>;

  /**  Event emitter is used for emit data to container component */
  @Output() public jobsList: EventEmitter<number>;

  /**  Event emitter is used for emit data to container component */
  @Output() public chargeBackExcel: EventEmitter<TableProperty>;

  /** This property is used to store QueryList of SortingOrderDirective */
  @ViewChildren(SortingOrderDirective) public sortingColumns: QueryList<SortingOrderDirective>;

  /** FormGroup */
  public filterFormGroup: FormGroup;

  /** This property is used to store the criteria that are selected by the user */
  public tableProperty: TableProperty;

  /** This property is used to store the options that are available in the Page Size selection drawdown */
  public pageSize: number[];

  /** Table prop of presentation component */
  public tableProp: Subject<TableProperty>;

  /** Table prof */
  public tablePropertyObj: TableProperty;

  /** This property is used for checking sort applied or not. */
  public isSortApply: boolean;

  /** Determines whether form submitted is ture or false */
  public get minDate(): Date {
    return this.chargeBackListPresenter.minDate;
  }

  /** Determines whether form submitted is ture or false */
  public get isFormSubmitted(): boolean {
    return this.chargeBackListPresenter.isFormSubmitted;
  }

  /** This enum is return users enum props. */
  public get chargebackEnum(): typeof Permission.ReportsCopyIt {
    return Permission.ReportsCopyIt;
  }

  /** create for getter setter */
  private _baseResponse: ChargeBack;

  /** Account Number */
  private _accountNumberList: AccountNumber[];

  /** Job list */
  private _jobList: Job[];

  /** create for  */
  private destroy: Subject<boolean>;

  constructor(
    private coreDataService: CoreDataService,
    public chargeBackListPresenter: ChargeBackListPresenter,
    public changeDetection: ChangeDetectorRef,
  ) {
    super(chargeBackListPresenter, changeDetection);
    this.class = 'd-flex flex-column h-100 w-100 overflow-hidden';
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

  /** Sets table data */
  public setTableData(): void {
    this.isSortApply = this.chargeBackListPresenter.sortApply(this.tableProperty.sort);
    this.chargeBackListPresenter.chargeBackLists = this.baseResponse.chargeBackData;
    this.chargeBackListPresenter.setTableData();
  }

  /** On Change Account Number */
  public onChangeAccount(): void {
    if (this.filterFormGroup.value.accountNo.length === 0) {
      this.filterFormGroup.get('accountNo').patchValue(null, { emitEvent: false });
    }
  }

  /** On Change Jobs  */
  public onChangeJobs(): void {
    if (this.filterFormGroup.value.job.length === 0) {
      this.filterFormGroup.get('job').patchValue(null, { emitEvent: false });
    }
  }

  /** Export Excel */
  public exportAsExcel(): void {
    this.chargeBackExcel.emit(this.tableProperty);
  }

  /** Filter of chargeback List */
  public chargebackFilter(): void {
    this.chargeBackListPresenter.chargebackFilter(this.filterFormGroup);
  }

  /**
   * This method is emit the client Id and get the Account Number list
   * @param clientId Get the client Id
   */
  private getAccountNumbers(clientId: number): void {
    if (clientId > 0) {
      this.accountsNumber.emit(clientId);
    } else {
      this.accountsNumber.emit();
    }
  }

  /**
   * This method is emit the client Id and get the Jobs list
   * @param clientId Get the client Id
   */
  private getJobsList(clientId: number): void {
    if (clientId > 0) {
      this.jobsList.emit(clientId);
    } else {
      this.jobsList.emit();
    }
  }

  /** Initializes default properties for the component */
  private setProperty(): void {
    this.destroy = new Subject();
    this.getChargeBackList = new EventEmitter<TableProperty>();
    this.accountsNumber = new EventEmitter(true);
    this.jobsList = new EventEmitter(true);
    this.chargeBackExcel = new EventEmitter(true);
    this.tableProp = new Subject();
    this.tableProperty = new TableProperty();
    this.pageSize = pageCount;
    this.filterFormGroup = this.chargeBackListPresenter.buildFilterForm();
  }

  /** After Init Prop */
  private initProperty(): void {
    this.chargeBackListPresenter.setTableProp$.pipe(takeUntil(this.destroy)).subscribe((tableProperty: TableProperty) => {
      this.getChargeBackList.emit(tableProperty);
      this.tableProperty = tableProperty;
      this.tablePropertyObj = { ...tableProperty };
    });

    this.chargeBackListPresenter.tableProp$.subscribe((value: TableProperty) => {
      this.tableProperty = value;
    });

    this.coreDataService.globalClientId$.pipe(takeUntil(this.destroy)).subscribe((clientId: number) => {
      this.filterFormGroup.patchValue({ accountNo: null, job: null });
      this.chargeBackListPresenter.chargeBackClientChange(clientId);
      this.getAccountNumbers(clientId);
      this.getJobsList(clientId);
    });

    this.filterFormGroup.get('startDate').valueChanges.subscribe((startDate: Date) => {
      if (startDate) {
        this.chargeBackListPresenter.setChargebackStartDate(this.filterFormGroup, startDate);
      }
    });
  }
}
