/**
 * @author Farhin Shaikh | Shahbaz Shaikh | Bikas Das | Ashok Yadav | Nitesh Sharma | Mitul Patel.
 */

/** 
 * This model is used to present copyit status properties
 * Used in list-filter, forms
 */
export class Status {
  /** statusId */
  public copyItStatusId: number;
  /** status name */
  public copyItStatus: string;
}

/** CopyIt status request model */
export class CopyItStatusRequest {
  public copyItStatusId: number;
  constructor(id: number) {
    this.copyItStatusId = id;
  }
}
/** CopyIt assignTo request model */
export class CopyItAssignToRequest {
  public associateId: number;
  constructor(id: number) {
    this.associateId = id;
  }
}

/** Tab step items property for stepper */
export interface TabStepItem {
  readonly id: number;
  readonly heading: string;
  readonly disabled: boolean;
}

/** User Details */
export class UserDetails {
  public userId?: number;
  public firstName?: string;
  public lastName?: string;
  public emailAddress?: string;
  public phoneNumber?: string;
  public projectCode?: ProjectCode[];
  public clientId?: number;

  constructor(userId: number, firstName: string, lastName: string, emailAddress: string, phoneNumber: string, projectCode: ProjectCode[], clientId?: number,) {
    this.userId = userId;
    this.firstName = firstName;
    this.lastName = lastName;
    this.emailAddress = emailAddress;
    this.phoneNumber = phoneNumber;
    this.projectCode = projectCode;
    this.clientId = clientId;
  }
}

/** Project Code selected against selected user */
export class ProjectCode {
  /** clientAccountId */
  public clientAccountId: number;
  /** accountNo */
  public accountNo: string;
  /** departmentName */
  public departmentName: string;

  constructor(clientAccountId: number, accountNo: string, departmentName: string) {
    this.clientAccountId = clientAccountId;
    this.accountNo = accountNo;
    this.departmentName = departmentName;
  }
}

/** Client detail-used in client dropdown */
export class Client {
  /** Client ID */
  public clientId: number;
  /** companyName  */
  public companyName: string;
  /** Acoount Number */
  public accountNumber: boolean;
  /** tenants */
  public tenants: boolean;

  constructor(clientId?: number, companyName?: string, accountNumber?: boolean, tenants?: boolean) {
    this.clientId = clientId;
    this.companyName = companyName;
    this.accountNumber = accountNumber;
    this.tenants = tenants;
  }
}

// /** User */
// export class User {
//   /** userId */
//   public userId: number;
//   /** First Name */
//   public firstName: string;
//   /** Last Name */
//   public lastName: string;
//   /** full name */
//   public fullName: string;

//   // public userName?: string;
//   constructor(userId?: number, firstName?: string, lastName?: string, fullName?: string) {
//     this.userId = userId;
//     this.firstName = firstName;
//     this.lastName = lastName;
//     this.fullName = fullName;
//   }
// }