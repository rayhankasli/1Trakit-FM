

/**
 * @name CopyitOptionsFormContainerComponent
 * @author Ronak Patel.
 * @description This is a container component for CopyitConfigurations. This is responsible for all data retrieving and posting to the server by http calls.
 */
import { Component, HostBinding } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { takeUntil } from 'rxjs/operators';
import { forkJoin, Subject } from 'rxjs';
//--------------------------------------------------------------------//
import { CopyitConfigurationsService } from '../copyit-configurations.service';
import { CopyitOptions } from '../copyit-configurations.model';

/**
 * CopyitOptionsFormContainerComponent
 */
@Component({
  selector: 'app-copyit-options-form-container',
  templateUrl: './copyit-options-form.container.html'
})
export class CopyitOptionsFormContainerComponent {

  /** hostBinding */
  @HostBinding('class') public class: string = 'd-flex flex-grow-1 flex-column overflow-hidden';

  /** CopyIt Option */
  public copyitOption$: Observable<CopyitOptions>;
  /** CopyIt Master Data */
  public copyitMasterData$: Observable<CopyitOptions>;
  /** Client Id store */
  public clientId: string;
  /** This is a observable which passes the master data to its child component */
  public masterData$: Observable<{ copyitOption: CopyitOptions, copyitMasterData: CopyitOptions }>;

  /** This is a subject which set the master data */
  private masterData: Subject<{ copyitOption: CopyitOptions, copyitMasterData: CopyitOptions }>;
  /** call this on destroy */
  private destroy: Subject<void>;

  constructor(
    private copyitConfigurationsService: CopyitConfigurationsService,
    private route: ActivatedRoute
  ) {

    this.destroy = new Subject<void>();
    this.masterData = new Subject<{ copyitOption: CopyitOptions, copyitMasterData: CopyitOptions }>();
    this.masterData$ = this.masterData.asObservable();
    this.clientId = this.route.parent.snapshot.params.id;
    this.getMasterData();
  }


  /** When presentation layer emits the save event, then this will post data on server */
  public updateCopyitOptions(copyitOptions: CopyitOptions): void {
    this.copyitConfigurationsService.updateCopyitOptions(this.clientId, copyitOptions).subscribe(
      () => {
        this.getMasterData();
      },
      // tslint:disable-next-line: no-any
      (err: any) => {
      });
  }

  /** getMasterData */
  public getMasterData(): void {
    this.copyitOption$ = this.copyitConfigurationsService.getCopyitOptions(this.clientId);
    this.copyitMasterData$ = this.copyitConfigurationsService.getCopyitMasterData();
    // tslint:disable-next-line: deprecation
    forkJoin(this.copyitOption$, this.copyitMasterData$).pipe(takeUntil(this.destroy)).subscribe(
      ([copyitOption, copyitMasterData]: [CopyitOptions, CopyitOptions]) => {
        const masterData: { copyitOption: CopyitOptions, copyitMasterData: CopyitOptions } = {
          copyitOption,
          copyitMasterData
        };
        this.masterData.next(masterData);
      }
    )
  }

}
