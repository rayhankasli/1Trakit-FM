/**
 * @author Rayhan Kasli.
 * @description This is data table desktop presentation component.To represent data in the desktop view.
 */
import {
  Component,
  ChangeDetectorRef,
  OnInit,
  OnDestroy,
  ViewChildren,
  QueryList,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  HostBinding,
  Inject,
  NgZone,
} from '@angular/core';
import { takeUntil } from 'rxjs/operators/takeUntil';
import { Subject } from 'rxjs/Subject';
//-----------------------------------------------------------------------------------------------------//
import { SortingOrderDirective } from 'common-libs';
//-----------------------------------------------------------------------------------------------------//
import { ReasonsListPresentationBase } from '../../reasons-list-presentation-base/reasons-list.presentation.base';
import { ReasonsListPresenter } from '../../reasons-list-presenter/reasons-list.presenter';
import { Reasons } from '../../reasons.model';

/**
 * ReasonsListDesktopPresentationComponent
 */
@Component({
  selector: 'app-reasons-list-desktop-presentation',
  templateUrl: './reasons-list-desktop.presentation.html',
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReasonsListDesktopPresentationComponent extends ReasonsListPresentationBase implements OnInit, OnDestroy {

  /** HostBinding */
  @HostBinding('class') public class: string;

  /**
   * Sets input
   */
  @Input() public set addNewReasonsForm(response: boolean) {
    this._addNewReasonsFrom = response;
    if (response) {
      this.closeEditForm()
    }
  }
  public get addNewReasonsForm(): boolean {
    return this._addNewReasonsFrom;
  }

  /**
   * Output  of reasons list desktop presentation component
   */
  @Output() public closeForm: EventEmitter<boolean>;

  /** This property is used to store QueryList of SortingOrderDirective */
  @ViewChildren(SortingOrderDirective) public sortingColumns: QueryList<SortingOrderDirective>;

  /**
   * Determines whether add new slot is
   */
  private _addNewReasonsFrom: boolean;

  constructor(
    public reasonsPresenter: ReasonsListPresenter,
    public changeDetection: ChangeDetectorRef,
    @Inject('Window') window: Window,
    zone: NgZone
  ) {
    super(reasonsPresenter, changeDetection, window, zone);
    this.destroy = new Subject();
    this.closeForm = new EventEmitter();
    this.class = 'd-flex flex-column h-100 overflow-hidden';
  }

  public ngOnInit(): void {
    this.reasonsPresenter.isCheckAll$
      .pipe(takeUntil(this.destroy))
      .subscribe((isCheckAll: boolean) => {
        this.isCheckAll = isCheckAll;
      });
  }

  public ngOnDestroy(): void {
    this.reasons && this.closeEditForm();
    this.destroy.unsubscribe();
  }

  /**
   * Edits reasons
   * @param reasons 
   */
  public editReasons(reasons: Reasons): void {
    this._addNewReasonsFrom = false;
    this.closeReasonForm(false);
    this.reasons && this.reasons.filter((data: Reasons) => {
      if (data.isEditable) {
        data.isEditable = false;
      }
      if (reasons === data) {
        data.isEditable = true;
      }
    });
  }

  /**
   * Closes edit form
   */
  public closeEditForm(): void {
    this.reasons && this.reasons.filter((data: Reasons) => {
      if (data.isEditable) {
        data.isEditable = false;
      }
    })
  }

  /**
   * Closes form
   * @param event 
   */
  public closeReasonForm(event: boolean): void {
    this.closeForm.emit(event);
    this.closeEditForm();
  }

}
