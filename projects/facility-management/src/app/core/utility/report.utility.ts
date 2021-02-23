/**
 * This method is used for return of chart data
 * @param itemsArray Get the Array list for chart
 */
export function dataForChart(itemsArray: any[]): any {
    let chartData: string[][];
    const firstMonthOfYear: string = 'jan';
    const currentMonth: string = new Date().toLocaleDateString(undefined, { month: 'short' }).toLowerCase();
    const currentYear: string = new Date().getFullYear().toString();

    if (itemsArray) {
        const itemObj: string[] = Object.keys(itemsArray[0]);
        const years: any = itemsArray[0].data.map((yearName: any) => yearName.year);

        let headings: any[] = [itemObj[0], ...years];

        chartData = [headings];

        itemsArray.forEach((item: any) => {
            let monthName: string[] = [item.month];
            let monthValue: string[] = [];

            item.data.forEach((value: any) => {
                /** Set null if the current month and array month are same,
                 *  Set 0 if current month is "jan", considering whole year with no data.
                 */
                const val: any = ((currentMonth === item.month.toLowerCase()) && (currentYear === value.year))
                    ? (currentMonth === firstMonthOfYear ? 0 : null)
                    : value.value;
                monthValue.push(val);
            });
            chartData.push(monthName.concat(monthValue));
        });

    }

    return chartData;
}

/**
 * This method is used for return of JsPDF Data
 * @param itemsArray Get the Array list for Js PDF
 */
export function dataForJsPDF(itemsArray: any[]): any {

    let headings: any[] = [];
    let tableValues: string[][] = [];

    if (itemsArray) {
        const years: any = itemsArray[0].data.map((yearName: any) => yearName.year);

        headings = ['MONTH', ...years];

        itemsArray.forEach((item: any) => {
            let monthName: string[] = [item.month];
            let monthValue: string[] = [];

            item.data.forEach((value: any) => {
                monthValue.push(value.value);
            });
            tableValues.push(monthName.concat(monthValue));
        });
    }

    return {
        tableHeader: headings,
        tableValue: tableValues
    }
}

/**
 * For prepare bookit Chart data
 * @param header Get the header
 * @param value Get the bookIt value
 * @param tableColumn Get the number of column
 */
export function dataForBookItChart(header: any[], value: any[], tableColumn: number): any {
    let chartData: string[][];
    chartData = [header];
    value.forEach((res: any) => {
        let monthName: string[] = [res.month];
        let monthValue: string[] = [];
        if (tableColumn === 3) {
            monthValue = [res.workOrderTickets, res.labourbHourPerMonth]
        } else {
            // For 2 column set month value
            monthValue = [res.helpDeskValue]
        }
        chartData.push(monthName.concat(monthValue));
    });

    return chartData;
}

/**
 * For prepare bookit JsPDF Data
 * @param header Get the header
 * @param value Get the bookIt value
 * @param tableColumn Get the number of column
 */
export function dataForJsPDFTable(header, value, tableColumn): any {
    let tableValues: string[][] = [];

    value.forEach((res: any) => {
        let monthName: string[] = [res.month];
        let monthValue: string[] = [];
        if (tableColumn === 3) {
            monthValue = [res.workOrderTickets !== null ? res.workOrderTickets : '-', res.labourbHourPerMonth !== null ? res.labourbHourPerMonth : '-']
        } else {
            // For 2 column set month value
            monthValue = [res.helpDeskValue !== null ? res.helpDeskValue : '-']
        }
        tableValues.push(monthName.concat(monthValue));
    });

    return {
        tableHeader: header,
        tableValue: tableValues
    }

}