/**
 * @author Rayhan Kasli
 * @description This the presantation which is contain client list and as per the client selection
 *              component should be loaded, Either no client selected or packages list container
 *              should be loaded.  
 */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, HostBinding, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { TableProperty } from 'common-libs';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ClientMaster } from '../../../core/model/common.model';
import { DeliveryService, Packages, Slot, SlotParam, UserDetails } from '../../packages.model';

@Component({
  selector: 'app-package-presentation-ui',
  templateUrl: './package-presentation.component.html',
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PackagePresentationComponent implements OnInit {

  @Input() public set slots(value: Slot[]) {
    if (value) {
      this._slots = value;
    }
  }
  public get slots(): Slot[] {
    return this._slots;
  }

  @Input() public set scanNew(value: number) {
    if (value) {
      this.openAddForm = value;
    }
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
  @Input() public set baseResponse(baseResponse: any) {
    if (baseResponse) {
      this._baseResponse = baseResponse;
    }
  }
  public get baseResponse(): any {
    return this._baseResponse;
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

  /** This property is used for add class host element */
  @HostBinding('class') public class: string;
  /** This property is used for emit data to container component */
  @Output() public getPackages: EventEmitter<TableProperty>;
  /** This property is used for emit data to container component */
  @Output() public deletePackage: EventEmitter<Packages>;
  /** This property is used for emit data to container component */
  @Output() public masterData: EventEmitter<void>;
  /*** Output of close update package form presentation component */
  @Output() public loadSlots: EventEmitter<SlotParam>;
  /** This property is used for emit data to container component */
  @Output() public add: EventEmitter<Packages>;
  /** This property is used for emit data to container component */
  @Output() public saveAndScanNew: EventEmitter<Packages>;
  /*** Output of update package form presentation component */
  @Output() public update: EventEmitter<Packages>;
  /** This property is used for emit data to container component */
  @Output() public user: EventEmitter<string>;

  /** for group for  */
  public clientId: FormControl = new FormControl();
  public openAddForm: number;
  /** _clients */
  private _clients: ClientMaster[];
  /** _clients */
  private _userList: UserDetails[];
  /** list of slots */
  private _slots: Slot[];
  /** create for getter setter */
  private _baseResponse: any;
  /** create for getter setter */
  private _userDetails: UserDetails;
  /** Customer of customer form presentation component */
  private _deliveryService: DeliveryService[];
  /** create for destroy */
  private destroy: Subject<boolean>;


  constructor(private cdr: ChangeDetectorRef) {
    this.getPackages = new EventEmitter(true);
    this.deletePackage = new EventEmitter(true);
    this.masterData = new EventEmitter(true);
    this.loadSlots = new EventEmitter(true);
    this.destroy = new Subject();
    this.class = 'flex-grow-1 h-100 overflow-hidden';
    this.add = new EventEmitter(true);
    this.saveAndScanNew = new EventEmitter(true);
    this.update = new EventEmitter(true);
    this.user = new EventEmitter(true);
  }

  public ngOnInit(): void {
    this.clientId.valueChanges.pipe(takeUntil(this.destroy)).subscribe((clientId: number) => {
      this.cdr.detectChanges();
    })
  }

  /** getPackagess( */
  public getPackagess(tableProperty: TableProperty): void {
    this.getPackages.emit(tableProperty)
  }
  /** getPackagess( */
  public deletePackages(packages: Packages): void {
    this.deletePackage.emit(packages);
  }
  /** getMasterData */
  public getMasterData(): void {
    this.masterData.emit();
  }

  /**
   * to raise add package event
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
   * to raise add package event
   * @param packages Packages
   */
  public updatePackage(packages: Packages): void {
    this.update.emit(packages);
  }

  /** getUser based on serchTerm */
  public getUser(search: string): void {
    this.user.emit(search);
  }

  /**
   * load slots based on given parameter
   * @param slotParam SlotParam
   */
  public loadSlotList(slotParam: SlotParam): void {
    this.loadSlots.emit(slotParam);
  }
}
