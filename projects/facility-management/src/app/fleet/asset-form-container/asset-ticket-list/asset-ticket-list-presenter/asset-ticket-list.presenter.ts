/** 
 * @author Ronak Patel.
 * @description AssetTicketpresenter service for AssetTicketpresentation component.
 */

import {
    Injectable
} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
// ---------------------------------------------- //
import { TableProperty } from 'common-libs';
import { AssetTicket } from '../../../fleet.model';
import { BaseTablePresenter } from '../../../../shared/base-presenter/base-table.presenter';

@Injectable()
export class AssetTicketListPresenter extends BaseTablePresenter<TableProperty> {

    /** Table prop$ of assetTicket list presenter */
    public tableProp$: Observable<TableProperty>;

    /** This property is used to store the AssetTickets that has been retrieved from the API. */
    public assetTickets: AssetTicket[];

    /** This property is used to store the criteria that are selected by the user */
    public tableProperty: TableProperty;

    /** Stores the current sorting order */
    public isAscending: boolean;

    /** The message that will be shown in template when no record found */
    public message: string;

    /** This property is used to store searchText . */
    public searchText: string;

    /** Table prop of AssetTicketlist presenter */
    private tableProp: Subject<TableProperty>;

    /** AssetTicket data of assetTicket list presenter */
    private assetTicketData: Subject<AssetTicket[]>;

    /** statusId  */
    private statusId: number;

    constructor(
    ) {
        super()
        this.initProperty();
    }

    /** onFliter  */
    public onFilter(value: number): void {
        this.resetTableProps();
        this.statusId = value;
        this.tableProperty.filter = { statusId: this.statusId };
        if (this.searchText) { this.tableProperty.search = this.searchText; }
        this.setTableProperty(this.tableProperty);
    }


    /**
     * Sets table data
     */
    public setTableData(): TableProperty {
        if (this.tableProperty.pageNumber > 0 && this.assetTickets.length === 0) {
            return;
        } else if (this.assetTickets.length === 0) {
            this.tableProperty.pageNumber = 0;
        }
        const assetTicketLength: number = this.assetTickets.length;
        this.assetTicketData.next(this.assetTickets);
        this.tableProperty = this.getTableProperty(this.tableProperty, assetTicketLength);
        this.tableProp.next(this.tableProperty);
        return this.tableProperty;
    }

    
    /**
     * This method is invoked when the user performs a global search. It resets the selected rows, updates the criteria
     * and then gets the new list of AssetTicketbased on updated criteria.
     * @param searchTerm The search string that has been searched by the user
     */
    public onSearch(searchTerm: string): void {
        if (this.searchText === searchTerm) { return; }
        this.resetTableProps();
        this.tableProperty.search = searchTerm;
        this.tableProperty.filter = { statusId: this.statusId };
        this.searchText = searchTerm;
        this.setTableProperty(this.tableProperty);
    }

    /**
     * it will reset the table property
     */
    private resetTableProps(): void {
        this.tableProperty = new TableProperty();
        this.tableProperty.filter = { statusId: 0 };
    }


    /** Initializes default properties for the component */
    private initProperty(): void {
        this.assetTickets = [];
        this.isAscending = false;
        this.tableProperty.filter = { statusId: 0 };
        this.searchText = '';
        this.tableProp = new Subject();
        this.assetTicketData = new Subject();
        this.tableProp$ = this.tableProp.asObservable();
    }
}

