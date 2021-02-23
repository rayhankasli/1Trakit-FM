
/**
 * @author Enter Your Name Here.
 * @description
 */
import { InjectionToken } from '@angular/core';
// ----------------------------------------------- //
import { SortingOrder } from 'common-libs';
// ----------------------------------------------- //
import { ClientMaster } from '../../core/model/common.model';
import { BaseAssignee } from '../../shared/models/assignee.model';
import { BookItRepeatsOn, BookItRepeatsOnRequest } from './bookIt-repeats-on.model';
import { Amenity, Catering, CateringCompanyInformation, Facility } from './bookIt-rooms.model';

/** model class for BookItResponseModel */
export class BookItResponseModel {
  /** book it id */
  public bookItId: number;
  /** companyname  of BookIt */
  public clientName: string;
  /** eventname  of BookIt */
  public eventName: string;
  /** description  of BookIt */
  public description: string;
  /** requestedby  of BookIt */
  public requestedBy: string;
  /** date  of BookIt */
  public date: string;
  /** assignTo  of BookIt */
  public assignedTo: string;
  /** status  of BookIt */
  public statusId: number;
  public startTime: string;
  public bookItNumber: number;

  constructor(
    bookItId?: number,
    clientName?: string,
    eventName?: string,
    description?: string,
    requestedBy?: string,
    date?: string,
    assignedTo?: string,
    statusId?: number,
    startTime?: string,
    bookItNumber?: number
  ) {
    this.bookItId = bookItId;
    this.clientName = clientName;
    this.eventName = eventName;
    this.description = description;
    this.requestedBy = requestedBy;
    this.date = date;
    this.assignedTo = assignedTo;
    this.statusId = statusId;
    this.startTime = startTime;
    this.bookItNumber = bookItNumber;
  }
}
/** Model class for sortRecord. */
export class BookItSortRecord {
  /** This property is use for which type of sorting apply by user. */
  public sortBy: SortingOrder;
  /** This property is used for sort field . */
  public sortColumn: string;
}

/**
 * User detail Model
 */
export class Users {
  public userId: number;
  public userName: string;
  constructor(
    userId: number,
    userName: string,
  ) {
    this.userId = userId;
    this.userName = userName;
  }
}

/** Model class for sortRecord. */
export class CopyItListSortRecord {
  /** This property is use for which type of sorting apply by user. */
  public sortBy: SortingOrder;
  /** This property is used for sort field . */
  public sortColumn: string;
}

/** BookIt list filter model */
export interface BookItFilterRecord {
  /** clientId. */
  clientId?: number;
  /** requestedById. */
  requestedById?: Users[];
  /** assignedToId. */
  assignedToId?: Users[];
  /** copyItStatusId. */
  copyItStatusId?: Status[];
}

/** BookIt filter record request */
export class BookItFilterRecordRequest {
  /** clientId. */
  public clientId?: number;
  /** requestedById. */
  public requestedById?: number[];
  /** assignedToId. */
  public assignedToId?: number[];
  /** copyItStatusId. */
  public statusId?: number[];
}
/**
 * Status Model
 */
export class Status {
  /** status name */
  public status: string;
  /** statusId */
  public statusId: number;

  constructor(
    statusId?: number,
    status?: string,
  ) {
    this.statusId = statusId;
    this.status = status;
  }
}

export const BOOKIT_SORT: InjectionToken<BookItSortRecord> = new InjectionToken<BookItSortRecord>('bookItSort');

/** model class for BookItRequest */
export class BookItRequest {
  /** eventName. */
  public eventName: string;
  /** name. */
  public name: string;
  /** date. */
  public date: string;
  /** startTime. */
  public startTime: string;
  /** endTime. */
  public endTime: string;
  /** isRecurring. */
  public isRecurring: boolean;
  /** setupBuffer. */
  public setupBuffer: number;
  /** cleanupBuffer. */
  public cleanupBuffer: number;
  /** noOfPeople. */
  public noOfPeople: number;
  /** clioent accountId */
  public clientAccountId: string;
  public clientAccount: string;
  /** chargeTo. */
  public chargeTo: string;
  /** description. */
  public description: string;
  /** clientId. */
  public clientId: number;
  /** userId. */
  public userId: number;
  /** roomId. */
  public roomId: number;
  /** roomLayoutId. */
  public roomLayoutId: number;
  /** facility. */
  public facility: Facility[];
  /** amenities. */
  public amenities: Amenity[];
  /** catering. */
  public catering: Catering[];
  public cateringCompanyInformation?: CateringCompanyInformation;
  /** filePath. */
  public filePath: string;
  /** fileOptionId. */
  public fileOptionId: number;

  public repeatsOn?: BookItRepeatsOnRequest;

  constructor(
    eventName: string,
    name: string,
    date: string,
    startTime: string,
    endTime: string,
    setupBuffer: number,
    cleanupBuffer: number,
    noOfPeople: number,
    clientAccountId: string,
    clientAccount: string,
    description: string,
    clientId: number,
    userId: number,
    roomId: number,
    roomLayoutId: number,
    facility: Facility[],
    amenities: Amenity[],
    catering: Catering[],
    cateringCompanyInformation: CateringCompanyInformation,
    filePath: string,
    fileOptionId: number
    // repeatsOn?: BookItRepeatsOn
  ) {
    this.eventName = eventName;
    this.name = name;
    this.date = date;
    this.startTime = startTime;
    this.endTime = endTime;
    // this.isRecurring = isRecurring;
    this.setupBuffer = setupBuffer;
    this.cleanupBuffer = cleanupBuffer;
    this.noOfPeople = noOfPeople;
    this.clientAccountId = clientAccountId;
    this.clientAccount = clientAccount;
    this.description = description;
    this.clientId = clientId;
    this.userId = userId;
    this.roomId = roomId;
    this.roomLayoutId = roomLayoutId;
    this.facility = facility;
    this.amenities = amenities;
    this.catering = catering;
    this.cateringCompanyInformation = cateringCompanyInformation;
    this.filePath = filePath;
    this.fileOptionId = fileOptionId;
    // this.repeatsOn = repeatsOn;
  }

}

export class BookItRequestBody {
  public bookIt: BookItRequest;
  public files: File[]
}
/** model class for BookItResponse */
export class BookItResponse {
  public bookItId: number;
  public clientName: string;
  public eventName: string;
  public description: string;
  public requestedBy: string;
  public dueDate: Date;
  public assignedTo: string;
  public statusId: number;

  public name: string;
  public date: string;
  public startTime: string;
  public endTime: string;
  public isRecurring: boolean;
  public setupBuffer: number;
  public cleanupBuffer: number;
  public noOfPeople: number;
  public clientAccountId: string;
  public clientAccount: string;
  public isPopulateAccountNumber: boolean;
  public clientId: number;
  public userId: number;
  public fullName: string;
  public roomId: number;
  public roomName: string;
  public roomLayoutId: number;
  public roomLayoutName: string;
  public facility: Facility[];
  public amenities: Amenity[];
  public catering: Catering[];
  public cateringCompanyInformation: CateringCompanyInformation;
  public filePath: string;
  public fileOptionId: number;
  public files?: BookItFileResponse[];
  public roomLayoutImage?: string;
  public assignToId?: number;
  public assignTo?: string;
  public bookItNumber: number;
}

export class BookItListResult {
  public total: number;
  public bookItList: BookIt[];
}

/** model class for BookIt */
export class BookIt {
  public bookItId?: number;
  public eventName?: string;
  public name?: string;
  public date?: Date;
  public startTime?: string;
  public endTime?: string;
  public isRecurring?: boolean;
  public setupBuffer?: string;
  public cleanupBuffer?: string;
  public noOfPeople?: number;
  public clientAccountId?: string;
  public clientAccount?: string;
  public description?: string;
  public clientId?: number;
  public clientName?: string;
  public userId?: number;
  public fullName?: string
  public roomId?: number;
  public roomLayoutId?: number;
  public facility?: Facility[];
  public amenities?: Amenity[];
  public catering?: Catering[];
  public cateringCompanyInformation?: CateringCompanyInformation;
  public fileOptionId?: number;
  public files?: File[];
  // public files?: BookItFileResponse[];
  public filePath: string;
  public uploadedFiles?: BookItFileResponse[];
  public bookItnumber?: number;
  public requestedBy?: string;
  public statusId?: number;
  public repeatsOn?: BookItRepeatsOn;
  public isPopulateAccountNumber?: boolean;
  public assignToId?: number;
  public dueDate?: Date;
  public assignedTo?: string;
  public roomLayoutImage: string;
  public fileName: string[];
  public assignTo?: string;
  public roomName: string;
  public roomLayoutName: string;
  public bookItNumber: number;

  constructor(
    bookItNumber?: number,
    bookItId?: number,
    eventName?: string,
    description?: string,
    statusId?: number,
    name?: string,
    date?: Date,
    startTime?: string,
    endTime?: string,
    isRecurring?: boolean,
    setupBuffer?: string,
    cleanupBuffer?: string,
    noOfPeople?: number,
    clientAccountId?: string,
    clientAccount?: string,
    clientId?: number,
    clientName?: string,
    userId?: number,
    fullName?: string,
    roomId?: number,
    roomLayoutId?: number,
    facility?: Facility[],
    amenities?: Amenity[],
    catering?: Catering[],
    cateringCompanyInformation?: CateringCompanyInformation,
    filePath?: string,
    fileOptionId?: number,
    files?: BookItFileResponse[],
    isPopulateAccountNumber?: boolean,
    roomLayoutImage?: string,
    assignToId?: number,
    assignTo?: string,
    roomName?: string,
    roomLayoutName?: string
  ) {
    this.bookItNumber = bookItNumber;
    this.bookItId = bookItId;
    this.eventName = eventName;
    this.name = name;
    this.date = date;
    this.startTime = startTime;
    this.endTime = endTime;
    this.isRecurring = isRecurring;
    this.setupBuffer = setupBuffer;
    this.cleanupBuffer = cleanupBuffer;
    this.noOfPeople = noOfPeople;
    this.clientAccountId = clientAccountId;
    this.clientAccount = clientAccount;
    this.description = description;
    this.clientId = clientId;
    this.clientName = clientName
    this.userId = userId;
    this.fullName = fullName;
    this.roomId = roomId;
    this.roomLayoutId = roomLayoutId;
    this.facility = facility;
    this.amenities = amenities;
    this.catering = catering;
    this.cateringCompanyInformation = cateringCompanyInformation;
    this.filePath = filePath;
    this.fileOptionId = fileOptionId;
    this.uploadedFiles = files;
    this.clientName = clientName;
    this.statusId = statusId;
    this.isPopulateAccountNumber = isPopulateAccountNumber;
    this.roomLayoutImage = roomLayoutImage;
    this.assignToId = assignToId;
    this.assignTo = assignTo;
    this.roomName = roomName;
    this.roomLayoutName = roomLayoutName;
  }
}



/** model for bookit master data */
export class BookItMaster {
  public clients?: ClientMaster[];
  public facilities?: Facility[];
  public amenities?: Amenity[];
  public caterings?: Catering[];
  public recurrings?: RecurringMaster[];
}



/** model for bookit recurring list */
export class RecurringMaster {
  public recurringId: number;
  public recurringType: string
}

/** model for bookit file response */
export class BookItFileResponse {
  public filePath?: string;
  public actualFileName: string
  public bookItFileId: number;
  public fileName: string;
  public fileOptionId: number
  public isDeleted: boolean;
  public shareFilePath: string;
}

/** copyIt assignee */
export class BookItAssignee extends BaseAssignee {
  constructor({ roleId, roleName, userId, priority, firstName, lastName, deskLocation }: any) {
    super({ roleId, roleName, userId, priority, firstName, lastName, deskLocation })
  }
}

/** model for client account */
export class ClientAccountMaster {
  public clientAccountId: number;
  public accountNo: string;
  public departmentName: string;
}

