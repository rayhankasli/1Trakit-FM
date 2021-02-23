
/**
 * @author Ronak Patel.
 * @description This is for table property.
 */

import { SortingOrder } from '../../shared/directives/sorting/sorting-order.model';
/** create class for pass params */
export class TableProperty<T = any> {
    /** pageNumber */
    public pageNumber: number;
    /** pageLimit */
    public pageLimit: number;
    /** sort */
    public sort: string;
    /** order */
    public order: SortingOrder;
    /** order */
    public start: number;
    /** end */
    public end: number;
    /** search */
    public search: string;
    /**  filter */
    public filter: T;
    /** totalRecord */
    public totalRecord: number;
    constructor(pageNumber: number = 0, pageLimit: number = 10) {
        this.pageNumber = pageNumber;
        this.pageLimit = pageLimit;
    }
}

/**
 * Sort type
 */
export enum SortType {
    Ascending = '+',
    Descending = '-'
}