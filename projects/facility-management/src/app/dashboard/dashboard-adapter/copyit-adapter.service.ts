import { Injectable } from '@angular/core';
import { CopyItChartStatusResponse } from '../dashboard.model';
import { Adapter } from 'projects/common-libs/src/projects';

@Injectable()
export class CopyitChartAdapter implements Adapter<CopyItChartStatusResponse> {
  /**
   * This is a method of  adapter class to modify CopyItChartStatusResponse
   * response coming from service.
   * @param item
   */
  public toResponse(item: CopyItChartStatusResponse): any {
    return new CopyItChartStatusResponse(item);
  }

}
