import { BaseCopyReportResponse, BaseData } from '../../../core/model/copyit-annual-report.model';

/** Model Class for Copy Impression Chart */
export class CopyIMPColorResponse extends BaseCopyReportResponse {
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