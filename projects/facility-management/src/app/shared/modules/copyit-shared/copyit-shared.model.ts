import { BaseAssignee } from '../../models/assignee.model';

/** Model class for User List */
export class CopyItUserList {
    /** roleName */
    public roleName: string;
    /** User */
    public user: CopyItUser[];

    constructor(roleName?: string, user?: CopyItUser[]) {
        this.roleName = roleName;
        this.user = user;
    }
}

/** Model class for copyit user detail model */
export class CopyItUser {
    public userId: number;
    public emailAddress: string;
    public firstName: string;
    public lastName: string;
    public phoneNumber: string;
    public projectCode: ProjectCode[];
    public fullName: string;
    public clientId?: number;

    constructor(userId?: number, firstName?: string, lastName?: string, emailAddress?: string, phoneNumber?: string, projectCode?: ProjectCode[]) {
        this.userId = userId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.emailAddress = emailAddress;
        this.phoneNumber = phoneNumber;
        this.projectCode = projectCode;
        this.fullName = firstName + ' ' + this.lastName;
    }
}

/** Model class for copyIt assignee */
export class CopyItAssignee extends BaseAssignee {
    constructor({ roleId, roleName, userId, priority, firstName, lastName, deskLocation }: any) {
        super({ roleId, roleName, userId, priority, firstName, lastName, deskLocation })
    }
}

/** Model class for Project code */
export class ProjectCode {
    public clientAccountId: number;
    public accountNo: number;
    public departmentName: string;
}
