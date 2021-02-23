

/** getDaysInMonth */
export function getDaysInMonth(month: number, year: number): number {
    return new Date(year, month + 1, 0).getDate();
}

/** getDays */
export function getDays(date: Date): number {
    let splitDate: string;
    if(date.getTimezoneOffset() >= 0) {
        splitDate = (date.getUTCMonth() + 1) < 10 ? ('0' + (date.getUTCMonth() + 1)).toString() : (date.getUTCMonth() + 1).toString();
        return new Date(date.getUTCFullYear() + '-' + (splitDate)).getUTCDay() + 1;
    } else {
        splitDate = (date.getMonth() + 1) < 10 ? ('0' + (date.getMonth() + 1)).toString() : (date.getMonth() + 1).toString();
        return new Date(date.getFullYear() + '-' + (splitDate)).getDay() + 1;
    }
}