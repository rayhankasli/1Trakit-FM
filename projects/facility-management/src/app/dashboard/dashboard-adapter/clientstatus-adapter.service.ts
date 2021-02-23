import { Injectable } from '@angular/core';
import { Adapter } from 'common-libs/projects';
import { ClientStatusChart } from '../dashboard.model';

@Injectable()
export class ClientstatusAdapter implements Adapter<ClientStatusChart> {


  /**
   * This is a method of  adapter class to modify CopyItChartStatus
   * response coming from service.
   * @param item
   */
  public toResponse(item: ClientStatusChart): any {

    const model: ClientStatusChart = new ClientStatusChart(
      item.companyName,
      item.new,
      item.assigned,
      item.inProgress,
      item.completed,
      item.reOpen,
      item.requestForInformation,
      item.onhold,
      item.close
    );
    return model;
  }

}
