
/**
 * @author Rayhan Kasli.
 * @description This is base class to represent the common members of desktop and mobile component.
 */

import { ChangeDetectorRef, EventEmitter, Inject, Input, NgZone, Output } from '@angular/core';
import { TableProperty } from 'common-libs';
import { Observable } from 'rxjs';
import { BaseCloseSelectDropdown } from '../../../core/base-classes/base-close-select-dropdown';
// --------------------------------------------- //
import { ClientMaster } from '../../../core/model/common.model';
import { ArchiveModeService } from '../../../core/services/archive-mode/archive-mode.service';
import { VisitorLog, VisitorLogFilterRecord, VisitorMaster } from '../../visitor-log.model';
import { VisitorLogListPresenter } from '../visitor-log-list-presenter/visitor-log-list.presenter';

/**
 * visitorLog list presentation base
 */
export class VisitorLogListPresentationBase extends BaseCloseSelectDropdown {

  /** list of offices */
  @Input() public set clients(value: ClientMaster[]) {
    if (value) {
      this._clients = value;
      this.isClient = this._clients[0].clientId > 0 ? true : false;
    }
  }

  public get clients(): ClientMaster[] {
    return this._clients;
  }

  /** This will set the data */
  @Input() public set masterData(value: VisitorMaster) {
    this._masterData = value;
  }
  public get masterData(): VisitorMaster {
    return this._masterData;
  }

  /*** it will used for emit the add VisitorLog form value to the parent component */
  @Output() public add: EventEmitter<VisitorLog>;
  /*** it will used for emit the update VisitorLog form value to the parent component */
  @Output() public update: EventEmitter<VisitorLog>;
  /*** it will used for emit the update VisitorLog form value to the parent component */
  @Output() public downloadPicture: EventEmitter<VisitorLog>;
  /*** it will used for emit the update VisitorLog form value to the parent component */
  @Output() public preview: EventEmitter<VisitorLog>;

  /** This property is used for filter apply or not. */
  public isFilterApply: boolean;
  /** This property is used to store the criteria that are selected by the user */
  public tableProperty: TableProperty<VisitorLogFilterRecord>;
  /** isClient  */
  public isClient: boolean;
  /** isArchived$  */
  public isArchived$: Observable<boolean>;


  /** list of clients */
  private _clients: ClientMaster[];
  /** list of clients_masterData */
  private _masterData: VisitorMaster;

  constructor(
    public visitorLogPresenter: VisitorLogListPresenter,
    public changeDetection: ChangeDetectorRef,
    public archiveModeService: ArchiveModeService,
    @Inject('Window') window: Window,
    zone: NgZone
  ) {
    super(window, zone);
    this.window = window as Window;
    this.isArchived$ = this.archiveModeService.archiveMode$;
    this.add = new EventEmitter<VisitorLog>();
    this.update = new EventEmitter<VisitorLog>();
    this.downloadPicture = new EventEmitter<VisitorLog>();
    this.preview = new EventEmitter<VisitorLog>();
  }

  /**
   * This method is invoked when the user changes the current page size.
   * @param pageSize The page number that needs to be set.
   */
  public onPageSizeChange(pageSize: number): void {
    this.visitorLogPresenter.onPageSizeChange(pageSize);
  }

  /**
   * This method is invoked when the user changes the page number from the pagination toolbar.
   * @param pageNumber The number to which the table should switch to
   */
  public onPageChange(pageNumber: number): void {
    this.visitorLogPresenter.onPageChange(pageNumber);
  }

  /** This method is invoked when the user click on filter button. */
  public openFilter(): void {
    this.visitorLogPresenter.openFilter();
  }

  /** create for open modal when action perform */
  public clearFilter(): void {
    this.isFilterApply = false;
    this.visitorLogPresenter.setTableProperty(new TableProperty());
  }

  /**
   * This method is invoked when the user performs a global search. It resets the selected rows, updates the criteria
   * and then gets the new list of VisitorLog based on updated criteria.
   * @param searchTerm The search string that has been searched by the user
   */
  public onSearch(searchTerm: string): void {
    this.visitorLogPresenter.onSearch(searchTerm);
  }


  /** create for open modal when action perform */
  public openModal(visitorLog: VisitorLog): void {
    this.visitorLogPresenter.openModal(visitorLog);
  }

  /**
   * it will used to emit the add visitor log data to parent component
   * @param visitorLog 
   */
  public addVisitorLog(visitorLog: VisitorLog): void {
    this.add.emit(visitorLog);
  }

  /**
   * it will used to emit the update visitor log data to parent component
   * @param visitorLog 
   */
  public updateVisitorLog(visitorLog: VisitorLog): void {
    this.update.emit(visitorLog);
  }

  /** downloadPicture */
  public downloadVisitorPicture(visitorLog: VisitorLog): void {
    this.downloadPicture.emit(visitorLog);
  }
  /** previewPicture */
  public previewPicture(visitorLog: VisitorLog): void {
    this.preview.emit(visitorLog);
  }
}
