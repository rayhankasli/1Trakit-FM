/**
 * @name CopyitStepperPresentationComponent
 * @author Enter Your Name Here.
 * @description
 */

import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild, ViewContainerRef } from '@angular/core';
import { TabsetComponent } from 'ngx-bootstrap';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';
//------------------------------------------------------------//
import { BasePresentation } from '../../../core/base-classes/base.presentation';
import { ClientMaster } from '../../../core/model/common.model';
import { CopyItInfo } from '../../../shared/modules/copy-it-print-details/models/copyit-info/copyit-info';
import { Client, TabStepItem, UserDetails } from '../../copyit.model';
import { CopyitStepperPresenter } from '../copyit-stepper-presenter/copyit-stepper.presenter';

/**
 * CopyitStepperPresentationComponent
 */
@Component({
  selector: 'app-copyit-stepper-ui',
  templateUrl: './copyit-stepper.presentation.html',
  viewProviders: [CopyitStepperPresenter],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CopyitStepperPresentationComponent extends BasePresentation implements OnInit, OnDestroy {

  /** Client List */
  @Input() public set clientsList(value: Client[]) {
    if (value) {
      this._clientsList = value;
      // this.copyitStepperPresenter.componentRef.instance[this.getCompInstanceInputName()] = value;
      this.copyitStepperPresenter.setClientsList(this._clientsList);
    }

  }

  public get clientsList(): Client[] {
    return this._clientsList;
  }

  /** Client List */
  @Input() public set clientMaster(value: ClientMaster) {
    if (value) {
      this.copyitStepperPresenter.client = value;
    }
  }

  public get clientMaster(): ClientMaster {
    return this.copyitStepperPresenter.client;
  }

  /** Get User list */
  @Input() public set usersListAndConfiguration(value: any) {
    if (value) {
      this._usersListAndConfiguration = value;
      this.copyitStepperPresenter.setUsersListAndConfiguration(this._usersListAndConfiguration);
      this.tabStepsItems = this.copyitStepperPresenter.getTabStepsDataItems();
    }
  }

  public get usersListAndConfiguration(): any {
    return this._usersListAndConfiguration;
  }

  /** User Details */
  @Input() public set userDetails(value: UserDetails) {
    if (value) {
      this._userDetails = value;
      this.copyitStepperPresenter.setUserDetail(this._userDetails);
    }
  }

  public get userDetails(): UserDetails {
    return this._userDetails;
  }

  /** Save the CopyIt Data */
  @Output() public saveData: EventEmitter<CopyItInfo>;
  /** Get List and Configuration by Client */
  @Output() public usersListAndConfigurationByClient: EventEmitter<number>;
  /** Get user details by user */
  @Output() public userDetailsByUser: EventEmitter<number>;

  /** This is a tab component which stores the list of tab */
  @ViewChild('tabSet', { static: false }) public tabSet: TabsetComponent;
  /** This is a container ref which renders child components dynamically */
  @ViewChild('containerRef', { read: ViewContainerRef, static: true }) public containerRef: ViewContainerRef;

  /** Store tab set value */
  public tabSetValue: boolean = false;
  /** Store current tab index */
  public currentIndex: number;
  /** Store the tab steps Items */
  public tabStepsItems: TabStepItem[] = [];
  /** tabIndex of CopyitStepper presentation component  */
  public tabIndex: number;
  /** Store the tab step */
  public tabStep: number;

  /** destroy  of CopyitStepper presentation component  */
  private destroy: Subject<void>;
  /** Client list */
  private _clientsList: Client[];
  /** Usre List and Configuration */
  private _usersListAndConfiguration: any;
  /** Store the user details */
  private _userDetails: UserDetails;
  /** Store the copyIt Info */
  private copyItInfo: CopyItInfo;

  constructor(
    private copyitStepperPresenter: CopyitStepperPresenter
  ) {
    super();
    this.tabStepsItems = this.copyitStepperPresenter.getTabStepsDataItems();
    this.destroy = new Subject();
    this.usersListAndConfigurationByClient = new EventEmitter();
    this.userDetailsByUser = new EventEmitter();
    this.saveData = new EventEmitter<CopyItInfo>();
  }

  public ngOnInit(): void {
    this.copyitStepperPresenter.tabStepObservable.pipe(takeUntil(this.destroy)).subscribe((value: number) => {
      this.tabStep = value;
    })
    this.onInitProps();
  }

  /** ngOnDestroy of CopyitStepper presentation component */
  public ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }

  /** it will emit the vent for saving the stepper data */
  public saveStepperData(): void {
    this.saveData.emit(this.copyItInfo);
  }

  /**
   * onBack for dynamically change the active tab
   * @param tabId : This is the tab id which we want to active
   */
  public onBack(): void {
    this.tabIndex -= 1;
    this.currentIndex = this.tabIndex;
    this.copyitStepperPresenter.changeTab(this.tabIndex, this.tabSet, this.containerRef);
    this.tabSet.tabs[this.tabIndex].customClass = 'active';
    if (this.tabIndex < this.tabStep) {
      this.tabSetValue = false;
    }
  }

  /**
   * onNext for dynamically change the active tab
   * @param tabId : This is the tab id which we want to active
   */
  public onNext(): void {
    this.copyitStepperPresenter.onNext();
  }

  /**
   * After Init Property
   */
  private onInitProps(): void {
    this.tabIndex = 0;
    this.currentIndex = this.tabIndex + 1;
    this.copyitStepperPresenter.createComponent(this.tabIndex, this.containerRef);
    /** Get Client and Configuration */
    this.copyitStepperPresenter.clientIdByClient$.pipe(takeUntil(this.destroy)).subscribe((id: number) => {
      this.usersListAndConfigurationByClient.emit(id);
    });
    /** Get User Details */
    this.copyitStepperPresenter.userIdByUser$.pipe(takeUntil(this.destroy)).subscribe((id: number) => {
      this.userDetailsByUser.emit(id);
    });
    this.copyitStepperPresenter.setNextStep$.pipe(takeUntil(this.destroy)).subscribe((value: CopyItInfo) => {
      this.copyItInfo = value;
      if (this.tabIndex !== this.tabStep) {
        this.tabIndex++;
        this.copyitStepperPresenter.changeTab(this.tabIndex, this.tabSet, this.containerRef);
      }
    });
  }
}
