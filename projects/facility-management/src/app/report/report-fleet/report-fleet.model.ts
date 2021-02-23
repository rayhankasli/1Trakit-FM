export const FleetMainHeader: string[] = ['MONTHS', 'MACHINE COUNT', 'TOTAL CALLS', 'SERVICE CALLS', 'UP-TIME %', 'TOTAL IMPRESSIONS'];

/** Model Class for month list constant array */
export class InnerHeader {
  public isHeader: boolean
  public manufacturer: string
  public assetNo: string
  public modelNo: string
  public totalCalls: string
  public serviceCalls: string
  public fleetTimeup: string
  public impressionCount: string
}

/** For Inner Table header object */
export const innerHeaderObject: InnerHeader = {
  'isHeader': true,
  'manufacturer': 'MANUFACTURER',
  'assetNo': 'ASSET NO',
  'modelNo': ' MODEL NO',
  'totalCalls': 'TOTAL CALLS',
  'serviceCalls': 'SERVICE CALLS',
  'fleetTimeup': 'UP-TIME',
  'impressionCount': 'TOTAL IMPRESSIONS'
}


/** Model Class for Fleet List which bind in table */
export class FleetList {
  public month: string = ''
  public totalMachineCount: string = ''
  public totalCalls: string = ''
  public totalServiceCalls: string = ''
  public totalFleetTimeup: string = ''
  public totalImpressionCount: string = ''
  public assets: AssestsList[]
  constructor(
    month: string = '',
    totalMachineCount: string = '',
    totalCalls: string = '',
    totalServiceCalls: string = '',
    totalFleetTimeup: string = '',
    totalImpressionCount: string = '',
    assets: AssestsList[]
  ) {
    this.month = month;
    this.totalMachineCount = totalMachineCount;
    this.totalCalls = totalCalls;
    this.totalServiceCalls = totalServiceCalls;
    this.totalFleetTimeup = totalFleetTimeup;
    this.totalImpressionCount = totalImpressionCount;
    this.assets = assets;
  }
}

/** Model Class for assets List */
export class AssestsList {
  public totalCalls: string = ''
  public serviceCalls: string = ''
  public fleetTimeup: string = ''
  public impressionCount: string = ''
  public manufacturer: string = ''
  public modelNo: string = ''
  public assetNo: string = ''
  constructor(
    totalCalls: string = '',
    serviceCalls: string = '',
    fleetTimeup: string = '',
    impressionCount: string = '',
    manufacturer: string = '',
    modelNo: string = '',
    assetNo: string = ''
  ) {
    this.totalCalls = totalCalls;
    this.serviceCalls = serviceCalls;
    this.fleetTimeup = fleetTimeup;
    this.impressionCount = impressionCount;
    this.manufacturer = manufacturer;
    this.modelNo = modelNo;
    this.assetNo = assetNo;
  }
}


/** class define for table Row */
export class TableRow {
  public month: string
  public totalMachineCount: string
  public totalCalls: string
  public totalServiceCalls: string
  public totalFleetTimeup: string
  public totalImpressionCount: string
}

/** PdfDataType for pdf table data type defined */
export interface PdfDataType {
  tableHeader: string[]
  tableValue: TableRow[]
}
