/**
 * @author Shahbaz Shaikh
 * @description Service layer class to communicate with the server.
 */

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
// ------------------------------------------- //
import { HttpService, TableProperty, Params, BaseResponse } from 'common-libs';
// ------------------------------------------- //
import { environment } from '../../../environments/environment';
import { convertToRequestParams } from '../../core/utility/utility';
import {
    RoomAdapter, FloorAdapter, RoomTypeAdapter, RoomLayoutMasterAdapter
} from './office-adapter/office.adapter';
import {
    Floor, FloorResponse, RoomType, Room, FloorResponseResult, FloorResult, RoomLayoutMaster
} from './office.model';

@Injectable()
export class FloorService {

    /** store base url */
    private baseUrl: string;

    constructor(
        private http: HttpService,
        private floorAdapter: FloorAdapter,
        private roomAdapter: RoomAdapter,
        private roomTypeAdapter: RoomTypeAdapter,
        private roomLayoutMasterAdapter: RoomLayoutMasterAdapter
    ) {
        this.baseUrl = environment.baseUrl;
    }

    /**
     * This method invokes the server's get endpoint to fetch the record as per the criteria mentioned in the tabelProperty parameters.
     * It converts the criteria to key and values expected by the API by invoking processParam method. It then invokes the server, on successful
     * response, it fetches the count from the header and invokes the adapter to convert server's response to what is expected by the client.
     * What happens when there is an error from the server ?
     * @param  tableProperty - Store the criteria based on which the records should be fetched from the server.
     * @returns - floor[]
     */
    public getFloors(tableProperty: TableProperty, id: string): Observable<Floor[]> {
        const url: string = this.baseUrl + 'offices/' + id + '/floors';
        const params: Params<TableProperty> = convertToRequestParams(tableProperty);
        return this.http.httpGetRequest<Floor[]>(
            url, { params: { ...params } }).pipe(map((data: BaseResponse<FloorResponseResult>) => {
                return data.result.floors.map((items: FloorResponse) => this.floorAdapter.toResponse(items));
            }));
    }

    /** get floor with office name */
    public getFloorsWithName(id: string): Observable<FloorResponseResult> {
        const url: string = this.baseUrl + 'offices/' + id + '/floors';
        return this.http.httpGetRequest<FloorResult>(
            url, { params: { ...convertToRequestParams(new TableProperty()) } }
        ).pipe(map((data: BaseResponse<FloorResponseResult>) => {
            const floors: any = data.result.floors.map((items: FloorResponse) => this.floorAdapter.toResponse(items));
            data.result.floors = floors;
            return data.result;
        }))
    }

    /**
     * getFloorType
     */
    public getFloorType(): Observable<string> {
        const url: string = this.baseUrl + 'floor-type';
        return this.http.httpGetRequest<string>(url);
    }

    /** This will toggle  the record by id from database */
    public toggleFloorStatus(status: any): Observable<BaseResponse<string>> {
        const url: string = this.baseUrl + 'floors/' + status.id + '/toggleStatus';
        return this.http.httpPutRequest<BaseResponse<string>>(url, { status: status.status });
    }

    /** This will save the record into database */
    public addFloor(id: string, floor: Floor): Observable<BaseResponse<string>> {
        const url: string = this.baseUrl + 'offices/' + id + '/floors';
        return this.http.httpPostRequest<BaseResponse<string>>(url, this.floorAdapter.toRequest(floor));
    }

    /** This will save the record by id into database */
    public updateFloor(floor: Floor): Observable<BaseResponse<string>> {
        const url: string = this.baseUrl + 'floors/' + floor.id;
        return this.http.httpPutRequest<BaseResponse<string>>(url, this.floorAdapter.toRequest(floor));
    }

    /**
     * It invokes the API to delete the record mentioned in the path parameter.
     * @param id The id of the record that needs to be deleted from the server.
     */
    public deleteFloor(id: string, floor: Floor): Observable<BaseResponse<string>> {
        const url: string = this.baseUrl + 'floors/' + floor.id;
        return this.http.httpDeleteRequest<BaseResponse<string>>(url);
    }

    /**
     * getRoomType
     */
    public getRoomType(id: string): Observable<RoomType[]> {
        const url: string = this.baseUrl + 'clients/' + id + '/roomTypes';
        return this.http.httpGetRequest<RoomType[]>(url).pipe(map((data: BaseResponse<RoomType[]>) => {
            return data.result.map((items: RoomType) => this.roomTypeAdapter.toResponse(items));
        }));
    }

    /** This will save the record into database */
    public addRoom(id: number, room: Room): Observable<BaseResponse<string>> {
        const url: string = this.baseUrl + 'floors/' + id + '/rooms';
        return this.http.httpPostRequest<BaseResponse<string>>(url, this.roomAdapter.toRequest(room));
    }

    /** This will add room type into database */
    public addRoomType(room: RoomType, id: string): Observable<BaseResponse<string>> {
        const url: string = this.baseUrl + 'clients/' + id + '/roomTypes';
        return this.http.httpPostRequest<BaseResponse<string>>(url, { 'roomType': room.roomType });
    }

    /** This will save the record by id into database */
    public updateRoom(room: Room): Observable<BaseResponse<string>> {
        const url: string = this.baseUrl + 'rooms/' + room.roomId;
        return this.http.httpPutRequest<BaseResponse<string>>(url, this.roomAdapter.toRequest(room));
    }

    /**
     * It invokes the API to delete the record mentioned in the path parameter.
     * @param id The id of the record that needs to be deleted from the server.
     */
    public deleteRoom(id: number, room: Room): Observable<BaseResponse<string>> {
        const url: string = this.baseUrl + 'rooms/' + room.roomId;
        return this.http.httpDeleteRequest<BaseResponse<string>>(url);
    }

    /**
     * Get room layout masters
     */
    public getRoomLayouts(): Observable<RoomLayoutMaster[]> {
        const url: string = `${this.baseUrl}roomLayouts/`;
        return this.http.httpGetRequest<BaseResponse<RoomLayoutMaster[]>>(url).pipe(
            map((response: BaseResponse<RoomLayoutMaster[]>) => this.roomLayoutMasterAdapter.toResponse(response.result))
        );
    }



}