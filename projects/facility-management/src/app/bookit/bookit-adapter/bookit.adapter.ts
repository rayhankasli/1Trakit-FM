

/**
 * @author Enter Your Name Here.
 * @description This is adapter service use for transforming data base user requirement. 
 */

import { Injectable } from '@angular/core';
import { Adapter, NgbTimeStringAdapter } from 'common-libs';
import { NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';

import {
  BookIt, BookItResponseModel, BookItRequest, BookItResponse, BookItFilterRecordRequest, BookItFileResponse,
} from '../models/bookit.model';
import { BookItRoomSearchParamsRequest, RoomLayoutMaster, BookItRoomSearchParams } from '../models/bookIt-rooms.model'
import { getRoomFilePath, getLocaleDateTime, getLocaleDate, getLocaleTime } from '../../core/utility/utility';
import { Conversation, ConversationRequest, ConversationResponse } from '../../shared/modules/custom-chat-box/models/custom-chat-box.model';
import { StatusMaster, UsersMaster, MultiSelectFilterRecord } from '../../core/model/common.model';
import { environment } from 'projects/facility-management/src/environments/environment';
import { BookItRepeatsOnRequest } from '../models/bookIt-repeats-on.model';
import { BookItConversation, BookItConversationRequest, BookItConversationResponse } from '../models/bookIt-conversation.model';

@Injectable()
export class BookItStatusFilterAdapter implements Adapter<StatusMaster>{
  /** This method is used to transform response object into T object. */
  public toResponse(item: StatusMaster): StatusMaster {
    let status: StatusMaster = new StatusMaster(
      item.statusId,
      item.status,
    );
    return status;
  }
}

@Injectable()
export class BookItFilterRecordAdapter implements Adapter<MultiSelectFilterRecord>{
  /** This method is used to transform T object into request object. */
  public toRequest(item: MultiSelectFilterRecord): BookItFilterRecordRequest {
    let clientInfo: BookItFilterRecordRequest = new BookItFilterRecordRequest();
    clientInfo.clientId = item.clientId;
    clientInfo.requestedById = item.requestedById && item.requestedById.length ? item.requestedById.map((user: UsersMaster) => user.userId) : null;
    clientInfo.assignedToId = item.assignedToId && item.assignedToId.length ? item.assignedToId.map((user: UsersMaster) => user.userId) : null;
    clientInfo.statusId = item.statusId && item.statusId.length ? item.statusId.map((status: StatusMaster) => status.statusId) : null;
    return clientInfo;
  }
}

@Injectable()
export class BookItAdapter implements Adapter<BookIt> {

  constructor(private ngbTimeAdapter: NgbTimeStringAdapter) {

  }

  /** This method is used to transform response object into T object. */
  public toResponse(item: BookItResponseModel): BookIt {
    const bookIt: BookIt = new BookIt();
    bookIt.bookItNumber = item.bookItNumber;
    bookIt.bookItId = item.bookItId;
    bookIt.clientName = item.clientName;
    bookIt.eventName = item.eventName;
    bookIt.description = item.description;
    bookIt.requestedBy = item.requestedBy;
    // bookIt.dueDate = item.dueDate;
    bookIt.assignedTo = item.assignedTo;
    bookIt.statusId = item.statusId;

    bookIt.date = getLocaleDateTime(item.date, item.startTime);

    return bookIt;
  }

  /** This method is used to transform response object into T object. */
  public toGetByIdResponse(item: BookItResponse): BookIt {
    const bookIt: BookIt = new BookIt(
      item.bookItNumber,
      item.bookItId,
      item.eventName,
      item.description,
      item.statusId,
      item.name,
      getLocaleDateTime(item.date, item.startTime),
      getLocaleTime(item.startTime),
      getLocaleTime(item.endTime),
      item.isRecurring,
      item.setupBuffer ? this.convertToHours(item.setupBuffer) : null,
      item.cleanupBuffer ? this.convertToHours(item.cleanupBuffer) : null,
      item.noOfPeople,
      item.clientAccountId,
      item.clientAccount,
      item.clientId,
      item.clientName,
      item.userId,
      item.fullName,
      item.roomId,
      item.roomLayoutId,
      item.facility,
      item.amenities,
      item.catering,
      item.cateringCompanyInformation ? item.cateringCompanyInformation : {},
      item.filePath,
      item.fileOptionId,
      item.files ? item.files.map((file: BookItFileResponse) => { file.filePath = this.getFilePath(file.fileName); return file; }) : null,
      item.isPopulateAccountNumber,
      item.roomLayoutImage ? getRoomFilePath(item.roomLayoutImage) : null,
      item.assignToId,
      item.assignTo,
      item.roomName,
      item.roomLayoutName
    );
    return bookIt;
  }

  /** This method is used to transform T object into request object. */
  public toRequest(item: BookIt, isAddRequest?: boolean): FormData {
    const bookIt: BookItRequest = new BookItRequest(
      item.eventName,
      item.name,
      item.date.toDateString(),
      item.startTime,
      item.endTime,
      item.setupBuffer ? this.convertToMinutes(item.setupBuffer) : null,
      item.cleanupBuffer ? this.convertToMinutes(item.cleanupBuffer) : null,
      Number(item.noOfPeople),
      item.clientAccountId,
      item.clientAccount,
      item.description,
      item.clientId,
      item.userId,
      item.roomId,
      item.roomLayoutId,
      item.facility,
      item.amenities,
      item.catering,
      item.cateringCompanyInformation,
      item.filePath,
      item.fileOptionId
    );
    if (isAddRequest) {
      bookIt.isRecurring = item.isRecurring;
      if (item.isRecurring && item.repeatsOn) {
        bookIt.repeatsOn = new BookItRepeatsOnRequest(
          item.repeatsOn.recurringId, item.repeatsOn.endDate.toDateString(),
          item.repeatsOn.repeatBy, item.repeatsOn.repeatsOnDay);
      }
    }

    // convert data to formData
    const formData: FormData = new FormData();
    formData.append('bookIt', JSON.stringify(bookIt));
    item.files && (item.files as File[]).filter((file: File) => (file instanceof File)).forEach((file: File, i: number) => formData.append('files', file, file.name));
    return formData;
  }

  /** room layout */
  public toRoomLayouts(item: RoomLayoutMaster): RoomLayoutMaster {
    return new RoomLayoutMaster(
      item.roomLayout,
      item.roomLayoutId,
      getRoomFilePath(item.roomLayoutImage)
    );
  }

  /** room layout */
  public toRoomSearchRequest(item: BookItRoomSearchParams): BookItRoomSearchParamsRequest {
    return {
      clientId: item.clientId,
      date: item.date.toDateString(),
      timeFrom: item.startTime,
      timeTo: item.endTime,
      setupBuffer: item.setupBuffer ? this.convertToMinutes(item.setupBuffer) : null,
      cleanupBuffer: item.cleanupBuffer ? this.convertToMinutes(item.cleanupBuffer) : null,
    };
  }

  /** convert time to minutes */
  private convertToMinutes(timeData: string): number {
    const time: NgbTimeStruct = this.ngbTimeAdapter.fromModel(timeData);
    time.hour = time.hour === 0 ? 24 : time.hour;
    const totalMinutes: number = time && time.minute + (time.hour * 60);
    return totalMinutes;
  }

  /**
   * Convert time to string before save
   * @param totalMinutes  total minutes
   */
  private convertToHours(totalMinutes: number): string {
    const time: NgbTimeStruct = this.ngbTimeAdapter.fromModel('00:00:00');
    time.hour = Math.floor(totalMinutes / 60);
    time.hour = time.hour === 24 ? 0 : time.hour;
    time.minute = totalMinutes % 60;
    return this.ngbTimeAdapter.toModel(time);
  }

  /** Get full path for the client logo file */
  private getFilePath(fileName: string): string {
    return `${environment.base_host_url}BookIt/${fileName}`;
  }
}

@Injectable()
export class ConversationAdapter implements Adapter<ConversationRequest | ConversationResponse>{
  /** This method is used to transform response object into T object. */
  public toResponse(chat: BookItConversationResponse): ConversationResponse {
    const res: ConversationResponse = new ConversationResponse();
    res.conversations = chat.chats && chat.chats.map((message: BookItConversation | any) => {
      this.renameKey(message, 'chatId', 'moduleConversationId');
      this.renameKey(message, 'bookItId', 'moduleId');
      return new Conversation(message);
    })
    res.isEnabled = chat.isEnabled;
    return res;
  }
  /** This method is used to transform T object into request object. */
  public toRequest(message: Conversation | any): BookItConversationRequest {
    this.renameKey(message, 'moduleId', 'bookItId');
    return new BookItConversationRequest(message);
  }

  /** This method is used to transform object key name. */
  private renameKey(obj: BookItConversation | Conversation, old_key: string, new_key: string) {
    if (old_key !== new_key) {
      Object.defineProperty(obj, new_key, Object.getOwnPropertyDescriptor(obj, old_key));
      delete obj[old_key];
    }
  }
}

