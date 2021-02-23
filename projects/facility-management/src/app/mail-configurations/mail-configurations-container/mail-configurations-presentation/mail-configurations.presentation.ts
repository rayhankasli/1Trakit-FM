/**
 * @name AccordionPresentationComponent
 * @author Rayhan Kasli
 * @description This is a presentation component for accordion control which contains the ui and business logic
 */

import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, Output, ViewChild } from '@angular/core';
import { NgbAccordion, NgbPanelChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { TableProperty } from 'common-libs';
import { Subject } from 'rxjs/Subject';
import { ClientFilterRequest } from '../../../client/client.model';
import { Permission } from '../../../core/enums/role-permissions.enum';
import { ReasonPermissions, Reasons, ReasonsResponse } from '../../../shared/components/reasons/reasons.model';
import { MasterData, Slots, SlotsResponse } from '../../mail-configurations.model';
import { MailConfigurationsPresenter } from '../mail-configurations-presenter/mail-configurations.presenter';

/**
 * MailConfigurationsPresentationComponent
 */
@Component({
  selector: 'app-mail-configurations-ui',
  templateUrl: './mail-configurations.presentation.html',
  viewProviders: [MailConfigurationsPresenter],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MailConfigurationsPresentationComponent implements AfterViewInit, OnDestroy {

  /** Sets input */
  @Input() public set baseResponseSlots(value: SlotsResponse) {
    if (value) {
      this._baseResponseSlots = value;
      this.lastSlot = value.lastSlot;
      this.slotss = value.slots;
      this.slotsCount = this.slotss.length;
    }
  }
  public get baseResponseSlots(): SlotsResponse {
    return this._baseResponseSlots;
  }

  /** Sets input */
  @Input() public set reasonsList(value: ReasonsResponse) {
    if (value) {
      this._reasonsList = value;
      this.reasonsNotDeliveredList = this.mailConfigurationsPresenter.getNotDeliveredReasons(this._reasonsList.reasons);
      this.reasonsNotPickedList = this.mailConfigurationsPresenter.getNotPickedReasons(this._reasonsList.reasons);
      this.reasonsNotDeliveredCount = this.reasonsNotDeliveredList ? this.reasonsNotDeliveredList.length : null;
      this.reasonsNotPickeCount = this.reasonsNotPickedList ? this.reasonsNotPickedList.length : null;
      this.lastReasonNotDelivered = value.lastReasonNotDelivered;
      this.lastReasonNotPicked = value.lastReasonNotPicked;
    }
  }
  public get reasonsList(): ReasonsResponse {
    return this._reasonsList;
  }

  /** This will set the data */
  @Input() public set masterData(value: MasterData) {
    this._masterData = value;
  }
  public get masterData(): MasterData {
    return this._masterData;
  }

  /** This property is used for get delete record or not. */
  @Input() public isSlotsDeleted: boolean;

  /** This will set the data */
  @Input() public set isReasonsDeleted(value: boolean) {
    if (value) {
      this._isReasonsDeleted = value;
    }
  }
  public get isReasonsDeleted(): boolean {
    return this._isReasonsDeleted;
  }

  /** This property is used for get delete record or not. */
  @Input() public isReasonsNotPickedDeleted: boolean;
  /** This property is used for get delete record or not. */
  @Input() public isReasonsNotDeliveredDeleted: boolean;

  /** getSlotsEmitter */
  @Output() public getSlotsEmitter: EventEmitter<TableProperty<ClientFilterRequest>> = new EventEmitter();
  /** deleteSlotsEmitter */
  @Output() public deleteSlotsEmitter: EventEmitter<Slots> = new EventEmitter();
  /** getReasonsNotDeliveredEmitter */
  @Output() public getReasonsNotDeliveredEmitter: EventEmitter<TableProperty> = new EventEmitter();
  /** deleteReasonsNotDeliveredEmitter */
  @Output() public deleteReasonsNotDeliveredEmitter: EventEmitter<Reasons> = new EventEmitter();
  /** getReasonsNotPickedEmitter */
  @Output() public getReasonsNotPickedEmitter: EventEmitter<TableProperty> = new EventEmitter();
  /** deleteReasonsNotPickedEmitter */
  @Output() public deleteReasonsNotPickedEmitter: EventEmitter<Reasons> = new EventEmitter();
  /** addSlotsEmitter of mailConfigurations component */
  @Output() public addSlotsEmitter: EventEmitter<Slots> = new EventEmitter();
  /** updateSlotsEmitter of mailConfigurations component  */
  @Output() public updateSlotsEmitter: EventEmitter<Slots> = new EventEmitter();
  /** addReasonsNotDeliveredEmitter of mailConfigurations component */
  @Output() public addReasonsNotDeliveredEmitter: EventEmitter<Reasons> = new EventEmitter();
  /** updateReasonsNotDeliveredEmitter of mailConfigurations component  */
  @Output() public updateReasonsNotDeliveredEmitter: EventEmitter<Reasons> = new EventEmitter();
  /** addReasonsNotPickedEmitter of mailConfigurations component */
  @Output() public addReasonsNotPickedEmitter: EventEmitter<Reasons> = new EventEmitter();
  /** updateReasonsNotPickedEmitter of mailConfigurations component  */
  @Output() public updateReasonsNotPickedEmitter: EventEmitter<Reasons> = new EventEmitter();
  /** This property is used for emit  status event */
  @Output() public setSlotStatus: EventEmitter<Slots> = new EventEmitter();

  /** View child of mailConfigurations presentation component   */
  @ViewChild('accordion', { static: true }) public accordionComponent: NgbAccordion;

  /** Reasons not delivered of mail configurations presentation component */
  public reasonsNotDeliveredList: Reasons[];
  /** Reasons not picked of mail configurations presentation component */
  public reasonsNotPickedList: Reasons[];
  /** slotss of mailConfigurations presentation component */
  public slotss: Slots[];
  /** slotsCount */
  public slotsCount: number;
  /** slotsCount */
  public lastSlot: string;
  /** reasonsNotPickeCount */
  public reasonsNotPickeCount: number;
  /** reasonsNotDeliveredCount */
  public reasonsNotDeliveredCount: number;
  /** reasonsNotDeliveredCount */
  public lastReasonNotDelivered: string;
  /** reasonsNotDeliveredCount */
  public lastReasonNotPicked: string;
  /** List of permissions for reasons */
  public reasonPermissions: ReasonPermissions;

  /** slotss of mailConfigurations presentation component */
  private _baseResponseSlots: SlotsResponse;
  /** This property is used for get delete record or not. */
  private _isReasonsDeleted: boolean;
  /** Reasons of mailConfigurations presentation component */
  private _reasonsList: ReasonsResponse;
  /** assigner of mailConfigurations presentation component */
  private _masterData: MasterData;
  /** destroy of mailConfigurations presentation component  */
  private destroy: Subject<void>;

  /** This enum return reason enum permission */
  public get reasonEnum(): typeof Permission.Reason {
    return Permission.Reason;
  }

  constructor(
    private cdr: ChangeDetectorRef,
    private mailConfigurationsPresenter: MailConfigurationsPresenter,
  ) {
    this.destroy = new Subject();
    this.reasonsNotDeliveredCount = 0;
    this.reasonsNotPickeCount = 0;
    this.reasonPermissions = this.mailConfigurationsPresenter.getReasonsPermissions();
  }

  public ngAfterViewInit(): void {
    this.mailConfigurationsPresenter.activeIds = ['0'];
    this.setPanelPrimaryType('0', false);
    this.cdr.detectChanges();
  }

  /**
   * When user click on save, make current panel collapsed and set next panel opened
   * @param id : This is the panel which we want to set as active
   */
  public onSave(id: string): void {
    this.mailConfigurationsPresenter.activeIds = [id];
    this.setPanelPrimaryType(id, false);
  }

  /**
   * When user click on cancel, make it collapsed
   * @param id : This is the panel which we want to remove from its active state
   */
  public onCancel(id: string): void {
    this.mailConfigurationsPresenter.onCancel(id, this.accordionComponent);
  }

  /**
   * On change of tabs, it will set the panel type according to its state
   * @param data: This is the current clicked tab
   */
  public toggleAccordion(data: NgbPanelChangeEvent): void {
    this.accordionComponent = this.mailConfigurationsPresenter.toggleAccordion(data, this.accordionComponent);
  }

  /** It will return list of active panel ids */
  public get activeIds(): string[] {
    return this.mailConfigurationsPresenter.activeIds;
  }

  /** getSlots */
  public getSlotss(tableProperty: TableProperty): void {
    this.getSlotsEmitter.emit(tableProperty);
  }
  /** deleteSlots */

  public deleteSlots(slots: Slots): void {
    this.deleteSlotsEmitter.emit(slots);
  }

  /** getReasonsNotDelivered */
  public getReasonsNotDelivereds(tableProperty: TableProperty): void {
    this.getReasonsNotDeliveredEmitter.emit(tableProperty);
  }

  /** emit slot status change to container */
  public toggleSlotStatus(slots: Slots): void {
    this.setSlotStatus.emit(slots);
  }

  /** deleteReasonsNotDelivered */
  public deleteReasonsNotDelivered(reasonsNotDelivered: Reasons): void {
    this.deleteReasonsNotDeliveredEmitter.emit(reasonsNotDelivered);
  }

  /** getReasonsNotPicked */
  public getReasonsNotPickeds(tableProperty: TableProperty): void {
    this.getReasonsNotPickedEmitter.emit(tableProperty);
  }

  /** deleteReasonsNotPicked */
  public deleteReasonsNotPicked(reasonsNotPicked: Reasons): void {
    this.deleteReasonsNotPickedEmitter.emit(reasonsNotPicked);
  }

  /** addSlots */
  public addSlots(slots: Slots): void {
    this.addSlotsEmitter.emit(slots);
  }

  /** updateSlots */
  public updateSlots(slots: Slots): void {
    this.updateSlotsEmitter.emit(slots);
  }

  /** addReasonsNotDelivered */
  public addReasonsNotDelivered(reasonsNotDelivered: Reasons): void {
    reasonsNotDelivered.reasonType = 1;
    this.addReasonsNotDeliveredEmitter.emit(reasonsNotDelivered);
  }

  /** updateReasonsNotDelivered */
  public updateReasonsNotDelivered(reasons: Reasons): void {
    reasons.reasonType = 1;
    this.updateReasonsNotDeliveredEmitter.emit(reasons);
  }

  /** addReasonsNotPicked */
  public addReasonsNotPicked(reasonsNotPicked: Reasons): void {
    reasonsNotPicked.reasonType = 2;
    this.addReasonsNotPickedEmitter.emit(reasonsNotPicked);
  }

  /** updateReasonsNotPicked */
  public updateReasonsNotPicked(reasons: Reasons): void {
    reasons.reasonType = 2;
    this.updateReasonsNotPickedEmitter.emit(reasons);
  }

  /**
   * This will set the panel type of the active panel and remove from other panels
   * @param id : This is the panel which we want to set as active
   * @param isCancel : This flag is optional, only used when user click on cancel button, then remove the primary type from active tab
   */
  private setPanelPrimaryType(id: string, isCancel?: boolean): void {
    this.accordionComponent = this.mailConfigurationsPresenter.setPanelPrimaryType(
      id,
      this.accordionComponent,
      isCancel
    );
  }

  /**
   * ngOnDestroy
   */
  // tslint:disable-next-line: member-ordering
  public ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }
}
