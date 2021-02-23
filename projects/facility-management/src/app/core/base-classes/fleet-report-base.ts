/**
 * @author Rayhan Kasli
 * @description This is base class for fleet and meter read reports
 */
import { FormBuilder, FormGroup } from '@angular/forms';
import { TableProperty } from 'common-libs';
import { monthListArray } from '../../report/report-model';
import { BaseTablePresenter } from '../../shared/base-presenter/base-table.presenter';

/** FleetReports */
export class FleetReports extends BaseTablePresenter<TableProperty> {

    /**  It will store the filter FormGroup */
    public filterFormGroup: FormGroup;
    
    /** It will store the Month list */
    public monthList: monthListArray[];
    
    constructor(
     public fb: FormBuilder,
    ) {
        super()
        this.filterFormGroup = this.buildForm();
    }

    /** On Change year update month list */
    public onChangeYear(formGroup: FormGroup): string {
        this.filterFormGroup = formGroup;
        this.filterFormGroup.controls['months'].patchValue(null);
        let year: string = this.filterFormGroup.value.year;
        return year;
    }

     /** On Change Month  value set as null if no month selected */
    public onChangeMonth(formGroup: FormGroup): void {
        this.filterFormGroup = formGroup;
        if (formGroup.value.months.length === 0) {
            this.filterFormGroup.controls['months'].patchValue(null);
        }
    }

    /** On Change fleet value set as null if no fleet selected */
    public onChangeFleet(formGroup: FormGroup): void {
        this.filterFormGroup = formGroup;
        if (formGroup.value.fleets.length === 0) {
            this.filterFormGroup.controls['fleets'].patchValue(null);
        }
    }

    /** Create form for filter dropdowns */
    public buildForm(): FormGroup {
        return this.fb.group({
        year: [new Date().getUTCFullYear()],
        months: [null],
        fleets: [null],
        clientId: [null]
        });
    };

}