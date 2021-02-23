/**
 * @author Farhin Shaikh
 * @description BookItpresenter service for BookItpresentation component.
 */

import { Injectable } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { MultiSelectFilterRecord } from '../../../../core/model/common.model';

/**
 * BookItListPresenter
 */
@Injectable()
export class MultiSelectFilterPresenter {

  constructor(
    private fb: FormBuilder
  ) { }

  /**
   * build form for multi-select-filter
   */
  public buildForm(): FormGroup {
    return this.fb.group(
      {
        requestedById: [[]],
        assignedToId: [[]],
        statusId: [[]],
        clientId: [0]
      })
  };

  /**
   * set setting for multi-select filter dropdown
   */
  public getSettings(control: string, value: string): Object {
    return {
      text: control,
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      classes: 'dropdown-item p-0',
      badgeShowLimit: 1,
      maxHeight: 230,
      primaryKey: value
    }
  }

  /**
   * reset form controls for the multi select filter
   * @param searchField search control
   * @param multiSelectFilterForm multi select filter form group
   */
  public resetControls(searchField: AbstractControl, multiSelectFilterForm: AbstractControl): void {
    searchField.patchValue('');
    multiSelectFilterForm.get('requestedById').patchValue([]);
    multiSelectFilterForm.get('assignedToId').patchValue([]);
    multiSelectFilterForm.get('statusId').patchValue([]);
  }

  /** check if search/filter applied  */
  public checkFilterApplied(search: string, filter: MultiSelectFilterRecord): boolean {
    return (search.length || filter.requestedById.length || filter.assignedToId.length || filter.statusId.length) ? true : false;
  }

}

