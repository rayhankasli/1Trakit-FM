/** model class for CopyCenterImpScan */
export class BaseCopyReportResponse {
    /** Month */
    public month?: string;
    /** Only For Tabel */
    public onlyForTable?: boolean;
    /** Year and Value Data */
    public data?: BaseData[];

    constructor (
        month?: string,
        onlyForTable?: boolean,
        data?: BaseData[]
    ) {
       this.month = month;
       this.onlyForTable = onlyForTable;
       this.data = data;
    }
}

/** Model class for Chart value and Year */
export class BaseData {
    /** Year */
    public year?: string;
    /** Value */
    public value?: number;

    constructor (
        year?: string,
        value?: number
    ) {
        this.year = year;
        this.value = value;
    }
}