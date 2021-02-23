/**
 * @author Rayhan Kasli.
 * @description This is base class to represent the common members of desktop and mobile component.
 */

import { ChangeDetectorRef, EventEmitter, Inject, Input, NgZone, Output } from '@angular/core';
// --------------------------------------------- //
import { TableProperty } from 'common-libs';
import { BaseCloseSelectDropdown } from 'projects/facility-management/src/app/core/base-classes/base-close-select-dropdown';
// --------------------------------------------- //
import { ReasonsListPresenter } from '../reasons-list-presenter/reasons-list.presenter';
import { ReasonPermissions, Reasons } from '../reasons.model';

/**
 * reasons list presentation base
 */
export class ReasonsListPresentationBase extends BaseCloseSelectDropdown {

  /** This property is used for getting policy permissions based on parent */
  @Input() public set permissions(permissions: ReasonPermissions) {
    if (permissions) {
      this._permissions = permissions;
    }
  }
  public get permissions(): ReasonPermissions {
    return this._permissions;
  }

  /** This property is used to store the reasons that has been retrieved from the API. */
  @Input() public set reasons(value: Reasons[]) {
    if (value) {
      if (value.length && !value[value.length - 1].reasonType) {
        this.lastReasonTaskNotCompleted = value[value.length - 1].reason;
      }
      this._reasons = value;
      this.changeDetection.detectChanges();
    }
  }

  public get reasons(): Reasons[] {
    return this._reasons;
  }

  /** Sets input */
  @Input() public set lastReasonNotDelivered(value: string) {
    this._lastReasonNotDelivered = value;
  }

  public get lastReasonNotDelivered(): string {
    return this._lastReasonNotDelivered;
  }
  /** Sets input */
  @Input() public set lastReasonNotPicked(value: string) {
    this._lastReasonNotPicked = value;
  }

  public get lastReasonNotPicked(): string {
    return this._lastReasonNotPicked;
  }

  /**
   * Output  of reasons not delivered list desktop presentation component
   */
  @Output() public saveReason: EventEmitter<Reasons>;

  /**
   * Output  of reasons not picked list presentation base
   */
  @Output() public updateReason: EventEmitter<Reasons>;

  /** This boolean is used to indicate whether all rows are selected or not  */
  public isCheckAll: boolean;

  /** This property is used for filter apply or not. */
  public isFilterApply: boolean;

  /** This property is used to store the criteria that are selected by the user */
  public tableProperty: TableProperty;

  public lastReasonTaskNotCompleted: string;

  /** Reasons of reasons list presentation base */
  private _reasons: Reasons[];
  /** _lastReasonNotDelivered. */
  private _lastReasonNotDelivered: string;
  /** _lastReasonNotPicked. */
  private _lastReasonNotPicked: string;
  /** Permission instance based on parent component */
  private _permissions: ReasonPermissions;


  constructor(
    public reasonsListPresenter: ReasonsListPresenter,
    public changeDetection: ChangeDetectorRef,
    @Inject('Window') window: Window,
    zone: NgZone
  ) {
    super(window, zone);
    this.window = window as Window;
    this.saveReason = new EventEmitter();
    this.updateReason = new EventEmitter();
  }

  /** create for open modal when action perform */
  public openModal(reasons: Reasons): void {
    this.reasonsListPresenter.openModal(reasons);
  }

  /**
   * Saves reasons for not delivered
   * @param reasons
   */
  public saveReasons(
    reasons: Reasons
  ): void {
    this.saveReason.emit(reasons);
  }

  /**
   * Cancels reason not picked
   * @param event
   */
  public updateReasons(
    reasons: Reasons
  ): void {
    reasons.isEditable = false;
    this.updateReason.emit(reasons);
  }

}
