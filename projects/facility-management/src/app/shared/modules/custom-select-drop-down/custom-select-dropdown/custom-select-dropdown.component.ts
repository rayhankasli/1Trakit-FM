import {
  Component,
  Input,
  Output,
  EventEmitter,
  ElementRef,
  ViewChild,
  ChangeDetectionStrategy,
  OnDestroy,
  Renderer2,
  AfterViewInit,
  ChangeDetectorRef
} from '@angular/core';
import { CustomDropDownItem, CustomDropDownItemOption } from '../models/custom-dropdown-item.model';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { NgbDropdown } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/operators';
// --------------------------------------------------- //

@Component({
  selector: 'trakit-custom-select-dropdown',
  templateUrl: './custom-select-dropdown.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: CustomSelectDropdownComponent,
      multi: true
    }
  ],
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomSelectDropdownComponent implements ControlValueAccessor, AfterViewInit, OnDestroy {

  /** it will store the bind Label */
  @Input() public bindLabel: string = 'label';
  /** it will store the bind Value */
  @Input() public bindValue: string = 'value';
  /** it will store the bind Quantity */
  @Input() public bindQuantity: string = 'quantity';
  /** it will store the Primary Key Field */
  @Input() public bindPrimaryKeyField: string;
  /** it will store the Id */
  @Input() public id: string = 'id';
  /** Wether isHideQuantityTextbox or not */
  @Input() public isHideQuantityTextbox: boolean;
  /** Wether isCheckboxSelection or not */
  @Input() public isCheckboxSelection: boolean;
  /** Wether isRadioSelection or not */
  @Input() public isRadioSelection: boolean;
  /** Wether isSingleValueSelection or not */
  @Input() public isSingleValueSelection: boolean;
  /** Wether searchable or not */
  @Input() public searchable: boolean = true;
  /** Wether closeOnSelect or not */
  @Input() public closeOnSelect: boolean;
  /** Wether allowDecimal or not */
  @Input() public allowDecimal: boolean = true;
  /** it will store the maxLength */
  @Input() public maxLength: number = 10;

  /** it will store the disable Option */
  @Input() public set disableOption(flag: boolean) {
    this.isDisabled = flag;
    this.cdr.detectChanges();
  }

  /** it will store the items array */
  @Input() public set items(value: any[]) {
    if (value) {
      this._items = [...value];
      this.mapInputData();
    }
  }

  public get items(): any[] {
    return this._items;
  }

  /** it will emit selected data */
  @Output() public selectedData: EventEmitter<CustomDropDownItem[]>;

  /** it will store the searchElement ref */
  @ViewChild('searchElement', { static: false }) public searchElement: ElementRef;
  /** it will store the dropdown menu ref */
  @ViewChild('dropdownMenu', { static: true }) public dropdownMenu: NgbDropdown;
  /** it will store the dropdownButton ref */
  @ViewChild('dropdownButton', { static: true }) public dropdownButton: ElementRef;
  /** it will store the dropdownPanel ref */
  @ViewChild('dropdownPanel', { static: true }) public dropdownPanel: ElementRef;

  /** it will store the item list */
  public itemsList: CustomDropDownItem[];
  /** it will store the searchText */
  public searchText: string;
  /** Determines whether change on */
  public onChange: Function;
  /** if control is disabled  */
  public isDisabled: boolean;
  /** it will store the  */
  public selectedDataItems: CustomDropDownItem[];

  /** it will store the Custome drop down Items */
  private _items: CustomDropDownItem[];
  /** it will store the Bind Value */
  private _bindValues: any[];
  /** on destroy */
  private _destroy: Subject<void>;

  constructor(
    private renderer: Renderer2,
    private cdr: ChangeDetectorRef
  ) {
    this.selectedData = new EventEmitter<CustomDropDownItem[]>();
    this.selectedDataItems = [];
    this._destroy = new Subject<void>();
  }

  public ngAfterViewInit(): void {
    if (this.searchable) {
      this.dropdownMenu.openChange.pipe(takeUntil(this._destroy)).subscribe(
        (value: boolean) => {
          if (value) {
            setTimeout(() => {
              this.searchElement.nativeElement.focus();
            }, 10);
          } else {
            this.searchElement.nativeElement.value = '';
            this.searchText = '';
            this.searchElement.nativeElement.blur();
          }
        });
    }
  }

  /** on destroy */
  public ngOnDestroy(): void {
    this._destroy.next();
    this._destroy.complete();
  }

  /**
   * Registers on change
   * @param fn 
   */
  public registerOnChange(fn: Function): void {
    this.onChange = fn;
  }

  /**
   * Registers on touch
   * @param fn 
   */
  public registerOnTouched(fn: Function): void {
  }

  /**
   * write value
   * @param fn 
   */
  public writeValue(value: any | any[]): void {
    if (value) {
      if (this.isSingleValueSelection) {
        this._bindValues = value;
      } else if (this.isRadioSelection) {
        this._bindValues = { ...value };
      } else {
        this._bindValues = [...value];
      }
      this.mapInputData();
    }
  }

  /** for disabled the control */
  public setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
    this.renderer.setProperty(this.dropdownButton.nativeElement, 'disabled', isDisabled);
  }

  /** it will open the dropdown menu */
  public openDropdownMenu(dropdownMenu: NgbDropdown): void {
    this.dropdownPanel.nativeElement.width = this.dropdownButton.nativeElement.offsetWidth;
    this.renderer.setStyle(
      this.dropdownPanel.nativeElement,
      'width', `${this.dropdownButton.nativeElement.offsetWidth}px`
    );
    this.renderer.setStyle(
      this.dropdownPanel.nativeElement,
      'min-width', `${this.dropdownButton.nativeElement.offsetWidth}px`
    );
    if (this.itemsList) {
      dropdownMenu.toggle();
      // dropdownMenu.open();
      return;
    }
    this.mapInputData();
    // dropdownMenu.open();
    dropdownMenu.toggle();
  }

  /** this method will close the dropdown */
  public closeDropdown(): void {
    this.dropdownMenu.close();
  }

  /** On Items Change */
  public onItemChange(item: CustomDropDownItem): void {
    if (item.selected && this.isRadioSelection) {
      return;
    }
    item.selected = !item.selected;
    if (this.isCheckboxSelection) {
      const selectedItemIndex: number = this.selectedDataItems.findIndex((data: CustomDropDownItem) => data.value === item.value);
      if (selectedItemIndex >= 0) {
        this.selectedDataItems.splice(selectedItemIndex, 1);
      } else {
        this.selectedDataItems.push(item);
      }
    } else if (this.isRadioSelection) {
      this.itemsList = this.itemsList.map((data: CustomDropDownItem) => {
        if (item.value !== data.value) {
          data.selected = false;
        }
        return data;
      });
      this.selectedDataItems = [];
      this.selectedDataItems.push(item);
    }
    this.setSelectedData();
    if (this.closeOnSelect) {
      this.dropdownMenu.close();
    }
  }

  /** On Quantity Input */
  public onQuantityInput(item: CustomDropDownItem, event: any): void {
    const trimValue: string = event.target.value.trim();
    item.quantity = trimValue && +trimValue || null;
    this.setSelectedData();
  }

  /** on Other Input */
  public onOtherInput(item: CustomDropDownItem, value: string): void {
    item.instruction = value;
    this.setSelectedData();
  }

  /** on Option Change */
  public onOptionChange(item: CustomDropDownItem, dropOption: CustomDropDownItemOption): void {
    item.finishingSubItemId = dropOption && dropOption.finishingSubItemId || null;
    item.finishingSubItemValue = dropOption && dropOption.finishingSubItem || null;
    this.setSelectedData();
  }

  /** when user type in search textbox */
  public search(value: string): void {
    this.searchText = value;
  }

  /** when user clear the item */
  public clearItem(item: any): void {
    item.quantity = '';
    item.selected = false;
    const selectedItemIndex: number = this.selectedDataItems.findIndex((data: CustomDropDownItem) => data.value === item.value);
    if (selectedItemIndex >= 0) {
      this.selectedDataItems.splice(selectedItemIndex, 1);
      this.setSelectedData();
    }
  }

  /** to optimize DOM */
  public trackBy(key: string, index: number, data: any): number {
    return data[key];
  }

  /** it will bind the control value in array */
  private bindSelectedData(inputItems: any | any[]): void {
    if (this.itemsList) {
      this.selectedDataItems = [];
      if (this.isSingleValueSelection) {
        this.selectedDataItems = this.itemsList.filter((obj: CustomDropDownItem) => {
          if (obj.value === inputItems) {
            obj.selected = true;
            return obj;
          }
        });
      } else if (this.isRadioSelection) {
        const data: CustomDropDownItem = this.itemsList.find((obj: CustomDropDownItem) => obj.value === inputItems[this.bindValue]);
        if (data) {
          data.selected = true;
          data.instruction = inputItems.instruction;
          data.finishingSubItemId = inputItems.finishingSubItemId ? inputItems.finishingSubItemId : '';
          data.finishingSubItemValue = inputItems.finishingSubItemValue ? inputItems.finishingSubItemValue : '';
          if (this.bindQuantity) {
            data.quantity = inputItems[this.bindQuantity];
          }
          if (this.bindPrimaryKeyField) {
            data.primaryKeyField = inputItems[this.bindPrimaryKeyField];
          }
          this.selectedDataItems.push(data);
        }
      } else {
        for (const item of inputItems) {
          const data: CustomDropDownItem = this.itemsList.find((obj: CustomDropDownItem) => obj.value === item[this.bindValue]);
          if (data) {
            data.selected = true;
            data.instruction = item.instruction;
            data.finishingSubItemId = item.finishingSubItemId ? item.finishingSubItemId : '';
            data.finishingSubItemValue = item.finishingSubItemValue ? item.finishingSubItemValue : '';
            if (this.bindQuantity) {
              data.quantity = item[this.bindQuantity];
            }
            if (this.bindPrimaryKeyField) {
              data.primaryKeyField = item[this.bindPrimaryKeyField];
            }
            this.selectedDataItems.push(data);
          }
        }
      }
      this.cdr.detectChanges();
    }
  }

  /** Set Selected Data */
  private setSelectedData(): void {
    if (this.selectedDataItems && this.selectedDataItems.length > 0) {
      const dataItems: any[] = this.selectedDataItems.map((item: CustomDropDownItem) => {
        const dataItem: any = {
          [this.bindValue]: item.value,
          [this.bindLabel]: item.label,
          [this.bindQuantity]: item.quantity || 0,
          finishingSubItemId: item.finishingSubItemId,
          finishingSubItemValue: item.finishingSubItemValue,
          isOther: item.isOther,
          instruction: item.instruction,
          defaultTenantRate: item.defaultTenantRate,
          defaultClientRate: item.defaultClientRate,
          reproductionTypeId: item.reproductionTypeId
        };
        if (this.bindPrimaryKeyField) {
          dataItem[this.bindPrimaryKeyField] = item.primaryKeyField;
        }
        Object.keys(dataItem).forEach(key => {
          if (dataItem[key] === null || dataItem[key] === undefined) {
            delete dataItem[key];
          }
        });
        return dataItem;
      });
      this.setChangeValue(dataItems);
    } else {
      this.onChange(null);
    }
  }

  /** it will the input control value into an array */
  private mapInputData(): void {
    if (this.items && this.items.length > 0) {
      this.itemsList = [];
      this.itemsList = this.items.map((item: CustomDropDownItem) => {
        let isHideQuantity = item.isHideQuantity;
        if (item[this.bindLabel] === 'N/A') {
          isHideQuantity = true;
        }
        return {
          value: item[this.bindValue],
          label: item[this.bindLabel],
          // quantity: item[this.bindQuantity],
          primaryKeyField: item[this.bindPrimaryKeyField],
          finishingSubItemId: item.finishingSubItemId,
          finishingSubItemValue: item.finishingSubItemValue,
          finishingSubItems: item.finishingSubItems,
          isOther: item.isOther,
          isHideQuantity,
          selected: item.selected,
          instruction: item.instruction,
          defaultTenantRate: item.defaultTenantRate,
          defaultClientRate: item.defaultClientRate,
          reproductionTypeId: item.reproductionTypeId
        };
      });

      if (this._bindValues) {
        this.bindSelectedData(this._bindValues);
      }
    }
  }

  /** it will change the control value */
  private setChangeValue(dataItems: any[]): void {
    if (dataItems && dataItems.length > 0) {
      if (this.isRadioSelection && this.isSingleValueSelection) {
        this.onChange(dataItems[0][this.bindValue]);
      } else if (this.isSingleValueSelection) {
        this.onChange(dataItems[0][this.bindValue]);
      } else if (this.isRadioSelection) {
        this.onChange(dataItems[0]);
      } else {
        this.onChange(dataItems);
      }
    } else {
      this.onChange(null);
    }
  }
}
