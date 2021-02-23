import { Injectable } from '@angular/core';
import { Adapter } from 'common-libs/projects';
import { OpenRequest } from '../dashboard.model';

@Injectable()
export class OpenrequestAdapter implements Adapter<any> {

  /**
   * This is a method of  adapter class to modify CopyItChartStatus
   * response coming from service.
   * @param item
   */
  public toResponse(item: OpenRequest): any {

    const model: OpenRequest = new OpenRequest(
      item.id,
      item.ticketId,
      item.type,
      item.description,
      item.dueDate,
      item.status,
      item.copies,
      item.priority,
      item.categoryId,
      item.category,
      item.noOfPeople,
      item.isDue,
      item.dueText,
      item.dueClass

    );
    return model;
  }
}
