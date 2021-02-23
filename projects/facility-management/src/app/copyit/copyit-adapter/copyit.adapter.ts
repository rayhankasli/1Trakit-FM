

/**
 * @author Enter Your Name Here.
 * @description This is adapter service use for transforming data base user requirement.
 */

import { Injectable } from '@angular/core';
import { Adapter } from 'common-libs';
// -------------------------------------------- //
import { StatusMaster, UsersMaster } from '../../core/model/common.model';
import { getLocaleDateTime, getLocaleTime } from '../../core/utility/utility';
import { Conversation, ConversationRequest, ConversationResponse } from '../../shared/modules/custom-chat-box/models/custom-chat-box.model';
import { CopyItAssignToRequest, CopyItStatusRequest } from '../copyit.model';
import { CopyItConversation, CopyItConversationRequest, CopyItConversationResponse } from '../models/copyit-conversation.model';
import { CopyItFilterRecordRequest, CopyItList } from '../models/copyit-list.model';

/** To convert copyit list related request/response */
@Injectable()
export class CopyItListAdapter implements Adapter<CopyItList> {

  /** This method is used to transform response object into T object. */
  public toResponse(item: CopyItList): CopyItList {
    const copyItList: CopyItList = new CopyItList(
      item.copyItId,
      item.copyItNumber,
      item.clientId,
      item.companyName,
      item.jobname,
      item.accountNo,
      item.requestedById,
      item.requestedBy,
      getLocaleDateTime(item.dueDate, item.dueTime),
      getLocaleTime(item.dueTime),
      item.associateId,
      item.associateName,
      item.copyItStatusId,
      item.copyItStatus
    );
    return copyItList;
  }

  /** This method is used to transform T object into request object. */
  public toRequest(item: CopyItList): CopyItList {
    const copyItList: CopyItList = new CopyItList(
      item.copyItId,
      item.copyItNumber,
      item.clientId,
      item.companyName,
      item.jobname,
      item.accountNo,
      item.requestedById,
      item.requestedBy,
      item.dueDate,
      item.dueTime,
      item.associateId,
      item.associateName,
      item.copyItStatusId,
      item.copyItStatus,
    );
    return copyItList;
  }
}

/** To convert copyit list multi-select filter */
@Injectable()
export class CopyItFilterRecordAdapter implements Adapter<CopyItFilterRecordRequest>{
  // use CopyItFilterRecord for toResponse

  /** This method is used to transform T object into request object. */
  public toRequest(item: any): CopyItFilterRecordRequest {
    let clientInfo: CopyItFilterRecordRequest = new CopyItFilterRecordRequest();
    clientInfo.clientId = item.clientId;
    clientInfo.requestedById = item.requestedById.length ? item.requestedById.map((user: UsersMaster) => user.userId) : null;
    clientInfo.associateId = item.assignedToId.length ? item.assignedToId.map((user: UsersMaster) => user.userId) : null;
    clientInfo.copyItStatusId = item.statusId.length ? item.statusId.map((status: StatusMaster) => status.statusId) : null;
    return clientInfo;
  }
}

/** To convert copyit conversation related data */
@Injectable()
export class ConversationAdapter implements Adapter<ConversationRequest | ConversationResponse>{
  /** This method is used to transform response object into T object. */
  public toResponse(chat: CopyItConversationResponse): ConversationResponse {
    const res: ConversationResponse = new ConversationResponse();
    res.conversations = chat.conversations.map((message: CopyItConversation | any) => {
      this.renameKey(message, 'copyItConversationId', 'moduleConversationId');
      this.renameKey(message, 'copyItId', 'moduleId');
      return new Conversation(message);
    })
    res.isEnabled = chat.isEnabled;
    return res;
  }
  /** This method is used to transform T object into request object. */
  public toRequest(message: Conversation | any): CopyItConversationRequest {
    this.renameKey(message, 'moduleId', 'copyItId');
    return new CopyItConversationRequest(message);
  }

  /** This method is used to transform object key name. */
  private renameKey(obj: CopyItConversation | Conversation, old_key: string, new_key: string): void {
    if (old_key !== new_key) {
      Object.defineProperty(obj, new_key, Object.getOwnPropertyDescriptor(obj, old_key));
      delete obj[old_key];
    }
  }
}

/** To convert copyit status request */
@Injectable()
export class CopyItStatusAdapter implements Adapter<number>{
  /** This method is used to transform T object into request object. */
  public toRequest(id: number): CopyItStatusRequest {
    return new CopyItStatusRequest(id);
  }
}

/** To convert copyit assignTo request */
@Injectable()
export class CopyItAssignToAdapter implements Adapter<number>{
  /** This method is used to transform T object into request object. */
  public toRequest(id: number): CopyItAssignToRequest {
    return new CopyItAssignToRequest(id);
  }
}

@Injectable()
export class CopyItStatusFilterAdapter implements Adapter<StatusMaster>{
  /** This method is used to transform response object into T object. */
  public toResponse(item: any): StatusMaster {
    let status: StatusMaster = new StatusMaster(
      item.copyItStatusId,
      item.copyItStatus,
    );
    return status;
  }
}

