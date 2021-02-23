import { Injectable } from '@angular/core';
// import { Office, Timezone, Floor, UserType, Client, WeekDays } from '../model/common.model';
import { BaseResponse, HttpService } from 'common-libs';
import { Observable } from 'rxjs/Observable';
import { map, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import {
  ClientMaster, FloorMaster, OfficeMaster, RoleMaster, TimezoneMaster,
  WeekDays, FloorResponseMaster, AssignedToMaster, UserWithRoleMaster, UsersMaster
} from '../model/common.model';
import { UserInfo } from '../model/core.model';
import { CoreDataService } from './core-data.service';
import { WeekDaysAdapter } from './adapter/weekDays.adapter';

@Injectable({
  providedIn: 'root'
})
export class CommonHttpService {

  /** it will used to store the base api url */
  private baseUrl: string;
  private readonly API_VERSION: string = environment.api_version;

  constructor(
    private httpService: HttpService,
    private coreDataService: CoreDataService,
    private weekDaysAdapter: WeekDaysAdapter
  ) {
    this.baseUrl = environment.baseUrl;
  }

  /** it will return the list of office from server */
  public getOffices(clientId?: number): Observable<OfficeMaster[]> {
    const url: string = `${this.baseUrl}clients/${clientId}/office`;
    return this.httpService.httpGetRequest<OfficeMaster[]>(url, this.API_VERSION).pipe(
      map((data: BaseResponse<OfficeMaster[]>) => data.result.map(
        (item: OfficeMaster) => new OfficeMaster(item.officeId, item.officeName, item.officeNickName))
      ));
  }

  /** it will return the list of user type from server */
  public getRoles(): Observable<RoleMaster[]> {
    const url: string = this.baseUrl + 'roles';
    return this.httpService.httpGetRequest<RoleMaster[]>(url, this.API_VERSION)
      .pipe(map((data: BaseResponse<RoleMaster[]>) => data.result));
  }

  /** it will return list of floors based on office id */
  public getFloors(officeId: number): Observable<FloorMaster[]> {
    const url: string = `${this.baseUrl}offices/${officeId}/floors`;
    return this.httpService.httpGetRequest<FloorMaster[]>(url, this.API_VERSION).pipe(
      map((data: BaseResponse<FloorResponseMaster>) => data.result.floors.map(
        (item: FloorMaster) => new FloorMaster(item.floorId, item.floorType, item.floorNickName)
      ))
    );
  }

  /** it will return the list of timezone from server */
  public getTimezones(): Observable<TimezoneMaster[]> {
    const url: string = this.baseUrl + 'timezones';
    return this.httpService.httpGetRequest<TimezoneMaster[]>(url, this.API_VERSION)
      .pipe(map((data: BaseResponse<TimezoneMaster[]>) => data.result));
  }

  /** it will return the list of clients from server */
  public getClients(): Observable<ClientMaster[]> {
    const url: string = this.baseUrl + 'clients';
    return this.httpService.httpGetRequest<ClientMaster[]>(url, this.API_VERSION)
      .pipe(map((data: BaseResponse<ClientMaster[]>) => data[0].result));
  }

  /**
   * Gets week days
   * @returns week days
   */
  public getWeekDays(clientId: number, onlyWeekDay?: boolean): Observable<WeekDays[]> {
    const url: string = this.baseUrl + 'WeekDays';
    if (onlyWeekDay) {
      return this.httpService.httpGetRequest<WeekDays[]>(url, this.API_VERSION).pipe(map((response: BaseResponse<WeekDays[]>) =>
        this.weekDaysAdapter.toResponse(response.result)
      ));
    } else {
      return this.httpService.httpGetRequest<WeekDays[]>(url).pipe(map((data: BaseResponse<WeekDays[]>) => data.result));
    }
  }

  /** it will return the current login user info from server */
  public getLoginUserInfo(): Observable<UserInfo> {
    const url: string = this.baseUrl + 'users/information';
    // const url: string = this.baseUrl + 'information';
    return this.httpService.httpGetRequest<UserInfo>(url, this.API_VERSION)
      .pipe(map((data: BaseResponse<UserInfo>) => data.result));
  }

  /**
   * Load loggedIn user info
   */
  public loadLoggedInUserInfo(): Observable<UserInfo> {
    return this.getLoginUserInfo().pipe(
      tap((userInfo: UserInfo) => this.coreDataService.setUserInfo(userInfo)));
  }

  /**
   * Gets assigner list
   * @returns assigner list
   */
  public getUserBasedOnOffice(officeId: number): Observable<AssignedToMaster[]> {
    const url: string = this.baseUrl + `offices/${officeId}/users`;;
    return this.httpService.httpGetRequest<AssignedToMaster[]>(
      url).pipe(map((data: BaseResponse<AssignedToMaster[]>) => data.result.map((item: any) =>
        new AssignedToMaster(item.userId, item.firstName + ' ' + item.lastName))));
  }

  /** it will call the api for user list by client id */
  public getUserList(clientId: number): Observable<UserWithRoleMaster[]> {
    const url: string = `${this.baseUrl}clients/${clientId}/users/list`;
    return this.httpService.httpGetRequest<UserWithRoleMaster[]>(url, this.API_VERSION).pipe(map((response: BaseResponse<UserWithRoleMaster[]>) =>
      response.result.map((item: UserWithRoleMaster) => {
        item.user.forEach((user: UsersMaster) => {
          user.fullName = user.firstName + ' ' + user.lastName;
          user.userName = user.firstName + ' ' + user.lastName;
        });
        return item;
      }
      )));
  }

  /** updateArchivedLicensce */
  public updateArchivedLicensce(userInfo: UserInfo): Observable<void> {
    const url: string = `${this.baseUrl}users/${userInfo.userId}/archive`;
    return this.httpService.httpPutRequest<void>(url, null, this.API_VERSION);
  }
}
