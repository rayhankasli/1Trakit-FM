/**
 * @name CopyitStepperContainerComponent
 * @author Ashok Yadav.
 * @description This is a container component for CopyitStepper. This is responsible for all data retrieving and posting to the server by http calls.
 */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthPolicyService } from 'auth-policy';
//--------------------------------------------------------------------//
import { ToastrServiceProvider } from 'common-libs';
import { forkJoin, of, Subject } from 'rxjs';
import { Observable } from 'rxjs/Observable';
import { map, switchMap, takeUntil, tap } from 'rxjs/operators';
//--------------------------------------------------------------------//
import { PolicyRoles } from '../../core/enums/role-permissions.enum';
import { ClientMaster } from '../../core/model/common.model';
import { UserInfo } from '../../core/model/core.model';
import { CoreDataService } from '../../core/services/core-data.service';
import { CopyItSharedConfigurationService } from '../../shared/modules/copy-it-print-details/copyit-shared-configuration.service';
import { CopyItInfo } from '../../shared/modules/copy-it-print-details/models/copyit-info/copyit-info';
import { Client, UserDetails } from '../copyit.model';
import { CopyitService } from '../copyit.service';

/**
 * CopyItStepperContainerComponent
 */
@Component({
  selector: 'app-copyit-stepper-container',
  templateUrl: './copyit-stepper.container.html'
})
export class CopyItStepperContainerComponent implements OnInit, OnDestroy {

  /** List of Client */
  public clientsList$: Observable<Client[]>;
  /** List of Client */
  public clientMaster$: Observable<ClientMaster>;
  /** To-Do */
  public usersListAndConfiguration$: Observable<any>;
  /** To-Do */
  public userDetails$: Observable<UserDetails>;
  /** To-Do */
  public userRole$: Observable<UserDetails>;

  /** Destroy */
  private destroy: Subject<void>;

  /** to check user-role is requestor */
  private isRequestor: boolean;

  constructor(
    private copyitService: CopyitService,
    private copyitConfigService: CopyItSharedConfigurationService,
    private authPolicy: AuthPolicyService,
    private coreDataService: CoreDataService,
    private router: Router,
    private route: ActivatedRoute,
    private toast: ToastrServiceProvider,
  ) {
    this.destroy = new Subject<void>();
    this.isRequestor = this.authPolicy.isInRole(PolicyRoles.requestor);
  }

  public ngOnInit(): void {
    const isSuperUSer: boolean = this.authPolicy.isInRole(PolicyRoles.superUser);
    if (!isSuperUSer) {
      this.clientMaster$ = this.coreDataService.userInfo$.pipe(
        map((data: UserInfo) => data.clients && data.clients[0]),
        tap((item) => this.usersListAndConfigurationByClient(item.clientId))
      );
    } else {
      this.setDefaultClient();
    }
    this.getClients();
  }

  public ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }

  /** This method is invoke when client get */
  public getClients(): void {
    this.clientsList$ = this.copyitService.getClients();
  }

  /** Invoke when user save the data */
  public saveData(copyItInfo: CopyItInfo): void {
    this.copyitService.addStepperFormData(copyItInfo).pipe(takeUntil(this.destroy)).subscribe(
      (copyitId: string) => {
        this.toast.success('Copy It Added Successfully.')
        this.navigateToEdit(copyitId);
      }
    );
  }

  /** Get user list and Configuration by Client */
  public usersListAndConfigurationByClient(id: number): void {
    this.usersListAndConfiguration$ = forkJoin([
      !this.isRequestor ? this.copyitService.getUsersListByClient(id) : of([]),
      this.copyitConfigService.getCopyItConfigurations(id),
      !this.isRequestor ? this.copyitConfigService.getDefaultConfigurations(id) : of(null)
    ]).pipe(map((response: object) => {
      return {
        usersList: response[0],
        configurations: response[1],
        defaultConfigurations: response[2]
      };
    }));
  }

  /** Get User Details */
  public userDetailsByUser(id: number): void {
    setTimeout(() => {
      this.userDetails$ = this.copyitService.getUserDetails(id);
    }, 100);
  }

  /** navigate to edit request */
  private navigateToEdit(id: string): void {
    this.router.navigate(['../', id], { relativeTo: this.route });
  }

  /** select default client from core data */
  private setDefaultClient(): void {
    this.clientMaster$ = this.coreDataService.globalClientId$.pipe(
      switchMap((clientId: number) => {
        return this.coreDataService.userInfo$.pipe(
          map((data: UserInfo) => data.clients && data.clients.find((c) => c.clientId === clientId)),
          tap((item: ClientMaster) => item && this.usersListAndConfigurationByClient(item.clientId))
        )
      })
    )
  }
}
