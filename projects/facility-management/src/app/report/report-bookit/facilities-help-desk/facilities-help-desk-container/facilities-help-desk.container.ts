import { Component, HostBinding, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
// ---------------------------------------------------- //
import { ClientMaster } from '../../../../core/model/common.model';
import { UserInfo } from '../../../../core/model/core.model';
import { CoreDataService } from '../../../../core/services/core-data.service';
import { FacilitiesHelpDeskService } from '../facilities-help-desk.service';
import { FacilitiesHelpDesk } from '../facilities-help-desk.model';

/** Component for container */
@Component({
  selector: 'app-facilities-help-desk-container',
  templateUrl: './facilities-help-desk.container.html'
})
export class FacilitiesHelpDeskContainerComponent implements OnDestroy {

  /** hostBinding */
  @HostBinding('class') public class: string = 'd-flex flex-grow-1 overflow-hidden';

  /** FACILITIES HELP DESK LIST */
  public facilitiesHelpDeskList$: Observable<FacilitiesHelpDesk[]>;

  /** Get Client List */
  public clientMaster$: Observable<ClientMaster>;

  /** destroy */
  private destroy: Subject<void>;

  constructor(
    private facilitiesHelpDeskService: FacilitiesHelpDeskService,
    private coreDataService: CoreDataService,
  ) {
    this.destroy = new Subject();
  }

  /** On Destroy component */
  public ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }


  /** Get facilitiesHelpDeskList by client Id */
  public getListById(clientId: number): void {
    this.setDefaultClient();
    this.facilitiesHelpDeskList$ = this.facilitiesHelpDeskService.getFacilitiesHelpDeskList(clientId);
  }

  /** select default client from core data */
  private setDefaultClient(): void {
    this.clientMaster$ = this.coreDataService.globalClientId$.pipe(
      switchMap((clientId: number) => {
        return this.coreDataService.userInfo$.pipe(
          map((data: UserInfo) => data.clients && data.clients.find(c => c.clientId === clientId)),
        )
      }));
  }

}