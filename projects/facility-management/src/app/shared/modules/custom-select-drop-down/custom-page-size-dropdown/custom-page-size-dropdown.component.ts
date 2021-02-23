import { Component, OnInit, ChangeDetectionStrategy, OnDestroy, Input, Output, EventEmitter, ElementRef, ViewChild, Renderer2, ChangeDetectorRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { NgbDropdown } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/operators/takeUntil';
// ----------------------------------------------------- //
import { CustomPaperSizeDropDownItem, PaperColor, PaperSide } from '../models/custom-dropdown-item.model';
import { CopyItConfigPaperSizes } from '../../copy-it-print-details/models/copyit-info/copyItConfigPaperSizes';

@Component({
  selector: 'trakit-custom-page-size-dropdown',
  templateUrl: './custom-page-size-dropdown.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: CustomPageSizeDropDownComponent,
      multi: true
    }
  ],
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomPageSizeDropDownComponent implements ControlValueAccessor, OnInit, OnDestroy {

  /** it will store the Items list */
  @Input() public set items(value: CopyItConfigPaperSizes[]) {
    if (value) {
      this._items = [...value];
      this.mapInputData();
    }
  }

  public get items(): CopyItConfigPaperSizes[] {
    return this._items;
  }

  /** it will store the disable Option */
  @Input() public set disableOption(flag: boolean) {
    this.isDisabled = flag;
    this.cdr.detectChanges();
  }

  /** it will store the bind Label */
  @Input() public bindLabel: string = 'label';
  /** it will store the bind Value */
  @Input() public bindValue: string = 'value';
  /** it will store the bind Paper Side */
  @Input() public bindPaperSide: string = '';
  /** it will store the Paper Color */
  @Input() public bindPaperColor: string = '';
  /** it will store the Primary Key Field */
  @Input() public bindPrimaryKeyField: string;
  /** it will store the id */
  @Input() public id: string = 'id';

  /** it will emit the selected data */
  @Output() public selectedData: EventEmitter<CustomPaperSizeDropDownItem[]>;

  /** searchElement */
  @ViewChild('searchElement', { static: true }) public searchElement: ElementRef;
  /** dropdown menu */
  @ViewChild('dropdownMenu', { static: true }) public dropdownMenu: NgbDropdown;
  /** dropdownButton */
  @ViewChild('dropdownButton', { static: true }) public dropdownButton: ElementRef;
  /** dropdownPanel */
  @ViewChild('dropdownPanel', { static: true }) public dropdownPanel: ElementRef;

  /** item list */
  public itemsList: CustomPaperSizeDropDownItem[];
  /** it will store the searchText */
  public searchText: string;
  /** Determines whether change on */
  public onChange: Function;
  /** if control is disabled */
  public isDisabled: boolean;
  /** it will store the selected items list */
  public selectedDataItems: CustomPaperSizeDropDownItem[];

  /** it will store the Copyit Config Paper Size items */
  private _items: CopyItConfigPaperSizes[];
  /** it will store the bind values */
  private _bindValues: any[];
  /** on destroy */
  private _destroy: Subject<void>;

  constructor(
    private element: ElementRef,
    private renderer: Renderer2,
    private cdr: ChangeDetectorRef
  ) {
    this.selectedData = new EventEmitter<CustomPaperSizeDropDownItem[]>();
    this.selectedDataItems = [];
    this._destroy = new Subject<void>();
  }

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
  public writeValue(value: any): void {
    if (value) {
      this._bindValues = { ...value };
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
      return;
    }
    this.mapInputData();
    dropdownMenu.toggle();
  }

  /** this method will close the dropdown */
  public closeDropdown(): void {
    this.dropdownMenu.close();
  }


  /** when user clicks on radio button */
  public onItemChange(item: CustomPaperSizeDropDownItem): void {
    if (item.selected) {
      return;
    }
    item.selected = true;
    const configPaperSize: CopyItConfigPaperSizes | any = this.items.find((data: CopyItConfigPaperSizes) =>
      data.paperSizeId === item.paperSizeId && data.paperColorTypeId === 1 && data.paperSideTypeId === 1);
    const singlePaperSize: CopyItConfigPaperSizes | any = this.items.find((data: CopyItConfigPaperSizes) =>
      data.paperSizeId === item.paperSizeId);
    if (configPaperSize) {
      // item.paperSize = configPaperSize.paperSize;
      if (item.subItem) {
        // set default child values for the parent item
        item.clientConfigureDefaultId = configPaperSize.clientConfigureDefaultId;
        item.paperColorTypeId = 1;
        item.paperSideTypeId = 1;
        item.paperColorType = configPaperSize.paperColorType;
        item.paperSideType = configPaperSize.paperSideType;
        item.defaultClientRate = configPaperSize.defaultClientRate;
        item.defaultTenantRate = configPaperSize.defaultTenantRate;
        // item[this.bindPrimaryKeyField] = item.primaryKeyField;

        item.subItem.paperColors.forEach((paperColor: PaperColor) => {
          if (paperColor.paperColorId === 1) {
            paperColor.selected = true;
          } else {
            paperColor.selected = false;
          }
        });
        item.subItem.paperSides.forEach((paperSide: PaperSide) => {
          if (paperSide.paperSideId === 1) {
            paperSide.selected = true;
          } else {
            paperSide.selected = false;
          }
        });
      }
    } else if (singlePaperSize) {
      // item[this.bindPrimaryKeyField] = singlePaperSize.primaryKeyField;
    }
    this.itemsList = this.itemsList.map((data: CustomPaperSizeDropDownItem) => {
      if (item.paperSizeId !== data.paperSizeId) {
        data.selected = false;
      }
      return data;
    });
    this.selectedDataItems = [];
    this.selectedDataItems.push(item);
    this.setSelectedData();
  }

  /** On Others Input */
  public onOtherInput(item: CustomPaperSizeDropDownItem, value: string): void {
    item.instruction = value;
    this.setSelectedData();
  }

  /** On Side change in dropdown */
  public onSidesChange(item: CustomPaperSizeDropDownItem, sideItem: PaperSide): void {
    if (sideItem.selected) {
      return;
    }
    const configPaperSize: CopyItConfigPaperSizes = this.items.find((data: CopyItConfigPaperSizes) => data.paperSizeId === item.paperSizeId
      && data.paperColorTypeId === item.paperColorTypeId && data.paperSideTypeId === sideItem.paperSideId);
    if (configPaperSize) {
      item.clientConfigureDefaultId = configPaperSize.clientConfigureDefaultId;
      item.defaultClientRate = configPaperSize.defaultClientRate;
      item.defaultTenantRate = configPaperSize.defaultTenantRate;
      item.paperSideTypeId = sideItem.paperSideId;
      item.paperSideType = sideItem.paperSide;

      item.subItem.paperSides.forEach((paperSide: PaperSide) => {
        if (paperSide.paperSideId === sideItem.paperSideId) {
          paperSide.selected = true;
        } else {
          paperSide.selected = false;
        }
      });

      this.setSelectedData();
    }
  }

  /** Change the Paper Color */
  public onColorChange(item: CustomPaperSizeDropDownItem, colorItem: PaperColor): void {
    if (colorItem.selected) {
      return;
    }
    const configPaperSize: CopyItConfigPaperSizes = this.items.find((data: CopyItConfigPaperSizes) => data.paperSizeId === item.paperSizeId
      && data.paperSideTypeId === item.paperSideTypeId && data.paperColorTypeId === colorItem.paperColorId);
    if (configPaperSize) {
      item.clientConfigureDefaultId = configPaperSize.clientConfigureDefaultId;
      item.defaultClientRate = configPaperSize.defaultClientRate;
      item.defaultTenantRate = configPaperSize.defaultTenantRate;
      item.paperColorTypeId = colorItem.paperColorId;
      item.paperColorType = colorItem.paperColor;

      item.subItem.paperColors.forEach((paperColor: PaperColor) => {
        if (paperColor.paperColorId === colorItem.paperColorId) {
          paperColor.selected = true;
        } else {
          paperColor.selected = false;
        }
      });
      this.setSelectedData();
    }
  }

  /** when user type in search textbox */
  public search(value: string): void {
    this.searchText = value;
  }

  /** when user clear the item */
  public clearItem(item: CustomPaperSizeDropDownItem): void {
    item.selected = false;
    item.clientConfigureDefaultId = null;
    item.paperColorTypeId = null;
    item.paperSideTypeId = null;

    this.selectedDataItems = [];
    this.setSelectedData();
  }

  /** to optimize DOM */
  public trackBy(key: string, index: number, data: any): number {
    return data[key];
  }

  /** Bind Slected Data */
  private bindSelectedData(inputItems: any): void {
    this.selectedDataItems = [];
    const configPaperSize: CopyItConfigPaperSizes = this.items.find((obj: CopyItConfigPaperSizes) =>
      obj.clientConfigureDefaultId === inputItems.clientConfigureDefaultId);
    if (configPaperSize) {
      const paperSize: CustomPaperSizeDropDownItem = this.itemsList.find((paperSizeItem: CustomPaperSizeDropDownItem) =>
        paperSizeItem.paperSizeId === configPaperSize.paperSizeId);
      if (paperSize) {
        paperSize.selected = true;
        paperSize.paperSize = configPaperSize.paperSize;
        paperSize.clientConfigureDefaultId = configPaperSize.clientConfigureDefaultId;
        paperSize.paperColorTypeId = configPaperSize.paperColorTypeId;
        paperSize.paperSideTypeId = configPaperSize.paperSideTypeId;
        paperSize.instruction = inputItems.instruction;
        paperSize.primaryKeyField = inputItems[this.bindPrimaryKeyField];

        paperSize.paperColorType = configPaperSize.paperColorType;
        paperSize.paperSideType = configPaperSize.paperSideType;

        const paperColor: PaperColor = paperSize.subItem && paperSize.subItem.paperColors.find((paperColorItem: PaperColor) =>
          paperColorItem.paperColorId === configPaperSize.paperColorTypeId);
        if (paperColor) {
          paperColor.selected = true;
        }

        const paperSide: PaperSide = paperSize.subItem && paperSize.subItem.paperSides.find((paperSideItem: PaperSide) =>
          paperSideItem.paperSideId === configPaperSize.paperSideTypeId);
        if (paperSide) {
          paperSide.selected = true;
        }
        this.selectedDataItems.push(paperSize);
      }
    }
  }

  /** it will set the selected data to a specific format */
  private setSelectedData(): void {
    if (this.selectedDataItems && this.selectedDataItems.length > 0) {
      const dataItems: any[] = this.selectedDataItems.map((dataItem: CustomPaperSizeDropDownItem) => {
        if (this.bindPrimaryKeyField) {
          dataItem[this.bindPrimaryKeyField] = dataItem.primaryKeyField;
        }
        Object.keys(dataItem).forEach((key: string) => {
          if (dataItem[key] === null || dataItem[key] === undefined) {
            delete dataItem[key];
          }
        });
        return dataItem;
      });
      this.onChange(dataItems[0]);
    } else {
      this.onChange(null);
    }
  }

  /** Map Input Data */
  private mapInputData(): void {
    this.itemsList = [];
    if (this.items && this.items.length > 0) {
      const uniquePaperSizeIds: Set<number> = new Set(this.items.map((item: CopyItConfigPaperSizes) => item.paperSizeId))
      uniquePaperSizeIds.forEach((id: number) => {
        const paperSize: CopyItConfigPaperSizes = this.items.find((item: CopyItConfigPaperSizes) => item.paperSizeId === id);
        if (paperSize) {
          let paperSizeItem: CustomPaperSizeDropDownItem = {
            paperSize: paperSize.paperSize,
            paperSizeId: paperSize.paperSizeId,
            clientConfigureDefaultId: null,
            paperColorType: paperSize.paperColorType,
            subItem: null,
            instruction: paperSize.instruction,
            isOther: paperSize.isOther,
            defaultTenantRate: paperSize.defaultTenantRate,
            defaultClientRate: paperSize.defaultClientRate
          }

          const paperSizes: CopyItConfigPaperSizes[] = this.items.filter((item: CopyItConfigPaperSizes) => item.paperSizeId === id);
          if (paperSizes.length > 1) {
            paperSizeItem.subItem = {
              paperColors: [
                { paperColorId: 1, paperColor: 'B/W', selected: false },
                { paperColorId: 2, paperColor: 'color', selected: false }
              ],
              paperSides: [
                { paperSideId: 1, paperSide: '1-Sided', selected: false },
                { paperSideId: 2, paperSide: '2-Sided', selected: false }
              ]
            }
          } else {
            paperSizeItem.clientConfigureDefaultId = paperSize.clientConfigureDefaultId;
            // paperSizeItem.primaryKeyField = paperSize[this.bindPrimaryKeyField];
          }
          this.itemsList.push(paperSizeItem);
        }
      });

      if (this._bindValues) {
        this.bindSelectedData(this._bindValues);
      }
    }
  }
}
