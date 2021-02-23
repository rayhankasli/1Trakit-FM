import { Component, Input } from '@angular/core';

/** Badge Model */
class Badge {
  /** color of Badge */
  public color: string;
  /** label of Badge */
  public label: string;

  constructor(label: string, color: string) {
    this.label = label;
    this.color = color;
  }
}

/** Status Badge enum */
export enum StatusBadge {
  new = 'badge-new',
  assigned = 'badge-assigned',
  inProgress = 'badge-in-progress',
  completed = 'badge-completed',
  reOpen = 'badge-re-open',
  onHold = 'badge-on-hold',
  requestForInformation = 'badge-request-for-information',
  qualityReview = 'badge-quality-review',
  close = 'badge-close',
}

/** Mapper for statusId and status badge detail */
const statusMap: Map<number, Badge> = new Map([
  [1, new Badge('New', StatusBadge.new)],
  [2, new Badge('Assigned', StatusBadge.assigned)],
  [3, new Badge('In Progress', StatusBadge.inProgress)],
  [4, new Badge('Completed', StatusBadge.completed)],
  [5, new Badge('Re-Open', StatusBadge.reOpen)],
  [6, new Badge('On-hold', StatusBadge.onHold)],
  [7, new Badge('Request For Information', StatusBadge.requestForInformation)],
  [8, new Badge('Quality Review', StatusBadge.qualityReview)],
  [9, new Badge('Close', StatusBadge.close)],
])

/**
 * Pass status id to set badge color and text.
 * Pass status text to set custom text.
 */
@Component({
  selector: 'app-status-badge',
  templateUrl: './status-badge.component.html',
})
export class StatusBadgeComponent {

  /** Input for status id */
  @Input() public set statusId(id: number) {
    if (id) {
      this.theme = statusMap.get(id);
    }
  };

  /** Set custom status name */
  @Input() public set statusText(label: string) {
    this.theme.label = label
  };

  /** Set custom color-class for status badge */
  @Input() public set statusColor(color: StatusBadge) {
    this.theme.color = color
  }

  /** Selected badge class */
  public theme: Badge;

  constructor() {
  }

}
