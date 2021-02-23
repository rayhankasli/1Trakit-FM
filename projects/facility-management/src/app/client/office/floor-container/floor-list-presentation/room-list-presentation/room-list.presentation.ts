
/**
 * @author Ronak Patel
 * @description This is data table presentation component.To represent get data from container component and render to dom.
 */
import { BreakpointState } from '@angular/cdk/layout';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, HostBinding, Inject, Input, NgZone, OnDestroy, OnInit, Output, QueryList, ViewChild, ViewChildren, ViewContainerRef } from '@angular/core';
import { pageCount, SortingOrder, SortingOrderDirective, TableProperty } from 'common-libs';
import { BaseCloseSelectDropdown } from 'projects/facility-management/src/app/core/base-classes/base-close-select-dropdown';
import { Observable } from 'rxjs/Observable';
import { takeUntil } from 'rxjs/operators/takeUntil';
import { Subject } from 'rxjs/Subject';
// ---------------------------------------------------------- //
import { Permission } from '../../../../../core/enums/role-permissions.enum';
import { Room, RoomLayout, RoomLayoutMaster, RoomType } from '../../../office.model';
import { RoomListPresenter } from '../room-list-presenter/room-list.presenter';

/**
 * RoomListPresentationComponent
 */
@Component({
  selector: 'app-room-list-ui',
  templateUrl: './room-list.presentation.html',
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [RoomListPresenter]
})
export class RoomListPresentationComponent extends BaseCloseSelectDropdown implements OnInit, OnDestroy {

  @HostBinding('class') public class: string;
  @Input() public set roomLayouts(layouts: RoomLayoutMaster[]) {
    if (layouts) {
      this._roomLayouts = layouts;
    }
  }
  public get roomLayouts(): RoomLayoutMaster[] {
    return this._roomLayouts;
  }

  /** This property is used for get data from container component */
  @Input() public set rooms(rooms: Room[]) {
    if (rooms) {
      this._rooms = rooms;
    }
  };
  public get rooms(): Room[] {
    return this._rooms;
  }
  /** This property is used for get data from container component */
  @Input() public set roomTypes(roomTypes: RoomType[]) {
    if (roomTypes) {
      this._roomTypes = roomTypes;
    }
  };
  public get roomTypes(): RoomType[] {
    return this._roomTypes;
  }

  /**
   * This enum is return floor enums props.
   */
  public get roomEnum(): typeof Permission.FloorsRoom {
    return Permission.FloorsRoom;
  }

  /** This property is used for emit data to container component */
  @Output() public addRoom: EventEmitter<Room>;
  /** This property is used for emit data to container component */
  @Output() public addRoomType: EventEmitter<RoomType>;
  /** This property is used for emit data to container component */
  @Output() public updateRoom: EventEmitter<Room>;
  /** This property is used for emit data to container component */
  @Output() public closeForm: EventEmitter<boolean>;

  /** This property is used for emit data to container component */
  @Output() public getRooms: EventEmitter<TableProperty>;
  /** This property is used for emit data to container component */
  @Output() public getRoomTypes: EventEmitter<void>;

  /** This property is used for emit data to container component */
  @Output() public deleteRoom: EventEmitter<Room>;

  /**
   * View child of customer list presentation component
   */
  @ViewChild('container', { read: ViewContainerRef, static: false }) public container: ViewContainerRef;

  /** This property is used to store QueryList of SortingOrderDirective */
  @ViewChildren(SortingOrderDirective) public sortingColumns: QueryList<SortingOrderDirective>;

  /** This property is used to store the selected Rooms */
  public selectedRooms: Set<Room>;

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

  /** This property is used for form open state or note */
  public formOpen: boolean;

  /** create for getter setter */
  private _rooms: Room[];

  /** create for getter setter */
  private _roomTypes: RoomType[];

  /** Room-layouts list master */
  private _roomLayouts: RoomLayoutMaster[];

  constructor(
    public roomPresenter: RoomListPresenter,
    public changeDetection: ChangeDetectorRef,
    @Inject('Window') window: Window,
    zone: NgZone
  ) {
    super(window, zone);
    this.window = window as Window;
    this.initProperty();
    this.class = 'd-flex flex-column overflow-hidden';
  }

  public ngOnInit(): void {
    this.roomPresenter.setTableProp$.pipe(takeUntil(this.destroy)).subscribe((tableProperty: TableProperty) => {
      this.getRooms.emit(tableProperty);
      this.tableProperty = tableProperty;
    });
    this.roomPresenter.deleteRecord$.pipe(takeUntil(this.destroy)).subscribe((room: Room) => { this.deleteRoom.emit(room) });
  }

  /** create for open room form */
  public addForm(): void {
    this.formOpen = !this.formOpen;
    this.formOpen && this.getRoomTypes.emit();
    this.closeEditForm();
  }

  /** create for add room */
  public add(value: Room): void {
    this.formOpen = false;
    this.addRoom.emit(value)
  }

  /** create for add room type */
  public onAddRoomType(value: RoomType): void {
    this.addRoomType.emit(value);
  }

  /** create for update room  */
  public update(value: Room): void {
    this.rooms = this.roomPresenter.closeForm(this.rooms);
    this.updateRoom.emit(value)
  }

  /** create for get room type */
  public onGetRoomTypes(): void {
    this.getRoomTypes.emit();
  }

  /** create for open edit form */
  public openEditForm(room: Room): void {
    this.formOpen = false;
    this.getRoomTypes.emit();
    this.rooms = this.roomPresenter.closeForm(this.rooms, room);
  }
  /** create for close form */
  public closeEditForm(): void {
    this.rooms = this.roomPresenter.closeForm(this.rooms);
  }
  /**
   * This method is invoked when the user clicks on sorting icons. It sets the sort related criteria and queries the server
   * to get the updated list of rooms.
   * @param column The column on which sorting needs to be performed. 
   * @param sortingOrder The sort order by which the column needs to be sorted.
   */
  public onSortOrder(column: string, sortingOrder: SortingOrder): void {
    this.roomPresenter.onSortOrder(column, sortingOrder, this.sortingColumns);
  }

  /** create for open modal when action perform */
  public openModal(room: Room): void {
    this.roomPresenter.openModal(room);
  }

  /** Used to create room-layout label for list */
  public getRoomLayoutLabel(roomLayouts: RoomLayout[]): string {
    const arr: RoomLayout[] = [...roomLayouts];
    let label: string = '';
    const first: RoomLayout = arr.splice(0, 1).pop();
    const more: number = arr.length;
    label += first ? `${first.roomLayout}` : '-';
    label += more > 0 ? ` (+${more})` : '';
    return label;
  }

  /** Initializes default properties for the component */
  private initProperty(): void {
    this.selectedRooms = new Set();
    this.isCheckAll = false;
    this.tableProp = new Subject();
    this.tableProperty = new TableProperty();
    this.pageSize = pageCount;
    this.destroy = new Subject();
    this.getRooms = new EventEmitter<TableProperty>();
    this.getRoomTypes = new EventEmitter<void>();
    this.deleteRoom = new EventEmitter<Room>();
    this.addRoom = new EventEmitter<Room>();
    this.addRoomType = new EventEmitter<RoomType>();
    this.updateRoom = new EventEmitter<Room>();
    this.closeForm = new EventEmitter<boolean>();
  }
}
