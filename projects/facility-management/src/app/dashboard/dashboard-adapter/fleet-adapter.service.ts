import { Injectable } from '@angular/core';
import { Adapter } from 'common-libs/projects';
import { FleetChartStatus } from '../dashboard.model';

@Injectable()
export class FleetChartAdapter implements Adapter<FleetChartStatus> {

  /**
   * This is a method of  adapter class to modify CopyItChartStatus
   * response coming from service.
   * @param item
   */
  public toResponse(item: FleetChartStatus): any {
     
    const model: FleetChartStatus = new FleetChartStatus(
      item.Operable,
      item.InOperable,
    );
    return model;
  }
}
