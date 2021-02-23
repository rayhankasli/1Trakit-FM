import { Injectable } from '@angular/core';
// -------------------------------------------- //
import { Adapter } from 'common-libs';
// -------------------------------------------- //
import { FacilitiesAssistants, } from '../facilities-assistants.model';

/**
 * FacilitiesAssistantsAdapter
 */
@Injectable()
export class FacilitiesAssistantsAdapter implements Adapter<FacilitiesAssistants> {
  /**
   * This is a method of  adapter class to modify bookit report list
   * response coming from service.
   * @param item
   */
  public toResponse(item: FacilitiesAssistants): FacilitiesAssistants {
    const facilitiesAssistants: FacilitiesAssistants = new FacilitiesAssistants(
      item.month,
      item.workOrderTickets,
      item.labourbHourPerMonth,
      item.onlyForTable
    );
    return facilitiesAssistants;
  }

}