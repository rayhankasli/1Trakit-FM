/**
 * @author Mitul Patel.
 * @description Service layer class to communicate with the server.
 */

import { BaseResponse, HttpService, Params, TableProperty } from 'common-libs';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';

// ------------------------------------------------------------- //
import { environment } from '../../environments/environment';
import {
  ClientAdapter, ClientFilterAdapter, ClientFormAdapter,
} from './client-adapter/client.adapter';
import {
  Client, ClientDetails, ClientFilterRequest, ClientDetailsResponse, ClientListResult
} from './client.model';
import { convertToRequestParams } from '../core/utility/utility';

@Injectable()
export class ClientService {
  /** store base url */
  private baseUrl: string;
  /** API version */
  private readonly API_VERSION: string = environment.api_version;

  constructor(
    private http: HttpService,
    private clientAdapter: ClientAdapter,
    private clientFilterAdapter: ClientFilterAdapter,
    private clientFormAdapter: ClientFormAdapter,

  ) {
    this.baseUrl = environment.baseUrl;

  }

  /**
   * This method invokes the server's get endpoint to fetch the record as per the criteria mentioned in the tabelProperty parameters.
   * It converts the criteria to key and values expected by the API by invoking processParam method. It then invokes the server, on successful
   * response, it fetches the count from the header and invokes the adapter to convert server's response to what is expected by the client.
   * What happens when there is an error from the server ?
   * @param  tableProperty - Store the criteria based on which the records should be fetched from the server.
   * @returns - client[]
   */
  public getClients(tableProperty: TableProperty<ClientFilterRequest>): Observable<ClientListResult> {
    const url: string = this.baseUrl + 'clients/search';
    const body: ClientFilterRequest = this.clientFilterAdapter.toRequest(tableProperty.filter);
    const params: Params = convertToRequestParams(tableProperty);
    return this.http.httpPostRequest<ClientListResult>(
      url, body, { params: { ...params } }).pipe(
        map((data: BaseResponse<ClientListResult>) => {
          data.result.clientList = data.result.clientList.map((item: Client) => this.clientAdapter.toResponse(item));
          return data.result;
        }));
  }

  /** This will get the record by id from database */
  public getClientById(id: string): Observable<ClientDetails> {
    const url: string = this.baseUrl + 'clients/' + id;
    return this.http.httpGetRequest<ClientDetailsResponse>(url, this.API_VERSION)
      .pipe(map((response: BaseResponse<ClientDetailsResponse>) =>
        this.clientFormAdapter.toResponse(response.result)));
  }

  /** This will save the record into database */
  public addClient(client: ClientDetails): Observable<number> {
    const url: string = this.baseUrl + 'clients';
    const formData: ClientDetails = this.clientFormAdapter.toRequest(client);
    return this.http.httpPostRequest<BaseResponse<number>>(url, formData, this.API_VERSION).pipe(
      map((response: BaseResponse<number>) => response.result)
    );
  }

  /** This will save the record by id into database */
  public updateClient(id: string, client: ClientDetails): Observable<void> {
    const url: string = this.baseUrl + 'clients/' + id;
    const formData: ClientDetails = this.clientFormAdapter.toRequest(client);
    return this.http.httpPutRequest<void>(url, formData, this.API_VERSION);
  }

  /**
   * It invokes the API to delete the record mentioned in the path parameter.
   * @param id The id of the record that needs to be deleted from the server.
   */
  public deleteClient(client: Client): Observable<void> {
    const url: string = this.baseUrl + 'clients';
    return this.http.httpDeleteRequest<void>(`${url}/${client.clientId}`, this.API_VERSION);
  }

  /** Set client status active/inactive */
  public setClientStatus(client: Client): Observable<boolean> {
    const url: string = `${this.baseUrl}clients/${client.clientId}/toggleStatus`;
    const body: ClientFilterRequest = this.clientFilterAdapter.toRequest(client);
    return this.http.httpPutRequest<boolean>(url, body, this.API_VERSION);
  }

}

