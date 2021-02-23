/**
 * @author Ronak Patel.
 * @description This is data table presentation component.To represent get data from container component and render to dom.
 */
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef, Component, EventEmitter,
  HostBinding, Inject, Input,
  NgZone, OnDestroy, OnInit, Output,
  ViewChild, ViewContainerRef
} from '@angular/core';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators/takeUntil';
import { Subject } from 'rxjs/Subject';
// ---------------------------------------------------------- //
import { pageCount, TableProperty } from 'common-libs';
// ---------------------------------------------------------- //
import { BaseCloseSelectDropdown } from '../../../../core/base-classes/base-close-select-dropdown';
import { ArchiveModeService } from '../../../../core/services/archive-mode/archive-mode.service';
import { DATE_FORMAT } from '../../../../core/utility/constants';
import { AssetTicketResult, AssetTicketStatus } from '../../../fleet.model';
import { AssetTicketListPresenter } from '../asset-ticket-list-presenter/asset-ticket-list.presenter';


@Component({
  selector: 'app-asset-ticket-list-ui',
  templateUrl: './asset-ticket-list.presentation.html',
  viewProviders: [AssetTicketListPresenter],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AssetTicketListPresentationComponent extends BaseCloseSelectDropdown implements OnInit, OnDestroy {

  @HostBinding('class') public class: string;
  /** This will set the data */
  @Input() public set baseResponse(value: AssetTicketResult) {
    if (value) {
      this._baseResponse = value;
      this.setTableData();
    }
  }
  public get baseResponse(): AssetTicketResult {
    return this._baseResponse;
  }

  /** This will set the data */
  @Input() public set ticketStatus(value: AssetTicketStatus[]) {
    if (value) {
      this._ticketStatus = value;
    }
  }

  public get ticketStatus(): AssetTicketStatus[] {
    return this._ticketStatus;
  }

  /** get common formate for date */
  public get dateFormat(): string {
    return DATE_FORMAT;
  }

  /** This property is used for emit data to container component */
  @Output() public getAssetTicket: EventEmitter<TableProperty>;

  /**
   * View child of customer list presentation component
   */
  @ViewChild('container', { read: ViewContainerRef, static: false }) public container: ViewContainerRef;


  /** This property is used to store the criteria that are selected by the user */
  public tableProperty: TableProperty;

  /** This property is used to store the options that are available in the Page Size selection drawdown */
  public pageSize: number[];

  public ticketId: number = 0;

  /** Table prop of customer list presentation component */
  public tableProp: Subject<TableProperty>;
  public ticketStatusId: number = 0;
  public isArchived$: Observable<boolean>;
  private _ticketStatus: AssetTicketStatus[];
  private _baseResponse: AssetTicketResult;


  constructor(
    public assetTicketPresenter: AssetTicketListPresenter,
    public changeDetection: ChangeDetectorRef,
    private archiveModeService: ArchiveModeService,
    @Inject('Window') window: Window,
    zone: NgZone
  ) {
    super(window, zone);
    this.initProperty();
    this.class = 'd-flex flex-column overflow-hidden';
  }

  public ngOnInit(): void {
    this.assetTicketPresenter.setTableProp$.pipe(takeUntil(this.destroy)).subscribe((tableProperty: TableProperty) => {
      setTimeout(() => {
        this.getAssetTicket.emit(tableProperty);
      }, 10);
      this.tableProperty = tableProperty;
    });
    this.assetTicketPresenter.tableProp$.subscribe((value: TableProperty) => {
      this.tableProperty = value;
    });
  }

  /** destroy */
  public ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.unsubscribe();
  }

  /**
   * Sets table data
   */
  public setTableData(): void {
    this.assetTicketPresenter.assetTickets = this.baseResponse.assetTickets;
    this.tableProperty = this.assetTicketPresenter.setTableData();
    this.ticketId = this.tableProperty.start;
  }

  /**
   * This method is invoked when the user changes the current page size.
   * @param pageSize The page number that needs to be set.
   */
  public onPageSizeChange(pageSize: number): void {
    this.assetTicketPresenter.onPageSizeChange(pageSize);
  }

  /**
   * This method is invoked when the user changes the page number from the pagination toolbar.
   * @param pageNumber The number to which the table should switch to
   */
  public onPageChange(pageNumber: number): void {
    this.assetTicketPresenter.onPageChange(pageNumber);
  }

  /**
   * This method is invoked when the user performs a global search. It resets the selected rows, updates the criteria
   * and then gets the new list of AssetTicket based on updated criteria.
   * @param searchTerm The search string that has been searched by the user
   */
  public onSearch(searchTerm: string): void {
    this.assetTicketPresenter.onSearch(searchTerm);
  }

  /** onStatusChange */
  public onStatusChange(value: AssetTicketStatus): void {
    this.assetTicketPresenter.onFilter(value.assetTicketStatusId);
  }

  /** Initializes default properties for the component */
  private initProperty(): void {
    this.tableProp = new Subject();
    this.tableProperty = new TableProperty();
    this.pageSize = pageCount;
    this.destroy = new Subject();
    this.getAssetTicket = new EventEmitter<TableProperty>();
    this.isArchived$ = this.archiveModeService.archiveMode$;
  }
}
