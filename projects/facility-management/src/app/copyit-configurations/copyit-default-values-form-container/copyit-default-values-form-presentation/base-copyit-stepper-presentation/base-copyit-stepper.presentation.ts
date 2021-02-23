import { Input, Inject, NgZone } from '@angular/core';
import { Observable, Subject } from 'rxjs';
// ------------------------------------------------------ //
import { BaseCloseSelectDropdown } from '../../../../core/base-classes/base-close-select-dropdown';

/** BaseCopyitStepperPresentation */
export class BaseCopyitStepperPresentation extends BaseCloseSelectDropdown {

    /**  isNext is used to set the input */
    @Input() public set isNext(value: number) {
        if (value) {
            this._isNext = value;
            this.baseNextStep.next(Date.now())
        }
    }

    public get isNext(): number {
        return this._isNext;
    }


    public baseNextStep$: Observable<number>;

    private baseNextStep: Subject<number>;
    /** _isNext is used to set isNext value */
    private _isNext: number;

    constructor(
        @Inject('Window') window: Window,
        zone: NgZone
    ) {
        super(window, zone);
        this.baseNextStep = new Subject<number>();
        this.baseNextStep$ = this.baseNextStep.asObservable();
    }
}