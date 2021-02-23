/**
 * @author Enter Your Name Here.
 * @description This is data table desktop presentation component.To represent data in the desktop view.
 */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit, QueryList, ViewChildren, HostBinding, Inject, NgZone } from '@angular/core';
import { SortingOrder, SortingOrderDirective } from 'common-libs';
import { takeUntil } from 'rxjs/operators/takeUntil';
import { Subject } from 'rxjs/Subject';
//-----------------------------------------------------------------------------------------------------//
import { Permission } from '../../../../core/enums/role-permissions.enum';
import { DATE_TIME_FORMAT } from '../../../../core/utility/constants';
import { ClientListPresentationBase } from '../../client-list-presentation-base/client-list.presentation.base';
import { ClientListPresenter } from '../../client-list-presenter/client-list.presenter';
import { AuthPolicyService } from 'auth-policy';

/**
 * ClientListDesktopPresentationComponent
 */
@Component({
  selector: 'app-client-list-desktop-presentation',
  templateUrl: './client-list-desktop.presentation.html',
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class ClientListDesktopPresentationComponent extends ClientListPresentationBase implements OnInit, OnDestroy {

  @HostBinding('class') public class: string;
  /** This property is used to store QueryList of SortingOrderDirective */
  @ViewChildren(SortingOrderDirective) public sortingColumns: QueryList<SortingOrderDirective>;

  /** Starting index for client list numbering */
  @Input() public startIndex: number

  /** Date format for createdAt column */
  public readonly dateFormat: string = DATE_TIME_FORMAT;

  /**
   * This enum is return clients enum props.
   */
  public get clientsEnum(): typeof Permission.Client {
    return Permission.Client;
  }

  public canCopyItConfigEdit: boolean;


  constructor(
    public clientPresenter: ClientListPresenter,
    public changeDetection: ChangeDetectorRef,
    public authPolicyService: AuthPolicyService,
    @Inject('Window') window: Window,
    zone: NgZone
  ) {
    super(clientPresenter, changeDetection, window, zone);
    this.destroy = new Subject();
    this.class = 'd-flex flex-column overflow-hidden';
    this.checkPermissionForCopyItConfigMenu();
  }

  public ngOnInit(): void {
    this.clientPresenter.isCheckAll$.pipe(takeUntil(this.destroy)).subscribe((isCheckAll: boolean) => { this.isCheckAll = isCheckAll });
  }

  /**
   * This method is invoked when the user clicks on sorting icons. It sets the sort related criteria and queries the server
   * to get the updated list of clients.
   * @param column The column on which sorting needs to be performed. 
   * @param sortingOrder The sort order by which the column needs to be sorted.
   */
  public onSortOrder(column: string, sortingOrder: SortingOrder): void {
    this.clientPresenter.onSortOrder(column, sortingOrder, this.sortingColumns);
  }

  /** check permission for copyit config menu */
  private checkPermissionForCopyItConfigMenu(): void {
    let hasPermission: boolean = this.authPolicyService.hasPermission(Permission.CopyItConfigurationOptions.view);
    if (hasPermission) {
      this.canCopyItConfigEdit = hasPermission;
      return;
    }
    hasPermission = this.authPolicyService.hasPermission(Permission.CopyItConfigurationDefaultValues.view);
    if (hasPermission) {
      this.canCopyItConfigEdit = hasPermission;
      return;
    }
    hasPermission = this.authPolicyService.hasPermission(Permission.CopyItManageAccount.view);
    if (hasPermission) {
      this.canCopyItConfigEdit = hasPermission;
      return;
    }
  }
}
