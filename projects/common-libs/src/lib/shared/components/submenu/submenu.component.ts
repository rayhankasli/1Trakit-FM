/** 
 * @author Mayur Patel 
 */

import { Component, Input, ChangeDetectionStrategy, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
// ------------------------------ //
import { SubMenu } from '../../../core/models/core.model';
import { ToggleAnimation } from '../../../core/component/dashboard.animation';

/**
 * SubmenuComponent
 */
@Component({
  selector: 'lib-submenu',
  templateUrl: './submenu.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [ToggleAnimation.bodyExpansion],
  preserveWhitespaces: false
})
export class SubmenuComponent {
  /**
   * Toggle state of submenu component
   */
  public toggleState: boolean;

  /**
   * Sets input
   */
  @Input() public set subMenuData(menu: SubMenu[]) {
    this._subMenuData = menu;
    this.cdref.detectChanges();
  }

  public get subMenuData(): SubMenu[] {
    return this._subMenuData;
  }

  /**
   * Input  of submenu component
   */
  @Input() public orientation: boolean;
  /**
   * Sub menu data of submenu component
   */
  private _subMenuData: SubMenu[];

  // Output submit emitter for update value overlay popup
  @Output() closeOverlayOnSelect: EventEmitter<boolean>;
  constructor(private cdref: ChangeDetectorRef) {
    this.toggleState = true;
    this.closeOverlayOnSelect = new EventEmitter();
  }

  /**
   * trackBy
   */
  public trackBy(index: number, item: SubMenu): number {
    return index;
  }

  public removeAttachmentOnClick() {
    this.closeOverlayOnSelect.emit(true)
  }

}
