/** Model Class for BookItRepeatsOn */
export class BookItRepeatsOn {
    public recurringId: number
    public endDate: Date;
    public repeatBy: number;
    public repeatsOnDay: number[];
}

/** Model Class for BookItRepeatsOnRequest */
export class BookItRepeatsOnRequest {
    public recurringId: number
    public endDate: string;
    public repeatBy: number;
    public repeatsOnDay: number[];

    constructor(recurringId: number, endDate: string, repeatBy: number, repeatsOnDay: number[]) {
        this.recurringId = recurringId;
        this.endDate = endDate;
        this.repeatBy = repeatBy;
        this.repeatsOnDay = repeatsOnDay;
    }
}
