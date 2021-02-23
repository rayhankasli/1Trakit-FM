
/**
 * @author Rayhan Kasli | Mitul Patel.
 * @description This is base class to represent the common members of desktop and mobile component.
 */

import { ChangeDetectorRef, EventEmitter, Inject, Input, NgZone, Output } from '@angular/core';
import { AuthPolicyService } from 'auth-policy';
import { TableProperty } from 'common-libs';
import { Observable } from 'rxjs';
import { BaseCloseSelectDropdown } from '../../../core/base-classes/base-close-select-dropdown';
// --------------------------------------------- //
import { BasePresentation } from '../../../core/base-classes/base.presentation';
import { PolicyRoles } from '../../../core/enums/role-permissions.enum';
import { ClientMaster } from '../../../core/model/common.model';
import { ArchiveModeService } from '../../../core/services/archive-mode/archive-mode.service';
import { DeliveryService, Packages, Slot, SlotParam, UserDetails } from '../../packages.model';
import { PackagesListPresenter } from '../packages-list-presenter/packages-list.presenter';

/**
 * packages list presentation base
 */
export class PackagesListPresentationBase extends BaseCloseSelectDropdown {

  /** This property is used to store the packagess that has been retrieved from the API. */
  @Input() public set packagess(value: Packages[]) {
    if (value) {
      this._packagess = value;
      this.changeDetection.detectChanges();
    }
  };
  public get packagess(): Packages[] {
    return this._packagess;
  }

  /** list of offices */
  @Input() public set clients(value: ClientMaster[]) {
    if (value) {
      this._clients = value;
    }
  }
  public get clients(): ClientMaster[] {
    return this._clients;
  }

  /** list of offices */
  @Input() public set userList(value: UserDetails[]) {
    if (value) {
      this._userList = value;
    }
  }
  public get userList(): UserDetails[] {
    return this._userList;
  }

  /** This property is used for get data from container component */
  @Input() public set userDetails(userDetails: UserDetails) {
    if (userDetails) {
      this._userDetails = userDetails;
    }
  }
  public get userDetails(): UserDetails {
    return this._userDetails;
  }

  /** This property is used for get data from container component */
  @Input() public set deliveryServiceList(deliveryService: DeliveryService[]) {
    if (deliveryService) {
      this._deliveryService = deliveryService;
    }
  }
  public get deliveryServiceList(): DeliveryService[] {
    return this._deliveryService;
  }

  /** This property is used for get data from container component */
  @Input() public set slots(value: Slot[]) {
    if (value) {
      this._slots = value;
    }
  }
  public get slots(): Slot[] {
    return this._slots;
  }

  /** This property is used to store the visitorLogList that has been retrieved from the API. */
  @Input() public set isAddPackage(value: boolean) {
    this.packagesPresenter.isAddPackage = value;
    this.scanNew = new Date().getMilliseconds();
    this.changeDetection.detectChanges();
  };
  public get isAddPackage(): boolean {
    return this.packagesPresenter.isAddPackage;
  }


  /*** Output of load slot form presentation component */
  @Output() public loadSlots: EventEmitter<SlotParam>;
  /** This property is used for emit data to container component */
  @Output() public add: EventEmitter<Packages>;
  /** This property is used for emit data to container component */
  @Output() public saveAndScanNew: EventEmitter<Packages>;
  /** This property is used for emit data to container component */
  @Output() public update: EventEmitter<Packages>;
  /** This property is used for emit data to container component */
  @Output() public user: EventEmitter<string>;

  /** This boolean is used to indicate whether all rows are selected or not  */
  public isCheckAll: boolean;
  /** This property is used for filter apply or not. */
  public isFilterApply: boolean;
  /** This property is used to store the criteria that are selected by the user */
  public tableProperty: TableProperty;
  /** to raise open new form event */
  public scanNew: number;
  /** isSuperUser */
  public isSuperUser: boolean;
  /** isArchived$  */
  public isArchived$: Observable<boolean>;

  /** Packagess of packages list presentation base */
  private _packagess: Packages[];
  /** list of clients */
  private _clients: ClientMaster[];
  /** list of clients */
  private _userList: UserDetails[];
  /** create for getter setter */
  private _userDetails: UserDetails;
  /** Customer of customer form presentation component */
  private _deliveryService: DeliveryService[];
  /** list of slots */
  private _slots: Slot[];

  constructor(
    public packagesPresenter: PackagesListPresenter,
    public changeDetection: ChangeDetectorRef,
    public authPolicy: AuthPolicyService,
    public archiveModeService: ArchiveModeService,
    @Inject('Window') window: Window,
    public zone: NgZone
  ) {
    super(window, zone);
    this.window = window as Window;
    // this.userId = new EventEmitter(true);
    this.loadSlots = new EventEmitter(true);
    this.add = new EventEmitter<Packages>(true);
    this.saveAndScanNew = new EventEmitter<Packages>(true);
    this.update = new EventEmitter<Packages>(true);
    this.user = new EventEmitter(true);
    this.isSuperUser = this.authPolicy.isInRole(PolicyRoles.superUser);
    this.isArchived$ = this.archiveModeService.archiveMode$;
  }

  /**
   * This method is invoked when the user changes the current page size.
   * @param pageSize The page number that needs to be set.
   */
  public onPageSizeChange(pageSize: number): void {
    this.packagesPresenter.onPageSizeChange(pageSize);
  }

  /**
   * This method is invoked when the user changes the page number from the pagination toolbar.
   * @param pageNumber The number to which the table should switch to
   */
  public onPageChange(pageNumber: number): void {
    this.packagesPresenter.onPageChange(pageNumber);
  }

  /** create for open modal when action perform */
  public openModal(packages: Packages): void {
    this.packagesPresenter.openModal(packages);
  }

  /**
   * to add new package
   * @param packages Packages
   */
  public addPackage(packages: Packages, saveAndScanNewFlag: boolean = false): void {
    if (saveAndScanNewFlag) {
      this.saveAndScanNew.emit(packages);
    } else {
      this.add.emit(packages);
    }
  }


  /**
   * to add new package
   * @param packages Packages
   */
  public updatePackage(packages: Packages): void {
    this.update.emit(packages);
  }

  /** getUser based on serchTerm */
  public getUser(search: string): void {
    this.user.emit(search);
  }

  /** load slot list based on given params */
  public loadSlotList(slotParam: SlotParam): void {
    this.loadSlots.emit(slotParam);
  }
}
