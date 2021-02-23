/**
 * @author Rayhan Kasli
 * @description This is adapter file for create comman adapter for all reports
 */
import { Injectable } from '@angular/core';
import { Adapter } from 'common-libs';
import { FleetDetail, FleetDetailList, YearList } from '../../../report/report-model';

/**
 * ReportYearListAdapter
 */
@Injectable()
export class ReportYearListAdapter implements Adapter<YearList> {

    /**
     * This is a method of  adapter class to modify year list
     * response coming from service.
     * @param item
     */
    public toResponse(item: YearList): YearList {
        const yearList: YearList = new YearList(
            item.year,
        );
        return yearList;
    }
}

/**
 * ReportFleetDetailListAdapter
 */
@Injectable()
export class ReportFleetDetailListAdapter implements Adapter<FleetDetailList> {

    /**
     * This is a method of  adapter class to modify year list
     * response coming from service
     * @param fleetDetalList
     */
    public toResponse(fleetDetail: FleetDetailList): FleetDetailList {
        const fleetDetailList: FleetDetailList = new FleetDetailList(
            fleetDetail.clientId,
            fleetDetail.companyName,
            this.bindFleetDetail(fleetDetail.fleetDetail),
        );
        return fleetDetailList;
    }

    /** bindFleetDetail */
    public bindFleetDetail(data: FleetDetail[]): FleetDetail[] {
        let fleetDetail: FleetDetail[];
        fleetDetail = data.map((t: FleetDetail) => (
            this.bindFleetObject(t)
        ));
        return fleetDetail;
    }

    /** bindFleetObject */
    public bindFleetObject(data: FleetDetail): FleetDetail {
        const fleetDetailObj: FleetDetail = new FleetDetail(
            data.assetId,
            data.assetNo,
            data.manufacturer,
            data.modelNo
        );
        return fleetDetailObj;
    }
}
