import { Component, HostBinding, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
// ------------------------------------------------------------- //
import { FacilitiesAssistantsService } from '../facilities-assistants.service';
import { FacilitiesAssistants } from '../facilities-assistants.model';
import { CoreDataService } from '../../../../core/services/core-data.service';
import { UserInfo } from '../../../../core/model/core.model';
import { ClientMaster } from '../../../../core/model/common.model';

/** Component for container */
@Component({
  selector: 'app-facilities-assistants-container',
  templateUrl: './facilities-assistants.container.html'
})
export class FacilitiesAssistantsContainerComponent implements OnDestroy {

  /** hostBinding */
  @HostBinding('class') public class: string = 'd-flex flex-grow-1 overflow-hidden';

  public facilitiesAssistantsList$: Observable<FacilitiesAssistants[]>;

  public clientMaster$: Observable<ClientMaster>;

  /** destroy */
  private destroy: Subject<void>;
  constructor(
    private fcilitiesAssistantsService: FacilitiesAssistantsService,
    private coreDataService: CoreDataService,
  ) {
    this.destroy = new Subject();
  }

  /** ngOnDestroy for destroy component */
  public ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }

  /** getListById for get list by client id */
  public getListById(clientId: number): void {
    this.setDefaultClient();
    this.facilitiesAssistantsList$ = this.fcilitiesAssistantsService.getFacilitiesAssistants(clientId);
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