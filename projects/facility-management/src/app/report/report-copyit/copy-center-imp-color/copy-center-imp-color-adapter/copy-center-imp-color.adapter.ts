import { Injectable } from '@angular/core';
// -------------------------------------------- //
import { Adapter } from 'common-libs';
// -------------------------------------------- //
import { CopyIMPColorResponse } from '../copy-center-imp-color.model';


/**
 * CopyCenterImpColorAdapter
 */
@Injectable()
export class CopyCenterImpColorAdapter implements Adapter<CopyIMPColorResponse> {

    /** This method is used to transform response object into T object. */
    public toResponse(item: CopyIMPColorResponse): CopyIMPColorResponse {
        const copyCenterIMPColor: CopyIMPColorResponse = new CopyIMPColorResponse(
            item.month,
            item.onlyForTable,
            item.data
        );

        return copyCenterIMPColor;
    }

    // /** This method is used to transform T object into request object. */
    public toRequest(item: CopyIMPColorResponse): CopyIMPColorResponse {
        const copyCenterIMPColor: CopyIMPColorResponse = new CopyIMPColorResponse();
        return copyCenterIMPColor;
    }

}