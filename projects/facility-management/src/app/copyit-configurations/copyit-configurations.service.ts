/**
 * @author Ronak Patel.
 * @description Service layer class to communicate with the server.
 */
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
// ------------------------------------------------------------- //
import { Params, TableProperty, HttpService, BaseResponse } from 'common-libs';
// ------------------------------------------------------------- //
import { environment } from '../../environments/environment';
import { CopyitManageAccountAdapter, CopyitDefaultValuesAdapter } from './copyit-configurations-adapter/copyit-configurations.adapter';
import { CopyitOptions, CopyitDefaultValues, AssignTo } from './copyit-configurations.model';
import { CopyitManageAccount, RequestCopyitManageAccount, CopyitManageAccounListResult } from './models/copyit-manage-account.model';
import { convertToRequestParams } from '../core/utility/utility';
import { DefaultCopyItConfigurationRequest } from './models/defaultCopyItConfigurationRequest';
import { CopyitOptionsAdapter } from './copyit-configurations-adapter/copyit-option.adapter';

@Injectable()
export class CopyitConfigurationsService {

  /** store base url */
  private baseUrl: string;

  constructor(
    private http: HttpService,
    private copyitOptionsAdapter: CopyitOptionsAdapter,
    private copyitManageAccountAdapter: CopyitManageAccountAdapter,
    private copyitDefaultValuesAdapter: CopyitDefaultValuesAdapter,
  ) {
    this.baseUrl = environment.baseUrl;
  }

  /** This will get the record by id from database */
  public getCopyitOptions(id: string): Observable<CopyitOptions> {
    const url: string = this.baseUrl + 'clients/' + id + '/configurations';
    return this.http.httpGetRequest<CopyitOptions>(url).pipe(map((data: BaseResponse<CopyitOptions>) => {
      return data.result;
    }));
  }

  /** This will get the record by id from database */
  public getCopyitMasterData(): Observable<CopyitOptions> {
    const url: string = this.baseUrl + 'copyIts/configurations';
    return this.http.httpGetRequest<CopyitOptions>(url).pipe(map((data: BaseResponse<CopyitOptions>) => {
      return data.result;
    }));
  }

  /** This will save the record by id into database */
  public updateCopyitOptions(id: string, copyitOptions: CopyitOptions): Observable<void> {
    const url: string = this.baseUrl + 'clients/' + id + '/configurations';
    const data: CopyitOptions = this.copyitOptionsAdapter.toRequest(copyitOptions)
    return this.http.httpPutRequest<void>(url, data);
  }

  /**
   * This method invokes the server's get endpoint to fetch the record as per the criteria mentioned in the tabelProperty parameters.
   * It converts the criteria to key and values expected by the API by invoking processParam method. It then invokes the server, on successful
   * response, it fetches the count from the header and invokes the adapter to convert server's response to what is expected by the client.
   * What happens when there is an error from the server ?
   * @param  tableProperty - Store the criteria based on which the records should be fetched from the server.
   * @returns - copyitManageAccount[]
   */
  public getCopyitManageAccounts(tableProperty: TableProperty, clientId: number): Observable<CopyitManageAccounListResult> {
    const url: string = this.baseUrl + `clients/${clientId}/account/search`;
    const params: Params<TableProperty> = convertToRequestParams(tableProperty);
    return this.http.httpPostRequest<CopyitManageAccounListResult>(
      url, tableProperty.filter, { params: { ...params } }).pipe(
        map((data: BaseResponse<CopyitManageAccounListResult>) => {
          data.result.accountList = data.result.accountList.map((items: CopyitManageAccount) => this.copyitManageAccountAdapter.toResponse(items));
          return data.result;
        }));
  }

  /** get all the Assign TO requestors list */
  public getAssignToRequestor(id: number): Observable<AssignTo[]> {
    const url: string = this.baseUrl + `clients/${id}/users/4`;
    return this.http.httpGetRequest(url).pipe(map((response: any) =>
      response.result
    ));
  }

  /** get all the Assign TO Associates list */
  public getAssignToAssociate(id: number): Observable<AssignTo[]> {
    const url: string = this.baseUrl + `clients/${id}/users/3`;
    return this.http.httpGetRequest(url).pipe(map((response: any) =>
      response.result
    ));
  }

  /** This will save the record into database */
  public addCopyitManageAccount(copyitManageAccount: CopyitManageAccount, clientId: number): Observable<void> {
    const url: string = this.baseUrl + 'accounts/';
    let newCopyitManageAccount: RequestCopyitManageAccount = this.copyitManageAccountAdapter.toPostRequest(copyitManageAccount, clientId);
    return this.http.httpPostRequest<void>(url, newCopyitManageAccount);
  }

  /** This will save the record by id into database */
  public updateCopyitManageAccount(copyitManageAccount: CopyitManageAccount, clientId: number): Observable<void> {
    const url: string = this.baseUrl + 'accounts/' + copyitManageAccount.clientAccountId;
    let newCopyitManageAccount: RequestCopyitManageAccount = this.copyitManageAccountAdapter.toUpdateRequest(copyitManageAccount);
    return this.http.httpPutRequest<void>(url, newCopyitManageAccount);
  }

  /**
   * It invokes the API to delete the record mentioned in the path parameter.
   * @param id The id of the record that needs to be deleted from the server.
   */
  public deleteCopyitManageAccount(copyitManageAccount: CopyitManageAccount): Observable<void> {
    const url: string = this.baseUrl + 'accounts/' + copyitManageAccount.clientAccountId;
    return this.http.httpDeleteRequest<void>(url);
  }

  /**
   * Updates copyit default value
   * @param clientId
   * @param defaultValue
   */
  public saveDefaultConfigurations(clientId: number, defaultValue: CopyitDefaultValues): Observable<void> {
    const url: string = this.baseUrl + `clients/${clientId}/defaultconfigurations`;
    const updatedDefaultValue: DefaultCopyItConfigurationRequest = this.copyitDefaultValuesAdapter.toRequest(defaultValue);
    return this.http.httpPutRequest<void>(url, updatedDefaultValue);
  }
}

