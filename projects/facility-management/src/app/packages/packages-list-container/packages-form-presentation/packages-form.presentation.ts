

/**
 * @name PackagesPresentationComponent
 * @author Rayhan Kasli | Mitul Patel
 * @description This is a presentation component for packageswhich contains the ui and business logic
 */

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Inject, Input, NgZone, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';
//-------------------------------------------------------------------------------//
import { BaseCloseSelectDropdown } from '../../../core/base-classes/base-close-select-dropdown';
import { DeliveryService, Packages, Slot, SlotParam, UserDetails } from '../../packages.model';
import { PackagesFormPresenter } from '../packages-form-presenter/packages-form.presenter';

/** 
 * PackagesFormPresentationComponent
 */
@Component({
  selector: 'app-packages-form-ui',
  templateUrl: './packages-form.presentation.html',
  viewProviders: [PackagesFormPresenter],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PackagesFormPresentationComponent extends BaseCloseSelectDropdown implements OnInit, OnDestroy {

  @Input() public set scanNew(value: number) {
    if (value) {
      this.isEditMode = false;
      this.isFormSubmitted = false;
      this.userList = [];
      this.packagesPresenter.resetForm(this.packagesFormGroup);
      this.focusBarcode();
    }
  }

  /** This property is used for get data from container component */
  @Input() public set slots(value: Slot[]) {
    if (value) {
      // filter slots if opened in edit mode, show previously selected slot if list is not present
      this._slots = this.isEditMode ? this.packagesPresenter.setSlots(value, this.packages) : value;
    }
  }
  public get slots(): Slot[] {
    return this._slots;
  }

  /** This will set the data */
  @Input() public set packages(value: Packages) {
    if (value) {
      this.user.emit(value.toUserName);
      const slotParams: SlotParam = this.packagesPresenter.getSlotParameters(value);
      this.selectedDeliveryDate = slotParams.deliveryDate;
      this._packages = { ...value, ...slotParams };
      this.loadSlots.emit(slotParams);
      this.packagesFormGroup = this.packagesPresenter.bindControlValue(this.packagesFormGroup, this._packages);
      this.isEditMode = true;
    }
  }
  public get packages(): Packages {
    return this._packages;
  }

  /** list of offices */
  @Input() public set userList(value: UserDetails[]) {
    if (value) {
      this._userList = value;
      this.cdrRef.detectChanges();
    }

  }
  public get userList(): UserDetails[] {
    return this._userList;
  }

  /** This property is used for get data from container component */
  @Input() public set userDetails(userDetails: UserDetails) {
    if (userDetails) {
      this._userDetails = userDetails;
      this.packagesPresenter.bindUserValue(this.packagesFormGroup, userDetails);
    }
  }
  public get userDetails(): UserDetails {
    return this._userDetails;
  }

  /** This property is used for get data from container component */
  @Input() public set deliveryServiceList(deliveryService: DeliveryService[]) {
    if (deliveryService) {
      this._deliveryService = deliveryService;
      // toggle custom company name based on previous selection
      if (this.isEditMode) {
        const selectedService: DeliveryService = deliveryService
          .find((service: DeliveryService) => service.deliveryServiceId === this.packages.deliveryServiceId);
        if (selectedService) {
          this.onDeliveryCompanyChange(selectedService);
        }
      }
    }
  }
  public get deliveryServiceList(): DeliveryService[] {
    return this._deliveryService;
  }

  /** Customer form group of customer form presentation component */
  public packagesFormGroup: FormGroup;
  /** Determines whether form submitted */
  public isFormSubmitted: boolean = false;
  /** Determines whether the form is opened in edit mode */
  public isEditMode: boolean;
  /** to toggle custom company name text control */
  public showCustomDeliveryCompany: boolean;
  /** selectedDeliveryDate date */
  public selectedDeliveryDate: string | Date;

  /*** Output of customer form presentation component */
  @Output() public add: EventEmitter<Packages>;
  /*** Output of customer form presentation component */
  @Output() public saveAndScanNew: EventEmitter<Packages>;
  /*** Output of update package form presentation component */
  @Output() public update: EventEmitter<Packages>;
  /*** Output of close update package form presentation component */
  @Output() public closeForm: EventEmitter<void>;
  /*** Output slot parameters to load slots */
  @Output() public loadSlots: EventEmitter<SlotParam>;
  /*** Output of close update package form presentation component */
  @Output() public user: EventEmitter<string>;

  /** instance of barcode text control */
  @ViewChild('barcode', { static: true }) public barcode: ElementRef;

  /** Customer of customer form presentation component */
  private _packages: Packages;
  /** Customer of customer form presentation component */
  private _userList: UserDetails[];
  /** create for getter setter */
  private _userDetails: UserDetails;
  /** Customer of customer form presentation component */
  private _deliveryService: DeliveryService[];

  private _slots: Slot[];
  private saveAndScanNewFlag: boolean;

  constructor(
    private packagesPresenter: PackagesFormPresenter,
    private cdrRef: ChangeDetectorRef,
    @Inject('Window') window: Window,
    zone: NgZone
  ) {
    super(window, zone);
    this.window = window as Window;
    this.initProps();
  }

  public ngOnInit(): void {
    // This will subscribe the save event and emit to container component
    this.packagesPresenter.add$.pipe(takeUntil(this.destroy)).subscribe((packages: Packages) => {
      if (this.packages) {
        this.update.emit(packages);
      } else {
        if (this.saveAndScanNewFlag) {
          this.saveAndScanNew.emit(packages);
        } else {
          this.add.emit(packages);
          this.cancel();
        }
      }
    });
    this.packagesFormGroup.get('barcode').valueChanges.pipe(debounceTime(50), takeUntil(this.destroy)).subscribe((value: string) => {
      this.packagesPresenter.disableControl(value, this.packagesFormGroup, 'upiNumber');
      this.cdrRef.detectChanges();
    });
    this.packagesFormGroup.get('upiNumber').valueChanges.pipe(debounceTime(500), takeUntil(this.destroy)).subscribe((value: string) => {
      this.packagesPresenter.disableControl(value, this.packagesFormGroup, 'barcode');
      this.cdrRef.detectChanges();
    });
    // listen user-list search event
    this.packagesPresenter.userSearch$.pipe(debounceTime(500), takeUntil(this.destroy)).subscribe((search: string) => {
      if (search) {
        this.user.emit(search);
      } else {
        this.userList = []
      }
    })

    if (!this.packages) {
      this.userList = [];
      this.slots = [];
      this.packagesPresenter.resetForm(this.packagesFormGroup);
    }
  }

  /** changeToUser */
  public changeToUser(user: UserDetails): void {
    const slotParams: SlotParam = this.packagesPresenter.getSlotParameters({ ...user, ...this.packages });
    this.selectedDeliveryDate = slotParams.deliveryDate;
    this.loadSlots.emit(slotParams);
    this.packagesPresenter.bindUserValue(this.packagesFormGroup, user);
    this.packagesPresenter.bindDeliveryDate(this.packagesFormGroup, slotParams);
  }

  /**
   * on delivery company dropdown change toggle custom company name
   * @param selectedDelivery DeliveryService
   */
  public onDeliveryCompanyChange(selectedDelivery: DeliveryService): void {
    const { deliveryServiceFrom }: any = this.packagesFormGroup.controls;
    this.showCustomDeliveryCompany = this.packagesPresenter.showDeliveryCompanyName(selectedDelivery, deliveryServiceFrom);
  }


  /** This is used to save the data */
  public savePackages(saveAndScanNew: boolean = false): void {
    this.isFormSubmitted = true;
    this.saveAndScanNewFlag = saveAndScanNew;
    this.packagesPresenter.savePackages(this.packagesFormGroup);
  }

  /** When user click on cancel */
  public cancel(): void {
    this.closeForm.emit()
  }

  /** customSearch  */
  public customSearch({ term }: any): void {
    this.packagesPresenter.onUserSearch(term);
  }

  public ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }

  /** focus barcode control */
  private focusBarcode(): void {
    setTimeout(() => {
      if (this.barcode) {
        this.barcode.nativeElement.focus();
      }
    }, 500);
  }

  /** initProps is initilaize property */
  private initProps(): void {
    this.destroy = new Subject();
    this.add = new EventEmitter(true);
    this.saveAndScanNew = new EventEmitter(true);
    this.update = new EventEmitter(true);
    this.closeForm = new EventEmitter(true);
    this.loadSlots = new EventEmitter(true);
    this.user = new EventEmitter();
    this.packagesFormGroup = this.packagesPresenter.buildForm();
    this.isEditMode = false;
    this.selectedDeliveryDate = new Date().toLocaleDateString();
  }

}

