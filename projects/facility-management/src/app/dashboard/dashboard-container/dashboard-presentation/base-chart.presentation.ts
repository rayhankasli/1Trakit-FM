import { Input, EventEmitter, Output } from '@angular/core';
import { MultiSelectFilterRecord } from '../../../core/model/common.model';

/** base chart presentation class */
export class BaseChartPresentation {

    @Input() public set chartInputFilter(value: MultiSelectFilterRecord) {
        if (value) {
            this.getChartData.emit();
        }
    }
    @Output() public getChartData: EventEmitter<void>;

    constructor() {
        this.getChartData = new EventEmitter<void>(true);
    }
}