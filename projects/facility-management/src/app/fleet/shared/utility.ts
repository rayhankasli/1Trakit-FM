import { AssetMeterReadResult, AssetMeter } from '../fleet.model';

/**
 * Create for set missing entry.
 * @param baseResponse Get the Asset Meter Read Result
 */
export function setMissingMeterReads(baseResponse: AssetMeterReadResult, previousRecord, tableProperty?: any, meterReads?: any,): AssetMeterReadResult {

    let newBaseResponse: AssetMeter[] = [];
    if (tableProperty.pageNumber > 0) { newBaseResponse = meterReads; }
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

    return { assetMeterList: [...newBaseResponse], total: baseResponse.total };
}