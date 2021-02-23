import { Injectable } from '@angular/core';
// -------------------------------------------- //
import { Adapter } from 'common-libs';
// -------------------------------------------- //
import { TotalCopyVolumeResponse } from '../total-copy-volume.model';


/**
 * TotalCopyVolumeAdapter
 */
@Injectable()
export class TotalCopyVolumeAdapter implements Adapter<TotalCopyVolumeResponse> {

    /** This method is used to transform response object into T object. */
    public toResponse(item: TotalCopyVolumeResponse): TotalCopyVolumeResponse {
        const totalCopyVolume: TotalCopyVolumeResponse = new TotalCopyVolumeResponse(
            item.avgColorRequest,
            item.avgBwRequest,
            item.avgScanRequest,
            item.period
        );
        return totalCopyVolume;
    }

    // /** This method is used to transform T object into request object. */
    public toRequest(item: TotalCopyVolumeResponse): TotalCopyVolumeResponse {
        const totalCopyVolume: TotalCopyVolumeResponse = new TotalCopyVolumeResponse();
        return totalCopyVolume;
    }
}