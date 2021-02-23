/** FacilitiesHelpDesk modal */
export class FacilitiesHelpDesk {
    public month: string = '';
    public helpDeskValue: number = 0;
    public onlyForTable: boolean = false;
    constructor(
        month: string = '',
        helpDeskValue: number = 0,
        onlyForTable: boolean = false
    ) {
        this.month = month;
        this.helpDeskValue = helpDeskValue;
        this.onlyForTable = (this.month === 'YTD' || this.month === 'Avg') ? true : false;
    }
    
}

export const TableHeader: string[] = ['WORK ORDER TICKETS' , 'FACILITIES HELP DESK']