/**
 * @author : Bikash Das
 * @description: This is a service class for dashboard service methods
 */

import { Injectable } from '@angular/core';
import { BaseResponse, HttpService, Params, TableProperty } from 'common-libs';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { convertToRequestParams } from '../core/utility/utility';
import { AssociateAdapter, RequestStatusFilterAdapter } from './dashboard-adapter/associate-adapter.service';
import { BookitChartAdapter } from './dashboard-adapter/bookit-adapter.service';
import { ClientstatusAdapter } from './dashboard-adapter/clientstatus-adapter.service';
import { CombochartAdapter } from './dashboard-adapter/combochart-adapter.service';
import { CopyitChartAdapter } from './dashboard-adapter/copyit-adapter.service';
import { FleetChartAdapter } from './dashboard-adapter/fleet-adapter.service';
import { NotificationAdapter } from './dashboard-adapter/notification-adapter.service';
import { OpenrequestAdapter } from './dashboard-adapter/openrequest-adapter.service';
import { AssociateStatusChart, AssociateStatusChartResponse, BookItChartStatusResponse, BookItRequestStatus, ClientStatusChart, CopyItChartStatusResponse, CopyItRequestStatus, FleetChartStatus, FleetRequestStatus, Notification, OpenRequest, RequestStatusFilter } from './dashboard.model';

@Injectable()
export class DashboardService {
  private baseUrl: string;
  /** API version */
  private readonly API_VERSION: string = environment.api_version;

  constructor(
    private http: HttpService,
    private copyItChartAdapter: CopyitChartAdapter,
    private bookitChartAdapter: BookitChartAdapter,
    private fleetChartAdapter: FleetChartAdapter,
    private associateAdapter: AssociateAdapter,
    private clientStatusAdapter: ClientstatusAdapter,
    private notificationAdapter: NotificationAdapter,
    private openRequestAdapter: OpenrequestAdapter,
    private comboChartAdapter: CombochartAdapter,
    private requestStatusFilterAdapter: RequestStatusFilterAdapter
  ) {
    this.baseUrl = environment.baseUrl;
  }

  /**
   * This is a service method to get all Copyit chart status data
   * from back end service
   */
  public getCopyItChartStatus(tableProperty: TableProperty, isArchive: number): Observable<CopyItChartStatusResponse> {
    let url: string = this.baseUrl + 'dashboards/copyIt';

    return this.http.httpGetRequest<CopyItChartStatusResponse>(url, { params: { ...tableProperty.filter, ...{ isArchive } } }, this.API_VERSION).pipe(
      map((data: BaseResponse<CopyItChartStatusResponse>) => {
        return this.copyItChartAdapter.toResponse(data.result);
      })
    );

  }

  /**
   * This is a service method to get all Bookit chart status data
   * from back end service
   */
  public getBookItChartStatus(tableProperty: TableProperty, isArchive: number): Observable<BookItChartStatusResponse> {
    let url: string = this.baseUrl + 'dashboards/bookIt';

    return this.http.httpGetRequest<BookItChartStatusResponse>(url, { params: { ...tableProperty.filter, ...{ isArchive } } }, this.API_VERSION).pipe(
      map((data: BaseResponse<BookItChartStatusResponse>) => {
        return this.bookitChartAdapter.toResponse(data.result);
      })
    );
  }

  /**
   * This is a service method to get all fleet chart status data
   * from back end service
   */
  public getFleetChartStatus(tableProperty: TableProperty, isArchive: number): Observable<FleetChartStatus> {
    let url: string = this.baseUrl + 'dashboards/fleet';

    return this.http.httpGetRequest<FleetChartStatus>(url, { params: { ...tableProperty.filter, ...{ isArchive } } }, this.API_VERSION).pipe(
      map((data: BaseResponse<FleetChartStatus>) => {
        return this.fleetChartAdapter.toResponse(data.result);
      })
    );
  }

  /**
   * This is a service method to get all client chart status data
   * from back end service
   */
  public getClientChartStatus(tableProperty: TableProperty, isArchive: number): Observable<ClientStatusChart[]> {
    let url: string = this.baseUrl + 'dashboards/clientStatus';

    return this.http.httpGetRequest<ClientStatusChart[]>(url, { params: { ...tableProperty.filter, ...{ isArchive } } }, this.API_VERSION).pipe(
      map((data: BaseResponse<ClientStatusChart[]>) => {
        return data.result.map((items: ClientStatusChart) =>
          this.clientStatusAdapter.toResponse(items)
        );
      })
    );

  }
  /**
   * This is a service method to get all associate chart status data
   * from back end service
   */
  public getAssociateChartStatus(tableProperty: TableProperty, isArchive: number): Observable<AssociateStatusChart[]> {
    let url: string = `${this.baseUrl}dashboards/associateStatus`;

    return this.http.httpGetRequest<AssociateStatusChartResponse[]>(url, { params: { ...tableProperty.filter, ...{ isArchive } } }, this.API_VERSION).pipe(
      map((data: BaseResponse<AssociateStatusChartResponse[]>) => {
        return this.associateAdapter.toResponse(data.result);
      })
    );
  }

  /**
   * This is a service method to get all copyit request status data
   * from back end service to show in combo chart
   */
  public getCopyItRequestStatus(param: RequestStatusFilter, isArchive: number): Observable<CopyItRequestStatus[]> {
    let url: string = `${this.baseUrl}dashboards/copyitGraph/${param.defaultParam}`;

    const params: RequestStatusFilter = this.requestStatusFilterAdapter.toRequest({ ...param, ...{ isArchive } });
    return this.http.httpGetRequest<CopyItRequestStatus[]>(url, { params: { ...params } }, this.API_VERSION).pipe(
      map((data: BaseResponse<CopyItRequestStatus>) => {
        return this.comboChartAdapter.toResponse(data.result);
      })
    );

  }

  /**
   * This is a service method to get all bookit request status data
   * from back end service to show in combo chart
   */
  public getBookItRequestStatus(param: any, isArchive: number): Observable<BookItRequestStatus[]> {
    let url: string = this.baseUrl + 'dashboards/bookitGraph/' + `${param.defaultParam}`;

    const params: RequestStatusFilter = this.requestStatusFilterAdapter.toRequest({ ...param, ...{ isArchive } });
    return this.http.httpGetRequest<BookItRequestStatus[]>(url, { params: { ...params } }, this.API_VERSION).pipe(
      map((data: BaseResponse<BookItRequestStatus>) => {
        return this.comboChartAdapter.toResponse(data.result);
      })
    );
  }

  /**
   * This is a service method to get all fleet request status data
   * from back end service to show in combo chart
   */
  public getFleetRequestStatus(param: any, isArchive: number): Observable<FleetRequestStatus[]> {
    let url: string = `${this.baseUrl}dashboards/fleetGraph/${param.defaultParam}`;

    const params: RequestStatusFilter = this.requestStatusFilterAdapter.toRequest({ ...param, ...{ isArchive } });
    return this.http.httpGetRequest<FleetRequestStatus[]>(url, { params: { ...params } }, this.API_VERSION).pipe(
      map((data: BaseResponse<FleetRequestStatus>) => {
        return this.comboChartAdapter.toResponse(data.result);
      })
    );
  }

  /**
   * This is a service method to get all notification status data
   * from back end service to show as list of notification
   * @param tableProperty
   */
  public getNotifications(tableProperty: TableProperty<any>, isArchive: number): Observable<Notification[]> {
    let url: string = `${this.baseUrl}dashboards/notification`;

    const params: Params = convertToRequestParams(tableProperty);
    let jsonData: any = {};
    jsonData.page = params.page;
    jsonData.perPage = params.perPage;
    if (tableProperty.filter != undefined) {
      jsonData.clientId = tableProperty.filter;
    }
    return this.http.httpGetRequest<Notification[]>(url, { params: { ...jsonData, ...{ isArchive } } }, this.API_VERSION).pipe(
      map((data: BaseResponse<Notification[]>) => {
        return data.result.map((items: Notification) =>
          this.notificationAdapter.toResponse(items)
        );
      })
    );

  }

  /**
   * This is a service method to get all open requests  status data
   * from back end service for copyit,bookit and fleet to show as card
   * view components
   */
  public getOpenRequest(tableProperty: TableProperty, isArchive: number): Observable<OpenRequest[]> {
    let url: string = `${this.baseUrl}dashboards/openrequest`;

    return this.http.httpGetRequest<OpenRequest[]>(url, { params: { ...tableProperty.filter, ...{ isArchive } } }, this.API_VERSION).pipe(
      map((data: BaseResponse<OpenRequest[]>) => {
        return data.result.map((items: OpenRequest) =>
          this.openRequestAdapter.toResponse(items)
        );
      })
    );

  }

}
