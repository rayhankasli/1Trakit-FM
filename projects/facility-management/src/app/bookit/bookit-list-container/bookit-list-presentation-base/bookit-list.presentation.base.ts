
/**
 * @author Enter Your Name Here.
 * @description This is base class to represent the common members of desktop and mobile component.
 */

import { ChangeDetectorRef, Inject, NgZone } from '@angular/core';
import { Observable } from 'rxjs';
// --------------------------------------------- //
import { TableProperty } from 'common-libs';
// --------------------------------------------- //
import { CopyItBookItBase } from '../../../core/base-classes/copyit-bookit-base';
import { ClientMaster } from '../../../core/model/common.model';
import { ArchiveModeService } from '../../../core/services/archive-mode/archive-mode.service';
import { BookIt } from '../../models/bookit.model';
import { BookItListPresenter } from '../bookit-list-presenter/bookit-list.presenter';

/**
 * bookIt list presentation base
 */
export class BookItListPresentationBase extends CopyItBookItBase {

  /** This property is used to store the bookIts that has been retrieved from the API. */
  public set bookIts(value: BookIt[]) {
    this._bookIts = value;
    this.changeDetection.detectChanges();
  };

  public get bookIts(): BookIt[] {
    return this._bookIts;
  }

  /** This property is used for filter apply or not. */
  public isFilterApply: boolean;
  /** This property is used to store the criteria that are selected by the user */
  public tableProperty: TableProperty;
  /** isArchived */
  public isArchived$: Observable<boolean>;

  /** list of clients */
  protected _clients: ClientMaster[];
  /** BookIts of bookIt list presentation base */
  private _bookIts: BookIt[];
  

  constructor(
    public bookItPresenter: BookItListPresenter,
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
   * @param pageSize The page number that needs to be set.
   */
  public onPageSizeChange(pageSize: number): void {
    this.bookItPresenter.onPageSizeChange(pageSize);
  }

  /**
   * This method is invoked when the user changes the page number from the pagination toolbar.
   * @param pageNumber The number to which the table should switch to
   */
  public onPageChange(pageNumber: number): void {
    this.bookItPresenter.onPageChange(pageNumber);
  }


  /**
   * This method is invoked when the user performs a global search. It resets the selected rows, updates the criteria
   * and then gets the new list of BookIt based on updated criteria.
   * @param searchTerm The search string that has been searched by the user
   */
  public onSearch(searchTerm: string): void {
    this.bookItPresenter.onSearch(searchTerm);
  }


  /** create for open modal when action perform */
  public openModal(bookIt: BookIt): void {
    this.bookItPresenter.openModal(bookIt);
  }
}
