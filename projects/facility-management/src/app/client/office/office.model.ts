/**
 * @author Ronak Patel.
 * @description
 */
import { InjectionToken } from '@angular/core';
import { SortingOrder } from 'common-libs';

/** model class for Office */
export class Office {
    /** officeName  of Office */
    public officeName: string;
    /** nickName  of Office */
    public nickName: string;
    /** address1  of Office */
    public address1: string;
    /** address2  of Office */
    public address2: string;
    /** city  of Office */
    public city: string;
    /** state  of Office */
    public state: string;
    /** zip  of Office */
    public zipcode: string;
    /** This property for last office   */
    public lastOffice: string;
    /** This property for officeId */
    public officeId: number;
    /** This property for stateId */
    public stateId: number;
    /** This property for cityid */
    public cityId: number;
    /** This property is  */
    public isEditable: boolean;
    public floorCount: number;
    constructor(
        officeName?: string,
        nickName?: string,
        address1?: string,
        address2?: string,
        zipcode?: string,
        stateId?: number,
        cityId?: number,
        city?: string,
        state?: string,
        lastOffice?: string,
        officeId?: number,
        floorCount?: number,
        isEditable?: boolean
    ) {
        this.officeName = officeName;
        this.nickName = nickName;
        this.address1 = address1;
        this.address2 = address2;
        this.city = city;
        this.state = state;
        this.zipcode = zipcode;
        this.lastOffice = lastOffice;
        this.officeId = officeId;
        this.stateId = stateId;
        this.cityId = cityId;
        this.isEditable = isEditable;
        this.floorCount = floorCount;
    }
}
/** Model class for sortRecord. */
export class OfficeSortRecord {
    /** This property is use for which type of sorting apply by user. */
    public sortBy: SortingOrder;
    /** This property is used for sort field . */
    public sortColumn: string;
}

export const OFFICE_SORT: InjectionToken<OfficeSortRecord> = new InjectionToken<OfficeSortRecord>('officeSort');


/** model class for Floor */
export class Floor {
    /** This property is use for floor id */
    public id: number;
    /** This property is use for floor nickName */
    public nickName: string;
    /** This property is use for floor floorType */
    public floorType: number;
    /** This property is use for floor status */
    public status: boolean;
    /** This property is use for floor totalRoom */
    public totalRoom: number;
    /** This property is use for floor rooms */
    public rooms: Room[];
    public isEditable: boolean;
    constructor(
        id?: number,
        nickName?: string,
        floorType?: number,
        status?: boolean,
        totalRoom?: number,
        rooms?: Room[]
    ) {
        this.id = id;
        this.nickName = nickName;
        this.floorType = floorType;
        this.status = status;
        this.totalRoom = totalRoom;
        this.rooms = rooms;
    }
}
/** This is floorResponse class */
export class FloorResponse {
    /** This property is used for floor Response */
    public floorId: number;
    /** This property is used for floor Response */
    public floorNickName: string;
    /** This property is used for floor Response */
    public floorType: number;
    /** This property is used for floor Response */
    public isActive: boolean;
    /** This property is used for floor Response */
    public floorRooms: Room[]

}
/** model class for Room */
export class Room {
    /** This property is for email of roomResponse */
    public email: string;
    /** This property is for roomLayouts of roomResponse */
    public roomLayouts: RoomLayout[];
    /** roomType. */
    public roomType: string;
    /** name. */
    public name: string;
    /** location. */
    public location: string;
    /** This property is use for room  */
    public isEditable: boolean;
    /** This property is use for room  */
    public roomId: number;
    /** This property is use for room  */
    public floorId: number;
    public roomTypeId: number;
    constructor(
        roomId?: number,
        roomTypeId?: number,
        roomType?: string,
        name?: string,
        location?: string,
        email?: string,
        roomLayouts?: RoomLayout[],
    ) {
        this.roomId = roomId;
        this.roomType = roomType;
        this.name = name;
        this.location = location;
        this.roomTypeId = roomTypeId
        this.email = email;
        this.roomLayouts = roomLayouts;
    }

}
/** This is RoomResponse class */
export class RoomResponse {

    /** This property is for email of roomResponse */
    public email: string;
    /** This property is for roomLayouts of roomResponse */
    public roomLayouts: RoomLayout[];
    /** This property is for roomResponse */
    public roomId: number;
    /** This property is for roomResponse */
    public roomTypeId: number;
    /** This property is for roomResponse */
    public roomType: string;
    /** This property is for roomResponse */
    public roomName: string;
    /** This property is for roomResponse */
    public location: string;
}
/** Room Layout Detail */
export class RoomLayout {
    public roomLayoutId: number;
    public roomLayout: string;
    public roomLayoutImage: string;
    public noOfPerson: number;
    public floorRoomLayoutId: number;
    constructor({ roomLayoutId, roomLayout, roomLayoutImage, noOfPerson, floorRoomLayoutId }: any) {
        this.roomLayoutId = roomLayoutId;
        this.roomLayout = roomLayout;
        this.roomLayoutImage = roomLayoutImage;
        this.noOfPerson = noOfPerson;
        this.floorRoomLayoutId = floorRoomLayoutId;
    }
}

/** Room layout master */
export class RoomLayoutMaster {
    public roomLayoutId: number;
    public roomLayout: string;
    public roomLayoutImage: string;
    public roomLayoutImagePath?: string;
    public isChecked?: boolean;
    public noOfPerson?: number;
}
/** This is roomType class */
export class RoomType {
    /** This property is use for room type  */
    public roomTypeId: number;
    /** This property is use for room type  */
    public roomType: string;
    constructor(
        roomTypeId?: number,
        roomType?: string
    ) {
        this.roomTypeId = roomTypeId;
        this.roomType = roomType;

    }
}
/** Model class for sortRecord. */
export class RoomSortRecord {
    /** This property is use for which type of sorting apply by user. */
    public sortBy: SortingOrder;
    /** This property is used for sort field . */
    public sortColumn: string;
}

export const ROOM_SORT: InjectionToken<RoomSortRecord> = new InjectionToken<RoomSortRecord>('roomSort');
/** This mode create for state */
export class State {
    /** stateId */
    public stateId: number;
    /** state */
    public state: string;
}

/** This mode create for state */
export class City {
    /** cityId */
    public cityId: number;
    /** city */
    public city: string;
}
/** officeResult class */
export class OfficeResult {
    /** property for last office */
    public lastOffice: string;
    /** property for office list */
    public offices: Office[]
}

export class Status {
    status: boolean;
}
export class ToggleStatus {
    id: number;
    status: boolean;
}
export class FloorResponseResult {
    public officeName: string;
    public floors: FloorResponse[];
}
export class FloorResult {
    public officeName: string;
    public floors: Floor[];
}   
