/** Model class for Chart value and Year */
export class Data {
  /** Year */
  public year?: string;
  /** Value */
  public value?: number | string;

  constructor(
    year?: string,
    value?: number | string
  ) {
    this.year = year;
    this.value = value;
  }
}

/** Report Tyepe */
export enum ReportType {
  bookIt = 'bookIt',
  copyIt = 'copyIt',
}

/** Report vAxis Title */
export enum REPORT_VAXIS_TITLE {
  Workflow_Report = 'No. of Tasks',
  Mail_Report = 'No. of Packages',
}
