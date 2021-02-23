/** Create interface for IdObject filtered data type */
export interface IdObject {
  selectedYear: string,
  clientId: number
}

/**  Create interface for filtered data type */
export interface FilterObject {
  year: string,
  clientId?: number,
  months: [number],
  assets: [number],
}

/** Model Class for Fleet Deail list */
export class FleetDetailList {
  public clientId: number = 0
  public companyName: string = ''
  public fleetDetail: FleetDetail[]
  constructor(
    clientId: number = 0,
    companyName: string = '',
    fleetDetail: FleetDetail[]
  ) {
    this.clientId = clientId;
    this.companyName = companyName;
    this.fleetDetail = fleetDetail;
  }
}

/** Model Class for Fleet FleetDetail */
export class FleetDetail {
  public assetId: number = 0
  public assetNo: string = ''
  public manufacturer: string = ''
  public modelNo: string = ''

  constructor(
    assetId: number = 0,
    assetNo: string = '',
    manufacturer: string = '',
    modelNo: string = ''
  ) {
    this.assetId = assetId;
    this.assetNo = assetNo;
    this.manufacturer = manufacturer;
    this.modelNo = modelNo
  }
}

/** class define for month list constant array */
export class monthListArray {
  public id: number
  public name: string
}

/** Create constant for Month List */
export const MonthList: monthListArray[] = [
  {
    id: 1,
    name: 'January'
  },
  {
    id: 2,
    name: 'February'
  },
  {
    id: 3,
    name: 'March'
  },
  {
    id: 4,
    name: 'April'
  },
  {
    id: 5,
    name: 'May'
  },
  {
    id: 6,
    name: 'June'
  },
  {
    id: 7,
    name: 'July'
  },
  {
    id: 8,
    name: 'August'
  },
  {
    id: 9,
    name: 'September'
  },
  {
    id: 10,
    name: 'October'
  },
  {
    id: 11,
    name: 'November'
  },
  {
    id: 12,
    name: 'December'
  }
]

/** Model class for Year List */
export class YearList {
  public year: string = ''
  constructor(
    year: string = ''
  ) {
    this.year = year;
  }
}

/** Used for year dropdown in Mail, Workflow and Task report */
export class YearsResponse {
  years: number[]
}

export class ClientYearFilter {
  public clientId: number;
  public year: number;
}

