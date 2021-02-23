

/**
 * @author Nitesh Sharma.
 * @description This is adapter service use for transforming data base user requirement. 
 */

import { Injectable } from '@angular/core';
import { Adapter } from 'common-libs';
// -------------------------------------------- //
import { User, NewUser, UserFilterRecord, UserResponse, BulkUploadUser, BulkUploadUserResponse } from '../user.model';
import { isArray, isNumber } from 'util';

@Injectable()
export class UserAdapter implements Adapter<User> {

    /** This method is used to transform T object into request object. */
    public toResponse(item: UserResponse): User {
        let clientId: number[] = item.clientId ? (item.clientId as string).split(',').map((id: string) => Number(id)) : null;
        const user: User = new User({ ...item, clientId });
        return user;
    }

    /** This method is used to transform T object into request object. */
    public toRequest(item: User): NewUser {
        let clientId: number[] = this.getClientIdList(item.clientId as number);
        const user: NewUser = new NewUser({ ...item, clientId });
        return user;
    }

    /** This method is used to transform T object into request object. */
    public toUpdateRequest(item: User): NewUser {
        let clientId: number[] = this.getClientIdList(item.clientId as number);
        const user: NewUser = new NewUser({ ...item, clientId });
        user.password = item.password || null;
        return user;
    }

    /** it will return object for toggle status request body */
    public toggleStatus(user: User): any {
        return {
            isActive: user.isActive
        };
    }

    /**
     * convert numeric clientId to Array of numbers
     * @param {number} clientId
     */
    private getClientIdList(clientId: number | number[]): number[] {
        return isNumber(clientId) ? [clientId as number] : clientId as number[];
    }
}


@Injectable()
export class UserFilterAdapter implements Adapter<UserFilterRecord> {

    /** This method is used to transform T object into request object. */
    public toRequest(item: UserFilterRecord): UserFilterRecord {
        const userFilter: UserFilterRecord = new UserFilterRecord(
            item.isActive,
            item.clientId
        );
        return userFilter;
    }
}

@Injectable()
export class BulkUploadUserAdapter implements Adapter<BulkUploadUser | BulkUploadUserResponse> {
    /** This method is used to transform T object into request object. */
    public toRequest(item: BulkUploadUser): FormData {
        const formData: FormData = new FormData();
        formData.append('userImportFile', item.userImportFile);
        return formData;
    }

    /** Convert API response to BulkUploadUserResponse */
    public toResponse(response: BulkUploadUserResponse): BulkUploadUserResponse {
        return new BulkUploadUserResponse(response);
    }
}
