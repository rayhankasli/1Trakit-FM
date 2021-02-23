import { Output, EventEmitter, Inject, NgZone } from '@angular/core';
import { TableProperty } from 'common-libs';
import { BaseCloseSelectDropdown } from '../../../core/base-classes/base-close-select-dropdown';
import { MultiSelectFilterRecord } from '../../../core/model/common.model';
import { ComboChartParameter } from '../../dashboard.model';

export class BaseDashboardPresentation extends BaseCloseSelectDropdown {
    /** emits output event for default combochart parameter for copyit */
    @Output() public copyItCombochartDataDefault: EventEmitter<any | void>;
    /** emits output event for default combochart parameter for bookit */
    @Output() public bookItCombochartDataDefault: EventEmitter<any | void>;
    /** emits output event for default combochart parameter for fleet */
    @Output() public fleetCombochartDataDefault: EventEmitter<any | void>;
    /** emits output event for  combochart parameter for copyit */
    @Output() public copyItCombochartData: EventEmitter<any | void>;
    /** emits output event for  combochart parameter for bookit */
    @Output() public bookItCombochartData: EventEmitter<any | void>;
    /** emits output event for  combochart parameter for fleet */
    @Output() public fleetCombochartData: EventEmitter<any | void>;

    @Output() public getCopyItChartList: EventEmitter<TableProperty<MultiSelectFilterRecord | void>>;
    @Output() public getBookItChartList: EventEmitter<TableProperty<MultiSelectFilterRecord | void>>;
    @Output() public getFleetChartList: EventEmitter<TableProperty<MultiSelectFilterRecord | void>>;
    @Output() public getClientStatus: EventEmitter<TableProperty<MultiSelectFilterRecord | void>>;
    @Output() public getAssociateStatus: EventEmitter<TableProperty<MultiSelectFilterRecord | void>>;
    @Output() public getOpenRequests: EventEmitter<TableProperty<MultiSelectFilterRecord | void>>;

    /** This property is used to store the criteria that are selected by the user */
    public tableProperty: TableProperty<MultiSelectFilterRecord>;
    public copyItComboChartOption: ComboChartParameter;
    public bookItComboChartOption: ComboChartParameter;
    public fleetComboChartOption: ComboChartParameter;

    public chartInputFilter: MultiSelectFilterRecord;

    constructor(
        @Inject('Window') window: Window,
        zone: NgZone
    ) {
        super(window, zone);
        /** event emitter for default copyit combochart */
        this.copyItCombochartDataDefault = new EventEmitter<any | void>();
        /** event emitter for default bookit combochart */
        this.bookItCombochartDataDefault = new EventEmitter<any | void>();
        /** event emitter for default fleet combochart */
        this.fleetCombochartDataDefault = new EventEmitter<any | void>();
        /** event emitter for copyit combochart */
        this.copyItCombochartData = new EventEmitter<any | void>();
        /** event emitter for bookit combochart */
        this.bookItCombochartData = new EventEmitter<any | void>();
        /** event emitter for fleet combochart */
        this.fleetCombochartData = new EventEmitter<any | void>();
        /** event emitter for copyit donut chart data */
        this.getCopyItChartList = new EventEmitter<TableProperty<MultiSelectFilterRecord | void>>();
        /** event emitter for bookit donut chart data */
        this.getBookItChartList = new EventEmitter<TableProperty<MultiSelectFilterRecord | void>>();
        /** event emitter for fleet donut chart data */
        this.getFleetChartList = new EventEmitter<TableProperty<MultiSelectFilterRecord | void>>();
        /** event emitter for client chart sattus for barchart data */
        this.getClientStatus = new EventEmitter<TableProperty<MultiSelectFilterRecord | void>>();
        /** event emitter for associate chart sattus for barchart data */
        this.getAssociateStatus = new EventEmitter<TableProperty<MultiSelectFilterRecord | void>>();
        /** event emitter for open request card component data */
        this.getOpenRequests = new EventEmitter<TableProperty<MultiSelectFilterRecord | void>>();

        this.copyItComboChartOption = new ComboChartParameter();
        this.bookItComboChartOption = new ComboChartParameter();
        this.fleetComboChartOption = new ComboChartParameter();
    }

    /** emmiting combochart parameter for default chart to get copyit data  */
    public getCopyItCombochartDataDefault(): void {
        this.copyItCombochartDataDefault.emit(this.copyItComboChartOption);
    }

    /** emmiting combochart parameter for default chart to get bookit data  */

    public getBookItCombochartDataDefault(): void {
        this.bookItCombochartDataDefault.emit(this.bookItComboChartOption);
    }
    /** emmiting combochart parameter for default chart to get fleet data  */

    public getFleetCombochartDataDefault(): void {
        this.fleetCombochartDataDefault.emit(this.fleetComboChartOption);
    }

    /** emmiting combochart parameter to get combochart data for copyit client wise  */
    public getCopyItCombochartData(): void {
        this.copyItCombochartData.emit(this.tableProperty);
    }

    /** emmiting combochart parameter to get combochart data for bookit client wise  */
    public getBookItCombochartData(): void {
        this.bookItCombochartData.emit(this.tableProperty);
    }

    /** emmiting combochart parameter to get combochart data for fleet client wise  */
    public getFleetCombochartData(): void {
        this.fleetCombochartData.emit(this.tableProperty);
    }

    /** emmiting client id as parameter to get copyit chart status data */
    public copyItChartList(): void {
        this.getCopyItChartList.emit(this.tableProperty);
    }

    /** emmiting client id as parameter to get bookit status data */
    public bookItChartList(): void {
        this.getBookItChartList.emit(this.tableProperty);
    }

    /** emmiting client id as parameter to get fleet chart status data */
    public fleetChartList(): void {
        this.getFleetChartList.emit(this.tableProperty);
    }

    /** emmiting client id as parameter to get client chart status data */
    public clientStatus(): void {
        this.getClientStatus.emit(this.tableProperty);
    }

    /** emmiting client id as parameter to get associate chart status data */
    public associateStatus(): void {
        this.getAssociateStatus.emit(this.tableProperty);
    }
    /** emmiting client id as parameter to get all open requests */
    public openRequests(): void {
        this.getOpenRequests.emit(this.tableProperty);
    }
}
