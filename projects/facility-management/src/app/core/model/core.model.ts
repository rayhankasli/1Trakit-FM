import { ClientMaster } from './common.model';
import { environment } from 'projects/facility-management/src/environments/environment';

export class UserInfo {
    /** userId */
    public userId: number;
    /** User Profile */
    public userDetail: UserProfile;
    /** clientIds */
    public clients: ClientMaster[];
    constructor(
        userId?: number,
        userDetail?: UserProfile,
        clients?: ClientMaster[],
    ) {
        this.userId = userId;
        this.userDetail = userDetail;
        const clientList: ClientMaster[] = clients && clients.map((client: ClientMaster) => {
            client.logoFileNameLarge = getFilePath(client.logoFileNameLarge);
            client.logoFileNameSmall = getFilePath(client.logoFileNameSmall);
            return client;
        })
        this.clients = clientList || [];
    }

}
/** Get full path for the client logo file */
function getFilePath(fileName: string): string {
    return fileName ? `${environment.base_host_url}ClientLogo/${fileName}` : null;
}

/**
 * User profile
 */
export class UserProfile {
    /** userId of User */
    public userId: number;
    /** firstName of User */
    public firstName: string;
    /** lastName of User */
    public lastName: string;
    /** email of User */
    public email: string;
    /** username of User */
    public userName: string;
    /** primary contact number of User */
    public primaryContactNumber: string;
    /** deskLocation of UserProfile */
    public deskLocation: string;
    /** floorId of UserProfile */
    public floorId: number;
    /** officeId of UserProfile */
    public officeId: number;
    /** priority of UserProfile */
    public priority: number;
    /** roleId of UserProfile */
    public roleId: number;
    /** departmentName of UserProfile */
    public departmentName: string;
    /** deskContactNumber of UserProfile */
    public deskContactNumber: string;
    /** isActive of UserProfile */
    public isActive: boolean;
    /** timeZoneId of UserProfile */
    public timeZoneId: number;
    /** to specify user have confirmed for the archived features */
    public acceptedDate: string;

}
/** UserProfile response model */
export class UserProfileResponse extends UserProfile {

    constructor(
        userId?: number,
        firstName?: string,
        lastName?: string,
        email?: string,
        userName?: string,
        primaryContactNumber?: string,
        deskLocation?: string,
        floorId?: number,
        officeId?: number,
        priority?: number,
        roleId?: number,
        departmentName?: string,
        deskContactNumber?: string,
        isActive?: boolean,
        timeZoneId?: number,
    ) {
        super();
        this.userId = userId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.userName = userName;
        this.primaryContactNumber = primaryContactNumber;
        this.deskLocation = deskLocation;
        this.floorId = floorId;
        this.officeId = officeId;
        this.priority = priority;
        this.roleId = roleId;
        this.departmentName = departmentName;
        this.deskContactNumber = deskContactNumber;
        this.isActive = isActive;
        this.timeZoneId = timeZoneId;
    }
}

export class RequestParams<T = any> {
    /**
     * Page  of params
     */
    public page: number;
    /**
     * Per page of params
     */
    public perPage: number;
    /**
     * Sort  of params
     */
    public sort: string;
    /**
     * Q  of params
     */
    public q: string;
    /**
     * Filter  of params
     */
    public filter: T;
}
