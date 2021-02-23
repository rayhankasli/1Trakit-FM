/** 
 * @author Ronak Patel.
 * @description Roompresenter service for Roompresentation component.
 */

import {
  Injectable, QueryList, Renderer2, NgZone,
} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
// ---------------------------------------------- //
import { ConfirmationModalService, ConfirmationModalComponent, TableProperty, SortingOrder, SortingOrderDirective } from 'common-libs';
import { Room } from '../../../office.model';
import { getTableProperty, onSorting } from 'projects/facility-management/src/app/core/utility/utility';
import { BaseTablePresenter } from 'projects/facility-management/src/app/shared/base-presenter/base-table.presenter';

/**
 * RoomListPresenter
 */
@Injectable()
export class RoomListPresenter extends BaseTablePresenter<TableProperty | Room> {

  /** This property is used to store the criteria that are selected by the user */
  public tableProperty: TableProperty;

  /** Stores the current sorting order */
  public isAscending: boolean;

  /** Stores the ID of the Room that needs to be deleted */
  public roomId: number;

  /** This property is used to store searchText . */
  public searchText: string;

  /** Table prop of Roomlist presenter */
  private tableProp: Subject<TableProperty>;
  /** Room data of room list presenter */
  private roomData: Subject<Room[]>;

  constructor(
    public renderer: Renderer2,
    public ngZone: NgZone,
    public modalService: ConfirmationModalService,
  ) {
    super(modalService, renderer, ngZone)
    this.initProperty();
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
  /** create for close form */
  public closeForm(rooms: Room[], room?: Room): Room[] {
    return rooms && rooms.map((value: Room) => {
      if (value.isEditable) {
        value.isEditable = false;
      }
      if (room && room === value) {
        value.isEditable = true;
      }
      return value;
    });
  }

  /** Initializes default properties for the component */
  private initProperty(): void {
    this.isAscending = false;
    this.searchText = '';
    this.tableProp = new Subject();
    this.roomData = new Subject();
  }
}

