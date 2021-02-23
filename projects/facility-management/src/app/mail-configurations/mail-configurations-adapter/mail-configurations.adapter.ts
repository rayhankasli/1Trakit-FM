

/**
 * @author Rayhan Kasli.
 * @description This is adapter service use for transforming data base user requirement.
 */

import { Injectable } from '@angular/core';
// -------------------------------------------- //
import { Adapter } from 'common-libs';
import { getLocaleTime } from '../../core/utility/utility';
import { Reasons, ReasonsResponse } from '../../shared/components/reasons/reasons.model';
import { RepeatOn, RepeatsOn, SlotFilterRequest, Slots, SlotsRequest, SlotsResponse } from '../mail-configurations.model';




/**
 * Injectable
 */
@Injectable()
export class SlotsAdapter implements Adapter<SlotsResponse> {

  /** This method is used to transform response object into T object. */
  public toResponse(item: SlotsResponse): SlotsResponse {
    const slotsWithLocaleTime: Slots[] = item.slots && item.slots.map(slot => {
      slot.slotTime = getLocaleTime(slot.slotTime);
      return slot;
    })
    const slots: SlotsResponse = new SlotsResponse(
      item.lastSlot,
      slotsWithLocaleTime
    );
    return slots;
  }

  /** This method is used to transform response object into T object. */
  public toRequest(item: any): SlotsRequest {
    const slotsRequest: SlotsRequest = new SlotsRequest(
      item.slotName,
      item.nickName,
      item.officeId,
      item.slotTime,
      item.repeatsOn.every,
      item.repeatsOn ? this.setRepeatOnArray(item.repeatsOn) : undefined,
    );
    return slotsRequest;
  }
  /**
   * To update request
   * @param item
   * @returns update request
   */
  public toUpdateRequest(item: any, clientId: number): SlotsRequest {
    const slotsRequest: SlotsRequest = new SlotsRequest(
      item.slotName,
      item.nickName,
      item.officeId,
      item.slotTime,
      item.repeatsOn.every,
      item.repeatsOn ? this.setRepeatOnArray(item.repeatsOn) : undefined,
      clientId
    );
    return slotsRequest;
  }

  /** sets repeatsOn array for request */
  private setRepeatOnArray(repeatsOn: RepeatsOn): number[] {
    let weekDay: number[] = [];
    repeatsOn.repeatsOnDay.forEach((repeatOn: RepeatOn) => {
      weekDay.push(repeatOn.weekDayId);
    })
    return weekDay
  }

}

/**
 * Injectable
 */
@Injectable()
export class ReasonsAdapter implements Adapter<ReasonsResponse> {


  /** This method is used to transform response object into T object. */
  public toResponse(item: ReasonsResponse): ReasonsResponse {
    const reasons: ReasonsResponse = new ReasonsResponse(
      item.lastReasonNotDelivered,
      item.lastReasonNotPicked,
      item.reasons
    );
    return reasons;
  }

  /** This method is used to transform T object into request object. */
  public toRequest(item: any): Reasons {
    const reasons: Reasons = new Reasons();
    reasons.reason = item.reason;
    reasons.description = item.description;
    reasons.reasonType = item.reasonType;
    return reasons;
  }
}

@Injectable()
export class SlotFilterAdapter implements Adapter<SlotFilterRequest> {

  /** This method is used to transform response object into T object. */
  public toRequest(slots: Slots): SlotFilterRequest {
    const slotFilter: SlotFilterRequest = new SlotFilterRequest(
      slots.isActive
    );
    return slotFilter;
  }

}


