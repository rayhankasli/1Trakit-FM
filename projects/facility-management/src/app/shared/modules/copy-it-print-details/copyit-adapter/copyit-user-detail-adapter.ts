import { Injectable } from '@angular/core';
// ------------------------------------------------- //
import { Adapter } from 'common-libs';
// ------------------------------------------------- //
import { CopyItUserList, CopyItUser } from '../../copyit-shared/copyit-shared.model';

@Injectable()
export class CopyItUserAdapter implements Adapter<CopyItUser> {
    /** This method is used to transform response object into T object. */
    public toResponse(item: CopyItUser): CopyItUser {
        if (item) {
            return new CopyItUser(
                item.userId,
                item.firstName,
                item.lastName,
                item.emailAddress,
                item.phoneNumber,
                item.projectCode
            );
        } else {
            return null;
        }
    }

    /** this will add the full name */
    public toListResponse(item: CopyItUserList): CopyItUserList {
        item.user.forEach((user: CopyItUser) => {
            user.fullName = user.firstName + ' ' + user.lastName;
        });
        return item;
    }
}