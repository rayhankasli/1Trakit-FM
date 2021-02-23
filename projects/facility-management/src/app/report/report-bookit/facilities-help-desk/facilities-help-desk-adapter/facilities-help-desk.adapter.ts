import { Injectable } from '@angular/core';
// -------------------------------------------- // 
import { Adapter } from 'common-libs';
// -------------------------------------------- // 
import { FacilitiesHelpDesk, } from '../facilities-help-desk.model';


/**
 * FacilitiesHelpDeskAdapter
 */
@Injectable()
export class FacilitiesHelpDeskAdapter implements Adapter<FacilitiesHelpDesk> {

    /**
     * This is a method of  adapter class to modify bookit report list
     * response coming from service.
     * @param item
     */
    public toResponse(item: FacilitiesHelpDesk): FacilitiesHelpDesk {
        const helpDeskList: FacilitiesHelpDesk = new FacilitiesHelpDesk(
            item.month,
            item.helpDeskValue,
            item.onlyForTable
        );
        return helpDeskList;
    }
}