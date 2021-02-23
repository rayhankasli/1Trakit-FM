
/**
 * @author YOUR_NAME_HERE
 * @description This is data table presentation component.To represent get data from container component and render to dom.
 */
import {
  ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter,

  HostBinding, Inject, Input,
  NgZone,
  OnDestroy, OnInit, Output, QueryList, ViewChild, ViewChildren,
  ViewContainerRef
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AuthPolicyService } from 'auth-policy';
import { takeUntil } from 'rxjs/operators/takeUntil';
import { Subject } from 'rxjs/Subject';
// ---------------------------------------------------------- //
import { pageCount, SortingOrderDirective, TableProperty } from 'common-libs';
// ---------------------------------------------------------- //
import { Permission, PolicyRoles } from '../../../core/enums/role-permissions.enum';
import { MultiSelectFilterRecord } from '../../../core/model/common.model';
import { ArchiveModeService } from '../../../core/services/archive-mode/archive-mode.service';
import { CopyItList, CopyItListResult } from '../../models/copyit-list.model';
import { CopyItListPresentationBase } from '../copyit-list-presentation-base/copyit-list.presentation.base';
import { CopyItListPresenter } from '../copyit-list-presenter/copyit-list.presenter';
import { getDropDownSettings } from '../../../core/utility/utility';

/**
 * CopyItListPresentationComponent
 */
@Component({
  selector: 'app-copyit-list-ui',
  templateUrl: './copyit-list.presentation.html',
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [CopyItListPresenter]
})
export class CopyItListPresentationComponent extends CopyItListPresentationBase implements OnInit, OnDestroy {

  /** HostBinding */
  @HostBinding('class') public class: string;

  /** This property is used for get data from container component */
  @Input() public set baseResponse(baseResponse: CopyItListResult) {
    if (baseResponse) {
      this._baseResponse = baseResponse;
      this.setTableData();
    }
  };

  public get baseResponse(): CopyItListResult {
    return this._baseResponse;
  }

  /** This property is used for emit data to container component */
  @Output() public getCopyItList: EventEmitter<TableProperty<MultiSelectFilterRecord>>;

  /** This property is used for emit data to container component */
  @Output() public deleteCopyItList: EventEmitter<number>;


  /** View child of customer list presentation component */
  @ViewChild('container', { read: ViewContainerRef, static: false }) public container: ViewContainerRef;

  /** This property is used to store QueryList of SortingOrderDirective */
  @ViewChildren(SortingOrderDirective) public sortingColumns: QueryList<SortingOrderDirective>;

  /** It will store the form group for multi select filter */
  public multiSelectFilterForm: FormGroup;
  /** This property is used to store the selected CopyItLists */
  public selectedCopyItLists: Set<CopyItList>;
  /** This property is used to store the criteria that are selected by the user */
  public tableProperty: TableProperty<MultiSelectFilterRecord>;
  /** This property is used to store the options that are available in the Page Size selection drawdown */
  public paperSize: number[];
  /** Table prop of customer list presentation component */
  public tableProp: Subject<TableProperty<MultiSelectFilterRecord>>;
  /** provides configuration for multi-select drop-down */
  public multiSelectDropDownConfig: boolean;
  /** This property is used for checking sort applied or not. */
  public isSortApply: boolean;
  /** Status list drop-down setting */
  public statusDropSettings: {};
  /** AssignTo list drop-down setting */
  public assignToDropSettings: {};
  /** requestedBy list settings */
  public requestedByDropSettings: {};
  /** search field control object */
  public searchField: FormControl;
  /** It will store the client */
  public client: any;
  /** check user role is SuperUser */
  public isSuperUser: boolean;

  /** It will get the copyIt Permission */
  public get copyItPermissions(): typeof Permission.CopyIt {
    return Permission.CopyIt;
  }
  /** It will get the copyIt Roles */
  public get copyItRoles(): typeof PolicyRoles {
    return PolicyRoles;
  }

  /** create for getter setter */
  private _baseResponse: CopyItListResult;
 
  constructor(
    public copyItListPresenter: CopyItListPresenter,
    public changeDetection: ChangeDetectorRef,
    private policyService: AuthPolicyService,
    public archiveModeService: ArchiveModeService,
    @Inject('Window') window: Window,
    zone: NgZone
  ) {
    super(copyItListPresenter, changeDetection, archiveModeService, window, zone);
    this.initProperty();
    this.class = 'd-flex flex-column h-100 overflow-hidden';
  }

  public ngOnInit(): void {
    this.afterInitProp();
  }

  /** Sets table data */
  public setTableData(): void {
    this.isSortApply = this.copyItListPresenter.sortApply(this.tableProperty.sort);
    this.copyItListPresenter.copyItLists = this.baseResponse.copyItList;
    this.copyItListPresenter.setTableData();
  }


  /** Initializes default properties for the component */
  private initProperty(): void {
    this.searchField = new FormControl('');
    this.selectedCopyItLists = new Set();
    this.tableProp = new Subject();
    this.tableProperty = new TableProperty<MultiSelectFilterRecord>();
    this.paperSize = pageCount;
    this.destroy = new Subject();
    this.getCopyItList = new EventEmitter<TableProperty<MultiSelectFilterRecord>>();
    this.deleteCopyItList = new EventEmitter<number>();
    this.multiSelectDropDownConfig = false;
    this.multiSelectFilterForm = this.copyItListPresenter.buildCopyItFilterForm();
    this.clients = [];
    this.isSuperUser = this.policyService.isInRole(this.copyItRoles.superUser);
    this.statusDropSettings = {
      text: 'Status',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      classes: 'dropdown-item p-0',
      badgeShowLimit: 1,
      maxHeight: 250,
      primaryKey: 'copyItStatusId'
    }
    this.assignToDropSettings = {
      text: 'Assigned To',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      classes: 'dropdown-item p-0',
      badgeShowLimit: 1,
      maxHeight: 250,
      primaryKey: 'userId'
    }
    this.requestedByDropSettings = {
      text: 'Requested By',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      classes: 'dropdown-item p-0',
      badgeShowLimit: 1,
      maxHeight: 250,
      primaryKey: 'userId'
    }
  }

  /** After Ininitialization Propty */
  private afterInitProp(): void {
    this.copyItListPresenter.setTableProp$.pipe(takeUntil(this.destroy)).subscribe((tableProperty: TableProperty) => {
      this.getCopyItList.emit(tableProperty);
      this.tableProperty = tableProperty;
    });

    this.copyItListPresenter.deleteRecord$.pipe(takeUntil(this.destroy))
      .subscribe((copyItList: CopyItList) => { this.deleteCopyItList.emit(copyItList.copyItId) });
    this.copyItListPresenter.tableProp$.subscribe((value: TableProperty<MultiSelectFilterRecord>) => {
      this.tableProperty = value;
    });

    // clear other filter which are dependent on clientId
    this.multiSelectFilterForm.get('clientId').valueChanges.pipe(takeUntil(this.destroy)).subscribe((clientId) => {
      this.multiSelectFilterForm.patchValue({ requestedById: [], assignedToId: [], statusId: [] });
    });

    /** On filter form changes */
    this.multiSelectFilterForm.valueChanges.pipe(takeUntil(this.destroy)).subscribe((filter: MultiSelectFilterRecord) => {
      this.copyItListPresenter.onFilterChange({ ...filter });
    });
  }
}
