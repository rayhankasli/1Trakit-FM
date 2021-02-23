/**
 * @name MailConfigurationsContainerComponent
 * @author Rayhan Kasli
 * @description This is a container component for MailConfigurations.
 * This is responsible for all data retrieving and posting to the server by http calls.
 */

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { takeUntil } from 'rxjs/operators';
//--------------------------------------------------------------------//
import { TableProperty } from 'common-libs';
import { MailConfigurationsService } from '../mail-configurations.service';
import {
  Slots,
  SlotsResponse,
  MasterData, SlotFilterRequest
} from '../mail-configurations.model';
import { Reasons, ReasonsResponse } from '../../shared/components/reasons/reasons.model';
import { WeekDays, OfficeMaster } from '../../core/model/common.model';
import { CommonHttpService } from '../../core/services/common-http.service';
import { Subject, forkJoin } from 'rxjs';

/**
 * MailConfigurationsContainerComponent
 */
@Component({
  selector: 'app-mail-configurations-container',
  templateUrl: './mail-configurations.container.html',
})
export class MailConfigurationsContainerComponent implements OnInit {
  /** This is a observable which passes the list of slots to its child component */
  public slotss$: Observable<SlotsResponse>;

  /** Office list$ of mail configurations container component */
  public officeList$: Observable<OfficeMaster[]>;

  /** Office list$ of mail configurations container component */
  public reasonsList$: Observable<ReasonsResponse>;

  /** Office list$ of mail configurations container component */
  public weekDays$: Observable<WeekDays[]>;

  /** Determines whether Slots deleted   */
  public isSlotsDeleted: boolean;

  /** Determines whether Slots deleted   */
  public clientId: number;

  /** Determines whether ReasonsNotPicked deleted   */
  public isReasonsDeleted: boolean;

  /** This is a observable which passes the master data to its child component */
  public masterData$: Observable<MasterData>;

  /** This is a subject which set the master data */
  private masterData: Subject<MasterData>;

  /** call this on destroy */
  private destroy: Subject<void>;

  private tablePropertyObject: boolean;

  constructor(
    private mailConfigurationsService: MailConfigurationsService,
    private route: ActivatedRoute,
    private commonHttpService: CommonHttpService
  ) {
    this.masterData = new Subject<MasterData>();
    this.masterData$ = this.masterData.asObservable();
    this.destroy = new Subject<void>();
  }

  public ngOnInit(): void {
    this.clientId = parseInt(this.route.snapshot.paramMap.get('id'));
    this.initProperty();
  }
  /** This Method is used to get data from server  */
  public getSlotss(tableProperty?: TableProperty<SlotFilterRequest>): void {
    if(!!tableProperty){
      this.tablePropertyObject = tableProperty.filter.isActive;
    }
    this.slotss$ = this.mailConfigurationsService.getSlots(this.tablePropertyObject, this.clientId);
  }

  /** When presentation layer emits the save event, then this will post data on server */
  public addSlots(slots: Slots): void {
    this.mailConfigurationsService.addSlots(slots, this.clientId).subscribe(
      (response: any) => {
        this.getSlotss();
      },
      // tslint:disable-next-line: no-any
      (err: any) => { }
    );
  }

  /** When presentation layer emits the save event, then this will post data on server */
  public updateSlots(slots: Slots): void {
    const id: number = slots.slotId;
    this.mailConfigurationsService.updateSlots(id, slots, this.clientId).subscribe(
      (response: any) => {
        this.getSlotss();
      },
      // tslint:disable-next-line: no-any
      (err: any) => { }
    );
  }

  /** This Method is delete data from server  */
  public deleteSlots(slots: Slots): void {
    this.mailConfigurationsService.deleteSlots(slots).subscribe((response: any) => {
      this.isSlotsDeleted = true;
      this.getSlotss();
    });
  }

  /** set slot status */
  public setSlotStatus(slots: Slots): void {
    this.mailConfigurationsService.setSlotStatus(slots).subscribe((response: any) => {
      this.getSlotss();
    })
  }
  /** Gets assigner list */
  public getReasonsList(): void {
    this.reasonsList$ = this.mailConfigurationsService.getReasons(new TableProperty(), this.clientId);
  }

  /** When presentation layer emits the save event, then this will post data on server */
  public addReasons(
    reasonsNotDelivered: Reasons
  ): void {
    this.mailConfigurationsService
      .addReasons(reasonsNotDelivered, this.clientId)
      .subscribe(
        (response: any) => {
          this.getReasonsList();
        },
        // tslint:disable-next-line: no-any
        (err: any) => { }
      );
  }

  /** When presentation layer emits the save event, then this will post data on server */
  public updateReasons(
    reasons: Reasons
  ): void {
    const id: number = reasons.reasonId;
    this.mailConfigurationsService
      .updateReasons(id, reasons, this.clientId)
      .subscribe(
        (response: any) => {
          this.getReasonsList();
        },
        // tslint:disable-next-line: no-any
        (err: any) => { }
      );
  }

  /** This Method is delete data from server  */
  public deleteReasons(
    reasons: Reasons
  ): void {
    this.mailConfigurationsService
      .deleteReasons(reasons, this.clientId)
      .subscribe((response: any) => {
        this.isReasonsDeleted = true;
        this.getReasonsList();
      });
  }

  /** GetMasters data */
  public getMasterData(): void {
    this.officeList$ = this.commonHttpService.getOffices(this.clientId);
    this.weekDays$ = this.commonHttpService.getWeekDays(this.clientId);
    // tslint:disable-next-line: deprecation
    forkJoin(this.officeList$, this.weekDays$).pipe(takeUntil(this.destroy)).subscribe(
      ([offices, weekDays]: [OfficeMaster[], WeekDays[]]) => {
        const masterData: MasterData = {
          offices,
          weekDays
        };
        this.masterData.next(masterData);
      }
    )
  }

  /**
   * Inits property
   */
  private initProperty(): void {
    //this.getSlotss();
    this.getReasonsList();
    this.getMasterData();
  }
}
