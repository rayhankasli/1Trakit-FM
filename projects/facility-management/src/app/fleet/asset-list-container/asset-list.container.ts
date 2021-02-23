/**
 * @name AssetListContainerComponent
 * @author Ronak Patel.
 * @description This is a container component for Asset list. This is responsible for all data retrieving and posting to the server by http calls.
 */

import { Component, HostBinding, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { map, take } from 'rxjs/operators';
//--------------------------------------------------------------------//
import { TableProperty } from 'common-libs';
import { FleetService } from '../fleet.service';
import { AssetList, AssetResult } from '../fleet.model';
import { ClientMaster } from '../../core/model/common.model';
import { CommonHttpService } from '../../core/services/common-http.service';
import { CoreDataService } from '../../core/services/core-data.service';
import { UserInfo } from '../../core/model/core.model';

/**
 * AssetListContainerComponent
 */
@Component({
  selector: 'app-asset-list-container',
  templateUrl: './asset-list.container.html'
})
export class AssetListContainerComponent implements OnInit {

  @HostBinding('class') public class: string;
  /** This is a observable which passes the list of asset to its child component */
  public assets$: Observable<AssetResult>;
  /** This is a observable which passes the client data to its child component */
  public clients$: Observable<ClientMaster[]>
  public tableProperty: TableProperty = new TableProperty();

  constructor(
    private assetService: FleetService,
    private commonHttpService: CommonHttpService,
    private coreDataService: CoreDataService,
  ) {
    this.tableProperty.filter = { clientId: 0 };
    this.class = 'flex-grow-1 h-100 overflow-hidden';
  }

  /** ngOnInit */
  public ngOnInit(): void {
    this.getMasterData();
  }

  /** This Method is used to get data from server  */
  public getAssets(tableProperty: TableProperty): void {
    this.tableProperty = tableProperty;
    this.assets$ = this.assetService.getAssets(tableProperty);
  }

  /** This Method is delete data from server  */
  public deleteAsset(asset: AssetList): void {
    this.assetService.deleteAsset(asset).subscribe(() => {
      this.getAssets(this.tableProperty);
    });
  }

  /**
   * toggle asset status to Active/Inactive
   * @param flag next status to set
   * @param assetId assetId of which status will be fliped
   */
  public setAssetStatus({ statusValue, assetId }): void {
    this.assetService.toggleAssetStatus(statusValue, assetId).pipe(take(1)).subscribe(() => {
      this.getAssets(this.tableProperty);
    })
  }
  /** it will used to call master data api for user form */
  private getMasterData(): void {
    this.clients$ = this.coreDataService.userInfo$.pipe(
      map((data: UserInfo) => data.clients)
    );
  }

}