

/**
 * @author Rayhan Kasli.
 * @description This is adapter service use for transforming data base user requirement. 
 */

import { Injectable } from '@angular/core';
// -------------------------------------------- //
import { Adapter } from 'common-libs';
import { FilterObject } from '../../report-model';
import { getMeterReadList } from '../meter-read-utility';

import { MeterRead } from '../report-meter-read.model'; 


/** MeterReadAdapter */
@Injectable()
export class MeterReadAdapter implements Adapter<MeterRead> {

    /** This method is used to transform response object into T object. */
    public toResponse(item: MeterRead): MeterRead{
        const meterRead: MeterRead = new MeterRead(
            item.assetId,
            item.manufacturer,
            item.assetNo,
            item.modelNo,
            item.total,
            getMeterReadList(item.meterReadDetail),
            item.totalBwCopies,
            item.totalBwCost,
            item.totalColorCopies,
            item.totalColorCost        
        );        
        return meterRead;
    }
}

/** MeterReadReportFilterAdapter */
@Injectable()
export class MeterReadReportFilterAdapter implements Adapter<FilterObject> {

    /** This method is used to transform T object into request object. */
    public toRequest(item: FilterObject): FilterObject {
        let filterObject: FilterObject = {
            year: item.year,
            months: item.months,
            assets: item.assets,
        }
        return filterObject;
    }
}


