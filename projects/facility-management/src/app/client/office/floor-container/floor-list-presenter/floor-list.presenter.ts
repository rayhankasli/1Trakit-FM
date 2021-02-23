/** 
 * @author Ronak Patel.
 * @description Floorpresenter service for Floorpresentation component.
 */

import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { ComponentRef, ElementRef, Injectable } from '@angular/core';
import { ConfirmationModalComponent, ConfirmationModalService, TableProperty } from 'common-libs';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
// ---------------------------------------------- //
import { BasePresentation } from '../../../../core/base-classes/base.presentation';
import { Floor } from '../../office.model';
import { FloorFormPresentationComponent } from '../floor-list-presentation/floor-form-presentation/floor-form.presentation';

/**
 * FloorListPresenter
 */
@Injectable()
export class FloorListPresenter extends BasePresentation {

  /** This property is used for subscribing the value of subject setTableProp */
  public setTableProp$: Observable<TableProperty>;

  /** This is used for user info object */
  public setTableProp: Subject<TableProperty>;

  /** This property is used for subscribe the value of subject deleteFloor */
  public deleteFloor$: Observable<Floor>;

  /** This property is used to store the Floors that has been retrieved from the API. */
  public floors: Floor[];

  /** This property is used to store the criteria that are selected by the user */
  public tableProperty: TableProperty;

  /** Stores the current sorting order */
  public isAscending: boolean;

  /** Stores the ID of the Floor that needs to be deleted */
  public floorId: number;

  /** This property is used to store searchText . */
  public searchText: string;

  /** set and get the active id of tabs */
  public set activeIds(ids: string[]) {
    this._activeId = ids;
  }
  public get activeIds(): string[] {
    return this._activeId;
  }
  /** This property is used for subscribe the value of subject addFloor */
  public addFloor$: Observable<Floor>
  /** This property is used for subscribe the value of subject updateFloor */
  public updateFloor$: Observable<Floor>
  /** isEditable */
  public isEditable$: Observable<boolean>;
  /** isEditable */
  private isEditable: Subject<boolean>;
  /** This property is used for emit when delete Floor. */
  private deleteFloor: Subject<Floor>;
  /** This property is used to store overlayRef. */
  public overlayRef: OverlayRef;
  /** Component ref of data table presentation component */
  private componentRef: ComponentRef<FloorFormPresentationComponent>;
  /** This property is used for subscribe the value of subject addFloor */
  private addFloor: Subject<Floor>;
  /** This property is used for subscribe the value of subject updateFloor */
  private updateFloor: Subject<Floor>;
  /** Active id of user presenter */
  private _activeId: string[];
  /** Primary color of user presenter */
  private primaryColor: string;
  constructor(
    private overlay: Overlay,
    private modalService: ConfirmationModalService,
  ) {
    super();
    this.initProperty();
    this._activeId = [];
    this.primaryColor = 'primary-color';
  }

  /** This method is invoke when table property change. */
  public setTableProperty(tableProperty: TableProperty): void {
    this.tableProperty = tableProperty;
    this.setTableProp.next(this.tableProperty);
  }

  /** This method is invoke when data successfully get */
  public getTableProperty(tableProperty: TableProperty, length: number): TableProperty {
    this.tableProperty = tableProperty;
    this.tableProperty.start = (this.tableProperty.pageLimit * (this.tableProperty.pageNumber)) + 1;
    this.tableProperty.end = this.tableProperty.start + length - 1;
    return this.tableProperty;
  }

  /**
   * This method is invoked when the user performs a global search. It resets the selected rows, updates the criteria
   * and then gets the new list of Floorbased on updated criteria.
   * @param searchTerm The search string that has been searched by the user
   */
  public onSearch(searchTerm: string): void {
    if (searchTerm) {
      this.tableProperty = new TableProperty();
      this.tableProperty.search = searchTerm;
    } else {
      this.tableProperty = new TableProperty();
    }
    if (this.searchText === searchTerm) { return; }
    this.searchText = searchTerm;
    this.setTableProperty(this.tableProperty);
  }

  /** create for open modal when action perform */
  public openModal(floor: Floor): void {
    const modalInstance: ConfirmationModalComponent = this.modalService.openModal();
    modalInstance.confirmModal.subscribe((value: boolean) => {
      (value) ? this.onDelete(floor) : console.log('decline conformations');
      this.modalService.closeModal();
    });
  }

  /** create method for open form in overlay */
  public openForm(elementRef: ElementRef, floor?: Floor): void {
    const overlayConfig: OverlayConfig = new OverlayConfig();
    overlayConfig.hasBackdrop = true;
    overlayConfig.backdropClass = '';
    overlayConfig.positionStrategy = this.overlay.position().flexibleConnectedTo(elementRef).withPositions([{
      originX: 'end',
      originY: 'bottom',
      overlayX: 'end',
      overlayY: 'top',
    }]);
    // create overlay
    this.overlayRef = this.overlay.create(overlayConfig);
    // instance of conformation modal component
    const portal: ComponentPortal<FloorFormPresentationComponent>
      = new ComponentPortal<FloorFormPresentationComponent>(FloorFormPresentationComponent);
    // attach component portal 
    this.componentRef = this.overlayRef.attach(portal);
    this.overlayRef.backdropClick().subscribe(() => {
      this.isEditable.next(false);
      this.overlayRef.detach();
    });
    this.componentRef.instance.floor = floor;
    this.componentRef.instance.add.subscribe((value: Floor) => {
      this.addFloor.next(value);
      this.overlayRef.detach();
    }
    );
    this.componentRef.instance.update.subscribe((value: Floor) => {
      this.updateFloor.next(value);
      this.overlayRef.detach();
    })
  }

  /**
   * create for delete record base on id.
   */
  public onDelete(floor: Floor): void {
    this.modalService.closeModal();
    this.deleteFloor.next(floor);
  }




  /** 
   * This Method is used for close the inline form
   * @param floors - list of all floor
   * @param floor - selected floor 
   */
  public toggleEditable(floors: Floor[], floor?: Floor): Floor[] {
    floors && floors.filter((value: Floor) => {
      if (value.isEditable) {
        value.isEditable = false;
      }
      if (floor === value) {
        value.isEditable = true;
      }
    });
    return floors;
  }


  /** Initializes default properties for the component */
  private initProperty(): void {
    this.floors = [];
    this.isAscending = false;
    this.tableProperty = new TableProperty();
    this.searchText = '';
    this.addFloor = new Subject();
    this.updateFloor = new Subject();
    this.deleteFloor = new Subject();
    this.setTableProp = new Subject();
    this.setTableProp$ = this.setTableProp.asObservable();
    this.deleteFloor$ = this.deleteFloor.asObservable();
    this.addFloor$ = this.addFloor.asObservable();
    this.updateFloor$ = this.updateFloor.asObservable();
    this.isEditable = new Subject();
    this.isEditable$ = this.isEditable.asObservable();
  }
}

