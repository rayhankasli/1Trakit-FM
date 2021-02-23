/** Constant for COPYIT OPTION LIST */
export const REPORT_TYPE_LIST: LableValuePair[] = [
    {
        label: 'Weekly',
        value: 1
    },
    {
        label: 'Others',
        value: 2
    }
]

/** List of Option */
export class LableValuePair {
    /** Label for Option */
    public label: string;
    /** value */
    public value: number;
}

/** repeats On model */
export class RepeatsOn {
    /** repeats */
    public repeatType: number;
    /** every for request */
    public every: number;
    /** list of days */
    public repeatsOnDay: number[] | any[];
}