
/**
 * @author Rayhan Kasli
 * @description This is data table presentation component.To represent get data from container component and render to dom.
 */
import {
  Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy, OnDestroy,
  ViewContainerRef, ViewChild, ChangeDetectorRef, NgZone, Inject
} from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { takeUntil } from 'rxjs/operators/takeUntil';
import { BreakpointState } from '@angular/cdk/layout';
// ---------------------------------------------------------- //
import { TableProperty, pageCount } from 'common-libs';
import { AuthPolicyService } from 'auth-policy';
// ---------------------------------------------------------- //
import { ReasonsListPresenter } from '../reasons-list-presenter/reasons-list.presenter';
import { ReasonsListPresentationBase } from '../reasons-list-presentation-base/reasons-list.presentation.base';
import { Reasons } from '../reasons.model';

/**
 * ReasonsListPresentationComponent
 */
@Component({
  selector: 'app-reasons-list-ui',
  templateUrl: './reasons-list.presentation.html',
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [ReasonsListPresenter]
})
export class ReasonsListPresentationComponent extends ReasonsListPresentationBase implements OnInit, OnDestroy {

  /** This property is used for get data from container component */
  @Input() public set baseResponse(baseResponse: Reasons[]) {
    if (baseResponse) {
      this._baseResponse = baseResponse;
      this.setTableData();
    }
  };

  public get baseResponse(): Reasons[] {
    return this._baseResponse;
  }

  /** This property is used for get delete record or not. */
  @Input() public set isDeleted(response: boolean) {
    if (response) {
      this._isDeleted = response;
      this.changeDetection.detectChanges();
      this.getReasons.emit(this.tableProperty);
    }

  }

  public get isDeleted(): boolean {
    return this._isDeleted;
  }


  /**
   * Add new reasons not delivered form of reasons not delivered list presentation component
   */
  @Input() public addNewReasonsForm: boolean;
  /**
   * Add New reason button show hide based on modules.
   */
  @Input() public showAddNewBtn: boolean;

  /** This property is used for emit data to container component */
  @Output() public getReasons: EventEmitter<TableProperty>;
  /** This property is used for emit data to container component */
  @Output() public deleteReasons: EventEmitter<Reasons>;
  /** This property is used for emit data to container component */
  @Output() public addReasons: EventEmitter<Reasons>;
  /** This property is used for emit data to container component */
  @Output() public closeReasonForm: EventEmitter<boolean>;

  /**
   * View child of customer list presentation component
   */
  @ViewChild('container', { read: ViewContainerRef, static: true }) public container: ViewContainerRef;


  /** user has add permission or not */
  public addPermission: boolean;

  /** This property is used to store the selected Reasonss */
  public selectedReasonss: Set<Reasons>;

  /** This property is used to store the criteria that are selected by the user */
  public tableProperty: TableProperty;

  /** This property is used to store the options that are available in the Page Size selection drawdown */
  public pageSize: number[];

  /** This boolean is used to indicate whether all rows are selected or not  */
  public isCheckAll: boolean;

  /** Table prop of customer list presentation component */
  public tableProp: Subject<TableProperty>;

  /** isMobile property for mobile screen or not */
  public isMobile: Observable<BreakpointState>;

  /** This property is used for checking filter applied or not. */
  public isFilterApply: boolean;

  /** This property is used for checking sort applied or not. */
  public isSortApply: boolean;

  /** create for getter setter */
  private _baseResponse: Reasons[];

  /** create for getter setter */
  private _isDeleted: boolean;

 
  constructor(
    public reasonsPresenter: ReasonsListPresenter,
    public changeDetection: ChangeDetectorRef,
    private policyService: AuthPolicyService,
    @Inject('Window') window: Window,
    zone: NgZone
  ) {
    super(reasonsPresenter, changeDetection, window, zone);
    this.initProperty();
  }

  public ngOnInit(): void {
    this.addPermission = this.policyService.hasPermission(this.permissions.add);
    this.reasonsPresenter.setTableProp$.pipe(takeUntil(this.destroy)).subscribe((tableProperty: TableProperty) => {
      this.getReasons.emit(tableProperty);
      this.tableProperty = tableProperty;
    });
    this.reasonsPresenter.deleteRecord$.pipe(takeUntil(this.destroy)).subscribe((reasons: Reasons) => { this.deleteReasons.emit(reasons) });
    this.reasonsPresenter.tableProp$.subscribe((value: TableProperty) => {
      this.tableProperty = value;
    });
  }

  /**
   * Sets table data
   */
  public setTableData(): void {
    this.reasonsPresenter.reasons = this.baseResponse;
    this.reasonsPresenter.setTableData();
  }


  /**
   * Adds addNewReasons
   */
  public addNewReasons(): void {
    this.addNewReasonsForm = !this.addNewReasonsForm;
  }

  /**
   * Adds addNewReasonsNotPicked
   */
  public closeForm(event: boolean): void {
    this.addNewReasonsForm = event;
    this.closeReasonForm.emit(event);
  }

  /** Initializes default properties for the component */
  private initProperty(): void {
    this.selectedReasonss = new Set();
    this.isCheckAll = false;
    this.tableProp = new Subject();
    this.tableProperty = new TableProperty();
    this.pageSize = pageCount;
    this.destroy = new Subject();
    this.getReasons = new EventEmitter<TableProperty>();
    this.deleteReasons = new EventEmitter<Reasons>();
    this.addReasons = new EventEmitter();
    this.closeReasonForm = new EventEmitter();
  }
}
