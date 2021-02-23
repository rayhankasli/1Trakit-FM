/** 
 * @author Rayhan Kasli.
 * @description Slotspresenter service for Slotspresentation component.
 */

import { 
  Injectable, QueryList, ComponentRef,
   TemplateRef, ViewContainerRef, ComponentFactoryResolver, Type, Renderer2, NgZone
 } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { CdkPortalOutlet, TemplatePortal } from '@angular/cdk/portal';
// ---------------------------------------------- //
import { ConfirmationModalService, TableProperty } from 'common-libs';
import { Slots, SlotFilterRequest } from '../../../mail-configurations.model';
import { BaseTablePresenter } from 'projects/facility-management/src/app/shared/base-presenter/base-table.presenter';

/**
 * SlotsListPresenter
 */
@Injectable()
export class SlotsListPresenter extends BaseTablePresenter<SlotFilterRequest> {

  
  /** This property is used for subscribe the value of subject  isCheckAll */
  public isCheckAll$: Observable<boolean>;
  
  /** Table prop$ of slots list presenter */
  public tableProp$: Observable<TableProperty<SlotFilterRequest>>;

  /** This boolean is used to indicate whether all rows are selected or not */
  public isCheckAll: Subject<boolean>;

  /** This property is used to store the Slotss that has been retrieved from the API. */
  public slotss: Slots[];

  /** This property is used to store Slots  of the selected Slotss */
  public selectedSlotss: Set<Slots>;

  /** This property is used to store the criteria that are selected by the user */
  public tableProperty: TableProperty<SlotFilterRequest>;

  /** Stores the current sorting order */
  public isAscending: boolean;

  /** The message that will be shown in template when no record found */
  public message: string;

  /** Stores the ID of the Slots that needs to be deleted */
  public slotsId: number;

  /** This property is sue to store selected items. */
  public selectedItems: string[];

  /** This property is used to store searchText . */
  public searchText: string;


  /** Table prop of Slotslist presenter */
  private tableProp: Subject<TableProperty>;

  /** Component ref of data table presentation component */
  private componentRef: ComponentRef<any>;
  /** Slots data of slots list presenter */
  private slotsData: Subject<Slots[]>;

  constructor(
    public modalService: ConfirmationModalService,
    public renderer: Renderer2,
    public ngZone: NgZone,
    private factoryResolver: ComponentFactoryResolver
  ) {
    super(modalService, renderer, ngZone)
    this.initProperty();
  }

  /**
   * Manage status dropdown change with filter
   */
  public onStatusChange(isActive: boolean): void {    
    this.tableProperty.filter = { ...this.tableProperty.filter, isActive };
    this.setTableProperty({ ...this.tableProperty, pageNumber: 0 });

  }

  
  /**
   * Details action
   * @param slots 
   * @param slotsIndex 
   * @param portalOutlets 
   * @param templatePortalContent 
   * @param viewContainerRef 
   */
  public detailAction(
    slots: Slots, slotsIndex: number, portalOutlets: QueryList<CdkPortalOutlet>,
    templatePortalContent: TemplateRef<{ $implicit: Slots}>, viewContainerRef: ViewContainerRef
  ): void {
    const portalOutlet: CdkPortalOutlet = portalOutlets.find((item: CdkPortalOutlet, index: number) => index === slotsIndex);
    if (portalOutlet) {
      if (!portalOutlet.portal) {
        const portal: TemplatePortal = new TemplatePortal(templatePortalContent, viewContainerRef, { $implicit: slots});
        portalOutlet.attachTemplatePortal(portal);
      }
      else {
        portalOutlet.detach();
      }
    }
  }

  /**
   * Sets table data
   */
  public setTableData(): void {
    if (this.tableProperty.pageNumber > 0 && this.slotss.length === 0) {
      // this.toaster.info('No more records found', 'alert');
      return;
    } else if (this.slotss.length === 0) {
      this.tableProperty.pageNumber = 0;
    }
    const slotsLength: number = this.slotss.length;
    this.slotsData.next(this.slotss);
    this.tableProperty = this.getTableProperty(this.tableProperty, slotsLength);
    this.tableProp.next(this.tableProperty);
  }

  /**
   * Sorts apply
   * @param sort 
   * @returns true if apply 
   */
  public sortApply(sort: string): boolean {
    if (sort) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Views size change
   * @template T 
   * @param componentRef 
   * @param container 
   */
  public addNewSlot<T>(
    componentRef: Type<T>,
    container: ViewContainerRef): void {
    this.componentRef.instance.addSlot = true;
  }

  

  /** Initializes default properties for the component */
  private initProperty(): void {
    this.slotss = [];
    this.selectedSlotss = new Set();
    this.isAscending = false;
    this.tableProperty.filter = new SlotFilterRequest(true);    
    this.selectedItems = [];
    this.searchText = '';
    this.isCheckAll = new Subject();
    this.tableProp = new Subject();
    this.slotsData = new Subject();
    this.isCheckAll$ = this.isCheckAll.asObservable();
    this.tableProp$ = this.tableProp.asObservable();
  }
}

