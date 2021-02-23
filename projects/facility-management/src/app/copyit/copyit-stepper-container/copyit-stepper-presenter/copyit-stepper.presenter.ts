
/**
 * @name CopyItStepperPresenter
 * @author Enter Your Name Here.
 * @description
 */

import { ComponentFactoryResolver, ComponentRef, Injectable, OnDestroy, Type, ViewContainerRef } from '@angular/core';
import { AuthPolicyService } from 'auth-policy';
import { TabDirective, TabsetComponent } from 'ngx-bootstrap';
import { BehaviorSubject } from 'rxjs';
import { Observable } from 'rxjs/Observable';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';
//-------------------------------------------------------------------------------------------------//
import { PolicyRoles } from '../../../core/enums/role-permissions.enum';
import { ClientMaster } from '../../../core/model/common.model';
import { CopyItConfiguration, DefaultCopyItConfiguration } from '../../../shared/modules/copy-it-print-details/models/copyit-info';
import { CopyItInfo } from '../../../shared/modules/copy-it-print-details/models/copyit-info/copyit-info';
import { PrintDetailsFormPresentationComponent } from '../../../shared/modules/copy-it-print-details/print-details-form-presentation/print-details-form.presentation';
import { CopyItUserList } from '../../../shared/modules/copyit-shared/copyit-shared.model';
import { ShippingDetailsFormPresentationComponent } from '../../../shared/modules/shipping-details/shipping-details-form-presentation/shipping-details-form.presentation';
import { CopyitSharedService } from '../../copyit-shared.service';
import { Client, TabStepItem, UserDetails } from '../../copyit.model';
import { TabStepsHeading } from '../../models/copyit-constant';
import { RequestInformationDetailsFormPresentationComponent } from '../../shared/request-information-details-form-presentation/request-information-details-form.presentation';
import { SchedulingDetailsFormPresentationComponent } from '../../shared/scheduling-details-form-presentation/scheduling-details-form.presentation';
import { SummaryPresentationComponent } from '../copyit-stepper-presentation/summary-presentation/summary.presentation';

/**
 * CopyItStepperPresenter
 */
@Injectable()
export class CopyitStepperPresenter implements OnDestroy {

  /** Set the client list */
  public set client(clients: ClientMaster) {
    this._client = clients;
  }
  public get client(): ClientMaster {
    return this._client;
  }

  /** Client ID for gettting User and Configuration */
  public clientIdByClient$: Observable<number>;
  /** User ID for getting User Details */
  public userIdByUser$: Observable<number>;
  /** save$  of CopyitStepper presenter */
  public save$: Observable<any>;
  /** Store the printDetails FormGroup */
  public printDetailsFormGroup: any;
  /** Store the Requester Informationdata */
  public getRequestInformationdata: any
  /** Store the PrintDetail Informationadat */
  public getPrintDetailInformationadata: any;
  /** This is used for subscribing the value of Master Data */
  public sendMasterData$: Observable<any>;
  /** Store the Tab step */
  public tabStepObservable: BehaviorSubject<number> = new BehaviorSubject(4);
  /** It will store the copyit info */
  public copyItInfo: CopyItInfo;
  /** tabRoute of CopyitStepper presenter */
  public tabRoute: Map<number, string>;
  /** Determines checkSchedulingDetailForm or not */
  public checkSchedulingDetailForm: boolean;
  /** Store the copyIt Configuration */
  public copyItConfiguration: any;
  /** Store the copyIt Default Configuration */
  public defaultCopyItConfiguration: any;
  /** This is used for subscribing the value of Next Step */
  public setNextStep$: Observable<CopyItInfo>;

  /** Private Property */
  /** Store the Next Step */
  private setNextStep: Subject<CopyItInfo>;
  /** Store the Tab steps */
  private tabSteps: number = 4;
  /** Destroy of form presentation component */
  private destroy: Subject<void>;
  /** Store the Step 1 Data */
  private step1Destroy: Subject<void>;
  /** Store the Master Data */
  private sendMasterData: any;
  /** This is used for subscribing the value of Save Step Data */
  private saveStepData$: Observable<CopyItInfo>;
  /** Client ID for gettting User and Configuration */
  private clientIdByClient: Subject<number>;
  /** User ID for getting User Details */
  private userIdByUser: Subject<number>;
  /** Store Client List */
  private clients$: Observable<any>;
  /** Store Client List */
  private clients: Subject<any>;
  /** Store User List and Configuration */
  private usersListAndConfiguration$: Observable<any>;
  /** Store User List and Configuration */
  private usersListAndConfiguration: Subject<any>;
  /** Store User Details */
  private setUserDetails$: Observable<UserDetails>;
  /** Store User Details */
  private setUserDetails: Subject<UserDetails>
  /** save of CopyitStepper presenter */
  private save: Subject<any>;
  /** Store the Save Step Data */
  private saveStepData: Subject<CopyItInfo>;
  /** Store the Default CopyIt Configuration Value */
  private defaultConfigurationValue: DefaultCopyItConfiguration;
  /** Store the Client List */
  private clientList: Client[];
  /** Store the Client */
  private _client: ClientMaster;
  /** Store the Users List */
  private usersList: CopyItUserList[];
  /** Store the User Object */
  private usersDetailsObj: UserDetails;
  /** Store the  CopyIt Configuration */
  private configuration: CopyItConfiguration;
  /** Store the Default CopyIt Configuration */
  private defaultConfiguration: DefaultCopyItConfiguration;
  /** Determines isRequestor or not */
  private isRequestor: boolean;
  /** it will have the reference of current opened component ref */
  private componentRef:
    ComponentRef<RequestInformationDetailsFormPresentationComponent | SchedulingDetailsFormPresentationComponent |
      PrintDetailsFormPresentationComponent | ShippingDetailsFormPresentationComponent | SummaryPresentationComponent>;

  constructor(
    private factoryResolver: ComponentFactoryResolver,
    private copyitSharedService: CopyitSharedService,
    private policyService: AuthPolicyService
  ) {
    this.initProperty();
  }

  public ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
    this.step1Destroy.next();
    this.step1Destroy.complete();
  }

  /**
   * changeTab for dyanamically change the active tab
   * @param tabId : This is the tab id which we want to active
   * @param tabSet : This is the tabSet component
   */
  public changeTab(tabId: number, tabSet: TabsetComponent, container: ViewContainerRef): void {
    tabSet.tabs[tabId].active = true;
    tabSet.tabs[tabId].customClass = 'active';

    this.save.next({ name: 'Tab' + tabId });
    if (tabId > 0) {
      tabSet.tabs[tabId - 1].customClass = 'success';
    }
    this.createComponent(tabId, container);
  }

  /** Creates component */
  public createComponent(tabIndex: number, container: ViewContainerRef): void {
    if (this.componentRef) {
      this.componentRef.destroy();
    }
    if (container) {
      container.clear();
    }

    switch (tabIndex) {
      case 0:
        this.componentRef = this.createFirstStep(container);
        break;

      case 1:
        this.componentRef = this.createSecondStep(container);
        break;

      case 2:
        this.componentRef = this.createThirdStep(container);
        break;

      case 3:
        this.componentRef = this.tabSteps === 4 ? this.createFourthStep(container) : this.createFifthStep(container);
        break;

      case 4:
        this.componentRef = this.createFifthStep(container);
        break;
      default:
        break;
    }

    /** Subscribe Request Information Form data from RequestInformationDetailsFormPresentationComponent */
    this.componentRef.instance.saveCopyItInfo.pipe(takeUntil(this.destroy)).subscribe((response: any) => {
      this.copyItInfo = response;
      this.setNextStep.next(this.copyItInfo);
    });
  }

  /** Set the client list */
  public setClientsList(clients: Client[]): void {
    this.clientList = clients;
    this.clients.next(clients);
  }


  /**
   * User List and Configuration
   * @param usresList 
   */
  public setUsersListAndConfiguration(usersListAndConfiguration: any): void {
    this.usersList = usersListAndConfiguration.usersList;
    this.defaultConfiguration = usersListAndConfiguration.defaultConfigurations;
    this.configuration = usersListAndConfiguration.configurations;
    this.tabSteps = this.copyitSharedService.isEnableShipping(usersListAndConfiguration.configurations.requestorSections) ? 4 : 3;
    this.tabStepObservable.next(this.tabSteps);
    this.usersListAndConfiguration.next(usersListAndConfiguration);
  }

  /**
   * Get user details
   * @param userDetails 
   */
  public setUserDetail(userDetails: UserDetails): void {
    this.usersDetailsObj = userDetails;
    this.setUserDetails.next(userDetails);
  }

  /** GEt tab set data items */
  public getTabStepsDataItems(): TabStepItem[] {
    let tabSetItems: TabStepItem[];
    tabSetItems = [
      { id: 1, heading: TabStepsHeading.REQUEST_INFORMATION_DETAILS, disabled: true },
      { id: 2, heading: TabStepsHeading.SCHEDULING_DETAILS, disabled: true },
      { id: 3, heading: TabStepsHeading.PRINT_DETAILS, disabled: true },
      { id: 4, heading: (this.tabSteps === 3) ? TabStepsHeading.SUMMARY : TabStepsHeading.SHIPPING_DETAILS, disabled: true },
      { id: 5, heading: TabStepsHeading.SUMMARY, disabled: true }
    ];
    (this.tabSteps === 3) && tabSetItems.splice(4, 5);
    return tabSetItems;
  }

  /**
   * onNext for dynamically change the active tab
   * @param tabId : This is the tab id which we want to active
   */
  public onNext(): void {
    // this.nextStep.next(Date.now());
    this.componentRef.instance.isNext = (Date.now());
  }

  /**
   * Creates dynamic component
   * @template T
   * @param container
   * @param component
   */
  private createDynamicComponent<T>(container: ViewContainerRef, component: Type<T>): ComponentRef<T> {
    return container.createComponent(this.factoryResolver.resolveComponentFactory(component));;
  }

  /** to-do */
  private initProperty(): void {
    /** Public Observable and private Subject for Request Information stepper */
    this.clientIdByClient = new Subject();
    this.userIdByUser = new Subject();
    this.clientIdByClient$ = this.clientIdByClient.asObservable();
    this.userIdByUser$ = this.userIdByUser.asObservable();

    /** Public Observable and private Subject for store data for Request Information stepper */
    this.clients = new Subject<any[]>();
    this.usersListAndConfiguration = new Subject();
    this.setUserDetails = new Subject();
    this.clients$ = this.clients.asObservable();
    this.usersListAndConfiguration$ = this.usersListAndConfiguration.asObservable();
    this.setUserDetails$ = this.setUserDetails.asObservable();
    this.destroy = new Subject();
    this.step1Destroy = new Subject();
    this.sendMasterData = new BehaviorSubject(null);
    this.sendMasterData$ = this.sendMasterData.asObservable();
    this.save = new Subject();
    this.save$ = this.save.asObservable();
    this.saveStepData = new Subject<CopyItInfo>();
    this.saveStepData$ = this.saveStepData.asObservable();
    this.setNextStep = new Subject<CopyItInfo>();
    this.setNextStep$ = this.setNextStep.asObservable();
    this.isRequestor = this.policyService.isInRole(PolicyRoles.requestor);
  }

  /**
   * Create first step component
   * @param container 
   * @param component 
   */
  private createFirstStep(container: ViewContainerRef): ComponentRef<RequestInformationDetailsFormPresentationComponent> {
    this.step1Destroy.next();
    const componentRef: ComponentRef<RequestInformationDetailsFormPresentationComponent>
      = this.createDynamicComponent(container, RequestInformationDetailsFormPresentationComponent);
    componentRef.instance.clients = this.clientList;
    componentRef.instance.usersList = this.usersList;
    componentRef.instance.client = this.client;
    componentRef.instance.configurations = this.configuration;
    componentRef.instance.defaultConfigurations = this.defaultConfiguration;
    this.defaultConfigurationValue = this.defaultConfiguration;
    // componentRef.instance.defaultConfigurations = this.defaultConfiguration;
    componentRef.instance.userDetails = this.usersDetailsObj;
    componentRef.instance.copyItInfo = this.copyItInfo;

    this.firstStepSubscriptions(componentRef);

    return componentRef;
  }

  /**
   * First Step Subscriptions
   * @param componentRef 
   */
  private firstStepSubscriptions(componentRef: any): void {
    /** Get Client List */
    this.clients$.pipe(takeUntil(this.destroy), takeUntil(this.step1Destroy)).subscribe(
      (clients: Client[]) => {
        componentRef.instance.clients = clients;
      });
    /** Subscribe of Client ID for get User List and Configuration */
    componentRef.instance.clientId.pipe(takeUntil(this.destroy), takeUntil(this.step1Destroy)).subscribe((id: number) => {
      this.clientIdByClient.next(id);
      const client: Client = this.clientList.find((client: Client) => client.clientId === id);
      if (client) {
        this.client = new ClientMaster({});
        this.client.client = client.companyName;
        this.client.clientId = client.clientId;
        this.client.accountNumber = client.accountNumber;
        this.client.tenants = client.tenants;
      }
    });
    /** Passed the User List and Configuration to RequestInformationDetailsFormPresentationComponent  */
    this.usersListAndConfiguration$.pipe(takeUntil(this.destroy), takeUntil(this.step1Destroy)).subscribe(
      (usersListAndConfiguration: any) => {
        componentRef.instance.configurations = usersListAndConfiguration.configurations;
        componentRef.instance.usersList = usersListAndConfiguration.usersList;
        componentRef.instance.defaultConfigurations = usersListAndConfiguration.defaultConfigurations;
        this.defaultConfigurationValue = usersListAndConfiguration.defaultConfigurations;
      });
    /** Subscribe of User ID for get User Details  */
    componentRef.instance.userId.pipe(takeUntil(this.destroy), takeUntil(this.step1Destroy)).subscribe((id: number) => {
      this.userIdByUser.next(id);
    });
    /** Passed User Details to request information stepper */
    this.setUserDetails$.pipe(takeUntil(this.destroy), takeUntil(this.step1Destroy)).subscribe(
      (userDetails: UserDetails) => {
        componentRef.instance.userDetails = userDetails;
      });
  }

  /**
   * create first step component
   * @param container 
   * @param component 
   */
  private createSecondStep(container: ViewContainerRef): ComponentRef<SchedulingDetailsFormPresentationComponent> {

    const componentRef: ComponentRef<SchedulingDetailsFormPresentationComponent>
      = this.createDynamicComponent(container, SchedulingDetailsFormPresentationComponent);
    componentRef.instance.defaultConfigurations = this.defaultConfigurationValue;
    componentRef.instance.copyItInfo = this.copyItInfo;
    return componentRef;
  }

  /**
   * it will create component for step 3
   * @param container 
   */
  private createThirdStep(container: ViewContainerRef): ComponentRef<PrintDetailsFormPresentationComponent> {
    const componentRef: ComponentRef<PrintDetailsFormPresentationComponent> =
      this.createDynamicComponent(container, PrintDetailsFormPresentationComponent);
    componentRef.instance.copyItConfiguration = this.configuration;
    componentRef.instance.defaultCopyItConfiguration = this.defaultConfiguration;
    componentRef.instance.copyItInfo = this.copyItInfo;
    // Requestor: disable user for adding quantity for all except Envelop
    // if (this.isRequestor) {
    //   componentRef.instance.hideQuantity = true;
    // }
    return componentRef;
  }

  /**
   * it will create component for step 4
   * @param container 
   */
  private createFourthStep(container: ViewContainerRef): ComponentRef<ShippingDetailsFormPresentationComponent> {
    const componentRef: ComponentRef<ShippingDetailsFormPresentationComponent> =
      this.createDynamicComponent(container, ShippingDetailsFormPresentationComponent);
    componentRef.instance.copyItConfigurations = this.configuration;
    componentRef.instance.defaultConfigurations = this.defaultConfiguration;
    componentRef.instance.copyItInfo = this.copyItInfo;
    return componentRef;
  }

  /**
   * it will create component for step 4
   * @param container 
   */
  private createFifthStep(container: ViewContainerRef): ComponentRef<SummaryPresentationComponent> {
    const componentRef: ComponentRef<SummaryPresentationComponent> =
      this.createDynamicComponent(container, SummaryPresentationComponent);
    componentRef.instance.copyItInfo = this.copyItInfo;
    componentRef.instance.configuration = this.configuration;
    componentRef.instance.enableShipping = this.copyitSharedService.isEnableShipping(this.configuration.requestorSections);
    componentRef.instance.enableEnvelop = this.copyitSharedService.isEnableEnvelop(this.configuration.requestorSections);
    return componentRef;
  }
}

