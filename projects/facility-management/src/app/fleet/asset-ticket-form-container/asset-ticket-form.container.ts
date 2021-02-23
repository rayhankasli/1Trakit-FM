/**
 * @name AssetTicketContainerComponent
 * @author Ronak Patel.
 * @description This is a container component for AssetTicket. This is responsible for all data retrieving and posting to the server by http calls.
 */
import { Component, HostBinding } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { takeUntil } from 'rxjs/operators';
//--------------------------------------------------------------------//
import { FleetService } from '../fleet.service';
import {
  AssetTicketCategory, AssetTicketStatus, AssetPriority, MasterDataTicket, AssetTicket,
} from '../fleet.model';
import { Subject, forkJoin } from 'rxjs';

@Component({
  selector: 'app-asset-ticket-form-container',
  templateUrl: './asset-ticket-form.container.html'
})
export class AssetTicketFormContainerComponent {
  /** hostBinding */
  @HostBinding('class') public class: string = 'd-flex h-100 overflow-hidden';

  /** This is a observable which passes the list of assetTicket to its child component */
  public assetTickets$: Observable<AssetTicket[]>;
  /** This is a observable which passes the AssetTicket object to its child component */
  public assetTicket$: Observable<AssetTicket>;
  public TicketCategory$: Observable<AssetTicketCategory[]>;
  public TicketStatus$: Observable<AssetTicketStatus[]>;
  public Priority$: Observable<AssetPriority[]>;
  /** This is a observable which passes the master data to its child component */
  public masterData$: Observable<MasterDataTicket>;
  public assetId: number;
  public ticketId: number;
  /** This is a subject which set the master data */
  private masterData: Subject<MasterDataTicket>;
  private destroy: Subject<void>;

  constructor(
    private fleetService: FleetService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.masterData = new Subject();
    this.masterData$ = this.masterData.asObservable();
    this.destroy = new Subject();
    this.getMasterDate()
    this.assetId = this.route.parent.snapshot.params.id;
    this.ticketId = this.route.snapshot.params.ticketId;
    if (this.ticketId) {
      this.assetTicket$ = this.fleetService.getAssetTicketById(this.ticketId);
    }
  }

  /** When presentation layer emits the save event, then this will post data on server */
  public addAssetTicket(assetTicket: AssetTicket): void {
    this.fleetService.addAssetTicket(assetTicket, this.assetId).subscribe(
      () => {
        this.router.navigate(['../../'], { relativeTo: this.route });
      });
  }

  /** When presentation layer emits the save event, then this will post data on server */
  public updateAssetTicket(assetTicket: AssetTicket): void {
    this.fleetService.updateAssetTicket(this.ticketId, assetTicket).subscribe(
      () => {
        this.router.navigate(['../../'], { relativeTo: this.route });
      });
  }

  /** getMasterDate */
  private getMasterDate(): void {
    this.TicketCategory$ = this.fleetService.getTicketCategory();
    this.TicketStatus$ = this.fleetService.getTicketStatus();
    this.Priority$ = this.fleetService.getPriority();

    // tslint:disable-next-line: deprecation
    forkJoin(this.TicketCategory$, this.TicketStatus$, this.Priority$).pipe(takeUntil(this.destroy)).subscribe(
      ([ticketCategory, ticketStatus, priority]: [AssetTicketCategory[], AssetTicketStatus[], AssetPriority[]]) => {
        const masterData: MasterDataTicket = {
          ticketCategory,
          ticketStatus,
          priority
        };
        this.masterData.next(masterData);
      });
  }

}
