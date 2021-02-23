/**
 * @author Mayur Patel.
 * @description This is sidebar component.To render menus in e-servicing portal
 */
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, Input, OnDestroy, OnInit, QueryList, ViewChildren, ViewContainerRef } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
// ----------------------------------- //
import { BaseClientMaster } from '../../../models/client-master.model';
import { HelpContent, Menu } from '../../../models/core.model';
import { SidebarService } from '../../../services/sidebar/sidebar.service';
import { DropdownAnimation, ToggleAnimation } from '../../dashboard.animation';
import { SidebarPresenter } from './../sidebar-presenter/sidebar.presenter';

/**
 * This is sidebar component.To render menus in e-servicing portal based on user permissions
 */
@Component({
  selector: 'lib-sidebar-ui',
  templateUrl: './sidebar.presentation.html',
  animations: [ToggleAnimation.bodyExpansion, ToggleAnimation.indicatorRotate, DropdownAnimation.fadeInDown],
  viewProviders: [SidebarPresenter],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarPresentationComponent implements OnInit, AfterViewInit, OnDestroy {

  /** This property is used to show client details */
  @Input() public clientDetail: BaseClientMaster;
  /** This property is use to store Menus data to render on sidebar from particular Apps */
  @Input() public menuData: Menu[];
  /** This property is use to store helpContentData data to render on sidebar from particular Apps */
  @Input() public helpContentData: HelpContent[];
  /** This property is use to store active menu's blank container */
  @ViewChildren('subMenuRef', { read: ViewContainerRef }) public entry: QueryList<ViewContainerRef>;
  /** This property is use to get the reference of active menu position. */
  @ViewChildren('menuRef', { read: ViewContainerRef }) public elementRef: QueryList<ViewContainerRef>;
  /** Determines whether current route is dashboard or not. */
  public isDashBoard: boolean;
  /** Determines whether side bar collapsed or not. */
  public isSideBarCollapsed: boolean;
  /** To store blank counters for creating submenus */
  public entryArray: ViewContainerRef[];
  /** This property is use to store Window object. */
  private window: Window;

  /** for stop subscriptions on component destroy */
  private destroy: Subject<void>;

  public isReportSelected: boolean;

  constructor(
    // tslint:disable-next-line: no-any
    @Inject('Window') window: any,
    private sideBarServices: SidebarService,
    private sidebarPresenter: SidebarPresenter,
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    this.isReportSelected = false;
    this.isDashBoard = false;
    this.window = window as Window;
    if (this.window.location.href.indexOf('http://localhost:4200') !== -1) {
      this.isDashBoard = true;
    }
    this.destroy = new Subject();
    this.checkCurrentRoute();
  }

  /**
   * To initialize sidebar and listen service to render menu based on collapsed menu click.
   */
  public ngOnInit(): void {

    // watches for screen-size change
    this.sidebarPresenter.changeScreenSize();
    this.entryArray = [];

    this.sideBarServices.isCollapsed.pipe(takeUntil(this.destroy)).subscribe((res: boolean) => {
      this.isSideBarCollapsed = res;
      if (this.menuData != null) {
        if (this.isSideBarCollapsed) {
          this.removeExpandedSubmenu();
        } else {
          this.createExpandedSubmenu();
        }
      }
      this.changeDetectorRef.detectChanges();
    });
  }

  /**
   * Toggles side bar flag Is collapsed
   */
  public toggleSideBar(): void {
    this.menuData.forEach((menu: Menu) => {
      menu.isOpen = false
    });
    this.sidebarPresenter.toggleSideBar();
  }

  /**
   * after view init
   */
  public ngAfterViewInit(): void {
    this.entryArray = this.entry.toArray();

    this.entry.changes.pipe(takeUntil(this.destroy)).subscribe(
      () => {
        this.entryArray = this.entry.toArray();
        this.createExpandedSubmenu();
      }
    );
  }

  /**
   * Creates submenu over lay when menu is Collapsed.
   * @param menu to extract submenu from menu object
   * @param index to get the position of container
   */
  public createSubmenuOverLay(menu: Menu, index: number): void {
    const elementArray: Array<any> = this.elementRef.toArray();
    this.sidebarPresenter.createSubmenuOverLay(menu, index, elementArray[index].element.nativeElement);
  }

  /**
   * Gets overlay help when click on help menu item
   */
  public getOverlayHelp(): void {
    this.sidebarPresenter.getOverlayHelp(this.helpContentData);
  }

  /**
   * Disables link
   * @param openFlag 
   */
  public disableLink(openFlag: boolean): void {

  }
  /**
   * Tracks by
   * @param index 
   * @param item 
   * @returns by 
   */
  public trackBy(index: number, item: Menu): number {
    return index;
  }

  /**
   * Creates expanded submenu when isCollapsed is false
   */
  public createExpandedSubmenu(): void {
    this.sidebarPresenter.createExpandedSubmenu(this.entryArray, this.menuData);
  }

  /**
   * Creates and remove submenu when isCollapsed is false 
   */
  public createAndRemoveSubmenu(index: number, menuObject: Menu): void {
    this.removeExpandedSubmenu();
    let isReportMenu: boolean = menuObject.index === 6 ? true : false;
    this.menuData.forEach((menu: Menu) => {
      if (!isReportMenu && menu.index === 6 && menu.isOpen) {
        menu.isOpen = false
      }
    });
    if (typeof index === 'number') {
      this.menuData[index].isOpen = this.menuData[index].isOpen ? false : true;
    }
    this.createExpandedSubmenu();
  }

  public ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }

  /** check current route for setting Reports router-link-active/de-active */
  private checkCurrentRoute(): void {
    this.router.events.pipe(takeUntil(this.destroy)).subscribe(event => {
      if (event instanceof NavigationEnd) {
        let url = event.url;
        let selectedUrl = url.split('/');
        let selectedRoute: string = selectedUrl[1];
        if (selectedRoute.includes('report')) {
          this.isReportSelected = true;
        } else {
          this.isReportSelected = false;
        }
        this.changeDetectorRef.markForCheck()
      }
    })
  }

  /**
   * Removes expanded submenu when isCollapsed is true
   */
  private removeExpandedSubmenu(): void {
    this.sidebarPresenter.removeExpandedSubmenu(this.entryArray);
  }
}
