/** 
 * @author Rayhan Kasli.
 * @description Reasonspresenter service for Reasonspresentation component.
 */

import {
  Injectable, ComponentRef, ViewContainerRef, Type, NgZone, Renderer2
} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
// ---------------------------------------------- //
import { ConfirmationModalService, TableProperty } from 'common-libs';
// ---------------------------------------------- //
import { Reasons } from '../reasons.model';
import { BaseTablePresenter } from '../../../base-presenter/base-table.presenter';

/**
 * ReasonsListPresenter
 */
@Injectable()
export class ReasonsListPresenter extends BaseTablePresenter<TableProperty | Reasons> {

  /** This property is used for subscribe the value of subject  isCheckAll */
  public isCheckAll$: Observable<boolean>;

  /** Table prop$ of reasons list presenter */
  public tableProp$: Observable<TableProperty>;

  /** This boolean is used to indicate whether all rows are selected or not */
  public isCheckAll: Subject<boolean>;

  /** This property is used to store the Reasonss that has been retrieved from the API. */
  public reasons: Reasons[];

  /** This property is used to store Reasons  of the selected Reasonss */
  public selectedReasons: Set<Reasons>;

  /** This property is used to store the criteria that are selected by the user */
  public tableProperty: TableProperty;

  /** Stores the current sorting order */
  public isAscending: boolean;

  /** The message that will be shown in template when no record found */
  public message: string;

  /** Stores the ID of the Reasons that needs to be deleted */
  public reasonsId: number;

  /** This property is sue to store selected items. */
  public selectedItems: string[];

  /** This property is used to store searchText . */
  public searchText: string;

  /** Table prop of Reasonslist presenter */
  private tableProp: Subject<TableProperty>;

  /** Component ref of data table presentation component */
  private componentRef: ComponentRef<any>;
  /** Reasons data of reasons list presenter */
  private reasonsData: Subject<Reasons[]>;

  constructor(
    public modalService: ConfirmationModalService,
    public renderer: Renderer2,
    public ngZone: NgZone,
  ) {
    super(modalService, renderer, ngZone)
    this.initProperty();
  }

  /**
   * Sets table data
   */
  public setTableData(): void {
    if (this.tableProperty.pageNumber > 0 && this.reasons.length === 0) {
      // this.toaster.info('No more records found', 'alert');
      return;
    } else if (this.reasons.length === 0) {
      this.tableProperty.pageNumber = 0;
    }
    const reasonsLength: number = this.reasons.length;
    this.reasonsData.next(this.reasons);
    this.tableProperty = this.getTableProperty(this.tableProperty, reasonsLength);
    this.tableProp.next(this.tableProperty);
  }

  /**
   * Views size change
   * @template T 
   * @param componentRef 
   * @param container 
   */
  public addNewReasons<T>(
    componentRef: Type<T>,
    container: ViewContainerRef
  ): void {
    this.componentRef.instance.addNewReasons = true;
  }

  /** Initializes default properties for the component */
  private initProperty(): void {
    this.reasons = [];
    this.selectedReasons = new Set();
    this.isAscending = false;
    this.selectedItems = [];
    this.searchText = '';
    this.isCheckAll = new Subject();
    this.tableProp = new Subject();
    this.reasonsData = new Subject();
    this.isCheckAll$ = this.isCheckAll.asObservable();
    this.tableProp$ = this.tableProp.asObservable();
  }
}

