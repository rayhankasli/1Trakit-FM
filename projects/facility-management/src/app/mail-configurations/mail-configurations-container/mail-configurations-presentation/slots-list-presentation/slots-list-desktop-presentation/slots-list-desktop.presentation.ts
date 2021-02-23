/**
 * @author Rayhan Kasli.
 * @description This is data table desktop presentation component.To represent data in the desktop view.
 */
import {
  Component, ChangeDetectorRef, OnInit, OnDestroy,
  ViewChildren, QueryList, ChangeDetectionStrategy, Input, EventEmitter, Output, HostBinding, Inject, NgZone
} from '@angular/core';
import { takeUntil } from 'rxjs/operators/takeUntil';
import { Subject } from 'rxjs/Subject';
import { SortingOrderDirective } from 'common-libs';
//-----------------------------------------------------------------------------------------------------//
import { SlotsListPresentationBase } from '../../slots-list-presentation-base/slots-list.presentation.base';
import { SlotsListPresenter } from '../../slots-list-presenter/slots-list.presenter';
import { Slots } from '../../../../mail-configurations.model';
import { Permission } from '../../../../../core/enums/role-permissions.enum'


/**
 * SlotsListDesktopPresentationComponent
 */
@Component({
  selector: 'app-slots-list-desktop-presentation',
  templateUrl: './slots-list-desktop.presentation.html',
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class SlotsListDesktopPresentationComponent extends SlotsListPresentationBase implements OnInit, OnDestroy {

  @HostBinding('class') public class: string;
  /**
   * Sets input
   */
  @Input() public set addSlot(response: boolean) {
    this._addSlot = response;
    if (response) {
      this.closeEditForm();
    }
  }
  public get addSlot(): boolean {
    return this._addSlot;
  }

  /**
   * This enum is return offices enum props.
   */
  public get slotsEnum(): typeof Permission.Slot {
    return Permission.Slot;
  }

  /*** Output of customer form presentation component */
  @Output() public closeSlotsForm: EventEmitter<boolean>;

  /** emmits slot status event */
  @Output() public setSlotStatus: EventEmitter<Slots>;

  /** This property is used to store QueryList of SortingOrderDirective */
  @ViewChildren(SortingOrderDirective) public sortingColumns: QueryList<SortingOrderDirective>;

  /** Determines whether add new slot is */
  private _addSlot: boolean;


  constructor(
    public slotsPresenter: SlotsListPresenter,
    public changeDetection: ChangeDetectorRef,
    @Inject('Window') window: Window,
    zone: NgZone
    ) {
    super(slotsPresenter, changeDetection, window, zone);
    this.destroy = new Subject();
    this.closeSlotsForm = new EventEmitter();
    this.setSlotStatus = new EventEmitter<Slots>();
    this.class = 'd-flex flex-column overflow-hidden';
  }

  public ngOnInit(): void {
    this.slotsPresenter.isCheckAll$.pipe(takeUntil(this.destroy)).subscribe((isCheckAll: boolean) => { this.isCheckAll = isCheckAll });
  }

  /**
   * Edits reasons not picked
   * @param reasonsNotPicked
   */
  public editSlot(slots: Slots): void {
    this._addSlot = false;
    this.closeForm(false);
    this.slotss && this.slotss.filter((data: Slots) => {
      if (data.isEditable) {
        data.isEditable = false;
      }
      if (slots === data) {
        data.isEditable = true;
      }
    });
  }
  /**
   * Closes edit form
   */
  public closeEditForm(): void {
    this.slotss && this.slotss.filter((data: Slots) => {
      if (data.isEditable) {
        data.isEditable = false;
      }
    })
  }


  /**
   * Cancels slot
   * @param event
   */
  public closeForm(event: boolean): void {
    this.closeSlotsForm.emit(event);
    this.closeEditForm();
  }

  public ngOnDestroy(): void {
    this.slotss && this.closeEditForm();
    this.destroy.unsubscribe();
  }
}
