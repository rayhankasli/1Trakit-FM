import { Directive, Input, ElementRef, Renderer2, OnInit } from '@angular/core';
// --------------------------------------------------------- //
import { StatusEnum } from '../../../core/enums/status.enum';

/** Status Background color class enum */
enum StatusBG {
  // Use the class 'bg-due-in' for Due in X hours.
  new = 'bg-in-progress',
  assigned = 'bg-in-progress',
  inProgress = 'bg-in-progress',
  completed = 'bg-close',
  reOpen = 'bg-in-progress',
  onHold = 'bg-in-progress',
  requestForInformation = 'bg-in-progress',
  qualityReview = 'bg-quality-review',
  close = 'bg-close',
}

/** Mapper for statusId and status BG color */
const statusMap: Map<number, StatusBG> = new Map([
  [1, StatusBG.new],
  [2, StatusBG.assigned],
  [3, StatusBG.inProgress],
  [4, StatusBG.completed],
  [5, StatusBG.reOpen],
  [6, StatusBG.onHold],
  [7, StatusBG.requestForInformation],
  [8, StatusBG.qualityReview],
  [9, StatusBG.close],
]);

/** Background color categories */
enum BGCategory {
  red = 0,
  yellow = 1,
  green = 2
}
@Directive({
  selector: '[trakItDueDateTime]'
})
export class DueDateTimeDirective implements OnInit {

  /** Due date time */
  @Input() public dueDateTime: Date;

  /** 
   * Input for status id to set status background
   * will be override if over-due
   */
  @Input() public set statusId(id: number) {
    if (id) {
      this._statusId = id;
      this.theme = statusMap.get(id);
    }
  };

  public get statusId(): number {
    return this._statusId;
  }

  /** Store Due In constant class */
  private readonly dueIn: string = 'bg-due-in';
  /** Store over Due constant class */
  private readonly overDue: string = 'overdue-data';
  /** Store status Id */
  private _statusId: number;
  /** Selected badge class */
  private theme: StatusBG | string;

  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2
  ) {
    this.theme = '';
  }

  public ngOnInit(): void {
    this.afterInitProp();
  }

  /** After Init Property */
  public afterInitProp(): void {
    /** check if status is complete/close */
    if (this.statusId && [StatusEnum.completed, StatusEnum.close].includes(this.statusId)) {
      // remove over-due class if ticket closed
      this.renderer.removeClass(this.elementRef.nativeElement, this.dueIn);
      this.renderer.removeClass(this.elementRef.nativeElement, this.overDue);
      this.theme && this.renderer.addClass(this.elementRef.nativeElement, this.theme);
    } else {
      if (!this.dueDateTime) { return }
      const currentDate: Date = new Date();
      const diff: number = (Date.parse(this.dueDateTime.toString()) - Date.parse(currentDate.toString())); // date diffrence in mili seconds
      const mm: number = Math.round(diff / 1000 / 60); // convert to minutues
      /**
       * if mm < 0 then over-due
       * if 0 < mm <2 then due-in-2h
       * else in-progress
       */
      const type: BGCategory = mm && (mm < 0 ? BGCategory.red : mm < 121 ? BGCategory.yellow : BGCategory.green);
      // set the status color as background
      switch (type) {
        case BGCategory.green:
          this.renderer.removeClass(this.elementRef.nativeElement, this.dueIn);
          this.renderer.removeClass(this.elementRef.nativeElement, this.overDue);
          this.theme && this.renderer.addClass(this.elementRef.nativeElement, this.theme);
          break;
        case BGCategory.yellow:
          this.renderer.removeClass(this.elementRef.nativeElement, this.overDue);
          this.theme && this.renderer.removeClass(this.elementRef.nativeElement, this.theme);
          this.renderer.addClass(this.elementRef.nativeElement, this.dueIn);
          break;
        case BGCategory.red:
          this.renderer.removeClass(this.elementRef.nativeElement, this.dueIn);
          this.theme && this.renderer.removeClass(this.elementRef.nativeElement, this.theme);
          this.renderer.addClass(this.elementRef.nativeElement, this.overDue);
          break;

        default:
          break;
      }
    }
  }
}
