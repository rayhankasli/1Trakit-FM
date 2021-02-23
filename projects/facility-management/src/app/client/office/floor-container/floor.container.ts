

/**
 * @name FloorContainerComponent
 * @author Ronak Patel.
 * @description This is a container component for Floor. This is responsible for all data retrieving and posting to the server by http calls.
 */
import { Component, HostBinding } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs';
//--------------------------------------------------------------------//
import { TableProperty } from 'common-libs';
//--------------------------------------------------------------------//
import { Floor, RoomType, Room, FloorResult, RoomLayoutMaster } from '../office.model';
import { FloorService } from '../floor.service';

/**
 * FloorContainerComponent
 */
@Component({
  selector: 'app-floor-container',
  templateUrl: './floor.container.html',
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class FloorContainerComponent {

  /** This property is used for add class host element */
  @HostBinding('class') public class: string;
  /** This is a observable which passes the list of floor to its child component */
  public floors$: Observable<Floor[]>;
  /** This is a observable which passes the list of room to its child component */
  public rooms$: Observable<Room[]>;
  /** This is a observable which passes the list of room to its child component */
  public roomTypes$: Observable<RoomType[]>;
  /** This is an observable for getting room-layout list master */
  public roomLayouts$: Observable<RoomLayoutMaster[]>;

  /** Determines whether  deleted */
  public isRoomDeleted: boolean;

  /** Determines whether  deleted */
  public isFloorDeleted: boolean;
  /** this property is for stor floor table property */
  public floorTableProperty: TableProperty;
  /** this property is for stor room table property */
  public roomTableProperty: TableProperty;
  /** This property is used for stor office id */
  public officeId: string;
  /** This property is used for stor client id */
  public clientId: string;
  /** This property is used for stor floor  id */
  public floorId: number;
  constructor(
    private floorService: FloorService,
    private route: ActivatedRoute
  ) {
    this.class = 'flex-grow-1 overflow-auto';
    this.officeId = this.route.snapshot.paramMap.get('id');
    this.clientId = this.route.parent.parent.snapshot.paramMap.get('id');
    this.floorTableProperty = new TableProperty();
    const floorResult: FloorResult = this.route.snapshot.data['floors'];
    this.floors$ = of(floorResult.floors);
    this.getRoomLayouts();
  }

  /** This Method is used to get data from server  */
  public getFloors(tableProperty: TableProperty, officeId?: string): void {
    this.floorTableProperty = tableProperty;
    this.floors$ = this.floorService.getFloors(tableProperty, this.officeId);
  }

  /** This Method is delete data from server  */
  public deleteFloor(floor: Floor): void {
    this.floorService.deleteFloor(this.officeId, floor).subscribe(() => {
      this.getFloors(this.floorTableProperty, this.officeId);
    });
  }

  /** When presentation layer emits the save event, then this will post data on server */
  public addFloor(floor: Floor): void {
    this.floorService.addFloor(this.officeId, floor).subscribe(() => {
      this.getFloors(this.floorTableProperty, this.officeId);
    });
  }

  /** When presentation layer emits the save event, then this will post data on server */
  public updateFloor(floor: Floor): void {
    this.floorService.updateFloor(floor).subscribe(() => {
      this.getFloors(this.floorTableProperty, this.officeId);
    });
  }

  /**
   * getRoomType
   */
  public getRoomTypes(): void {
    this.roomTypes$ = this.floorService.getRoomType(this.clientId);
  }

  /** This Method is delete data from server  */
  public deleteRoom(room: Room): void {
    this.floorService.deleteRoom(this.floorId, room).subscribe(() => {
      this.getFloors(this.floorTableProperty, this.officeId);
    });
  }

  /** When presentation layer emits the save event, then this will post data on server */
  public addRoom(data: any): void {
    this.floorService.addRoom(data.id, data.room).subscribe(() => {
      this.getFloors(this.floorTableProperty, this.officeId);
    });
  }

  /** When presentation layer emits the save event, then this will post data on server */
  public addRoomType(room: RoomType): void {
    this.floorService.addRoomType(room, this.clientId).subscribe(() => {
      this.roomTypes$ = this.floorService.getRoomType(this.clientId);
    });
  }

  /** When presentation layer emits the save event, then this will post data on server */
  public updateRoom(room: Room): void {
    this.floorService.updateRoom(room).subscribe(() => {
      this.getFloors(this.floorTableProperty, this.officeId);
    });
  }

  /** onToggleFloorStatus */
  public onToggleFloorStatus(status: any): void {
    this.floorService.toggleFloorStatus(status).subscribe(() => {
      this.getFloors(this.floorTableProperty, this.officeId);
    });
  }

  /** Get room-layout masters list */
  public getRoomLayouts(): void {
    this.roomLayouts$ = this.floorService.getRoomLayouts();
  }
}
