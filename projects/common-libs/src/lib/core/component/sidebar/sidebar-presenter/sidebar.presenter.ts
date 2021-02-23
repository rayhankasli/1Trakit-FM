/**
 * @author Ronak Patel.
 */
import { Injectable, ElementRef, ComponentRef, ViewContainerRef, ComponentFactoryResolver, ComponentFactory } from '@angular/core';
import { Menu, HelpContent } from '../../../models/core.model';
import { OverlayConfig, Overlay, OverlayRef, ConnectionPositionPair } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
// ----------------------------------------------- //
import { HelpContentComponent } from './../../../../shared/components/help-content/help-content.component';
import { SubmenuComponent } from './../../../../shared/components/submenu/submenu.component';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { SidebarService } from '../../../services/sidebar/sidebar.service';

/**
 * SidebarPresenter
 */
@Injectable()
export class SidebarPresenter {
  /** Overlay ref for creating helpdesk and submenu */
  public overlayRef: OverlayRef;
  /** Property use to store sidebar collapsed state. */
  public isSideBarCollapsed: boolean;
  /** isScreenForDesktop */
  private isScreenForDesktop: boolean;

  constructor(
    private sideBarServices: SidebarService,
    private breakpointObserver: BreakpointObserver,
    private overlay: Overlay,
    private resolver: ComponentFactoryResolver
  ) { }

  /**
   * Creates submenu over lay when menu is Collapsed.
   * @param menu to extract submenu from menu object
   * @param index to get the position of container
   */
  public createSubmenuOverLay(menu: Menu, index: number, elementRef: ElementRef): void {
    const overlayConfigSubmenu: OverlayConfig = new OverlayConfig();
    overlayConfigSubmenu.hasBackdrop = true;
    overlayConfigSubmenu.backdropClass = '';
    overlayConfigSubmenu.positionStrategy = this.overlay.position().flexibleConnectedTo(elementRef).withPositions(
      [
        {
          originX: 'end',
          originY: 'top',
          overlayX: 'start',
          overlayY: 'top',
          offsetX: 0.1,
          panelClass: 'top-right'
        },
        {
          originX: 'end',
          originY: 'bottom',
          overlayX: 'start',
          overlayY: 'bottom',
          offsetX: 0.1,
          panelClass: 'bottom-right'
        }

      ]
    );
    this.overlayRef = this.overlay.create(overlayConfigSubmenu);
    const portal: ComponentPortal<SubmenuComponent>
      = new ComponentPortal<SubmenuComponent>(SubmenuComponent);
    const componentRef: ComponentRef<SubmenuComponent> = this.overlayRef.attach(portal);
    (componentRef.instance as SubmenuComponent).subMenuData = menu.subMenus;
    this.overlayRef.backdropClick().subscribe(() => {
      this.overlayRef.detach();
    });
    componentRef.instance.closeOverlayOnSelect.subscribe(status => {
      this.overlayRef.detach();
    });
  }

  /**
   * Gets overlay help when click on help menu item
   */
  public getOverlayHelp(helpContentData: HelpContent[]): void {
    const overlayConfig: OverlayConfig = new OverlayConfig();
    overlayConfig.hasBackdrop = true;
    overlayConfig.backdropClass = '';
    overlayConfig.positionStrategy = this.overlay.position().global().right('0').centerVertically();
    this.overlayRef = this.overlay.create(overlayConfig);
    const portal: ComponentPortal<HelpContentComponent>
      = new ComponentPortal<HelpContentComponent>(HelpContentComponent);
    const componentRef: ComponentRef<HelpContentComponent> = this.overlayRef.attach(portal);
    (componentRef.instance as HelpContentComponent).helpContentData = helpContentData;
    (componentRef.instance as HelpContentComponent).removeHelpCentre.subscribe(() => {
      this.overlayRef.detach();
    });
    this.overlayRef.backdropClick().subscribe(() => {
      this.overlayRef.detach();
    });
  }

  /**
   * Creates expanded submenu when isCollapsed is false
   */
  public createExpandedSubmenu(entryArray: ViewContainerRef[], menuData: Menu[]): void {
    entryArray.forEach((singleEntry: ViewContainerRef) => {
      singleEntry.clear();
    });
    menuData.forEach((singleMenu: Menu, index: number) => {
      if (singleMenu.isOpen) {
        const factory: ComponentFactory<SubmenuComponent> = this.resolver.resolveComponentFactory(SubmenuComponent);
        const componentRef: ComponentRef<SubmenuComponent> = entryArray[index].createComponent(factory);
        (componentRef.instance as SubmenuComponent).subMenuData = menuData[index].subMenus;
      }
    });
  }

  /**
   * Removes expanded submenu when isCollapsed is true
   */
  public removeExpandedSubmenu(entryArray: ViewContainerRef[]): void {
    entryArray.forEach((singleEntry: ViewContainerRef) => {
      singleEntry.clear();
    });
  }

  /**
   * Toggles side bar flag Is collapsed
   */
  public toggleSideBar(): void {
    if (this.isScreenForDesktop) {
      if (this.isSideBarCollapsed) {
        this.isSideBarCollapsed = false;
      } else {
        this.isSideBarCollapsed = true;
      }
      this.sideBarServices.setDashboardCollapsed(this.isSideBarCollapsed);
    }
  }

  /**
   * Change screen size
   */
  public changeScreenSize(): void {
    this.breakpointObserver.observe(['(max-width: 1400px)']).subscribe((state: BreakpointState) => {
      if (state.matches) {
        this.isScreenForDesktop = true;
        this.isSideBarCollapsed = true;
        this.sideBarServices.setDashboardCollapsed(this.isSideBarCollapsed);
      } else {
        this.isScreenForDesktop = true;
        this.isSideBarCollapsed = false;
        this.sideBarServices.setDashboardCollapsed(this.isSideBarCollapsed);
      }
    });
  }
}