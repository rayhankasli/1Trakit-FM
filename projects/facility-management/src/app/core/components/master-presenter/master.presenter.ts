import { Injectable, OnDestroy } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { AuthPolicyService } from 'auth-policy';
import { AuthService, Menu, SubMenu } from 'common-libs';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { distinctUntilChanged, filter, map, switchMap, take, takeUntil } from 'rxjs/operators';
import { MenuLicensing } from '../../enums/menu-licensing.enum';
import { Permission, PolicyRoles } from '../../enums/role-permissions.enum';
import { ClientMaster } from '../../model/common.model';
import { UserInfo } from '../../model/core.model';
import { ArchivedService } from '../../module/archived/archived.service';
import { ArchiveModeService } from '../../services/archive-mode/archive-mode.service';
import { CoreDataService } from '../../services/core-data.service';
import { getKeyByValue } from '../../utility/utility';

/** Client modules available under licensed or archived */
enum ClientMode {
  PRODUCT_LICENSE = 'productLicense',
  ARCHIVE = 'archive',
}

/** Master presenter service */
@Injectable()
export class MasterPresenterService implements OnDestroy {

  /** menu items observable */
  public menuItems$: Observable<Menu[]>;
  /** client detail observable */
  public clientDetail: ClientMaster;
  /** to check if current user is having Role:super-user */
  public isSuperUser: boolean;
  /** archive mode enabled flag */
  public isArchived: boolean;
  /** to toggle archive menu */
  public showArchivedMenu: boolean;
  /** subject for menu-items */
  private menuItems: BehaviorSubject<Menu[]>;
  /** sub-menu items */
  private readonly reportMenuList: SubMenu[] = [
    {
      index: MenuLicensing.ReportCopyIt,
      name: 'Copy It',
      link: '/report/copyit',
      icon: 'icon-copy'
    },
    {
      index: MenuLicensing.ReportBookIt,
      name: 'Book It',
      link: '/report/bookit',
      icon: 'icon-meeting',
    },
    {
      index: MenuLicensing.ReportFleet,
      name: 'Fleet',
      link: '/report/fleet',
      icon: 'icon-print',
    },
    {
      index: MenuLicensing.ReportMeterReads,
      name: 'Meter Reads',
      link: '/report/meter-read',
      icon: 'icon-manometer',
    },
    {
      index: MenuLicensing.ReportMail,
      name: 'Mail',
      link: '/report/mail',
      icon: 'icon-send-email',
    },
    {
      index: MenuLicensing.ReportWorkflow,
      name: 'Workflow',
      link: '/report/workflow',
      icon: 'icon-workflow',
    },
    {
      index: MenuLicensing.ReportTask,
      name: 'Task',
      link: '/report/task',
      icon: 'icon-tasks',
    }
  ];
  /** menu items */
  private readonly menuItemList: Menu[] = [
    {
      index: MenuLicensing.Dashboard,
      name: 'Dashboard',
      link: '/dashboard',
      icon: 'icon-dashboard',
      parentMenuId: '',
      permisison: true,
      isRouteLink: true,
      isOpen: false,
      subMenus: []
    },
    {
      index: MenuLicensing.CopyIt,
      name: 'Copy It',
      link: '/copyit',
      icon: 'icon-copy',
      parentMenuId: '',
      permisison: true,
      isRouteLink: true,
      isOpen: false,
      subMenus: []
    },
    {
      index: MenuLicensing.BookIt,
      name: 'Book It',
      link: '/bookit',
      icon: 'icon-meeting',
      parentMenuId: '',
      permisison: true,
      isRouteLink: true,
      isOpen: false,
      subMenus: []
    },
    {
      index: MenuLicensing.Fleet,
      name: 'Fleet',
      link: '/asset',
      icon: 'icon-print',
      parentMenuId: '',
      permisison: true,
      isRouteLink: true,
      isOpen: false,
      subMenus: []
    },
    {
      index: MenuLicensing.VisitorLog,
      name: 'Visitor Log',
      link: '/visitor-log',
      icon: 'icon-visitor-log',
      parentMenuId: '',
      permisison: true,
      isRouteLink: true,
      isOpen: false,
      subMenus: []
    },
    {
      index: MenuLicensing.Packages,
      name: 'Packages',
      link: '/packages',
      icon: 'icon-package',
      parentMenuId: '',
      permisison: true,
      isRouteLink: true,
      isOpen: false,
      subMenus: []
    },
    {
      index: MenuLicensing.Report,
      name: 'Report',
      link: null,
      icon: 'icon-chart',
      parentMenuId: '',
      permisison: true,
      isRouteLink: true,
      isOpen: false,
      subMenus: this.reportMenuList
    },
  ];

  /** to unsubscribe the subscriptions */
  private destroy: Subject<void>;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private authPolicy: AuthPolicyService,
    private coreDataService: CoreDataService,
    private archivedService: ArchivedService,
    private archiveModeService: ArchiveModeService
  ) {
    this.destroy = new Subject();
    this.menuItems = new BehaviorSubject(this.menuItemList);
    this.menuItems$ = this.menuItems.asObservable();
    this.isSuperUser = this.authPolicy.isInRole(PolicyRoles.superUser);

    /** get client details to show client logo in sidebar */
    this.coreDataService.clientDetail$().pipe(takeUntil(this.destroy)).subscribe((clientDetail: ClientMaster) => {
      this.clientDetail = clientDetail;
    });

    // check router change subscription for checking archived routes or not
    this.watchForArchivedRoutesEnable();

    /** watch archived mode change for updating menu items */
    this.archiveModeService.archiveMode$.pipe(distinctUntilChanged(), takeUntil(this.destroy))
      .subscribe((isArchived: boolean) => {
        this.isArchived = isArchived;
        this.showArchivedMenu = this.checkArchiveMenuEnable(this.clientDetail);
        const newMenu: Menu[] = Object.assign([], this.menuItemList);
        const list: Menu[] = this.generateMenuList(newMenu, isArchived);
        if (isArchived) {
          // this.checkArchivedAndPermission();
          this.checkLicensingAndPermissionForMenu([...list], this.clientDetail.archive, ClientMode.ARCHIVE);
        } else {
          this.checkLicensingAndPermissionForMenu([...list], this.clientDetail.productLicense, ClientMode.PRODUCT_LICENSE);
        }
      })
  }

  /** get logged-in user details */
  public getLoggedInUserDetail(): Observable<any> {
    return this.coreDataService.userInfo$.pipe(
      switchMap(userInfo => userInfo.userDetail ?
        of(`${userInfo.userDetail.firstName} ${userInfo.userDetail.lastName}`) :
        this.authService.getUserData().pipe(map(user => user.profile.fullname))
      )
    );
  }

  /**
   * check licensing and permission for menu items
   * @param menuList Licensed/Archived menu list
   * @param clientDetail client license detail
   * @param mode Licensed/Archived mode
   */
  public checkLicensingAndPermissionForMenu(menuList: Menu[], clientDetail: ClientMaster['productLicense'] | ClientMaster['archive'], mode: ClientMode): void {
    const list = menuList.map((menu: Menu) => {
      // modeEnabled used for licensed-mode
      const { modeEnabled, permission, isSubMenu }: any = this.setMenuPermission({ ...menu }, clientDetail)
      if (isSubMenu) {
        menu = this.checkLicensingAndPermissionForSubMenu({ ...menu }, clientDetail, mode);
      } else {
        /** check if user is super-user or has client-licensing & required permission */
        menu.permisison = !permission ? true :
          (mode === ClientMode.PRODUCT_LICENSE ? (this.isSuperUser || modeEnabled) : modeEnabled) &&
          this.authPolicy.hasPermission(permission);
      }
      return menu;
    });
    this.menuItems.next([...list]);
  }

  /** open Archived info popup for manager and associates */
  public openArchivedInfoPopup(): void {
    if ((this.authPolicy.isInRole(PolicyRoles.manager) || this.authPolicy.isInRole(PolicyRoles.associate))) {
      this.coreDataService.userInfo$.pipe(take(1)).subscribe((userInfo: UserInfo) => {
        let acceptedDate: string = userInfo.userDetail.acceptedDate;
        const archivedModuleName: string[] = this.checkArchivedModules(userInfo.clients);
        !acceptedDate && archivedModuleName.length && this.archivedService.openPopUp(archivedModuleName, userInfo);
      });
    }
  }

  /**
   * set menu items based on permission
   * @param menu Licensed/Archive menu
   * @param clientDetail client license detail
   */
  private setMenuPermission(menu: Menu, clientDetail: ClientMaster[ClientMode.PRODUCT_LICENSE] | ClientMaster[ClientMode.ARCHIVE]): any {
    let modeEnabled: boolean = true;
    let permission: string = '';
    let isSubMenu: boolean = false;
    switch (menu.index) {
      case MenuLicensing.Dashboard:
        permission = Permission.Dashboard.summary;
        modeEnabled = clientDetail.copyIt || clientDetail.bookIt;
        break;
      case MenuLicensing.CopyIt:
        permission = Permission.CopyIt.view;
        modeEnabled = clientDetail.copyIt;
        break;
      case MenuLicensing.BookIt:
        permission = Permission.BookIt.view;
        modeEnabled = clientDetail.bookIt;
        break;
      case MenuLicensing.Fleet:
        permission = Permission.Fleet.view;
        modeEnabled = clientDetail.copyIt;
        break;
      case MenuLicensing.VisitorLog:
        permission = Permission.VisitorLog.viewVisitor;
        modeEnabled = clientDetail.visitorLog;
        break;
      case MenuLicensing.Packages:
        permission = Permission.Packages.webView;
        modeEnabled = clientDetail.mail;
        break;
      case MenuLicensing.Report:
        isSubMenu = true;
        permission = '';
        break;
    }
    return { modeEnabled, permission, isSubMenu };
  }

  /** This method is return boolean value based on sub menu has permission or not */
  private checkLicensingAndPermissionForSubMenu(menu: Menu, clientDetail: ClientMaster[ClientMode.PRODUCT_LICENSE] | ClientMaster[ClientMode.ARCHIVE], mode: ClientMode): Menu {
    let hasPermissionSubMenu: boolean = false;
    let subMenuItems: SubMenu[] = [];
    if (menu.name === 'Report') {
      menu.subMenus.forEach((subMenu: SubMenu, i: number) => {
        // modeEnabled used for licensed-mode
        const { modeEnabled, permission }: any = this.setSubMenuPermission({ ...subMenu }, clientDetail)
        /** check if user is super-user or has client-licensing & required permission */
        hasPermissionSubMenu = !permission ? true :
          (mode === ClientMode.PRODUCT_LICENSE ? (this.isSuperUser || modeEnabled) : modeEnabled) &&
          this.authPolicy.hasPermission(permission);
        if (hasPermissionSubMenu) {
          subMenuItems.push(subMenu);
        }
      });
    }
    menu.subMenus = [];
    menu.subMenus = [...subMenuItems];
    menu.permisison = subMenuItems.length > 0;
    return menu;
  }

  /** set sub menu item permission */
  private setSubMenuPermission(subMenus: SubMenu, clientDetail: ClientMaster[ClientMode.PRODUCT_LICENSE] | ClientMaster[ClientMode.ARCHIVE]): any {
    let modeEnabled: boolean = true;
    let permission: string = '';
    switch (subMenus.index) {
      case MenuLicensing.ReportCopyIt:
        permission = Permission.ReportsCopyIt.view;
        modeEnabled = clientDetail.copyIt;
        break;
      case MenuLicensing.ReportBookIt:
        permission = Permission.ReportsBookIt.view;
        modeEnabled = clientDetail.bookIt;
        break;
      case MenuLicensing.ReportFleet:
        permission = Permission.ReportsFleet.view;
        modeEnabled = clientDetail.copyIt;
        break;
      case MenuLicensing.ReportMail:
        permission = Permission.ReportsMail.reportMailView;
        modeEnabled = clientDetail.mail;
        break;
      case MenuLicensing.ReportWorkflow:
        permission = Permission.ReportsWorkflow.reportWorkflowView;
        modeEnabled = clientDetail.workflow;
        break;
      case MenuLicensing.ReportTask:
        permission = Permission.ReportsTask.reportTaskView;
        modeEnabled = clientDetail.workflow;
        break;
      case MenuLicensing.ReportMeterReads:
        permission = Permission.ReportsMeterReads.reportMeterReadsView;
        modeEnabled = clientDetail.copyIt;
        break;
    }
    return { modeEnabled, permission }
  }

  /** check archived modules from given clients  */
  private checkArchivedModules(clients: ClientMaster[]): string[] {
    let names: string[] = [];
    clients.forEach((client: ClientMaster) => {
      names = [...new Set([...names, ...getKeyByValue(client.archive, true)])];
    });
    return names;
  }
  /** check if archived menu is visible */
  private checkArchiveMenuEnable(client: ClientMaster): boolean {
    const data: string[] = getKeyByValue(client.archive, true); //.filter(d => (<any[]>[this.licenseFeature.copyIt, this.licenseFeature.bookIt, this.licenseFeature.visitorLog]).includes(d));
    return data.length > 0;
  }

  /** check if user activated archived view */
  private watchForArchivedRoutesEnable(): void {
    this.router.events.pipe(filter(events => events instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        const data = this.route.snapshot.firstChild.data;
        if (data) {
          this.archiveModeService.setArchiveMode(data.isArchived || false);
        }
      })
  }

  /**
   * Generate menu list based on client licensing/archive mode
   * @param menuList Menu list
   * @param isArchived archive mode enabled
   */
  private generateMenuList(menuList: Menu[], isArchived: boolean): Menu[] {
    const list: Menu[] = menuList.map((menuItem: Menu) => {
      const menu: Menu = { ...menuItem };
      if (isArchived) {
        menu.link = menu.link && `/archive${menu.link}`;
      }
      if (menu.hasOwnProperty('subMenus')) {
        menu.subMenus = this.generateMenuList(menu.subMenus as Menu[], isArchived);
      }
      return menu;
    });
    return [...list];
  }

  // tslint:disable-next-line: member-ordering
  public ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }
}