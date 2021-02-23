import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
// ------------------------------------------- //

export class BaseFormPresenter<T> {

    /** observable for save which will be subscribe in component */
    public save$: Observable<T>;
    /** observable for error which will be subscribe in component if any error occured */
    public error$: Observable<string>;
    
    /** subject for save which pass the data to save observable */
    private save: Subject<T>;
    /** subject for error which pass the data to error observable */
    private error: Subject<string>;

    constructor() {
        this.initProps();
    }

    /**
     * This is used for save data
     * @param formGroup this is form group
     * @param data
     */
    public onSave(formGroup: FormGroup, data: T): void {
        if (formGroup.valid) {
            let dataObj: T;
            if (data) {
                dataObj = { ...data, ...formGroup.getRawValue() };
            } else {
                dataObj = formGroup.getRawValue();
            }
            this.save.next(dataObj);
        } else {
            this.error.next('Form is not valid.');
        }
    }

    /**
     * This will bind the form control value
     * @param userFormGroup is the form group containing all the controls
     * @param useris the object storing all the values  
     */
    public bindControlValue(formGroup: FormGroup, data: T): FormGroup {
        if (data) {
            formGroup.patchValue(data);
        }
        return formGroup;
    }

    /**
     * it will initialize the property
     */
    private initProps(): void {
        this.save = new Subject<T>();
        this.save$ = this.save.asObservable();
        this.error = new Subject<string>();
        this.error$ = this.error.asObservable();
    }
}
