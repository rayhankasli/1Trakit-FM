/**
 * @author Ronak Patel.
 * @description Service layer class to communicate with the server.
 */
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
// ------------------------------------------------------------- //
import { environment } from '../../environments/environment';
import { Params, TableProperty, HttpService, BaseResponse } from 'common-libs';
import { AssetListAdapter, AssetFormAdapter, AssetTicketAdapter, AssetMeterAdapter, MeterReadAdapter } from './fleet-adapter/fleet.adapter';
import {
  AssetTicketCategory, AssetTicketStatus, AssetPriority, AssetResult, AssetList, AssetTicketResult, AssetTicket, AssetMeterReadResult, AssetMeter,
  MeterRead, Asset, AssetToggleStatusRequest
} from './fleet.model';
import { convertToRequestParams } from '../core/utility/utility';
@Injectable()
export class FleetService {
  /** store base url */
  private baseUrl: string;
  constructor(
    private meterReadAdapter: MeterReadAdapter,
    private assetMeterAdapter: AssetMeterAdapter,
    private assetTicketAdapter: AssetTicketAdapter,
    private http: HttpService,
    private assetListAdapter: AssetListAdapter,
    private assetFormAdapter: AssetFormAdapter,
  ) {
    this.baseUrl = environment.baseUrl;
  }

  //*************************************************************************************************************************************************************** */
  /**
   * This method invokes the server's get endpoint to fetch the record as per the criteria mentioned in the tabelProperty parameters.
   * It converts the criteria to key and values expected by the API by invoking processParam method. It then invokes the server, on successful
   * response, it fetches the count from the header and invokes the adapter to convert server's response to what is expected by the client.
   * What happens when there is an error from the server ?
   * @param  tableProperty - Store the criteria based on which the records should be fetched from the server.
   * @returns - asset[]
   */
  public getAssets(tableProperty: TableProperty): Observable<AssetResult> {
    const url: string = this.baseUrl + 'assets/search';
    const params: Params<TableProperty> = convertToRequestParams(tableProperty);
    return this.http.httpPostRequest<AssetResult>(
      url, tableProperty.filter, { params: { ...params } }).pipe(map((data: BaseResponse<AssetResult>) => {
        data.result.assetList = data.result.assetList.map((items: AssetList) => this.assetListAdapter.toResponse(items));
        return data.result;
      }));
  }

  /** This will get the record by id from database */
  public getAssetById(id: string): Observable<Asset> {
    const url: string = this.baseUrl + 'assets/' + id;
    return this.http.httpGetRequest<Asset>(url).pipe(map((response: BaseResponse<Asset>) =>
      this.assetFormAdapter.toResponse(response.result)));
  }

  /** This will save the record into database */
  public addAsset(asset: Asset): Observable<void> {
    const url: string = this.baseUrl + 'assets';
    return this.http.httpPostRequest<void>(url, this.assetFormAdapter.toRequest(asset));
  }

  /** This will save the record by id into database */
  public updateAsset(id: string, asset: Asset): Observable<void> {
    const url: string = this.baseUrl + 'assets/' + id;
    return this.http.httpPutRequest<void>(url, this.assetFormAdapter.toRequest(asset));
  }

  /**
   * It invokes the API to delete the record mentioned in the path parameter.
   * @param id The id of the record that needs to be deleted from the server.
   */
  public deleteAsset(asset: AssetList): Observable<void> {
    const url: string = this.baseUrl + 'assets/' + asset.assetId;
    return this.http.httpDeleteRequest<void>(url);
  }

  /**
   * This will toggle the user status in database into database
   * @param flag action flag to be set
   * @param assetId assetId
   */
  public toggleAssetStatus(flag: boolean, assetId: number): Observable<void> {
    const url: string = `${this.baseUrl}assets/${assetId}/togglestatus`;
    const body: AssetToggleStatusRequest = this.assetListAdapter.toggleStatusRequest(flag);
    return this.http.httpPutRequest<void>(url, body);
  }

  /**
   * This method invokes the server's get endpoint to fetch the record as per the criteria mentioned in the tabelProperty parameters.
   * It converts the criteria to key and values expected by the API by invoking processParam method. It then invokes the server, on successful
   * response, it fetches the count from the header and invokes the adapter to convert server's response to what is expected by the client.
   * What happens when there is an error from the server ?
   * @param  tableProperty - Store the criteria based on which the records should be fetched from the server.
   * @returns - fleetTicket[]
   */
  public getFleetTickets(tableProperty: TableProperty, assetId: number): Observable<AssetTicketResult> {
    const url: string = this.baseUrl + 'assets/' + assetId + '/tickets/search';
    const params: Params<TableProperty> = convertToRequestParams(tableProperty);
    return this.http.httpPostRequest<AssetTicketResult>(
      url, tableProperty.filter, { params: { ...params } }).pipe(map((data: BaseResponse<AssetTicketResult>) => {
        data.result.assetTickets = data.result.assetTickets.map((items: AssetTicket) => this.assetTicketAdapter.toResponse(items));
        return data.result;
      }));
  }

  /** This will get the record by id from database */
  public getAssetTicketById(ticketId: number): Observable<AssetTicket> {
    const url: string = this.baseUrl + 'assets/tickets/' + ticketId;
    return this.http.httpGetRequest<AssetTicket>(url).pipe(map((response: BaseResponse<AssetTicket>) =>
      this.assetTicketAdapter.toResponse(response.result)));
  }

  /** This will save the record into database */
  public addAssetTicket(fleetTicket: AssetTicket, assetId: number): Observable<void> {
    const url: string = this.baseUrl + 'assets/' + assetId + '/tickets';
    return this.http.httpPostRequest<void>(url, this.assetTicketAdapter.toRequest(fleetTicket));
  }

  /** This will save the record by id into database */
  public updateAssetTicket(ticketId: number, fleetTicket: AssetTicket): Observable<void> {
    const url: string = this.baseUrl + 'assets/tickets/' + ticketId;
    return this.http.httpPutRequest<void>(url, this.assetTicketAdapter.toRequest(fleetTicket));
  }

  /** getTicketCategory */
  public getTicketCategory(): Observable<AssetTicketCategory[]> {
    const url: string = this.baseUrl + 'assetTicketCategories';
    return this.http.httpGetRequest<AssetTicketCategory[]>(url).pipe(map((response: BaseResponse<AssetTicketCategory[]>) => response.result));
  }
  /** getTicketStatus */
  public getTicketStatus(): Observable<AssetTicketStatus[]> {
    const url: string = this.baseUrl + 'assetTicketStatus';
    return this.http.httpGetRequest<AssetTicketStatus[]>(url).pipe(map((response: BaseResponse<AssetTicketStatus[]>) => response.result));
  }
  /** getPriority */
  public getPriority(): Observable<AssetPriority[]> {
    const url: string = this.baseUrl + 'priorities';
    return this.http.httpGetRequest<AssetPriority[]>(url).pipe(map((response: BaseResponse<AssetPriority[]>) => response.result));
  }

  /**
   * This method invokes the server's get endpoint to fetch the record as per the criteria mentioned in the tabelProperty parameters.
   * It converts the criteria to key and values expected by the API by invoking processParam method. It then invokes the server, on successful
   * response, it fetches the count from the header and invokes the adapter to convert server's response to what is expected by the client.
   * What happens when there is an error from the server ?
   * @param  tableProperty - Store the criteria based on which the records should be fetched from the server.
   * @returns - meterRead[]
   */
  public getMeterReads(tableProperty: TableProperty, assetId: number): Observable<AssetMeterReadResult> {
    const url: string = this.baseUrl + 'assets/' + assetId + '/meterread/search';
    const params: Params<TableProperty> = convertToRequestParams(tableProperty);
    return this.http.httpGetRequest<AssetMeterReadResult>(
      url, { params: { ...params } }).pipe(map((data: BaseResponse<AssetMeterReadResult>) => {
        data.result.assetMeterList = data.result.assetMeterList.map((items: AssetMeter) => this.assetMeterAdapter.toResponse(items));
        return data.result;
      }));
  }

  /** This will get the record by id from database */
  public getMeterReadById(assetId: number): Observable<MeterRead> {
    const url: string = this.baseUrl + 'assets/' + assetId + '/meterread';
    return this.http.httpGetRequest<MeterRead>(url).pipe(map((response: BaseResponse<MeterRead>) =>
      this.meterReadAdapter.toResponse(response.result)));
  }

  /** This will save the record into database */
  public addMeterRead(meterRead: MeterRead, assetId: number): Observable<void> {
    const url: string = this.baseUrl + 'assets/' + assetId + '/meterread';
    return this.http.httpPostRequest<void>(url, this.meterReadAdapter.toRequest(meterRead));
  }

  /**
   * It invokes the API to delete the record mentioned in the path parameter.
   * @param assetMeterId The id of the record that needs to be deleted from the server.
   */
  public deleteMeterRead(assetMeterId: number): Observable<void> {
    const url: string = `${this.baseUrl}assets/meterread/${assetMeterId}`;
    return this.http.httpDeleteRequest<void>(url);
  }

  /** exportAsPDF  */
  public exportAsPDF(assetId: number): Observable<Blob> {
    const url: string = this.baseUrl + 'assets/' + assetId + '/pdf';
    return this.http.httpGetRequest<void>(url, { responseType: 'blob' });
  }
  /** exportAsExcel  */
  public exportAsExcel(assetId: number): Observable<Blob> {
    const url: string = this.baseUrl + 'assets/' + assetId + '/excel';
    return this.http.httpGetRequest<void>(url, { responseType: 'blob' });
  }
}

