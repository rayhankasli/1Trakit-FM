/**
 * @author Enter Your Name Here.
 * @description This is data table desktop presentation component.To represent data in the desktop view.
 */
import { Component, ChangeDetectorRef, ViewChildren, QueryList, ChangeDetectionStrategy, HostBinding, Inject, NgZone } from '@angular/core';
//-----------------------------------------------------------------------------------------------------//
import { SortingOrderDirective, SortingOrder } from 'common-libs';
//-----------------------------------------------------------------------------------------------------//
import { CopyItListPresentationBase } from '../../copyit-list-presentation-base/copyit-list.presentation.base';
import { CopyItListPresenter } from '../../copyit-list-presenter/copyit-list.presenter';
import { Permission } from '../../../../core/enums/role-permissions.enum';
import { DATE_TIME_FORMAT } from '../../../../core/utility/constants';
import { StatusEnum } from '../../../../core/enums/status.enum';
import { ArchiveModeService } from '../../../../core/services/archive-mode/archive-mode.service';

/**
 * CopyItListDesktopPresentationComponent
 */
@Component({
  selector: 'app-copyit-list-desktop-ui',
  templateUrl: './copyit-list-desktop.presentation.html',
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class CopyItListDesktopPresentationComponent extends CopyItListPresentationBase {

  /** It will add the class */
  @HostBinding('class') public class: string;

  /** This property is used to store QueryList of SortingOrderDirective */
  @ViewChildren(SortingOrderDirective) public sortingColumns: QueryList<SortingOrderDirective>;

  /** It will store the date format constant */
  public dateFormat: string = DATE_TIME_FORMAT;

  /** It will get the status enum and return */
  public get StatusEnum(): typeof StatusEnum {
    return StatusEnum;
  }

  /** It will get the Permission and return */
  public get copyItPermissions(): typeof Permission.CopyIt {
    return Permission.CopyIt;
  }

  constructor(
    public copyItListPresenter: CopyItListPresenter,
    public changeDetection: ChangeDetectorRef,
    public archiveModeService: ArchiveModeService,
    @Inject('Window') window: Window,
    zone: NgZone
  ) {
    super(copyItListPresenter, changeDetection, archiveModeService, window, zone);
    this.class = 'd-flex flex-column overflow-hidden';
  }


  /**
   * This method is invoked when the user clicks on sorting icons. It sets the sort related criteria and queries the server
   * to get the updated list of copyItLists.
   * @param column The column on which sorting needs to be performed. 
   * @param sortingOrder The sort order by which the column needs to be sorted.
   */
  public onSortOrder(column: string, sortingOrder: SortingOrder): void {
    this.copyItListPresenter.onSortOrder(column, sortingOrder, this.sortingColumns);
  }
}
