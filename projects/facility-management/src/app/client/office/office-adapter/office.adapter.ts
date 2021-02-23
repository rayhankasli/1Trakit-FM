/**
 * @author Enter Your Name Here.
 * @description This is adapter service use for transforming data base user requirement. 
 */

import { Injectable } from '@angular/core';
import { Adapter } from 'common-libs';
// ------------------------------------------- //
import { Office, Room, RoomResponse, Floor, FloorResponse, RoomType, RoomLayoutMaster } from '../office.model';
import { environment } from '../../../../environments/environment';

/******************************************
 ************ Floors & Rooms **************
 ******************************************/
@Injectable()
export class OfficeAdapter implements Adapter<Office> {

    /** This method is used to transform response object into T object. */
    public toResponse(item: Office): Office {
        const office: Office = new Office(
            item.officeName,
            item.nickName,
            item.address1,
            item.address2,
            item.zipcode,
            item.stateId,
            item.cityId,
            item.city,
            item.state,
            item.lastOffice,
            item.officeId,
            item.floorCount
        );
        return office;
    }

    /** This method is used to transform T object into request object. */
    public toRequest(item: Office): Office {
        const office: Office = new Office(
            item.officeName,
            item.nickName,
            item.address1,
            item.address2,
            item.zipcode,
            item.stateId,
            item.cityId
        );
        return office;
    }
}

@Injectable()
export class RoomAdapter implements Adapter<Room> {

    /** This method is used to transform response object into T object. */
    public toResponse(item: RoomResponse): Room {
        const room: Room = new Room(
            item.roomId,
            item.roomTypeId,
            item.roomType,
            item.roomName,
            item.location,
            item.email,
            item.roomLayouts
        );
        return room;
    }

    /** This method is used to transform T object into request object. */
    public toRequest(item: Room): RoomResponse {
        const room: RoomResponse = new RoomResponse();
        room.roomTypeId = item.roomTypeId;
        room.roomName = item.name;
        room.location = item.location;
        room.email = item.email;
        room.roomLayouts = item.roomLayouts;
        return room;
    }
}
@Injectable()
export class FloorAdapter implements Adapter<Floor> {
    constructor(private roomAdapter: RoomAdapter) { }
    /** This method is used to transform response object into T object. */
    public toResponse(item: FloorResponse): Floor {
        const floor: Floor = new Floor(
            item.floorId,
            item.floorNickName,
            item.floorType,
            item.isActive,
            item.floorRooms.length,
            item.floorRooms.map((room: any) => this.roomAdapter.toResponse(room))
        );
        return floor;
    }

    /** This method is used to transform T object into request object. */
    public toRequest(item: Floor): FloorResponse {
        const floor: FloorResponse = new FloorResponse();
        floor.floorType = item.floorType;
        floor.floorNickName = item.nickName;
        return floor;
    }
}

@Injectable()
export class RoomTypeAdapter implements Adapter<RoomType>{
    /** This method is used to transform T object into request object. */
    public toResponse(item: RoomType): RoomType {
        const roomType: RoomType = new RoomType();
        roomType.roomTypeId = item.roomTypeId;
        roomType.roomType = item.roomType;
        return roomType;
    }
    /** This method is used to transform T object into request object. */
    public toRequest(item: RoomType): RoomType {
        const roomType: RoomType = new RoomType();
        return roomType;
    }
}

@Injectable()
export class RoomLayoutMasterAdapter implements Adapter<RoomLayoutMaster[]>{
    /** This method is used to transform T object into request object. */
    public toResponse(item: RoomLayoutMaster[]): RoomLayoutMaster[] {
        return item.map(layout => {
            const roomLayout: RoomLayoutMaster = new RoomLayoutMaster();
            roomLayout.roomLayout = layout.roomLayout;
            roomLayout.roomLayoutId = layout.roomLayoutId;
            roomLayout.roomLayoutImage = layout.roomLayoutImage;
            roomLayout.roomLayoutImagePath = layout.roomLayoutImage ? this.getFilePath(layout.roomLayoutImage) : layout.roomLayoutImage;
            return roomLayout;
        });
    }

    /** Get full path for the client logo file */
    private getFilePath(fileName: string): string {
        return `${environment.base_host_url}RoomLayouts/${fileName}`;
    }
}