import { NgZone, OnDestroy, QueryList, ViewChildren } from '@angular/core';
import { NgbDropdown } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectComponent } from '@ng-select/ng-select';
import { BsDatepickerDirective, PopoverDirective } from 'ngx-bootstrap';
import { Subject } from 'rxjs/Subject';
// --------------------------------------------------------
import { CustomDropdownComponent } from '../../copyit-configurations/custom-select-dropdown/custom-select-dropdown.component';
import { TimePickerComponent } from '../../shared/components/time-picker/time-picker.component';
import { CustomPageSizeDropDownComponent } from '../../shared/modules/custom-select-drop-down/custom-page-size-dropdown/custom-page-size-dropdown.component';
import { CustomSelectDropdownComponent } from '../../shared/modules/custom-select-drop-down/custom-select-dropdown/custom-select-dropdown.component';
import { closeCustomSelectDropdown, closeNgSelect } from '../utility/utility';
import { BasePresentation } from './base.presentation';

/** base classes for closing the select dropdown */
export class BaseCloseSelectDropdown extends BasePresentation implements OnDestroy {

  /** ng-select dropdown reference */
  @ViewChildren(NgSelectComponent) public ngSelects: QueryList<NgSelectComponent>;
  /** custom select dropdown reference */
  @ViewChildren(CustomSelectDropdownComponent) public customSelectDropdowns: QueryList<CustomSelectDropdownComponent>;
  /** custom page size select dropdown reference */
  @ViewChildren(CustomPageSizeDropDownComponent) public customPageSizeSelectDropdowns: QueryList<CustomPageSizeDropDownComponent>;
  /** custom popover reference */
  @ViewChildren(PopoverDirective) public popoverDirective: QueryList<PopoverDirective>;
  /** custom popover (time picker) reference */
  @ViewChildren(TimePickerComponent) public timePickerComponent: QueryList<TimePickerComponent>;
  /** custom page size select dropdown reference */
  @ViewChildren(CustomDropdownComponent) public customConfigDropdowns: QueryList<CustomDropdownComponent>;
  /** ngb dropdown reference */
  @ViewChildren(NgbDropdown) public ngbDropDown: QueryList<NgbDropdown>;

  @ViewChildren(BsDatepickerDirective) public datepicker: QueryList<BsDatepickerDirective>;

  /** Destroy of customer form presentation component */
  public destroy: Subject<void>;

  constructor(public window: Window, public zone: NgZone) {
    super();
    this.destroy = new Subject<void>();
    zone.runOutsideAngular(() => {
      window.addEventListener('scroll', this.scroll, true);
    });
  }

  /** it will on component destroy */
  public ngOnDestroy(): void {
    this.window.removeEventListener('scroll', this.scroll, true);
    this.destroy.next();
    this.destroy.complete();
  }

  /** on scroll event for hide the ng-select dropdown */
  public scroll = (event: any): void => {
    this.zone.run(() => {
      if (this.ngSelects) {
        this.ngSelects.forEach((item: NgSelectComponent) => {
          closeNgSelect(item, event);
        });
      }

      // close the custom dropdown
      if (this.customSelectDropdowns) {
        this.customSelectDropdowns.forEach((item: CustomSelectDropdownComponent) => {
          closeCustomSelectDropdown(item, event);
        });
      }

      // close the custom page size select dropdown
      if (this.customPageSizeSelectDropdowns) {
        this.customPageSizeSelectDropdowns.forEach((item: CustomPageSizeDropDownComponent) => {
          closeCustomSelectDropdown(item, event);
        });
      }
      // close the custom page size select dropdown
      if (this.popoverDirective) {
        this.popoverDirective.forEach((item: PopoverDirective) => {
          item.hide();
        });
      }

      if (this.customConfigDropdowns) {
        this.customConfigDropdowns.forEach((item: CustomDropdownComponent) => {
          closeCustomSelectDropdown(item, event);
        });
      }

      if (this.ngbDropDown) {
        this.ngbDropDown.forEach((item: NgbDropdown) => {
          if (item && item.isOpen) {
            item.close();
          }
        });
      }

      if (this.datepicker) {
        this.datepicker.forEach((item: BsDatepickerDirective) => {
          if (item && item.isOpen) {
            item.hide();
          }
        })
      }
      // close time picker popover
      if (this.timePickerComponent) {
        this.timePickerComponent.forEach(({popover}: TimePickerComponent) => {
          popover.hide();
        })
      }
    });
  };

}