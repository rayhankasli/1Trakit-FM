import { SafeUrl } from '@angular/platform-browser';
import { BaseClientMaster, ProductLicense, Archive } from 'common-libs';

/** Office */
export class OfficeMaster {
  /** officeId */
  public officeId: number;
  /** officeName */
  public officeName: string;
  /** officeNickName */
  public officeNickName: string;
  /** office */
  public office: string;

  constructor(officeId?: number, officeName?: string, officeNickName?: string) {
    this.officeId = officeId;
    this.officeName = officeName;
    this.officeNickName = officeNickName;
    this.office = officeName + '-' + officeNickName
  }
}

/** UserType */
export class RoleMaster {
  /** roleId */
  public roleId: number;
  /** role */
  public role: string;
}

/** FloorResponseMaster */
export class FloorResponseMaster {
  /** floors */
  public floors: FloorMaster[];
}


/** Floor */
export class FloorMaster {
  /** floorId */
  public floorId: number;
  /** floorType */
  public floorType: number;
  /** floorNickName */
  public floorNickName: string;
  /** floor */
  public floor: string;

  constructor(floorId?: number, floorType?: number, floorNickName?: string) {
    this.floorId = floorId;
    this.floorType = floorType;
    this.floorNickName = floorNickName;
    this.floor = '[' + floorType + ']' + '-' + floorNickName;
  }
}

/** Timezone */
export class TimezoneMaster {
  /** timezoneId */
  public timezoneId: number;
  /** timezone */
  public timezone: string;
  /** abbreviation */
  public abbreviation: string;
}

/** Client Master */
export class ClientMaster extends BaseClientMaster {
  /** clientId */
  public clientId: number;
  /** client */
  public client: string;
  /** tenants */
  public tenants?: boolean;
  /** Account Number */
  public accountNumber?: boolean;
  /** logo small */
  public logoFileNameSmall?: string;
  /** logo large */
  public logoFileNameLarge?: string;
  /** product licensing for app-features */
  public productLicense?: ProductLicense;
  /** product licensing for app-features */
  public archive?: Archive;

  constructor({ clientId, client, tenants, accountNumber, logoFileNameSmall, logoFileNameLarge, productLicense, archive }: any) {
    super();
    this.clientId = clientId;
    this.client = client;
    this.tenants = tenants;
    this.accountNumber = accountNumber;
    this.logoFileNameSmall = logoFileNameSmall;
    this.logoFileNameLarge = logoFileNameLarge;
    this.productLicense = productLicense || new ProductLicense({});
    this.archive = archive || new Archive({});
  }
}

/** WeekDays Model */
export class WeekDays {
  /** Id of weekDay */
  public weekDayId?: number;
  /** Name of weekDay */
  public weekDay?: string;
  /** repeatType */
  public repeatType?: number;

  constructor(
    weekDayId?: number,
    weekDay?: string,
    repeatType?: number
  ) {
    this.weekDayId = weekDayId;
    this.weekDay = weekDay;
    this.repeatType = repeatType;
  }
}
/**
 * User detail Model
 */
// export class UsersMaster {
//   public userId: number;
//   public userName: string;
//   constructor(
//     userId: number,
//     userName: string,
//   ) {
//     this.userId = userId;
//     this.userName = userName;
//   }
// }

/** CopyIt list filter model */
export class MultiSelectFilterRecord {
  /** clientId. */
  clientId?: number;
  /** requestedById. */
  requestedById?: UsersMaster[];
  /** assignedToId. */
  assignedToId?: UsersMaster[];
  /** copyItStatusId. */
  statusId?: StatusMaster[];

  constructor(
    clientId?: number,
    requestedById?: UsersMaster[],
    assignedToId?: UsersMaster[],
    copyItStatusId?: StatusMaster[],
  ) {
    this.clientId = clientId;
    this.requestedById = requestedById;
    this.assignedToId = assignedToId;
    this.statusId = copyItStatusId;
  }

}
/** CopyIt filter record request */
export class MultiSelectFilterRecordRequest {
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
export class StatusMaster {
  /** status name */
  public status: string;
  /** statusId */
  public statusId: number;
  constructor(
    statusId: number,
    status: string,
  ) {
    this.statusId = statusId;
    this.status = status;
  }
}

/** Office based user */
export class AssignedToMaster {
  /** Id  of assigner */
  public assignedToId: number;
  /** Assigner name of assigner */
  public assignTo: string;

  constructor(assignedToId: number, assignTo: string) {
    this.assignedToId = assignedToId;
    this.assignTo = assignTo;
  }
}

/** User List */
export class UserWithRoleMaster {
  public roleName: string;
  public user: UsersMaster[];
  constructor(
    roleName: string,
    user: UsersMaster[]
  ) {
    this.roleName = roleName;
    this.user = user;
  }
}

/** User */
export class UsersMaster {
  /** userId */
  public userId: number;
  /** First Name */
  public firstName: string;
  /** Last Name */
  public lastName: string;
  /** full name */
  public fullName: string;
  /** user name */
  public userName: string;

  constructor(
    userId: number,
    firstName: string,
    lastName: string,
    fullName: string
  ) {
    this.userId = userId;
    this.firstName = firstName;
    this.lastName = lastName;
    this.fullName = fullName;
  }
}

/** Pictures */
export class Pictures {
  /** imageId */
  public imageId?: number;
  /** actualImageName */
  public actualImageName: string;
  /** systemImageName */
  public systemImageName: string | SafeUrl;
  /** imageType */
  public imageType?: number;
  /** imageDesription */
  public imageDesription?: string;
}

/** List of Option */
export class LableValuePair {
  /** Label for Option */
  public label: string;
  /** value */
  public value: number;
}

/** List of Option */
export class IdLabelPair {
  /** ID */
  public id: number;
  /** Label for Option */
  public label: string;
}