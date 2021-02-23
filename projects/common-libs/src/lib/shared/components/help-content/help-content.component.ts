/** 
 * @author Mayur Patel 
 */

import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
// ------------------------------------------------- //
import { SlideAnimation } from '../../../core/component/dashboard.animation';
import { HelpContent } from '../../../core/models/core.model';

/**
 * HelpContentComponent
 */
@Component({
  selector: 'lib-help-content',
  templateUrl: './help-content.component.html',
  animations: [SlideAnimation.slideInOut],
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HelpContentComponent {

  /**
   * Faq status of help content component
   */
  public faqStatus: boolean;
  /**
   * Search filter of help content component
   */
  public searchFilter: string;
  /**
   * Input  of help content component
   */
  @Input() public helpContentData: HelpContent[];
  /**
   * Output  of help content component
   */
  @Output() public removeHelpCentre: EventEmitter<boolean>;
  constructor() {
    this.faqStatus = true;
    this.searchFilter = '';
    this.removeHelpCentre = new EventEmitter();
  }


  // Help click
  /**
   * Faqs btn click
   */
  public faqBtnClick(): void {
    this.faqStatus = !this.faqStatus;
  }
  /**
   * Deletes me
   */
  public deleteMe(): void {
    this.removeHelpCentre.emit(true);
  }

  /**
   * Tracks by
   * @param index 
   * @param item 
   * @returns by 
   */
  public trackBy(index: number, item: HelpContent): number {
    return index;
  }
}
