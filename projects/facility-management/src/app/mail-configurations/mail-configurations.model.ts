/**
 * @author Rayhan Kasli.
 * @description
 */
import { InjectionToken } from '@angular/core';
import { SortingOrder } from 'common-libs';
import { OfficeMaster, WeekDays } from '../core/model/common.model';

/** model class for Slots */
export class Slots {
  /** id  of Slots */
  public slotId: number;

  /** slotName  of Slots */
  public slotName: string;

  /** nickName  of Slots */
  public nickName: string;

  /** office  of SlotsRequest */
  public officeId: number;

  /** office  of SlotsRequest */
  public officeName: string;

  /** office  of SlotsRequest */
  public officeNickName: string;

  /** time  of Slots */
  public slotTime: string;

  /** repeatsOn  of Slots */
  public repeatsOn: RepeatsOn;

  /** assignTo  of SlotsRequest */
  public repeatEvery: number;

  /**
   * Determines whether editable is
   */
  public isEditable: boolean;

  /** isActive of Slot */
  public isActive?: boolean;

  constructor(
    slotId?: number,
    slotName?: string,
    nickName?: string,
    officeId?: number,
    officeName?: string,
    officeNickName?: string,
    slotTime?: string,
    repeatsOn?: RepeatsOn,
    repeatEvery?: number,
    isEditable?: boolean
  ) {
    this.slotId = slotId;
    this.slotName = slotName;
    this.nickName = nickName;
    this.officeId = officeId;
    this.officeName = officeName;
    this.officeNickName = officeNickName;
    this.slotTime = slotTime;
    this.repeatsOn = repeatsOn;
    this.repeatEvery = repeatEvery;
    this.isEditable = isEditable;
  }
}
/** model class for SlotsRequest */
export class SlotsRequest {
  /** id  of SlotsRequest */
  public slotId: number;

  /** slotName  of SlotsRequest */
  public slotName: string;

  /** nickName  of SlotsRequest */
  public nickName: string;

  /** office  of SlotsRequest */
  public officeId: number;

  /** time  of SlotsRequest */
  public slotTime: string;

  /** repeatsOn  of SlotsRequest */
  public repeatOn: number[];

  /** assignTo  of SlotsRequest */
  public assignToId: number;

  /** assignTo  of SlotsRequest */
  public repeatEvery: number;

  /**
   * Client id of slots request
   */
  public clientId: number;

  constructor(
    slotName?: string,
    nickName?: string,
    officeId?: number,
    slotTime?: string,
    repeatEvery?: number,
    repeatsOn?: number[],
    clientId?: number
  ) {
    this.slotName = slotName;
    this.nickName = nickName;
    this.officeId = officeId;
    this.slotTime = slotTime;
    this.repeatEvery = repeatEvery;
    this.repeatOn = repeatsOn;
    this.clientId = clientId;
  }
}
/** model class for SlotsResponse */
export class SlotsResponse {
  /** assignTo  of Slots */
  public lastSlot: string;

  /** Slots  of slots response */
  public slots: Slots[];

  constructor(lastSlot?: string, slots?: Slots[]) {
    this.lastSlot = lastSlot;
    this.slots = slots;
  }
}

/** model class for SlotsFilter */
export class SlotsFilter {
  /** isActive of ClientFilterRequest */
  public isActive?: boolean;
  constructor(isActive?: boolean) {
    this.isActive = isActive;
  }
}



/** Model class for sortRecord. */
export class SlotsSortRecord {
  /** This property is use for which type of sorting apply by user. */
  public sortBy: SortingOrder;
  /** This property is used for sort field . */
  public sortColumn: string;
}

export const SLOTS_SORT: InjectionToken<SlotsSortRecord> = new InjectionToken<
  SlotsSortRecord
>('slotsSort');


/** repeats On model */
export class RepeatsOn {
  /** repeats */
  public repeats: number;
  /** every for request */
  public every: number;

  /** list of days */
  public repeatsOnDay: number[] | any[]
}

/** WeekDays */
export class RepeatOn {
  /** Id  of assigner */
  public weekDayId: number;
  /** Assigner name of assigner */
  public weekDay: string;

  constructor(weekDayId: number, weekDay: string) {
    this.weekDayId = weekDayId;
    this.weekDay = weekDay;
  }
}


/**
 * User master data
 */
export class MasterData {
  /** offices */
  public offices: OfficeMaster[];
  /** clients */
  public weekDays: WeekDays[];
}


/** Model class for filterRecord. */
export class SlotFilterRequest {
  /** isActive of ClientFilterRequest */
  public isActive?: boolean;
  constructor(isActive?: boolean) {
    this.isActive = isActive;
  }
}

/** Available Client list status */
export class SlotListStatus {
  /** statusKey */
  public statusKey: string;
  /** statusValue */
  public statusValue: boolean;
}

export const SLOT_STATUS_OPTION: SlotListStatus[] = [
  {
    statusKey: 'Active',
    statusValue: true
  },
  {
    statusKey: 'Inactive',
    statusValue: false
  }
]
