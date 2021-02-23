import { Injectable } from '@angular/core';
// -------------------------------------------- //
import { Adapter } from 'common-libs';
// -------------------------------------------- //
import { TimelinessResponse } from '../timeliness.model';


/**
 * TimelinessAdapter
 */
@Injectable()
export class TimelinessAdapter implements Adapter<TimelinessResponse> {

    /** This method is used to transform response object into T object. */
    public toResponse(item: TimelinessResponse): TimelinessResponse {
        const timeliness: TimelinessResponse = new TimelinessResponse(
            item.month,
            item.onlyForTable,
            item.data
        );

        return timeliness;
    }

    /** This method is used to transform T object into request object. */
    public toRequest(item: TimelinessResponse): TimelinessResponse {
        const timeliness: TimelinessResponse = new TimelinessResponse();
        return timeliness;
    }
}