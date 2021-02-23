

/**
 * @name CopyitDefaultValuesFormContainerComponent
 * @author Ronak Patel.
 * @description This is a container component for CopyitConfigurations. This is responsible for all data retrieving and posting to the server by http calls.
 */
import { Component, HostBinding, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { map, takeUntil } from 'rxjs/operators';
import { forkJoin, Subject } from 'rxjs';
//--------------------------------------------------------------------//
import { CopyitConfigurationsService } from '../copyit-configurations.service';
import { CopyitDefaultValues } from '../copyit-configurations.model';
import { CopyItSharedConfigurationService } from '../../shared/modules/copy-it-print-details/copyit-shared-configuration.service';


/**
 * CopyitDefaultValuesFormContainerComponent
 */
@Component({
  selector: 'app-copyit-default-values-form-container',
  templateUrl: './copyit-default-values-form.container.html'
})
export class CopyitDefaultValuesFormContainerComponent implements OnInit {

  /** hostBinding */
  @HostBinding('class') public class: string = 'd-flex flex-grow-1 flex-column overflow-hidden';
  
  /** To-Do */
  public baseResponse$: Observable<any>;
  /** observable for user details */
  public userDetails$: Observable<any>;
  
  /** call this on destroy */
  private destroy: Subject<void>;
  /** it will store the client id */
  private clientId: number;

  constructor(
    private copyitConfigurationsService: CopyitConfigurationsService,
    private copyitSharedConfigService: CopyItSharedConfigurationService,
    private route: ActivatedRoute
  ) {
    this.destroy = new Subject<void>();
  }

  public ngOnInit(): void {
    this.clientId = this.route.parent.snapshot.params.id;
    if (this.clientId) {
      this.getConfigurationByClient(this.clientId);
    }
  }

  /** it will call the save method of service */
  public saveDefaultConfigurations(copyitDefaultValues: CopyitDefaultValues): void {
    this.copyitConfigurationsService.saveDefaultConfigurations(this.clientId, copyitDefaultValues).pipe(
      takeUntil(this.destroy)
    ).subscribe(
      () => {
      });
  }

  /** get user detail by user d */
  public getUserDetailByUserId(userId: number): void {
    this.userDetails$ = this.copyitSharedConfigService.getUserDetailByUserId(userId);
  }

  /** To-Do */
  private getConfigurationByClient(id: number): void {
    this.baseResponse$ = forkJoin([
      this.copyitSharedConfigService.getUserList(id),
      this.copyitSharedConfigService.getConfigurations(id),
      this.copyitSharedConfigService.getDefaultConfigurations(id)
    ]).pipe(map((response: object) => {
      return {
        userList: response[0],
        configurations: response[1],
        defaultConfigurations: response[2]
      };
    }));
  }


}
