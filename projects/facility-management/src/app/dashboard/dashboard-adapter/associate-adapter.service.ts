import { Injectable } from '@angular/core';
import {
  AssociateStatusChartResponse,
  AssociateGraph,
  AssociateStatusChart,
  TimeTaken,
  UserName,
  RequestStatusFilter,
} from '../dashboard.model';
import { Adapter } from 'common-libs';
@Injectable()
export class AssociateAdapter implements Adapter<AssociateStatusChart[]> {
  /**
   * This is a method of  adapter class to modify CopyItChartStatus
   * response coming from service.
   * @param item
   */
  public toResponse(data: AssociateStatusChartResponse[]): AssociateStatusChart[] {
    let associateData: AssociateStatusChart[];
    associateData = data.map((element: any) => ({
      associateGraph: this.bindGraphObj(element),
      timeTaken: this.bindTimeObj(element),
      userName: this.bindUserName(element),
    }));
    return associateData;
  }

  private bindGraphObj(data: any): AssociateGraph {
    return {
      companyName: data.companyName,
      assigned: data.assigned,
      inProgress: data.inProgress,
      completed: data.completed,
      requestForInformation: data.requestForInformation,
      onhold: data.onhold,
      close: data.close,
    };
  }

  private bindTimeObj(data: any): TimeTaken {
    return {
      timeTaken: data.timeTaken,
    };
  }

  private bindUserName(data: any): UserName {
    return {
      userName: data.userName,
    };
  }
}

@Injectable()
export class RequestStatusFilterAdapter implements Adapter<RequestStatusFilter> {
  public toRequest(item: RequestStatusFilter): RequestStatusFilter {
    const requestfilter: RequestStatusFilter = new RequestStatusFilter(item);
    delete requestfilter.defaultParam;
    !requestfilter.clientId && delete requestfilter.clientId;
    !requestfilter.isArchive && delete requestfilter.isArchive;
    return { ...requestfilter };
  }
}
