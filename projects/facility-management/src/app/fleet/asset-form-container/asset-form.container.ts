/**
 * @name AssetFormContainerComponent
 * @author Ronak Patel.
 * @description This is a container component for Asset. This is responsible for all data retrieving and posting to the server by http calls.
 */
import { Component } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { filter, switchMap, map } from 'rxjs/operators';
//--------------------------------------------------------------------//
import { TableProperty } from 'common-libs';
import { FleetService } from '../fleet.service';
import {
  Asset, AssetTicketStatus, AssetTicketResult,
} from '../fleet.model';
import { ClientMaster } from '../../core/model/common.model';
import { CoreDataService } from '../../core/services/core-data.service';
import { UserInfo } from '../../core/model/core.model';

@Component({
  selector: 'app-asset-form-container',
  templateUrl: './asset-form.container.html'
})
export class AssetFormContainerComponent {
  /** This is a observable which passes the Asset object to its child component */
  public asset$: Observable<Asset> = this.route.paramMap.pipe(
    filter((params: ParamMap) => params.has('id')),
    switchMap((params: ParamMap) => this.fleetService.getAssetById(params.get('id'))),
  );
  /** This is a observable which passes the Asset object to its child component */
  public fleetTickets$: Observable<AssetTicketResult> = this.route.paramMap.pipe(
    filter((params: ParamMap) => params.has('id')),
    switchMap((params: ParamMap) => {
      let tableProperty: TableProperty = new TableProperty();
      tableProperty.filter = { statusId: 0 };
      return this.fleetService.getFleetTickets(tableProperty, this.assetId);
    }),
  );
  /** This is a observable which passes the client data to its child component */
  public clients$: Observable<ClientMaster[]>
  public assetId: number;
  public ticketStatus$: Observable<AssetTicketStatus[]>;

  constructor(
    private fleetService: FleetService,
    private coreDataService: CoreDataService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.clients$ = this.coreDataService.userInfo$.pipe(
      map((data: UserInfo) => data.clients)
    );
    this.assetId = this.route.snapshot.params.id;
    this.ticketStatus$ = this.fleetService.getTicketStatus();
  }

  /** This Method is used to get data from server  */
  public getAssetTickets(tableProperty: TableProperty): void {
    this.fleetTickets$ = this.fleetService.getFleetTickets(tableProperty, this.assetId);
  }

  /** When presentation layer emits the save event, then this will post data on server */
  public addAsset(asset: Asset): void {
    this.fleetService.addAsset(asset).subscribe(
      () => {
        this.router.navigate(['./asset']);
      });
  }

  /** When presentation layer emits the save event, then this will post data on server */
  public updateAsset(asset: Asset): void {
    const id: string = this.route.snapshot.params.id;
    this.fleetService.updateAsset(id, asset).subscribe(
      () => {
        this.router.navigate(['./asset']);
      });
  }

}
