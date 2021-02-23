/**
 * @author Rayhan Kasli.
 * @description Service layer class to communicate with the server.
 */
import { Injectable } from '@angular/core';
import { BaseResponse, HttpService, Params, TableProperty } from 'common-libs';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
// ------------------------------------------------------------- //
import { environment } from '../../environments/environment';
import { convertDateFormat, convertToRequestParams } from '../core/utility/utility';
import { DeliveryServiceAdapter, PackagesAdapter, PackagesFilterAdapter, SlotAdapter, UserDetailsAdapter, UserListAdapter } from './packages-adapter/packages.adapter';
import { DeliveryService, PackageFilterRecord, Packages, PackagesRequest, Slot, UserDetails } from './packages.model';

@Injectable()
export class PackagesService {
  /** store base url */
  private baseUrl: string;
  private readonly API_VERSION: string;
  constructor(
    private http: HttpService,
    private packagesAdapter: PackagesAdapter,
    private packagesFilterAdapter: PackagesFilterAdapter,
    private userDetailsAdapter: UserDetailsAdapter,
    private deliveryServiceAdapter: DeliveryServiceAdapter,
    private userListAdapter: UserListAdapter,
    private slotAdapter: SlotAdapter
  ) {
    this.baseUrl = environment.baseUrl;
    this.API_VERSION = environment.api_version;
  }

  /**
   * This method invokes the server's get endpoint to fetch the record as per the criteria mentioned in the tabelProperty parameters.
   * It converts the criteria to key and values expected by the API by invoking processParam method. It then invokes the server, on successful
   * response, it fetches the count from the header and invokes the adapter to convert server's response to what is expected by the client.
   * What happens when there is an error from the server ?
   * @param  tableProperty - Store the criteria based on which the records should be fetched from the server.
   * @returns - packages[]
   */
  public getPackagess(tableProperty: TableProperty): Observable<Packages[]> {
    const body: PackageFilterRecord = this.packagesFilterAdapter.toRequest(tableProperty.filter);
    const params: Params<TableProperty> = convertToRequestParams(tableProperty);
    const url: string = this.baseUrl + 'packages/web?startDate=' + convertDateFormat(tableProperty.filter.startDate) + '&endDate=' + convertDateFormat(tableProperty.filter.endDate);
    return this.http.httpPostRequest<Packages[]>(
      url, body, { params: { ...params } }).pipe(map((data: BaseResponse<any>) => {
        data.result.packageList = data.result.packageList.map((items: Packages) => this.packagesAdapter.toResponse(items));
        return data.result;
      }));
  }

  /** This will get the record by id from database */
  public getPackagesById(id: string): Observable<Packages> {
    const url: string = this.baseUrl + 'Packages/' + id;
    return this.http.httpGetRequest<Packages>(url,).pipe(map((response: BaseResponse<Packages>) =>
      this.packagesAdapter.toResponse(response.result)));
  }

  /** This will save the record into database */
  public addPackages(packages: Packages): Observable<void> {
    const url: string = this.baseUrl + 'Packages';
    const request: PackagesRequest = this.packagesAdapter.toRequest(packages);
    return this.http.httpPostRequest<void>(url, request);
  }

  /** This will save the record by id into database */
  public updatePackages(packages: Packages): Observable<void> {
    const url: string = `${this.baseUrl}Packages/${packages.packageId}`;
    const request: PackagesRequest = this.packagesAdapter.toRequest(packages);
    return this.http.httpPutRequest<void>(url, request);
  }

  /**
   * It invokes the API to delete the record mentioned in the path parameter.
   * @param id The id of the record that needs to be deleted from the server.
   */
  public deletePackages(packages: Packages): Observable<void> {
    const url: string = `${this.baseUrl}Packages/${packages.packageId}`;
    return this.http.httpDeleteRequest<void>(url);
  }

  /** getUserList based on serch criteria */
  public getUserList(search: string): Observable<UserDetails[]> {
    const url: string = `${this.baseUrl}users?searchText=${search}`;
    return this.http.httpGetRequest<UserDetails[]>(url).pipe(map((data: BaseResponse<UserDetails[]>) => {
      return data.result.map((item: UserDetails) => this.userListAdapter.toResponse(item));
    }));
  }

  /** getUserDetails */
  public getUserDetails(userId: number): Observable<UserDetails> {
    const url: string = `${this.baseUrl}users/${userId}/details`;
    return this.http.httpGetRequest<UserDetails>(url).pipe(map((response: BaseResponse<UserDetails>) =>
      this.userDetailsAdapter.toResponse(response.result)));
  }

  /** getDeliveryServiceCompanyList */
  public getDeliveryServiceCompanyList(): Observable<DeliveryService[]> {
    const url: string = `${this.baseUrl}DeliveryServices`;
    return this.http.httpGetRequest<DeliveryService[]>(url).pipe(
      map((data: BaseResponse<DeliveryService[]>) => data.result.map(
        (item: DeliveryService) => this.deliveryServiceAdapter.toResponse(item)
      )));
  }

  /** get slots based on selected office */
  public getSlotsByOffice(officeId: number, date: string): Observable<Slot[]> {
    // using shared API developed for mobile app, and need offset * -1
    const headers: any = { timeZoneOffset: `${new Date().getTimezoneOffset() * -1}`, 'api-version': this.API_VERSION }
    let url: string = `${this.baseUrl}offices/${officeId}/slots`;
    if (date) { url += `?date=${date}`; }
    return this.http.httpGetRequest<Slot[]>(url, { headers }).pipe(
      map((data: BaseResponse<Slot[]>) => this.slotAdapter.toResponse(data.result, date)));
  }

}

