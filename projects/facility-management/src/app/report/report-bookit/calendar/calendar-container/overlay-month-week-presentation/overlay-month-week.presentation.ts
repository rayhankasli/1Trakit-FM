/**
 * @author Ashok Yadav
 * @description This component is use to define overlay component for month and week wrapper.
 */
import { Component, ViewChild, ElementRef, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';


@Component({
    selector: 'app-overlay-month-week-ui',
    templateUrl: './overlay-month-week.presentation.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    preserveWhitespaces: false
})

export class OverlayMonthWeekPresentationComponent {

    /** monthElementRef for month view */
    @ViewChild('monthElement', { static: true }) public monthElementRef: ElementRef;

    /** weekElementRef for week view */
    @ViewChild('weekElement', { static: true }) public weekElementRef: ElementRef;

    /** clickOnOverlay */
    @Output() public clickOnOverlay: EventEmitter<string>;

    constructor() {
        this.clickOnOverlay = new EventEmitter<string>();
    }

    /** clickOnOverlayItem */
    public clickOnOverlayItem(item: string): void {
        this.clickOnOverlay.emit(item);
    }
}
