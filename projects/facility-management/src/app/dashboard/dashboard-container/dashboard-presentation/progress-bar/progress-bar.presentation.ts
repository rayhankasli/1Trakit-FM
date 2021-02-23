/**
 * @author : Bikash Das
 * @description : This is a presentation component class for Progress Bar
 */

import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-progress-bar-ui',
  templateUrl: './progress-bar.presentation.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProgressBarPresentationComponent {

  /**
   * This is a setter method to get progress bar status values as input
   * for copyit,bookit and fleet for combo chart
   */
  @Input() public set progressStatus(data: any) {
    if (data) {
      this.receivedRequest = data.totalRecievedRequest;
      this.completedRequest = data.totalCompletedRequest;
    }
  }

  public receivedRequest: number;
  public completedRequest: number;

  constructor() {
    this.receivedRequest = 0;
    this.completedRequest = 0;
  }

  /** setting getter method which returns received request */
  public get receivedData(): number {
    return this.receivedRequest;
  }
  /** setting getter method which returns completed request */
  public get completedData(): number {
    return this.completedRequest;
  }
}
