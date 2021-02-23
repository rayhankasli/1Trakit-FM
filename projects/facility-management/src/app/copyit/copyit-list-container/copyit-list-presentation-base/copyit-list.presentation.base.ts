/**
 * @author Enter Your Name Here.
 * @description This is base class to represent the common members of desktop and mobile component.
 */

import { ChangeDetectorRef, Inject, Input, NgZone } from '@angular/core';
import { Observable } from 'rxjs';
// ----------------------------------------------------------- //
import { TableProperty } from 'common-libs';
// ----------------------------------------------------------- //
import { CopyItBookItBase } from '../../../core/base-classes/copyit-bookit-base';
import { ArchiveModeService } from '../../../core/services/archive-mode/archive-mode.service';
import { CopyItList } from '../../models/copyit-list.model';
import { CopyItListPresenter } from '../copyit-list-presenter/copyit-list.presenter';

/**
 * copyItList list presentation base
 */
export class CopyItListPresentationBase extends CopyItBookItBase {

  /** This property is used to store the copyItLists that has been retrieved from the API. */
  @Input() public set copyItLists(value: CopyItList[]) {
    this._copyItLists = value;
    this.changeDetection.detectChanges();
  };

  public get copyItLists(): CopyItList[] {
    return this._copyItLists;
  }

  /** This boolean is used to indicate whether all rows are selected or not  */
  public isCheckAll: boolean;
  /** This property is used for filter apply or not. */
  public isFilterApply: boolean;
  /** This property is used to store the criteria that are selected by the user */
  public tableProperty: TableProperty;
  /** Check wether the isAchrived or not */
  public isArchived$: Observable<boolean>;

  /** CopyItLists of copyItList list presentation base */
  private _copyItLists: CopyItList[];


  constructor(
    public copyItListPresenter: CopyItListPresenter,
    public changeDetection: ChangeDetectorRef,
    public archiveModeService: ArchiveModeService,
    @Inject('Window') window: Window,
    zone: NgZone
  ) {
    super(window, zone);
    this.window = window as Window;
    this.isArchived$ = this.archiveModeService.archiveMode$;
  }

  /**
   * This method is invoked when the user changes the current page size.
   * @param paperSize The page number that needs to be set.
   */
  public onPageSizeChange(paperSize: number): void {
    this.copyItListPresenter.onPageSizeChange(paperSize);
  }

  /**
   * This method is invoked when the user changes the page number from the pagination toolbar.
   * @param pageNumber The number to which the table should switch to
   */
  public onPageChange(pageNumber: number): void {
    this.copyItListPresenter.onPageChange(pageNumber);
  }


  /**
   * This method is invoked when the user performs a global search. It resets the selected rows, updates the criteria
   * and then gets the new list of CopyItList based on updated criteria.
   * @param searchTerm The search string that has been searched by the user
   */
  public onSearch(searchTerm: string): void {
    this.copyItListPresenter.onSearch(searchTerm);
  }

  /** create for open modal when action perform */
  public openModal(copyItList: CopyItList): void {
    this.copyItListPresenter.openModal(copyItList);
  }

}
