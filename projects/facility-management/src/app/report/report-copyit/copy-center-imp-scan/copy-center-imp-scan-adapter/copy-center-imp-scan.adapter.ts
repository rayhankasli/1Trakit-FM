import { Injectable } from '@angular/core';
// -------------------------------------------- //
import { Adapter } from 'common-libs';
// -------------------------------------------- //
import { CopyIMPScanResponse, } from '../copy-center-imp-scan.model';


/**
 * CopyCenterImpScanAdapter
 */
@Injectable()
export class CopyCenterImpScanAdapter implements Adapter<CopyIMPScanResponse> {

    /** This method is used to transform response object into T object. */
    public toResponse(item: CopyIMPScanResponse): CopyIMPScanResponse {
        const copyCenterIMPScan: CopyIMPScanResponse = new CopyIMPScanResponse(
            item.month,
            item.onlyForTable,
            item.data
        );

        return copyCenterIMPScan;
    }

    // /** This method is used to transform T object into request object. */
    public toRequest(item: CopyIMPScanResponse): CopyIMPScanResponse {
        const copyCenterIMPScan: CopyIMPScanResponse = new CopyIMPScanResponse();
        return copyCenterIMPScan;
    }
}