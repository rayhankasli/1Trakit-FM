import { Injectable } from '@angular/core';
import { Adapter } from 'common-libs/projects';
import { BookItChartStatusResponse } from '../dashboard.model';

@Injectable()
export class BookitChartAdapter implements Adapter<BookItChartStatusResponse>{

  /**
   * This is a method of  adapter class to modify BookItChartStatusResponse
   * response coming from service.
   * @param item
   */
  public toResponse(item: BookItChartStatusResponse): any {     
    return new BookItChartStatusResponse(item);
  }
}
