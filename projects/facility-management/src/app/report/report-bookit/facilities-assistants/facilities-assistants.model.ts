/** Class defined for FacilitiesAssistants */
export class FacilitiesAssistants {
    public month: string = '';
    public workOrderTickets: number = 0;
    public labourbHourPerMonth: number = 0;
    public onlyForTable: boolean = false;
    constructor(
        month: string = '',
        workOrderTickets: number = 0,
        labourbHourPerMonth: number = 0,
        onlyForTable: boolean = false
    ) {
        this.month = month;
        this.workOrderTickets = workOrderTickets;
        this.labourbHourPerMonth = labourbHourPerMonth;
        this.onlyForTable = (this.month === 'YTD' || this.month === 'Avg') ? true : false;
    }
    
}
export const TableHeader: string[] = ['JOSE BARILLO' , 'WORK ORDER TICKETS', 'LABOR HOURS-PER MONTH']