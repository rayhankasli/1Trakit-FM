
import { Injectable } from '@angular/core';
import { DecimalPipe } from '@angular/common';
// ------------------------------------------------------- //
import { Adapter } from 'common-libs';
// ------------------------------------------------------- //
import { FleetList, AssestsList } from '../report-fleet.model';


/**
 * ReportFleetListAdapter
 */
@Injectable()
export class ReportFleetListAdapter implements Adapter<FleetList> {
    constructor(
        private decimalPipe: DecimalPipe
    ) {}

    /**
     * This is a method of  adapter class to modify year list
     * response coming from service.
     * @param fleet
     */
    public toResponse(fleet: FleetList): FleetList {
        const fleetList: FleetList = new FleetList(
            fleet.month,
            fleet.totalMachineCount,
            fleet.totalCalls === null ? '0' : fleet.totalCalls,
            fleet.totalServiceCalls === null ? '0' : fleet.totalServiceCalls,
            fleet.totalFleetTimeup === null ? '0' : fleet.totalFleetTimeup,
            fleet.totalImpressionCount === null ? '0' : this.decimalPipe.transform(fleet.totalImpressionCount),
            !!fleet.assets ? this.bindAssets(fleet.assets) : [],
        );
        return fleetList;
    }

    /** bindAssets */
    public bindAssets(data: AssestsList[]): AssestsList[] {
        let assets: AssestsList[];
        assets = data.map((t: AssestsList) => (
            this.bindAssetsObject(t)
        ));
        return assets;
    }

    /** bindAssetsObject */
    public bindAssetsObject(data: AssestsList): AssestsList {
        const assetsObj: AssestsList = new AssestsList(
            data.totalCalls === null ? '0' : data.totalCalls,
            data.serviceCalls === null ? '0' : data.serviceCalls,
            data.fleetTimeup === null ? '0' : data.fleetTimeup,
            data.impressionCount === null ? '0' : this.decimalPipe.transform(data.impressionCount),
            data.manufacturer,
            data.modelNo,
            data.assetNo,
        );
        return assetsObj;
    }
}