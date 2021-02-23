import { BaseCopyReportResponse, BaseData } from '../../../core/model/copyit-annual-report.model';

/** Model class for Timeliness */
export class TimelinessResponse extends BaseCopyReportResponse {
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