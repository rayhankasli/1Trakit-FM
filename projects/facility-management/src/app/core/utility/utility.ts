import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { DatePipe, TitleCasePipe } from '@angular/common';
import { ChangeDetectorRef, ComponentRef, NgZone, QueryList, Renderer2 } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { NgbTimepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectComponent } from '@ng-select/ng-select';
import { NgbTimeStringAdapter, Params, SortingOrder, SortingOrderDirective, TableProperty } from 'common-libs';
import { BsDatepickerConfig, PopoverConfig } from 'ngx-bootstrap';
import { environment } from 'projects/facility-management/src/environments/environment';
import { filter, take } from 'rxjs/operators';
// ---------------------------------------------------------
import { CustomDropdownComponent } from '../../copyit-configurations/custom-select-dropdown/custom-select-dropdown.component';
import { MonthList, monthListArray } from '../../report/report-model';
import { GalleryPresentationComponent } from '../../shared/components/gallery/gallery-presentation/gallery-presentation.component';
import { CustomPageSizeDropDownComponent } from '../../shared/modules/custom-select-drop-down/custom-page-size-dropdown/custom-page-size-dropdown.component';
import { CustomSelectDropdownComponent } from '../../shared/modules/custom-select-drop-down/custom-select-dropdown/custom-select-dropdown.component';
import { Pictures, WeekDays } from '../model/common.model';

/**
 * it will compare the two values
 * @param controlName 
 * @param matchingControlName 
 * @returns  
 */
// tslint:disable-next-line: no-any
export function compareTwoValues(controlName: string, matchingControlName: string): any {
    // tslint:disable-next-line: typedef
    return (formGroup: FormGroup) => {
        const control: AbstractControl = formGroup.controls[controlName];
        const matchingControl: AbstractControl = formGroup.controls[matchingControlName];
        if (!control.value) {
            return;
        }
        if (matchingControl.errors && !matchingControl.errors.mustMatch) {
            // return if another validator has already found an error on the matchingControl
            return;
        }

        // set error on matchingControl if validation fails
        if (control.value !== matchingControl.value) {
            matchingControl.setErrors({ mustMatch: true });
        } else {
            matchingControl.setErrors(null);
        }
    }
}

/**
 * Download file with blob response
 * @param response blob response
 * @param name filename to be set
 */
export function downloadFile(response: Blob, name: string): void {
    const blob: Blob = new Blob([response], { type: response.type });
    if (window.navigator.msSaveOrOpenBlob) //IE & Edge
    {
        //msSaveBlob only available for IE & Edge
        window.navigator.msSaveBlob(blob, name);
    } else {
        const url: string = objectURLFromBlob(blob);
        const fileCreate: HTMLAnchorElement = document.createElement('a');
        document.body.appendChild(fileCreate);
        fileCreate.setAttribute('style', 'display: none');
        fileCreate.href = url;
        fileCreate.download = name;
        fileCreate.click();
        window.URL.revokeObjectURL(url);
        fileCreate.remove();
    }
}
/** Create Object URL from blob */
export function objectURLFromBlob(blob: Blob): string {
    return window.URL.createObjectURL(blob);
}

/** Convert base64 string to blob for downloading files */
export function base64ToBlob(dataURI: string, fileType: string): Blob {
    const byteString: string = window.atob(dataURI);
    const arrayBuffer: ArrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array: Uint8Array = new Uint8Array(arrayBuffer);
    for (let i: number = 0; i < byteString.length; i++) {
        int8Array[i] = byteString.charCodeAt(i);
    }
    const blob: Blob = new Blob([int8Array], { type: fileType });
    return blob;
}

/**
 * This function checks for the presence or criteria and constructs the query params object accordingly.
 * @param tableProperty The model which needs to be mapped to the criteria that is accepted by the API.
 */
export const convertToRequestParams = (tableProperty: TableProperty): Params => {
    const params: Params = new Params();
    params.page = tableProperty.pageNumber.toString();
    params.perPage = tableProperty.pageLimit.toString();
    if (tableProperty.sort)
        params.sort = tableProperty.order + tableProperty.sort;
    if (tableProperty.search)
        params.q = tableProperty.search;

    return params;
};

/**
 * This function will return the common datepicker config
 */
export function getDatepickerConfig(): BsDatepickerConfig {
    return Object.assign(new BsDatepickerConfig(), {
        adaptivePosition: true,
        dateInputFormat: 'MM/DD/YYYY',
        selectFromOtherMonth: true,
        containerClass: 'theme-primary',
        customTodayClass: 'current-date'
    });
}

/**
 * Popover configuration
 */
export function getPopoverConfig(): PopoverConfig {
    return Object.assign(new PopoverConfig(), { placement: 'bottom', container: 'body', outsideClick: true });
}
/**
 * Time picker configuration
 */
export function getTimePickerConfig(): NgbTimepickerConfig {
    return Object.assign(new NgbTimepickerConfig(), { meridian: true, spinners: true });
}

/** close the ngSelect  */
export function closeNgSelect(item: NgSelectComponent, event: any): void {
    if (item && item.isOpen && event.target.className) {
        // const isScrollingInScrollHost: boolean = (event.target.className as string).indexOf('ng-dropdown-panel-items') > -1;
        const isScrollingInScrollHost: boolean = (event.target.className as string).indexOf('ng-dropdown-panel') > -1;
        if (isScrollingInScrollHost) { return; }
        item.close();
    }
}

/** close custom select dropdown */
export function closeCustomSelectDropdown(item: CustomSelectDropdownComponent | CustomPageSizeDropDownComponent
    | CustomDropdownComponent,            event: any): void {
    if (item && item.dropdownMenu.isOpen() && event.target.className) {
        const isScrollingInScrollHost: boolean = (event.target.className as string).indexOf('multiselect-dropdown-list') > -1;
        if (isScrollingInScrollHost) { return; }
        item.closeDropdown();
    }
}

/** Get full path for the file */
export function getRoomFilePath(fileName: string): string {
    return `${environment.base_host_url}RoomLayouts/${fileName}`;
}

/**
 * Get unique data by prop from the Array<T> of Objects
 * @param myArr List<T>
 * @param prop primary field to get unique data
 */
export function getUniqueByProp<T>(myArr: Array<T>, prop: string): Array<T> {
    if (!prop) { return myArr }
    return myArr && myArr.filter((obj: T, pos: number, arr: Array<T>) => {
        return arr.map((mapObj: T) =>
            mapObj[prop]).indexOf(obj[prop]) === pos;
    }) || [];
}

/** Weeks map */
export function weekMap(weekday: WeekDays[], selectedDay: number[]): WeekDays[] {
    let dayDispaly: WeekDays[] = []
    selectedDay.forEach((dayId: number) => {
        let weekDays: WeekDays = new WeekDays();
        let days: WeekDays = weekday.find((day: WeekDays) => day.weekDayId === dayId)
        weekDays.weekDayId = days.weekDayId;
        weekDays.weekDay = days.weekDay;
        dayDispaly.push(weekDays);
    });
    return dayDispaly;
}

/**
 * Convert UTC date to system's date-time
 * @param utcDate string | Date 
 * @returns locale date format for the given date
 * @default new Date()
 */
export function getLocaleDate(utcDate: string | Date): Date {
    const date: Date = utcDate ? new Date(utcDate) : new Date();
    return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes()));
}

/**
 * get Locale time string of given UTC time from toDay
 * @param completedTime time string("HH:mm")
 */
export function getLocaleTime(timeString: string): string {
    const localeDate: Date = getLocaleDateTime(new Date(), timeString);
    let localeTime = timeString ? localeDate.toLocaleTimeString('en', { hour12: false }) : null;
    if (localeTime) {
        const ngbT = new NgbTimeStringAdapter();
        const timeF = ngbT.fromModel(localeTime);
        timeF.hour = timeF.hour === 24 ? 0 : timeF.hour;
        localeTime = ngbT.toModel(timeF);
    }
    return localeTime;
}

/** convert date-time from UTC to Locale timezone */
export function getLocaleDateTime(dateString: string | Date, timeString?: string): Date {
    if (!dateString) { return null }
    const ngbT = new NgbTimeStringAdapter();
    const date: Date = new Date(dateString);
    const time = ngbT.fromModel(timeString ? timeString : '00:00');
    return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), timeString ? time.hour : date.getHours(), timeString ? time.minute : date.getMinutes()));
}

/** getKeyByValue */
export function getKeyByValue(object: any, value: any): string[] {
    return (object && value) ? Object.keys(object).filter(key => object[key] === value) : [];
}

/** titleCaseConverter */
export function titleCaseConverter(value: string[]): string[] {
    let titleCasePipe: TitleCasePipe = new TitleCasePipe();
    let moduleName: string[] = [];
    value.forEach((element: string) => {
        element = element.split(/(?=[A-Z])/).join(' ');
        element = element[0].toUpperCase() + element.slice(1);
        element = titleCasePipe.transform(element);
        // element = element.replace(/ +/g, '');
        moduleName.push(element);
    });
    return moduleName;
}
/** string to sentence string with title case */
export function sentenceCase(str: string): string {
    let titleCasePipe: TitleCasePipe = new TitleCasePipe();
    return titleCasePipe.transform(str.replace(/([A-Z]+)/g, ' $1').replace(/([A-Z][a-z])/g, ' $1'));
}

/**
 * round digit to nearest floor of N
 * @param digit Number
 * @param N Number default 10
 */
export function roundToN(digit: number, N: number = 10): number {
    if (digit % N === 0) { return digit }
    return (digit + N) - (digit % N);
}

/**
 * Get maximum digit from the list
 * @param data Array of objects contains properties type number
 * @default 10
 */
export function getMaximumFrom<T>(data: Array<T>, defaultValue: number = 10): number {
    return Math.max(...data.map((d: T) => Math.max(...Object.values(d || []).filter(d => typeof d === 'number'))) || defaultValue) || defaultValue;
}

/** getTableProperty */
export function getTableProperty<T>(tableProperty: TableProperty<T>, length: number): TableProperty<T> {
    tableProperty.start = (tableProperty.pageLimit * (tableProperty.pageNumber)) + 1;
    tableProperty.end = tableProperty.start + length - 1;
    return tableProperty
}

/** pageSizeChange */
export function pageSizeChange<T>(tableProperty: TableProperty<T>, pageSize: number): TableProperty<T> {
    tableProperty.pageNumber = 0;
    tableProperty.pageLimit = pageSize;
    return tableProperty

}

/** resetTableProps used for reset table properties */
export function resetTableProps<T>(tableProperty: TableProperty<T>): TableProperty<T> {
    tableProperty.pageNumber = 0;
    return tableProperty;
}

/** openGalleryModal for dispaly workflow and task pictures  */
export function openGalleryModal(images: Pictures[], overlay: Overlay, isPrintAndDiscription?: boolean): void {
    let componentRef: ComponentRef<GalleryPresentationComponent>;
    let overlayRef: OverlayRef;
    // set overlay config
    const overlayConfig: OverlayConfig = new OverlayConfig();
    overlayConfig.hasBackdrop = true;
    overlayConfig.backdropClass = 'dark-backdrop';
    // create overlay reference
    overlayRef = overlay.create(overlayConfig);
    const portal: ComponentPortal<GalleryPresentationComponent>
        = new ComponentPortal<GalleryPresentationComponent>(GalleryPresentationComponent);
    // attach overlay with portal
    componentRef = overlayRef.attach(portal);
    // to allow print and description
    if (isPrintAndDiscription) {
        componentRef.instance.enableDetail = true;
    }
    // set list of pictures
    componentRef.instance.pictures = images;
    // listen to backdrop click
    overlayRef.backdropClick().pipe(take(1)).subscribe(() => {
        overlayRef.detach();
    });
    // listen to escape key press
    overlayRef.keydownEvents().pipe(filter(e => e.keyCode === 27 || e.which === 27), take(1))
        .subscribe(e => {
            overlayRef.detach();
        })
    // listen to close button press
    componentRef.instance.closeGallery.subscribe((close: boolean) => {
        close && overlayRef.detach();
    });
}

/** Handle sorting of thhe table */
export function onSorting<T>(
    tableProperty: TableProperty<T>, column: string, sortingOrder: SortingOrder,
    sortingColumns: QueryList<SortingOrderDirective>, ngZone: NgZone, renderer: Renderer2): TableProperty<T> {
    tableProperty.sort = column;
    tableProperty.order = sortingOrder;
    ngZone.runOutsideAngular(() => {
        sortingColumns.forEach((sortingColumn: SortingOrderDirective) => {
            if (sortingColumn.column !== column) {
                renderer.removeClass(sortingColumn.elementRef.nativeElement, 'sort-asc');
                renderer.removeClass(sortingColumn.elementRef.nativeElement, 'sort-desc');
            }
        });
    })
    return tableProperty;
}

/** convertDateFormat */
export function convertDateFormat(date: any): any {
    let dateConvert: any;
    dateConvert = date ? (1 + date.getMonth()).toString().padStart(2, '0') + '-' + date.getDate().toString().padStart(2, '0') + '-' + date.getFullYear() : '';
    return dateConvert;
}

/**
 * trakby function for looping DOM elements
 * @param index numeric index
 * @param data data<T>
 */
export function trackBy<T>(key: string, index: number, data: T): number {
    return key ? data[key] : data;
}

/**
 * Convert File to file-reader and patch form-controls
 * @param file Selected file
 * @param formGroup form-group to update
 * @param ctrlLogo form-control to preview selected file
 * @param ctrlOriginal form-control to patch original file name
 * @param ctrlExtension form-control to patch file extension
 * @optional @param cdrRef to make change-detection manualy
 */
export function convertFileToBase64(
    file: File, formGroup: FormGroup, ctrlLogo: string,
    ctrlOriginal: string, ctrlExtension: string, cdrRef?: ChangeDetectorRef
): FormGroup {

    if (file) {
        const myReader: FileReader = new FileReader();
        myReader.onloadend = (e) => {
            formGroup.get(ctrlLogo).patchValue(myReader.result);
            cdrRef && cdrRef.detectChanges();
        }
        myReader.readAsDataURL(file);
        formGroup.get(ctrlOriginal).patchValue(file ? file.name : null);
        formGroup.get(ctrlExtension).patchValue(file ? '.' + file.name.split('.').pop().toLowerCase() : null);
    } else {
        formGroup.get(ctrlLogo).patchValue(null);
        formGroup.get(ctrlOriginal).patchValue(null);
        formGroup.get(ctrlExtension).patchValue(null);
    }

    return formGroup;
}

/**
 * This function will return the common drop-down config
 */
export function getDropDownSettings(textName: string, primaryKeyName: string): any {
    return {
        text: textName,
        selectAllText: 'Select All',
        unSelectAllText: 'UnSelect All',
        classes: 'dropdown-item p-0',
        badgeShowLimit: 1,
        maxHeight: 250,
        primaryKey: primaryKeyName
    };
}

 /** getMonthList */
export function getMonthList(selectedYear: string): monthListArray[] {
    let datePipe: DatePipe = new DatePipe('en-US');
    let monthList: monthListArray[] = [];
    let currentYear: string = new Date().getFullYear().toString();
    let currentMonth: string = datePipe.transform(new Date(), 'MMMM');
    if (selectedYear === currentYear) {
      let isReturn: boolean = false;
      MonthList.forEach((month: monthListArray) => {
        if (isReturn) { return } else {
          monthList.push(month);
          if (month.name === currentMonth) {
            isReturn = true;
          }
        }
      });
    } else {
      monthList = MonthList;
    }
    return monthList;
  }
