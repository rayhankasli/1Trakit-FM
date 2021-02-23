
/**
 * @author Rayhan Kasli
 * @description This is data table presentation component.To represent get data from container component and render to dom.
 */
import { 
  Component, OnInit, ViewChildren, QueryList, Input, Output, EventEmitter, ChangeDetectionStrategy, OnDestroy, 
  ViewContainerRef, ViewChild, ChangeDetectorRef, NgZone, Inject
} from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { takeUntil } from 'rxjs/operators/takeUntil';
import { BreakpointState } from '@angular/cdk/layout';
// ---------------------------------------------------------- //
import { TableProperty, SortingOrderDirective, pageCount } from 'common-libs';
import { Slots, SlotFilterRequest, SlotListStatus, SLOT_STATUS_OPTION } from '../../../mail-configurations.model';
import { SlotsListPresenter } from '../slots-list-presenter/slots-list.presenter';
import { SlotsListPresentationBase } from '../slots-list-presentation-base/slots-list.presentation.base';
import { Permission } from '../../../../core/enums/role-permissions.enum'

/**
 * SlotsListPresentationComponent
 */
@Component({
  selector: 'app-slots-list-ui',
  templateUrl: './slots-list.presentation.html',
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [SlotsListPresenter]
})
export class SlotsListPresentationComponent extends SlotsListPresentationBase implements OnInit, OnDestroy {

  /** This property is used for get data from container component */
  @Input() public set baseResponse(baseResponse: Slots[]) {
    if (baseResponse) {
      this._baseResponse = baseResponse;
      this.setTableData();
    }
  };
  public get baseResponse(): Slots[] {
    return this._baseResponse;
  }

  /** This property is used for get delete record or not. */
  @Input() public isDeleted: boolean;

  /** This property is used for emit data to container component */
  @Output() public getSlots: EventEmitter<TableProperty<SlotFilterRequest>>;

  /** This property is used for emit data to container component */
  @Output() public deleteSlots: EventEmitter<Slots>;
  
  /** This property is used for emit data to container component */
  @Output() public addNewSlotData: EventEmitter<Slots>;

  /** setSlotStatus */
  @Output() public setSlotStatus: EventEmitter<Slots> = new EventEmitter();

  /** View child of customer list presentation component */
  @ViewChild('container', { read: ViewContainerRef, static: true }) public container: ViewContainerRef;
  
  /** This property is used to store QueryList of SortingOrderDirective */
  @ViewChildren(SortingOrderDirective) public sortingColumns: QueryList<SortingOrderDirective>;

  /** Client status */
  public status: SlotListStatus[] = SLOT_STATUS_OPTION;
  /** Status dropdown model */
  public statusOption: boolean;
  /** User role is super user */
  public isSuperUser: boolean;
  

  /**
   * This enum is return offices enum props.
   */
  public get slotsEnum(): typeof Permission.Slot {
    return Permission.Slot;
  }

  /** This property is used to store the selected Slotss */
  public selectedSlotss: Set<Slots>;

  /** This property is used to store the criteria that are selected by the user */
  public tableProperty: TableProperty<SlotFilterRequest>;

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

  /**
   * Add slot of slots list presenter
   */
  public addSlotForm: boolean;

  /** create for getter setter */
  private _baseResponse: Slots[];
  /** create for getter setter */
  private _closeForm: boolean;
  
  constructor(
    public slotsPresenter: SlotsListPresenter,
    public changeDetection: ChangeDetectorRef,
    @Inject('Window') window: Window,
    zone: NgZone
    ) {
    super(slotsPresenter, changeDetection, window, zone);
    this.initProperty();
  }

  public ngOnInit(): void {
    this.slotsPresenter.setTableProp$.pipe(takeUntil(this.destroy)).subscribe((tableProperty: TableProperty<SlotFilterRequest>) => {
        this.getSlots.emit(tableProperty);
        this.tableProperty = tableProperty;
        this.statusOption = tableProperty.filter.isActive;   
    });
    this.slotsPresenter.deleteRecord$.pipe(takeUntil(this.destroy)).subscribe((slots: Slots) => { this.deleteSlots.emit(slots) });
    this.slotsPresenter.tableProp$.subscribe((value: TableProperty) => {
      this.tableProperty = value;
    });
  }

  /** Sets table data */
  public setTableData(): void {
    this.isSortApply = this.slotsPresenter.sortApply(this.tableProperty.sort);
    this.slotsPresenter.slotss = this.baseResponse;
    this.slotsPresenter.setTableData();
  }

  /**
   * Filter status on Slot list change active,in-active
   * @param status Filter status
   */
  public onStatusChange(status: SlotListStatus): void {
    this.slotsPresenter.onStatusChange(status.statusValue);
    this.addSlotForm && this.closeSlotsForm(false);
  }
  
  /** Adds new slot */
  public addNewSlot(): void {
    this.addSlotForm = !this.addSlotForm;
  }

  /** toggleSlotStatus */
  public toggleSlotStatus(slots: Slots): void{
    this.setSlotStatus.emit(slots);
  }


  /** closeSlotsForm */
  public closeSlotsForm(event: boolean): void {
    this.addSlotForm = event;
  }

  /** Initializes default properties for the component */
  private initProperty(): void {
    this.selectedSlotss = new Set();
    this.isCheckAll = false;
    this.tableProp = new Subject();
    this.tableProperty = new TableProperty();
    this.pageSize = pageCount;
    this.destroy = new Subject();
    this.getSlots= new EventEmitter<TableProperty<SlotFilterRequest>>(true);
    this.deleteSlots= new EventEmitter<Slots>();
    this.addNewSlotData = new EventEmitter<Slots>();
    this.setSlotStatus = new EventEmitter<Slots>();
  }
}
