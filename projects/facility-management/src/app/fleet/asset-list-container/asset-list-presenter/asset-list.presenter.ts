/**
 * @author Ronak Patel.
 * @description AssetListPresenter service for AssetPresentation component.
 */

import {
    Injectable
} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

// ---------------------------------------------- //
import { ConfirmationModalService, ConfirmationModalComponent, TableProperty, } from 'common-libs';
import { AssetList, AssetFilter, } from '../../fleet.model';
import { FormGroup, FormBuilder } from '@angular/forms';
import { getTableProperty, pageSizeChange } from '../../../core/utility/utility';
import { BaseTablePresenter } from '../../../shared/base-presenter/base-table.presenter';

/**
 * AssetListPresenter       
 */
@Injectable()
export class AssetListPresenter extends BaseTablePresenter<AssetFilter> {

    /** Table prop$ of asset list presenter */
    public tableProp$: Observable<TableProperty<AssetFilter>>;

    /** This property is used to store the Assets that has been retrieved from the API. */
    public assets: AssetList[];

    /** This property is used to store Asset  of the selected Assets */
    public selectedAssets: Set<AssetList>;

    /** This property is used to store the criteria that are selected by the user */
    public tableProperty: TableProperty<AssetFilter>;

    /** Stores the current sorting order */
    public isAscending: boolean;

    /** The message that will be shown in template when no record found */
    public message: string;

    /** Stores the ID of the Asset that needs to be deleted */
    public assetId: number;

    /** This property is sue to store selected items. */
    public selectedItems: string[];

    /** This property is used to store searchText . */
    public searchText: string;

    /** Table prop of Assetlist presenter */
    private tableProp: Subject<TableProperty<AssetFilter>>;

    /** Asset data of asset list presenter */
    private assetData: Subject<AssetList[]>;

    constructor(
        public modalService: ConfirmationModalService,
        private fb: FormBuilder
    ) {
        super(modalService)
        this.initProperty();
    }
    /**
     * used to call api for filter
     * @param value filter record
     */
    public onClientChange(value: number): void {
        this.resetTableProps();
        this.tableProperty.filter.clientId = value <= 0 ? 0 : value;
        this.setTableProperty(this.tableProperty);
    }
    /**
     * used to call api for filter
     * @param value filter record
     */
    public onStatusChange(flag: boolean): void {
        this.resetTableProps();
        this.tableProperty.filter.isActive = flag;
        this.setTableProperty(this.tableProperty);
    }

    /**
     * This method is invoked when the user performs a global search. It resets the selected rows, updates the criteria
     * and then gets the new list of Assetbased on updated criteria.
     * @param searchTerm The search string that has been searched by the user
     */
    public onSearch(searchTerm: string): void {
        if (this.searchText === searchTerm) { return; }
        this.resetTableProps();
        this.tableProperty.search = searchTerm;
        this.searchText = searchTerm;
        this.setTableProperty(this.tableProperty);
    }

    /**
     * Sets table data
     */
    public setTableData(): void {
        if (this.tableProperty.pageNumber > 0 && this.assets.length === 0) {
            // this.toaster.info('No more records found', 'alert');
            return;
        } else if (this.assets.length === 0) {
            this.tableProperty.pageNumber = 0;
        }
        const assetLength: number = this.assets.length;
        this.assetData.next(this.assets);
        this.tableProperty = this.getTableProperty(this.tableProperty, assetLength);
        this.tableProp.next(this.tableProperty);
    }

    /**
     * This will create all the controls for the form group
     * @param userFormGroup is the form group
     * @param fb is the form builder which will create the controls
     * @returns It will return the userFromGroup with all the controls
     */
    public buildForm(): FormGroup {
        return this.fb.group({
            clientId: [0]
        })
    }

    /**
     * it will reset the table property
     */
    private resetTableProps(): void {
        this.tableProperty.pageNumber = 0;
    }
    /** Initializes default properties for the component */
    private initProperty(): void {
        this.assets = [];
        this.selectedAssets = new Set();
        this.isAscending = false;
        this.tableProperty.filter = { isActive: true, clientId: 0 };
        this.selectedItems = [];
        this.searchText = '';
        this.tableProp = new Subject();
        this.assetData = new Subject();
        this.tableProp$ = this.tableProp.asObservable();
    }
}

