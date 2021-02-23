import { BaseCopyReportResponse, BaseData } from '../../../core/model/copyit-annual-report.model';

/** model class for TotalCopyVolume */
export class TotalCopyVolumeResponse {
    public avgColorRequest: number;
    public avgBwRequest: number;
    public avgScanRequest: number;
    public period: TotalVolumePeriod[];

    constructor(
        avgColorRequest?: number,
        avgBwRequest?: number,
        avgScanRequest?: number,
        period?: TotalVolumePeriod[]
    ) {
        this.avgColorRequest = avgColorRequest;
        this.avgBwRequest = avgBwRequest;
        this.avgScanRequest = avgScanRequest;
        this.period = period;
    }
}

/** Model Class for Copy Impression Chart */
export class TotalVolumePeriod extends BaseCopyReportResponse {
    constructor(
        month?: string,
        onlyForTable?: boolean,
        data?: Data[]
    ) {
        super(month, onlyForTable, data);
    }
}

/** Model class for Chart value and Year */
export class Data extends BaseData {
    constructor(
        year?: string,
        value?: number
    ) {
        super(year, value);
    }
}