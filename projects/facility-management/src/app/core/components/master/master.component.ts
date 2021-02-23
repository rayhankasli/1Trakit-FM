import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthPolicyService } from 'auth-policy';
import { Menu } from 'common-libs';
import { Subject } from 'rxjs';
import { Observable } from 'rxjs/Observable';
// --------------------------------------------- //
import { distinctUntilChanged, map } from 'rxjs/operators';
import { Permission, PolicyRoles } from '../../enums/role-permissions.enum';
import { ClientMaster } from '../../model/common.model';
import { MasterPresenterService } from '../master-presenter/master.presenter';

/**
 * MasterComponent
 */
@Component({
  selector: 'app-master',
  templateUrl: './master.component.html',
  // changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [
    MasterPresenterService
  ]
})
export class MasterComponent implements OnInit, OnDestroy {

  /** Menus$  of master component */
  public menus$: Observable<Menu[]>;

  /** Logged in user data$ of master component */
  public loggedInUserData$: Observable<string>;

  /**
   * This enum is return SuperManagers enum props.
   */
  public get superManagerEnum(): typeof Permission.SuperManager {
    return Permission.SuperManager;
  }

  /**
   * This enum is return clients enum props.
   */
  public get clientsEnum(): typeof Permission.Client {
    return Permission.Client;
  }

  /**
   * This enum is return users enum props.
   */
  public get usersEnum(): typeof Permission.User {
    return Permission.User;
  }

  /** client detail observable */
  public get clientDetail(): ClientMaster { return this.masterPresenterService.clientDetail; }

  /** to check if current user is having Role:super-user */
  public checkAllowedRole: boolean;
  /** to check if current view is archived or not */
  public get isArchived(): boolean {
    return this.masterPresenterService.isArchived;
  }
  public get showArchivedMenu(): boolean {
    return this.masterPresenterService.showArchivedMenu;
  }

  /** to unsubscribe the observations on destroy */
  private destroy: Subject<void>;

  constructor(
    private authPolicy: AuthPolicyService,
    private masterPresenterService: MasterPresenterService
  ) {
    this.checkAllowedRole = this.authPolicy.isInRole(PolicyRoles.manager) || this.authPolicy.isInRole(PolicyRoles.associate);

    /** Get menuList observable */
    this.menus$ = this.masterPresenterService.menuItems$.pipe(
      map(menuList => menuList.filter(menu => menu.permisison === true)),
      distinctUntilChanged());
    this.destroy = new Subject();
  }

  public ngOnInit(): void {

    // Set username on user drop-down if not present take from token
    this.loggedInUserData$ = this.masterPresenterService.getLoggedInUserDetail();

    /** check user roles and open archived module info popup */
    this.masterPresenterService.openArchivedInfoPopup();
  }

  public ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }

}
