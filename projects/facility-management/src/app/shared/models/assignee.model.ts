/** 
 * base assignee model
 * used in copyit, bookit assignee dropdown
 */
export class BaseAssignee {
    public roleId: number;
    public roleName: string;
    public userId: number;
    public priority: number;
    public firstName: string;
    public lastName: string;
    public deskLocation: string;
    public fullName: string;

    constructor({ roleId, roleName, userId, priority, firstName, lastName, deskLocation }: any) {
        this.roleId = roleId;
        this.roleName = roleName;
        this.userId = userId;
        this.priority = priority;
        this.firstName = firstName;
        this.lastName = lastName;
        this.deskLocation = deskLocation;
        this.fullName = firstName + ' ' + this.lastName;
    }
}