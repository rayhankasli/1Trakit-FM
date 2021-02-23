import { Component, OnInit, Input, Output, EventEmitter, ElementRef, ViewChild, ChangeDetectionStrategy, OnDestroy, Renderer2 } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { NgbDropdown } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/operators';
import { trackBy } from '../../core/utility/utility';

/** Model class for Custom DropDown Item */
export class CustomDropDownItem {
  /** to-do */
  public value?: any;
  public label?: any;
  public quantity?: any;
  public primaryKeyField: any;
  public selected?: boolean;
  public defaultTenantRate?: number;
  public defaultClientRate?: number;
  public defaultQuantity?: number;
  public defaultInstruction?: string;
  public group;
  /** to-do */
  public isOther?: boolean;
  public instruction?: any;
  public isHideQuantity?: boolean;
  public finishingSubItemId?: any;
  public finishingSubItem?: any[];
  public isUpdated?: boolean
}

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'trakit-custom-dropdown',
  templateUrl: './custom-select-dropdown.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: CustomDropdownComponent,
      multi: true
    }
  ],
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomDropdownComponent implements ControlValueAccessor, OnInit, OnDestroy {

  // tslint:disable-next-line: completed-docs
  @Input() public set items(value: any[]) {
    if (value) {
      this._items = value;
      this.selectedDataItems = [];
      this.itemsList = [];
      this.groupMap = {};
      this.mapInputData();
    }
  }

  // tslint:disable-next-line: completed-docs
  public get items(): any[] {
    return this._items;
  }

  @Input() public bindLabel: string = 'label';
  @Input() public bindValue: string = 'value';
  @Input() public bindPrimaryKeyField: string;

  @Input() public isCheckboxSelection: boolean;
  @Input() public isRadioSelection: boolean;
  @Input() public isTextBoxRequired: boolean;
  @Input() public isCustomList: boolean;

  @Input() public dropdownLabel: string;
  @Input() public isValueRequired: boolean;


  // tslint:disable-next-line: completed-docs
  @Output() public selectedData: EventEmitter<CustomDropDownItem[]>;

  /** searchElement */
  @ViewChild('searchElement', { static: true }) public searchElement: ElementRef;
  /** dropdown menu */
  @ViewChild('dropdownMenu', { static: true }) public dropdownMenu: NgbDropdown;
  /** dropdownButton */
  @ViewChild('dropdownButton', { static: true }) public dropdownButton: ElementRef;
  /** dropdownPanel */
  @ViewChild('dropdownPanel', { static: true }) public dropdownPanel: ElementRef;

  /** item list */
  public itemsList: CustomDropDownItem[];
  /** searchText */
  public searchText: string;
  /** Determines whether change on */
  public onChange: Function;
  public groupMap: any;
  public isDisabled: boolean;
  public selectedDataItems: CustomDropDownItem[];
  /** input pattern for rate */
  public inputPattern: string | RegExp;

  public selectedItemIndex: number;

  private _items: CustomDropDownItem[];
  private _bindValues: any[];
  /** on destroy */
  private _destroy: Subject<void>;

  constructor(
    private renderer: Renderer2
  ) {
    this.selectedData = new EventEmitter<CustomDropDownItem[]>();
    this.selectedDataItems = [];
    this.itemsList = [];
    this._destroy = new Subject<void>();
    this.groupMap = {};
    this.inputPattern = '^-?[0-9]\\d*(\\.\\d{1,2})?$';
    this.selectedItemIndex = 2;
  }

  // tslint:disable-next-line: typedef
  public ngOnInit() {
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

  /** on destroy */
  public ngOnDestroy(): void {
    this._destroy.next();
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
  public writeValue(value: CustomDropDownItem[]): void {
    if (value) {
      this._bindValues = value;
      // this.mapInputData();
    }
  }

  /** disabled control */
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
      return;
    }
    dropdownMenu.toggle();
  }

  /** this method will close the dropdown */
  public closeDropdown(): void {
    this.dropdownMenu.close();
  }

  /** changeIndex */
  public changeIndex(totalIndex: number): void {
    this.selectedItemIndex = totalIndex;
  }
  // tslint:disable-next-line: completed-docs
  public onItemChange(item: CustomDropDownItem): void {
    const selectedItem: CustomDropDownItem = this.itemsList && this.itemsList.find((itemList) => itemList[this.bindValue] === item[this.bindValue]);
    selectedItem.selected = !selectedItem.selected;
    selectedItem[this.bindLabel] = item[this.bindLabel];
    selectedItem['defaultClientRate'] = 0;
    selectedItem['defaultTenantRate'] = 0;
    selectedItem['isUpdated'] = false;
    selectedItem['clientConfigureDefaultId'] = item['clientConfigureDefaultId'] ? item['clientConfigureDefaultId'] : 0;
    const selectedItemIndex: number = this.selectedDataItems.findIndex((data: CustomDropDownItem) =>
      data[this.bindLabel].toString() === selectedItem[this.bindLabel].toString()
    );
    if (selectedItem['list']) {
      selectedItem['list'] = selectedItem['list'].map((groupData) => {
        groupData[this.bindLabel] = groupData[this.bindLabel]
        groupData['defaultClientRate'] = 0
        groupData['defaultTenantRate'] = 0
        groupData['isUpdated'] = false;
        groupData['clientConfigureDefaultId'] = groupData['clientConfigureDefaultId'] ? groupData['clientConfigureDefaultId'] : 0;
        return groupData;
      })
    }
    if (selectedItemIndex >= 0) {
      this.selectedDataItems.splice(selectedItemIndex, 1);
    } else {
      this.selectedDataItems.push(selectedItem);
    }

    this.setSelectedData();
  }

  // tslint:disable-next-line: completed-docs
  public onClientRateInput(item: any, value: string): void {
    item.defaultClientRate = +value;
    item.isUpdated = true;
    this.setSelectedData();
  }
  // tslint:disable-next-line: completed-docs
  public onTenantRateInput(item: any, value: string): void {
    item.defaultTenantRate = +value;
    item.isUpdated = true;
    this.setSelectedData();
  }

  // tslint:disable-next-line: completed-docs
  public onOtherInput(item: CustomDropDownItem, value: string): void {
    item.instruction = value;
    this.setSelectedData();
  }

  // tslint:disable-next-line: completed-docs
  public onOptionChange(item: CustomDropDownItem, value: number): void {
    item.finishingSubItemId = value;
    this.setSelectedData();
  }

  /** when user type in search textbox */
  public search(value: string): void {
    this.searchText = value;
  }

  /** when user clear the item */
  public clearItem(item: any): void {
    const selectedItemIndex: number = this.selectedDataItems.findIndex((data: CustomDropDownItem) =>
      data[this.bindValue].toString() === item[this.bindValue].toString()
    );
    this.selectedDataItems[selectedItemIndex].selected = false;
    if (selectedItemIndex >= 0) {
      this.selectedDataItems.splice(selectedItemIndex, 1);
    }
    this.setSelectedData();
  }

  /**
   * Used for performance optimization.
   */
  public trackBy(key: string, index: number, data: any): number {
    return trackBy(key, index, data);
  }

  // tslint:disable-next-line: completed-docs
  private bindSelectedData(inputItems: any[]): void {
    for (const item of inputItems) {
      const data: CustomDropDownItem = this.itemsList && this.itemsList.find((obj: CustomDropDownItem) =>
        obj[this.bindLabel] === item[this.bindLabel]);
      if (data) {
        data.selected = true;
        if (data['list']) {
          inputItems.forEach((groupData) => {
            const selectedItemIndex: number = data['list'].findIndex((itemList: CustomDropDownItem) =>
              groupData[this.bindLabel].toString() === itemList[this.bindLabel].toString()
            );
            if (selectedItemIndex >= 0) {
              data['list'][selectedItemIndex][this.bindLabel] = groupData[this.bindLabel]
              data['list'][selectedItemIndex]['defaultClientRate'] = groupData['defaultClientRate']
              data['list'][selectedItemIndex]['defaultTenantRate'] = groupData['defaultTenantRate']
              data['list'][selectedItemIndex]['isDefault'] = groupData['isDefault']
              data['list'][selectedItemIndex]['quantity'] = groupData['quantity']
              data['list'][selectedItemIndex]['instruction'] = groupData['instruction']
              data['list'][selectedItemIndex]['clientConfigureDefaultId'] = groupData['clientConfigureDefaultId'];
              data['list'][selectedItemIndex]['isUpdated'] = false;
            }
          })
        }
        data[this.bindLabel] = item[this.bindLabel]
        data['defaultClientRate'] = item['defaultClientRate']
        data['defaultTenantRate'] = item['defaultTenantRate']
        data['isDefault'] = item['isDefault']
        data['quantity'] = item['quantity']
        data['instruction'] = item['instruction']
        data['instruction'] = item['instruction']
        data['clientConfigureDefaultId'] = item['clientConfigureDefaultId'];
        data['isUpdated'] = false;
        this.selectedDataItems.push(data);
        // var lastData:
      }
    }
  }

  // tslint:disable-next-line: completed-docs
  private setSelectedData(): void {
    if (this.selectedDataItems && this.selectedDataItems.length > 0) {
      const dataItems: any[] = [];
      this.selectedDataItems.forEach((item: CustomDropDownItem) => {
        Object.keys(item).forEach(key => {
          if (item[key] === null || item[key] === undefined) {
            delete item[key];
          }
        });
        if (this.isCustomList && item['list']) {
          item['list'].forEach((value: CustomDropDownItem) => { dataItems.push(value) });
        } else {
          dataItems.push(item);
        }
      });
      if (this.isRadioSelection) {
        this.onChange(dataItems[0]);
      } else {
        this.onChange(dataItems);
      }
    } else {
      this.onChange(null);
    }
  }

  /** to-do */
  private mapInputData(): void {
    if (this.isCustomList) {
      let isAvailable: any = {};
      this.items && this.items.forEach((item: CustomDropDownItem) => {
        if (isAvailable[this.bindValue] === item[this.bindValue]) { return; }
        isAvailable = { ...item };
        const groupList: CustomDropDownItem[] = this.items.filter((data: CustomDropDownItem) => item[this.bindValue] === data[this.bindValue]);
        if (groupList.length === 4) {
          isAvailable['list'] = [...groupList];
        }
        this.itemsList.push(isAvailable);
      });
    } else {
      this.itemsList = this.items;
    }
    if (this._bindValues) {
      this.bindSelectedData(this._bindValues);
    }

  }

}