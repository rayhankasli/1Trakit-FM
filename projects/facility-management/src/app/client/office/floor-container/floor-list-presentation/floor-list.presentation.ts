
/**
 * @author Ronak Patel.
 * @description This is data table presentation component.To represent get data from container component and render to dom.
 */
import { BreakpointState } from '@angular/cdk/layout';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { NgbAccordion } from '@ng-bootstrap/ng-bootstrap';
// ---------------------------------------------------------- //
import { pageCount, TableProperty } from 'common-libs';
import { Observable } from 'rxjs/Observable';
import { takeUntil } from 'rxjs/operators/takeUntil';
import { Subject } from 'rxjs/Subject';
import { BasePresentation } from '../../../../core/base-classes/base.presentation';
import { Permission } from '../../../../core/enums/role-permissions.enum';
import { Floor, Room, RoomLayoutMaster, RoomType, ToggleStatus } from '../../office.model';
import { FloorListPresenter } from '../floor-list-presenter/floor-list.presenter';

/**
 * FloorListPresentationComponent
 */
@Component({
  selector: 'app-floor-list-ui',
  templateUrl: './floor-list.presentation.html',
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [FloorListPresenter]
})
export class FloorListPresentationComponent extends BasePresentation implements OnInit, OnDestroy {

  @Input() public set roomLayouts(layouts: RoomLayoutMaster[]) {
    if (layouts) {
      this._roomLayouts = layouts;
    }
  }
  public get roomLayouts(): RoomLayoutMaster[] {
    return this._roomLayouts;
  }

  /** This property is used for get data from container component */
  @Input() public set floors(floors: Floor[]) {
    if (floors) {
      let floor: Floor = floors.find((data: Floor) => data.id === this.floorId);
      this.rooms = floor && floor.rooms;
      this._floors = floors;
    }
  };
  public get floors(): Floor[] {
    return this._floors;
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
  public get floorEnum(): typeof Permission.Floor {
    return Permission.Floor;
  }

  /**
   * This enum is return floor enums props.
   */
  public get roomEnum(): typeof Permission.FloorsRoom {
    return Permission.FloorsRoom;
  }

  /** This property is used for emit data to container component */
  @Output() public getFloors: EventEmitter<TableProperty>;

  /** This property is used for emit data to container component */
  @Output() public deleteFloor: EventEmitter<Floor>;
  /** This property is used for emit data to container component */
  @Output() public addFloor: EventEmitter<Floor>;
  /** This property is used for emit data to container component */
  @Output() public updateFloor: EventEmitter<Floor>;
  /** This property is used for emit data to container component */
  @Output() public getRoomTypes: EventEmitter<void>;
  /** This property is used for emit data to container component */
  @Output() public addRoom: EventEmitter<any>;
  /** This property is used for emit data to container component */
  @Output() public addRoomType: EventEmitter<RoomType>;
  /** This property is used for emit data to container component */
  @Output() public updateRoom: EventEmitter<Room>;
  /** This property is used for emit data to container component */
  @Output() public deleteRoom: EventEmitter<Room>;
  /** This property is used for emit data to container component */
  @Output() public toggleFloorStatus: EventEmitter<ToggleStatus>;

  /** This property is used to store the selected Floors */
  public selectedFloors: Set<Floor>;

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
  /** property is used for store floor id */
  public floorId: number;
  /** View child of user presentation component   */
  @ViewChild('accordion', { read: NgbAccordion, static: false }) public accordionComponent: NgbAccordion;
  /** Floors of floor list presentation base */
  private _floors: Floor[];
  /** Rooms of room list presentation base */
  private _rooms: Room[];
  /** Room-layouts list master */
  private _roomLayouts: RoomLayoutMaster[];
  /** roomtypes */
  private _roomTypes: RoomType[];


  /** create for  */
  private destroy: Subject<boolean>;
  /** It will return list of active panel ids */
  public get activeIds(): string[] {
    return this.floorPresenter.activeIds;
  }

  constructor(
    public floorPresenter: FloorListPresenter,
    public changeDetection: ChangeDetectorRef
  ) {
    super();
    this.initProperty();
  }

  public ngOnInit(): void {
    this.floorPresenter.setTableProp$.pipe(takeUntil(this.destroy)).subscribe((tableProperty: TableProperty) => {
      this.getFloors.emit(tableProperty);
      this.tableProperty = tableProperty;
    });
    this.floorPresenter.deleteFloor$.pipe(takeUntil(this.destroy)).subscribe((floor: Floor) => { this.deleteFloor.emit(floor) });
    this.floorPresenter.addFloor$.pipe(takeUntil(this.destroy)).subscribe((floor: Floor) => { this.addFloor.emit(floor) });
    this.floorPresenter.updateFloor$.pipe(takeUntil(this.destroy)).subscribe((floor: Floor) => { this.updateFloor.emit(floor) });
    this.floorPresenter.isEditable$.pipe(takeUntil(this.destroy)).subscribe(
      () => { this.floors = this.floorPresenter.toggleEditable(this.floors); this.changeDetection.detectChanges() });
  }


  /**
   * This method is invoked when the user performs a global search. It resets the selected rows, updates the criteria
   * and then gets the new list of Floor based on updated criteria.
   * @param searchTerm The search string that has been searched by the user
   */
  public onSearch(searchTerm: string): void {
    this.floorPresenter.onSearch(searchTerm);
  }


  /** create for open modal when action perform */
  public openModal(floor: Floor): void {
    this.floorPresenter.openModal(floor);
  }

  /** create for open form */
  public openForm(elementRef: ElementRef, floor?: Floor): void {
    this.floorPresenter.openForm(elementRef, floor);
    this.floors = this.floorPresenter.toggleEditable(this.floors, floor);
  }

  /** destroy */
  public ngOnDestroy(): void {
    this.destroy.next(true);
    this.destroy.unsubscribe();
  }

  /** create for accordion open and close */
  public onOpen(floor: Floor): void {
    this.floorId = floor.id;
    this.rooms = floor.rooms;
  }

  /** create gor get room types. */
  public onGetRoomTypes(): void {
    this.getRoomTypes.emit();
  }

  /** create for add room */
  public onAddRoom(value: Room): void {
    this.addRoom.emit({ id: this.floorId, room: value });
  }

  /** create for add room type */
  public onAddRoomType(room: RoomType): void {
    this.addRoomType.emit(room)
  }

  /** create for update room */
  public onUpdateRoom(room: Room): void {
    room.floorId = this.floorId;
    this.updateRoom.emit(room)
  }

  /** create for delete room */
  public onDeleteRoom(room: Room): void {
    this.deleteRoom.emit(room)
  }

  /** This method is for toggle status */
  public onToggleStatus(floor: Floor): void {
    this.toggleFloorStatus.emit({ id: floor.id, status: floor.status ? false : true });
  }

  /** Initializes default properties for the component */
  private initProperty(): void {
    this.selectedFloors = new Set();
    this.isCheckAll = false;
    this.tableProp = new Subject();
    this.tableProperty = new TableProperty();
    this.pageSize = pageCount;
    this.destroy = new Subject();
    this.getFloors = new EventEmitter();
    this.deleteFloor = new EventEmitter();
    this.addRoom = new EventEmitter();
    this.addRoomType = new EventEmitter();
    this.updateRoom = new EventEmitter();
    this.deleteRoom = new EventEmitter();
    this.addFloor = new EventEmitter();
    this.updateFloor = new EventEmitter();
    this.getRoomTypes = new EventEmitter();
    this.toggleFloorStatus = new EventEmitter();
  }
}
