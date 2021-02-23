/**
 * @author Ronak Patel.
 */

import { Injectable } from '@angular/core';
import { AssetMeter, AssetMeterReadResult } from '../../fleet.model';

@Injectable()
export class MeterReadPrintPresenter {

    constructor() { }

    /** Create for set missing entry. */
    public setMissingMeterRead(baseResponse: AssetMeterReadResult): AssetMeterReadResult {
        let newBaseResponse: AssetMeter[] = [];
        let previousRecord: AssetMeter;
        baseResponse && baseResponse.assetMeterList.forEach((meterRead: AssetMeter) => {
            if (previousRecord
                && (previousRecord.previousColorRead !== meterRead.currentColorRead
                    || previousRecord.previousBwRead !== meterRead.currentBwRead
                    || previousRecord.previousScanRead !== meterRead.currentScanRead)) {

                previousRecord.isMissingEntry = true;
                meterRead.downAssetMeterId = meterRead.assetMeterId;
                meterRead.upAssetMeterId = previousRecord.assetMeterId;
                newBaseResponse.push(previousRecord);
                baseResponse.total++;
            }
            newBaseResponse.push(meterRead);
            previousRecord = { ...meterRead };
        });

        return { assetMeterList: newBaseResponse, total: baseResponse.total };
    }
}