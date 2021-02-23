/**
 * @author Rayhan Kasli.
 * @description This is base class to represent the common members of desktop and mobile component.
 */

import { ChangeDetectorRef, EventEmitter, Inject, Input, NgZone, Output } from '@angular/core';
import { TableProperty } from 'common-libs';
import { BaseCloseSelectDropdown } from 'projects/facility-management/src/app/core/base-classes/base-close-select-dropdown';
// --------------------------------------------- //
import { MasterData, SlotListStatus, Slots, SLOT_STATUS_OPTION } from '../../../mail-configurations.model';
import { SlotsListPresenter } from '../slots-list-presenter/slots-list.presenter';

/**
 * slots list presentation base
 */
export class SlotsListPresentationBase extends BaseCloseSelectDropdown {
  /** This property is used to store the slotss that has been retrieved from the API. */
  @Input() public set slotss(value: Slots[]) {
    if (value) {
      this._slotss = value;
    }
  }

  public get slotss(): Slots[] {
    return this._slotss;
  }

  /** This will set the data */
  @Input() public set masterData(value: MasterData) {
    this._masterData = value;
  }
  public get masterData(): MasterData {
    return this._masterData;
  }
  /** Sets input */
  @Input() public set lastSlot(value: string) {
    this._lastSlot = value;
  }
  public get lastSlot(): string {
    return this._lastSlot;
  }
  /*** Output of customer form presentation component */
  @Output() public newSlotData: EventEmitter<Slots>;
  /*** Output of customer form presentation component */
  @Output() public updateSlotData: EventEmitter<Slots>;
  /*** Output of customer form presentation component */
  @Output() public officeId: EventEmitter<number>;
  /** This property is used for emit  status event */
  @Output() public setSlotStatus: EventEmitter<Slots>;

  /** This boolean is used to indicate whether all rows are selected or not  */
  public isCheckAll: boolean;

  /** This property is used for filter apply or not. */
  public isFilterApply: boolean;

  /** This property is used to store the criteria that are selected by the user */
  public tableProperty: TableProperty;

  /** Slots list status */
  public status: SlotListStatus[] = SLOT_STATUS_OPTION;

  /** Slotss of slots list presentation base */
  private _slotss: Slots[];
  /** Slotss of slots list presentation base */
  private _lastSlot: string;
  /** Slotss of slots list presentation base */
  private _masterData: MasterData;

  constructor(
    public slotsPresenter: SlotsListPresenter,
    public changeDetection: ChangeDetectorRef,
    @Inject('Window') window: Window,
    zone: NgZone
  ) {
    super(window, zone);
    this.window = window as Window;
    this.newSlotData = new EventEmitter();
    this.updateSlotData = new EventEmitter();
    this.officeId = new EventEmitter();
    this.setSlotStatus = new EventEmitter();

  }

  /**
   * Saves slots
   * @param event
   */
  public saveSlots(slots: Slots): void {
    this.newSlotData.emit(slots);
  }
  /**
   * Saves slots
   * @param event
   */
  public updateSlots(slots: Slots): void {
    this.slotss && this.slotss.forEach((response: Slots) => {
      response.isEditable = false
    });
    this.updateSlotData.emit(slots);
  }

  /** create for open modal when action perform */
  public openModal(slots: Slots): void {
    this.slotsPresenter.openModal(slots);
  }

  /**
   * Set slot status active/inactive
   * @param status status to be changed
   * @param slots slot detail
   */
  public setStatus(status: SlotListStatus, slots: Slots): void {
    this.onSetStatus({ ...slots, isActive: status.statusValue });
  }

  /**
   * On slots status change
   * @param slots Slots
   */
  public onSetStatus(slots: Slots): void {  
    this.setSlotStatus.emit(slots);
  }

}
