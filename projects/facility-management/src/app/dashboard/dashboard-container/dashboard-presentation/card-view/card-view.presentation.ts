/**
 * @author : Bikash Das
 * @description : This is a presentation component class for Card View Open Request
 */

import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { DATE_TIME_FORMAT } from '../../../../core/utility/constants';
import { trackBy } from '../../../../core/utility/utility';
import { OPEN_REQUEST_LABEL, OPEN_REQUEST_TITLE } from '../../../dashboard.enum';
import { OpenRequest } from '../../../dashboard.model';
import { BaseChartPresentation } from '../base-chart.presentation';

@Component({
  selector: 'app-card-view-ui',
  templateUrl: './card-view.presentation.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardViewPresentationComponent extends BaseChartPresentation implements OnInit {

  @Input() public set isArchive(flag: boolean) {
    this.parentRoute = '/';
    if (flag) { this.parentRoute = '/archive' }
  };

  /**
   * setter method to get all open request data for copyit,bookit and fleet as input
   */
  @Input() public set openRequests(val: OpenRequest[]) {
    if (val) {
      this._openRequests = val;
    }
  }
  public get openRequests(): OpenRequest[] {
    return this._openRequests;
  }

  /** date-time format */
  public readonly dateFormat: string = DATE_TIME_FORMAT;
  /** widget title mapper */
  public titleLabels: Map<number, string> = new Map<number, string>();
  /** title enum refence */
  public titleNames: typeof OPEN_REQUEST_TITLE = OPEN_REQUEST_TITLE;
  /** to preserve parent level route for ''/'archive'  */
  public parentRoute: string;

  /** Open request list */
  private _openRequests: OpenRequest[] = [];

  constructor() {
    super();
  }

  public ngOnInit(): void {
    /** setting open request titles to show as labels in map as key value pair */
    this.titleLabels.set(OPEN_REQUEST_TITLE.Copyit, OPEN_REQUEST_LABEL.Copyit);
    this.titleLabels.set(OPEN_REQUEST_TITLE.Bookit, OPEN_REQUEST_LABEL.Bookit);
    this.titleLabels.set(OPEN_REQUEST_TITLE.Fleet, OPEN_REQUEST_LABEL.Fleet);
  }

  /**
   * Used for performance optimization.
   */
  public trackBy(key: string, index: number, data: any): number {
    return trackBy(key, index, data);
  }

}
