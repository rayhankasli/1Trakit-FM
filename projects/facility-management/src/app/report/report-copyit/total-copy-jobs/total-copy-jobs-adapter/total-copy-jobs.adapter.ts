import { Injectable } from '@angular/core';
// -------------------------------------------- //
import { Adapter } from 'common-libs';
// -------------------------------------------- //
import { TotalCopyJobsResponse } from '../total-copy-jobs.model';


/**
 * TotalCopyJobsAdapter
 */
@Injectable()
export class TotalCopyJobsAdapter implements Adapter<TotalCopyJobsResponse> {

    /** This method is used to transform response object into T object. */
    public toResponse(item: TotalCopyJobsResponse): TotalCopyJobsResponse {
        const totalCopyJobs: TotalCopyJobsResponse = new TotalCopyJobsResponse(
            item.month,
            item.onlyForTable,
            item.data
        );

        return totalCopyJobs;
    }

    // /** This method is used to transform T object into request object. */
    public toRequest(item: TotalCopyJobsResponse): TotalCopyJobsResponse{
        const totalCopyJobs: TotalCopyJobsResponse= new TotalCopyJobsResponse();
        return totalCopyJobs;
    }
}