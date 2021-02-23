/**
 * @author Rayhan Kasli
 * @description Base class for table
 */
import { NgZone, QueryList, Renderer2 } from '@angular/core';
import { ConfirmationData, ConfirmationModalComponent, ConfirmationModalService, SortingOrder, SortingOrderDirective, TableProperty } from 'common-libs';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { ConformationDelete } from '../../core/utility/enums';
import { getTableProperty, onSorting, pageSizeChange, resetTableProps } from '../../core/utility/utility';

/** BaseTablePresenter */
export class BaseTablePresenter<T> {

    /** This property is used for subscribing the value of subject setTableProp */
    public setTableProp$: Observable<TableProperty<T>>;

    /** This is used for user info object */
    public setTableProp: Subject<TableProperty<T>> | BehaviorSubject<TableProperty<T>>;

    /** This property is used for subscribe the value of subject deleteVisitorLog */
    public deleteRecord$: Observable<T>;

    /** This property is used to store the criteria that are selected by the user */
    public tableProperty: TableProperty<T>;

    /** This property is used to store searchText . */
    public searchText: string;

    /** This property is used for emit when delete VisitorLog.  */
    private deleteRecord: Subject<T>;

    constructor(
        public modalService?: ConfirmationModalService,
        public renderer?: Renderer2,
        public ngZone?: NgZone,
    ) {
        this.tableProperty = new TableProperty<T>();
        this.setTableProp = new BehaviorSubject(this.tableProperty);
        this.setTableProp$ = this.setTableProp.asObservable();
        this.deleteRecord = new Subject<T>();
        this.deleteRecord$ = this.deleteRecord.asObservable();
        this.searchText = '';
    }

    /** This method is invoke when table property change. */
    public setTableProperty(tableProperty: TableProperty<T>): void {
        this.tableProperty = tableProperty;
        this.setTableProp.next(this.tableProperty);
    }

    /** This method is invoke when data successfully get */
    public getTableProperty(tableProperty: TableProperty<T>, length: number): TableProperty<T> {
        this.tableProperty = tableProperty;
        this.tableProperty = getTableProperty(tableProperty, length);
        return this.tableProperty;
    }

    /**
     * This method is invoked when the user changes the page number from the pagination toolbar.
     * @param pageNumber The number to which the table should switch to
     */
    public onPageChange(pageNumber: number): void {
        this.tableProperty.pageNumber = pageNumber;
        this.setTableProperty(this.tableProperty);
    }

    /**
     * This method is invoked when the user changes the current page size.
     * @param pageSize The page number that needs to be set.
     */
    public onPageSizeChange(pageSize: number): void {
        this.tableProperty = pageSizeChange(this.tableProperty, pageSize);
        this.setTableProperty(this.tableProperty);
    }

    /**
     * This method is invoked when the user clicks on sorting icons. It sets the sort related criteria and queries the server
     * to get the updated list of Users.
     * @param column The column on which sorting needs to be performed. 
     * @param sortingOrder The sort order by which the column needs to be sorted.
     */
    public onSortOrder(column: string, sortingOrder: SortingOrder, sortingColumns: QueryList<SortingOrderDirective>): void {
        this.tableProperty = resetTableProps(this.tableProperty);
        this.tableProperty = onSorting(this.tableProperty, column, sortingOrder, sortingColumns, this.ngZone, this.renderer)
        this.setTableProperty(this.tableProperty);
    }

    /** Used for performance optimization */
    public trackBy<T>(index: number, className: T): T {
        return className;
    }

    /**
     * This method is invoked when the user performs a global search. It resets the selected rows, updates the criteria
     * and then gets the new list of Userbased on updated criteria.
     * @param searchTerm The search string that has been searched by the user
     */
    public onSearch(searchTerm: string): void {
        if (this.searchText === searchTerm) { return; }
        this.tableProperty.search = searchTerm;
        this.tableProperty = resetTableProps(this.tableProperty);
        this.searchText = searchTerm;
        this.setTableProperty(this.tableProperty);
    }

    /**
     * create for open modal when action perform
     * @param data <T> model
     */
    public openModal(data: T, arg: ConfirmationData = {}): void {
        const { confirmationMessage, positiveAction, negativeAction }: ConfirmationData = arg;
        const modalInstance: ConfirmationModalComponent = this.modalService.openModal();
        modalInstance.confirmationMessage = confirmationMessage || ConformationDelete.Conformation_Massage;
        modalInstance.positiveAction = positiveAction || ConformationDelete.Positive_Action;
        modalInstance.negativeAction = negativeAction || ConformationDelete.Negative_Action;
        modalInstance.confirmModal.subscribe((value: boolean) => {
            if (value) {
                this.onDelete(data);
            }
            this.modalService.closeModal();
        });
    }

    /**
     * create for delete record base on id.
     * @param t <T> model
     */
    public onDelete(t: T): void {
        this.modalService.closeModal();
        this.deleteRecord.next(t);
    }


}