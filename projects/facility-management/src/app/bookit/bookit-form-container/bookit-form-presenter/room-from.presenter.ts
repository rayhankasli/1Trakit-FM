import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
// -------------------------------------------------- //
import { minSelectedCheckboxes } from 'common-libs';
// -------------------------------------------------- //
import { compareDates } from '../../../core/utility/validations';
import { BookItRepeatByOption, BookItRepeatsOnOption } from '../../models/bookit.enum';
import { BookItRoomLayoutSearchParams, BookItRoomSearchParams, RoomLayoutMaster } from '../../models/bookIt-rooms.model';
import { BookIt } from '../../models/bookit.model';
import { WeekDays } from '../../../core/model/common.model';

/** 
 * Room Form Preseneter
 */
export class RoomFormPresenter {

    /** This is used for subscribing the value of subject getRooms */
    public getRooms$: Observable<BookItRoomSearchParams>;
    /** This is used for subscribing the clearRoom observation */
    public clearRooms$: Observable<void>;
    /** This is used to take action on get room layout */
    public getRoomLayouts$: Observable<BookItRoomLayoutSearchParams>;
    /** flag for checking file upload */
    public isFileUpload: boolean;
    /** This is used to show daily option */
    public showDailyOptions$: Observable<boolean>;
    /** This is used to show monthly options */
    public showMonthlyOptions$: Observable<boolean>;
    /** This is to get summary label */
    public summaryLabel$: Observable<string>;

    /** This is used for getRooms object */
    private getRooms: Subject<BookItRoomSearchParams>;
    /** used to raise clear rooms */
    private clearRooms: Subject<void>;
    /** getRoomLayouts */
    private getRoomLayouts: Subject<BookItRoomLayoutSearchParams>;
    /** showDailyOptions */
    private showDailyOptions: Subject<boolean>;
    /** showMonthlyOptions */
    private showMonthlyOptions: Subject<boolean>;
    /** summaryLabel */
    private summaryLabel: Subject<string>;

    constructor(
        public fb?: FormBuilder,
    ) {
        this.getRooms = new Subject<BookItRoomSearchParams>();
        this.getRooms$ = this.getRooms.asObservable();
        this.clearRooms = new Subject<void>();
        this.clearRooms$ = this.clearRooms.asObservable();
        this.getRoomLayouts = new Subject<BookItRoomLayoutSearchParams>();
        this.getRoomLayouts$ = this.getRoomLayouts.asObservable();
        this.isFileUpload = true;
        this.showDailyOptions = new Subject<boolean>();
        this.showDailyOptions$ = this.showDailyOptions.asObservable();
        this.showMonthlyOptions = new Subject<boolean>();
        this.showMonthlyOptions$ = this.showMonthlyOptions.asObservable();
        this.summaryLabel = new Subject<string>();
        this.summaryLabel$ = this.summaryLabel.asObservable();
    }

    /** check if all required parameter for search rooms are present of not */
    public canSearchRooms(formValue: BookIt, oldSearchParams: BookIt): boolean {
        if (!oldSearchParams) {
            if (formValue && formValue.date && formValue.startTime && formValue.endTime && formValue.clientId) {
                // this.getRooms.next(formValue);
                return true;
            }
            return false;
        }
        // return this.compareTwoObjectPropsValue(formValue, oldSearchParams);
    }

    /** get rooms by search parameter */
    public getRoomBySearchProps(searchParamsForRooms: BookItRoomSearchParams): void {
        if (searchParamsForRooms && searchParamsForRooms.date &&
            searchParamsForRooms.startTime && searchParamsForRooms.endTime
            && searchParamsForRooms.clientId) {
            this.getRooms.next(searchParamsForRooms);
        } else {
            this.clearRooms.next();
        }
    }

    /** when user change the isRecurring */
    public onRecurringChange(value: boolean, repeatsOnControls: any, repeatsOnFormGroup: FormGroup): void {
        if (value) {
            repeatsOnFormGroup.setValidators([compareDates('date', 'endDate')]);
            repeatsOnFormGroup.updateValueAndValidity();

            repeatsOnControls.repeatBy.setValue(BookItRepeatByOption.DAY_OF_WEEK);

            repeatsOnControls.recurringId.setValidators([Validators.required]);
            repeatsOnControls.repeatsOnDay.updateValueAndValidity();
            repeatsOnControls.endDate.setValidators([Validators.required]);
            repeatsOnControls.repeatsOnDay.updateValueAndValidity();
            repeatsOnControls.repeatsOnDay.setValidators([Validators.required, minSelectedCheckboxes(1)]);
            repeatsOnControls.repeatsOnDay.updateValueAndValidity();
        } else {
            repeatsOnControls.recurringId.setValue(null);
            repeatsOnControls.repeatBy.setValue(null);

            repeatsOnFormGroup.clearValidators();
            repeatsOnFormGroup.updateValueAndValidity();
            repeatsOnControls.recurringId.clearValidators();
            repeatsOnControls.recurringId.updateValueAndValidity();
            repeatsOnControls.repeatBy.clearValidators();
            repeatsOnControls.repeatBy.updateValueAndValidity();
            repeatsOnControls.endDate.clearValidators();
            repeatsOnControls.endDate.updateValueAndValidity();
            repeatsOnControls.repeatsOnDay.clearValidators();
            repeatsOnControls.repeatsOnDay.updateValueAndValidity();
        }
    }

    /** on rooms change */
    public onRoomChange(bookitFormGroup: FormGroup, bookit: BookIt, roomLayouts: RoomLayoutMaster[], clearRoomLayout?: boolean): void {
        // roomLayouts = [];
        if (bookitFormGroup.getRawValue().roomId) {
            bookitFormGroup.get('roomLayoutId').setValue(null);
            if (bookit && clearRoomLayout) {
                bookit.roomLayoutId = null;
            }
            const roomId: number = bookitFormGroup.get('roomId').value;
            const noOfPeople: number = bookitFormGroup.get('noOfPeople').value;
            if (roomId && noOfPeople) {
                this.getRoomLayouts.next({ roomId, noOfPeople });
            } else {
                roomLayouts.length = 0;
            }
        } else {
            bookitFormGroup.get('roomLayoutId').setValue(null);
        }
    }

    /** on files selection  */
    public onChangeFile(fileOptionId: number, bookitFormGroup: FormGroup): void {
        bookitFormGroup.get('fileName').setValue(null);
        bookitFormGroup.get('files').setValue(null);
        bookitFormGroup.get('filePath').setValue(null);
        this.isFileUpload = fileOptionId === 1;
    }

    /** compare the object props */
    public isValueChanged(key: string, newValue: string | number | Date, compareObj: any): boolean {
        if (!compareObj) {
            return true;
        }
        if (newValue instanceof Date && compareObj[key] && newValue) {
            if (newValue.toDateString() !== compareObj[key].toDateString()) {
                return true;
            }
            return false;
        }
        if (newValue !== compareObj[key]) {
            return true;
        }
        return false;
    }

    /** it will return list of search params for room */
    public getRoomSearchPropsList(): string[] {
        return ['date', 'startTime', 'endTime', 'setupBuffer', 'cleanupBuffer', 'clientId'];
    }

    /**
     * Add week days controls
     * @param formGroup
     * @param weekDays
     */
    public addWeekControls(formGroup: FormGroup, weekDays: WeekDays[]): FormGroup {
        let formArrayControls: FormArray = formGroup.get('repeatsOnDay') as FormArray;
        formArrayControls = this.fb.array([]);
        weekDays.forEach((c: WeekDays) => {
            formArrayControls.push(new FormControl(true));
        });
        formGroup.setControl('repeatsOnDay', this.fb.array(formArrayControls.controls, [minSelectedCheckboxes(1)]));
        return formGroup;
    }

    /** when user changes repeats on */
    public onRepeatsOnChange(value: number, repeatsOnFormGroup: FormGroup, weekDays: WeekDays[], date: Date): void {
        let summaryLabel: string = 'Summary: ';
        this.showDailyOptions.next(false);
        this.showMonthlyOptions.next(false);
        this.summaryLabel.next('');

        if (value === BookItRepeatsOnOption.DAILY) {
            repeatsOnFormGroup = this.addWeekControls(repeatsOnFormGroup, weekDays);
            this.showDailyOptions.next(true);
            const dailyOptionLabel: string = this.getDailyOptionLabel(repeatsOnFormGroup.controls.repeatsOnDay.value, weekDays);
            this.summaryLabel.next(`${summaryLabel} ${dailyOptionLabel}`);
        } else if (value === BookItRepeatsOnOption.WEEKLY) {
            this.summaryLabel.next(`${summaryLabel}Weekly on ${this.getWeekDayName(date.getDay())}`);
        } else if (value === BookItRepeatsOnOption.BIWEEKLY) {
            this.summaryLabel.next(`${summaryLabel}Biweekly`);
        } else if (value === BookItRepeatsOnOption.MONTHLY) {
            if (repeatsOnFormGroup.controls.repeatBy.value) {
                this.onRepeatsByChange(repeatsOnFormGroup.controls.repeatBy.value, date);
            } else {
                repeatsOnFormGroup.controls.repeatBy.setValue(BookItRepeatByOption.DAY_OF_WEEK);
            }
            this.showMonthlyOptions.next(true);
        } else if (value === BookItRepeatsOnOption.YEARLY) {
            this.summaryLabel.next(`${summaryLabel}Yearly on June ${date.getDate()}`);
        } else {
            repeatsOnFormGroup.controls.repeatBy.setValidators([Validators.required]);
        }

        if (value !== BookItRepeatsOnOption.MONTHLY) {
            repeatsOnFormGroup.controls.repeatBy.setValue(null);

            repeatsOnFormGroup.controls.repeatBy.clearValidators();
            repeatsOnFormGroup.controls.repeatBy.updateValueAndValidity();
        }
        if (value !== BookItRepeatsOnOption.DAILY) {
            repeatsOnFormGroup.controls.repeatsOnDay.clearValidators();
            repeatsOnFormGroup.controls.repeatsOnDay.updateValueAndValidity();
        }
    }

    /** when user change the repeats by option */
    public onRepeatsByChange(value: number, date: Date): void {
        if (value === BookItRepeatByOption.DAY_OF_MONTH) {
            this.summaryLabel.next(`Summary: Monthly on day ${date.getDate()}`);
        } else if (value === BookItRepeatByOption.DAY_OF_WEEK) {
            this.summaryLabel.next(`Summary: Monthly on the ${this.getNthForMonthlyOption(date)}`);
        } else {
            this.summaryLabel.next('');
        }
    }

    /** when user changes repeats on days */
    public onRepeatsDayChange(repeatsOnFormGroup: FormGroup, weekDays: WeekDays[]): void {
        const dailyOptionLabel: string = this.getDailyOptionLabel(repeatsOnFormGroup.controls.repeatsOnDay.value, weekDays);
        this.summaryLabel.next(`Summary: ${dailyOptionLabel}`);
    }

    /** it will return the daily option label */
    private getDailyOptionLabel(repeatsOnDay: any[], weekDays: WeekDays[]): string {
        let label: string = '';
        if (repeatsOnDay) {
            repeatsOnDay.forEach((value: boolean, index: number) => {
                if (value) {
                    label = label ? label + ', ' + weekDays[index].weekDay : weekDays[index].weekDay;
                }
            });
        }

        return label;
    }

    /** it will return the week day name e.g Monday,..,Sunday */
    private getWeekDayName(day: number): string {
        return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][day];
    }

    /** it will findhe nth day of the week */
    private getNthForMonthlyOption(date: Date): string {
        const nthDay: string[] = ['First', 'Second', 'Third', 'Fourth', 'Last'];
        const today: number = date.getDate();
        const day: number = date.getDay();
        const n: number = Math.ceil(today / 7);
        const nextMonthDate: Date = new Date(date);
        nextMonthDate.setDate(nextMonthDate.getDate() + 7);

        let nthDayLabel: string = nthDay[n - 1] + ' ';
        if (date.getMonth() !== nextMonthDate.getMonth()) {
            nthDayLabel = 'Last ';
        }
        return nthDayLabel + this.getWeekDayName(day);
    }
}