/**
 * @author Shahbaz Shaikh
 * @description Base class for report copyIt
 */

import { FormGroup } from '@angular/forms';
import { TableProperty } from 'common-libs/projects';
// ----------------------------------------------- //
import { BaseTablePresenter } from '../../shared/base-presenter/base-table.presenter';

/**
 * ReportDateRangeFilterBasePresenter
 */
export class ReportDateRangeFilterBasePresenter extends BaseTablePresenter<TableProperty | TableProperty<any>> {

    /** Bs config of filter form presentation component */
    public minDate: Date;

    /** isMonthSame */
    public isMonthSame: boolean;

    /** Today Date */
    public todayDate: Date;

    /** Start Date */
    public startDate: Date;

    /** End Date */
    public endDate: Date;

    constructor(
    ) {
        super()
        this.initProp();
    }

    /**
     * This method are set null end date and set start date in the mindate 
     * @param formGroup Get the form group
     * @param startDate Get the start date
     */
    public setStartDate(formGroup: FormGroup, startDate: Date): void {
        if (startDate) {
            formGroup.get('endDate').patchValue(null);
            formGroup.get('endDate').markAsTouched();
            this.minDate = startDate;
        }
    }

    /**
     * Compare two month in start and end period
     * @param tableProperty Get the table property
     */
    public setCompareMonth(tableProperty: TableProperty): void {

        let startDate: number = tableProperty.filter.startDate.getMonth() + 1;
        let endDate: number = tableProperty.filter.endDate.getMonth() + 1;

        if (startDate === endDate) {
            this.isMonthSame = false;
        } else {
            this.isMonthSame = true;
        }
    }

    /** Init Prop */
    private initProp(): void {
        this.todayDate = new Date();
        this.startDate = new Date(this.todayDate.getFullYear(), this.todayDate.getMonth(), 1);
        this.endDate = new Date(this.todayDate.getFullYear(), this.todayDate.getMonth() + 1, 0);
        this.minDate = this.startDate;
    }
}