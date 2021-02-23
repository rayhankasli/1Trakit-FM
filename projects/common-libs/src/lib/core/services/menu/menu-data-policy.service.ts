
/**
 * @author Mayur Patel
 */

import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
// -------------------------------------------- //
import { Menu, SubMenu } from '../../models/core.model';
import { AuthPolicyService } from 'auth-policy';

/**
 * MenuDataPolicyService
 */
@Injectable()
export class MenuDataPolicyService {
  /** menus */
  private menus: Menu[];
  /** windowUrl */
  private windowUrl: string;
  /**
   * Window  of menu service
   */
  private window: Window;
  /** currentGuidelineTag */
  public set currentGuidelineTag(tagValue: string) {
    this._currentGuidelineTag = tagValue;
  }
  public get currentGuidelineTag(): string {
    return this._currentGuidelineTag;
  }
  /** _currentGuidelineTag */
  private _currentGuidelineTag: string;
  constructor(
    @Inject('Window') window: any,
    private authSerive: AuthPolicyService) {
    this.menus = [];
    this.window = window as Window;
    this.windowUrl = this.window.location.origin;
  }

  /**
   * Gets all menus
   * @param responseData 
   * @returns all menus 
   */
  public getAllMenus(responseData: any): Observable<Menu[]> {
    this.menus = responseData.filter((item: any) => {
      if (item.fields.__typename === 'menu') {
        return item;
      }
    }).map((filteredItem: any) => {
      return this.menuAdapter(filteredItem.fields);
    });
    let sortedItem: Menu[] = this.menus.sort((firstValue: Menu, secondValue: Menu) => {
      return firstValue.index - secondValue.index;
    });
    return of(sortedItem);
  }

  /**
   * Menus adapter
   * @param menuInfo 
   * @returns adapter 
   */
  private menuAdapter(menuInfo: any): Menu {
    let submenuDetail: SubMenu[] = [];
    if (menuInfo.submenu != null && menuInfo.submenu !== []) {
      submenuDetail = this.getSubmenus(menuInfo.submenu);
    }
    let isMenuOpen: boolean = false;
    if (menuInfo.link !== '' && this.windowUrl === menuInfo.link) {
      isMenuOpen = true;
      this.currentGuidelineTag = menuInfo.guidelineTag;
    }

    let isMenuAvailable: boolean = false;

    if (menuInfo.permission === null || menuInfo.permission === '') {
      isMenuAvailable = true;
    } else {
      isMenuAvailable = this.authSerive.hasPermission(menuInfo.permission);
    }
    let isRouteLink: boolean = true;
    const pattern: RegExp =
      new RegExp(/^(([0-9]{1,2}|1[0-9]{2}|2[0-9][0-5])\.){3}([0-9]{1,2}|1[0-9]{2}|2[0-9][0-5])(\/([0-9]{1,2}|1[0-9]{2}|2[0-9][0-5]))?$/);
    let menuLink: string = menuInfo.link;
    let menuLinkArray: string[] = [];

    if (menuLink != null) {
      menuLinkArray = menuLink.split(':');
    } else {
      menuLink = '';
    }


    if ((menuLink != null) && ((pattern.test(menuLinkArray[0])) || (menuLink.indexOf(':') !== -1))) {
      isRouteLink = false;
    }

    return new Menu(
      menuInfo.index,
      menuInfo.name,
      menuLink,
      menuInfo.icon,
      isMenuOpen,
      isMenuAvailable,
      isRouteLink,
      submenuDetail);
  }

  /**
   * Gets submenus
   * @param subMenuInfo 
   * @returns submenus 
   */
  private getSubmenus(subMenuInfo: any): SubMenu[] {
    let subMenuItems: SubMenu[] = subMenuInfo.map((subMenuItem: any) => {
      return this.subMenuAdapter(subMenuItem);
    });
    let sortedItem: SubMenu[] = subMenuItems.sort((firstValue: SubMenu, secondValue: SubMenu) => {
      return firstValue.index - secondValue.index;
    });
    return sortedItem;
  }
  /**
   * Subs menu adapter
   * @param subMenuInfo 
   * @returns menu adapter 
   */
  private subMenuAdapter(subMenuInfo: any): SubMenu {
    return new SubMenu(
      subMenuInfo.index,
      subMenuInfo.name,
      subMenuInfo.link,
      subMenuInfo.icon);
  }
}
