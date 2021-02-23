/**
 * @author Enter Your Name Here.
 * @description This is data table desktop presentation component.To represent data in the desktop view.
 */
import { Component, ChangeDetectorRef, ViewChildren, QueryList, ChangeDetectionStrategy, Input, HostBinding, Inject, NgZone } from '@angular/core';
//-----------------------------------------------------------------------------------------------------//
import { SortingOrderDirective, SortingOrder } from 'common-libs';
//-----------------------------------------------------------------------------------------------------//
import { BookItListPresentationBase } from '../../bookit-list-presentation-base/bookit-list.presentation.base';
import { BookItListPresenter } from '../../bookit-list-presenter/bookit-list.presenter';
import { BookIt } from '../../../models/bookit.model';
import { DATE_TIME_FORMAT } from '../../../../core/utility/constants';
import { Permission } from '../../../../core/enums/role-permissions.enum';
import { StatusEnum } from '../../../../core/enums/status.enum';
import { ArchiveModeService } from '../../../../core/services/archive-mode/archive-mode.service';

/**
 * BookItListDesktopPresentationComponent
 */
@Component({
  selector: 'trakit-bookit-list-desktop-presentation',
  templateUrl: './bookit-list-desktop.presentation.html',
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class BookItListDesktopPresentationComponent extends BookItListPresentationBase {

  @HostBinding('class') public class: string;

  /** getter setter for bookIt records */
  @Input() public set bookItList(value: BookIt[]) {
    if (value) {
      this._bookIt = value;
      this.changeDetection.detectChanges();
    }
  };

  public get bookItList(): BookIt[] {
    return this._bookIt;
  }

  /** This property is used to store QueryList of SortingOrderDirective */
  @ViewChildren(SortingOrderDirective) public sortingColumns: QueryList<SortingOrderDirective>;

  /** Date format */
  public dateFormat: string = DATE_TIME_FORMAT;

  public get bookItPermissions(): typeof Permission.BookIt {
    return Permission.BookIt;
  }
  // Status enum
  public get StatusEnum(): typeof StatusEnum {
    return StatusEnum;
  }

  /** bookIt variable for getter setter */
  private _bookIt: BookIt[];

  constructor(
    public bookItPresenter: BookItListPresenter,
    public changeDetection: ChangeDetectorRef,
    public archiveModeService: ArchiveModeService,
    @Inject('Window') window: Window,
    zone: NgZone
  ) {
    super(bookItPresenter, changeDetection, archiveModeService, window, zone);
    this.class = 'd-flex flex-column overflow-hidden';
  }

  /**
   * This method is invoked when the user clicks on sorting icons. It sets the sort related criteria and queries the server
   * to get the updated list of bookIts.
   * @param column The column on which sorting needs to be performed.
   * @param sortingOrder The sort order by which the column needs to be sorted.
   */
  public onSortOrder(column: string, sortingOrder: SortingOrder): void {
    this.bookItPresenter.onSortOrder(column, sortingOrder, this.sortingColumns);
  }
}
