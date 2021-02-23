import { Injectable } from '@angular/core';
// -------------------------------------------- //
import { Adapter } from 'common-libs';
// ----------------------------------------------- //
import { CopyIMPBAndWResponse } from '../copy-center-imp-b-and-w.model';


/**
 * CopyCenterImpBAndWAdapter
 */
@Injectable()
export class CopyCenterImpBAndWAdapter implements Adapter<CopyIMPBAndWResponse> {


    /** This method is used to transform response object into T object. */
    public toResponse(item: CopyIMPBAndWResponse): CopyIMPBAndWResponse {
        const copyCenterIMPBAndW: CopyIMPBAndWResponse = new CopyIMPBAndWResponse(
            item.month,
            item.onlyForTable,
            item.data
        );

        return copyCenterIMPBAndW;
    }

    /** This method is used to transform T object into request object. */
    public toRequest(item: CopyIMPBAndWResponse): CopyIMPBAndWResponse {
        const copyCenterIMPBAndW: CopyIMPBAndWResponse = new CopyIMPBAndWResponse();
        return copyCenterIMPBAndW;
    }
}