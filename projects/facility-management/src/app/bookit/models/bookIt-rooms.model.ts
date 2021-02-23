/** model for room master data */
export class RoomMaster {
    public room: string;
    public roomId: number;
}

/** model for room layout master data */
export class RoomLayoutMaster {
    public roomLayout?: string;
    public roomLayoutId?: number;
    public roomLayoutImage?: string;

    constructor(roomLayout: string, roomLayoutId: number, roomLayoutImage: string) {
        this.roomLayout = roomLayout;
        this.roomLayoutId = roomLayoutId;
        this.roomLayoutImage = roomLayoutImage;
    }
}

/** model for facility data */
export class Facility {
    public facilitiesId: number;
    public facility: string;
    public instruction: string | null;
    public isText: boolean;
}

/** model for amenities data */
export class Amenity {
    public amenities: string;
    public amenitiesId: number;
    public quantity: number;
}

/** model for catering data */
export class Catering {
    public cateringTypeId: number;
    public cateringType: string;
    public isOther: boolean;
    public instruction: string;
}

/** model for catering company information */
export class CateringCompanyInformation {
    public companyName?: string;
    public contactPersonName?: string;
    public phoneNumber?: string;
    public arrivalTime?: string;
}

/** model for bookit room search params */
export class BookItRoomSearchParams {
    constructor(
        public date?: Date,
        public startTime?: string,
        public endTime?: string,
        public setupBuffer?: string,
        public cleanupBuffer?: string,
        public noOfPeople?: number,
        public clientId?: number
    ) {
        this.date = date;
        this.startTime = startTime;
        this.endTime = endTime;
        this.setupBuffer = setupBuffer;
        this.cleanupBuffer = cleanupBuffer;
        this.clientId = clientId;
    }
}

/** model for room search api request */
export class BookItRoomSearchParamsRequest {
    constructor(
        public date?: string,
        public timeFrom?: string,
        public timeTo?: string,
        public setupBuffer?: number,
        public cleanupBuffer?: number,
        public noOfPeople?: number,
        public clientId?: number
    ) {
        this.date = date;
        this.timeFrom = timeFrom;
        this.timeTo = timeTo;
        this.setupBuffer = setupBuffer;
        this.cleanupBuffer = cleanupBuffer;
        this.clientId = clientId;
    }
}

/** model for bookit room layout seach params */
export class BookItRoomLayoutSearchParams {
    public roomId: number;
    public noOfPeople: number;
}

