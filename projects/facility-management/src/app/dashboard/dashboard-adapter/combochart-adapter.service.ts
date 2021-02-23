import { Injectable } from '@angular/core';
import { Adapter } from 'common-libs/projects';
import { ComboChartResponseStatus, Period, CopyItRequestStatus, BookItRequestStatus, FleetRequestStatus } from '../dashboard.model';

@Injectable()
export class CombochartAdapter implements Adapter<CopyItRequestStatus | BookItRequestStatus | FleetRequestStatus> {

  /**
   * This is a method of  adapter class to modify CopyItChartStatus
   * response coming from service.
   * @param item
   */
  public toResponse(item: CopyItRequestStatus | BookItRequestStatus | FleetRequestStatus): any {
    if(item.period == null){
      const model: ComboChartResponseStatus = new ComboChartResponseStatus(
        item.period = [new Period()],
        item.totalCompletedRequest,
        item.totalRecievedRequest,
      );
       
      return model;
    }
     else{
    
    const model: ComboChartResponseStatus = new ComboChartResponseStatus(
      item.period,
      item.totalCompletedRequest,
      item.totalRecievedRequest,
    );
     
    return model;
  }
}

}
