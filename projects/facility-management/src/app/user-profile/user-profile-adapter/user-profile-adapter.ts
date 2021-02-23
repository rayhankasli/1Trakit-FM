/**
 * @author Ronak Patel.
 * @description This is adapter service use for transforming data base user requirement. 
 */

import { Injectable } from '@angular/core';
// -------------------------------------------- //
import { Adapter } from 'common-libs';
// -------------------------------------------- //
import { UserProfile, UserProfileResponse } from '../../core/model/core.model';

@Injectable()
export class UserProfileAdapter implements Adapter<UserProfile> {

    /** This method is used to transform response object into T object. */
    public toResponse(items: UserProfile): UserProfile {
        const userProfile: UserProfile = new UserProfileResponse(
            items.userId,
            items.firstName,
            items.lastName,
            items.email,
            items.userName,
            items.primaryContactNumber,
            items.deskLocation,
            items.floorId,
            items.officeId,
            items.priority,
            items.roleId,
            items.departmentName,
            items.deskContactNumber,
            items.isActive,
            items.timeZoneId,
        );
        return userProfile;
    }

    /** This method is used to transform T object into request object. */
    public toRequest(items: UserProfile): UserProfile {
        let userProfile: UserProfile = new UserProfile();
        // items.userId,
        userProfile.firstName = items.firstName;
        userProfile.lastName = items.lastName;
        userProfile.email = items.email;
        userProfile.primaryContactNumber = items.primaryContactNumber;
        return userProfile;
    }
}




