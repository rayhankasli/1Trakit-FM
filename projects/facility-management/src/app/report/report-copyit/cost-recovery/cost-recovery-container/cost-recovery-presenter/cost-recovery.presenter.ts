/** 
 * @author Shahbaz Shaikh.
 * @description CostRecoverypresenter service for CostRecoverypresentation component.
 */

import { Injectable } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
// -------------------------------------------------- //
import { TableProperty } from 'common-libs';
// ------------------------------------------------- //
import {
    FilterRecord, CostRecovery, User, PaperSizeMeterReads, PaperSizeDetail, FIND_RATE_CHARGES, FIND_MASTER,
    FinishingDetail, PaperStockDetail, TabsDetail, EnvelopeDetail, OverSizeDetail, CostRecoveryDetail, MeterReadsDetail, MeterRead, PaperSize
} from '../../cost-recovery.model';
import { ReportDateRangeFilterBasePresenter } from '../../../../../core/base-classes/report-date-range-filter.base';

/** CostRecoveryPresenter */
@Injectable()
export class CostRecoveryPresenter extends ReportDateRangeFilterBasePresenter {

    /** isFormSubmitted */
    public isFormSubmitted: boolean;

    /** Table prop$ of costRecovery list presenter */
    public tableProp$: Observable<TableProperty>;

    /** This property is used to store the CostRecoverys that has been retrieved from the API. */
    public costRecoveryList: User[];

    /** This property is used to store CostRecovery  of the selected CostRecoverys */
    public selectedCostRecoverys: Set<any>;

    /** This property is used to store the criteria that are selected by the user */
    public tableProperty: TableProperty;

    /** Table prop of CostRecoverylist presenter */
    private tableProp: Subject<TableProperty>;

    /** CostRecovery data of costRecovery list presenter */
    private costRecoveryData: Subject<any[]>;

    /** This property is used to store filterData. */
    private filterData: FilterRecord;

    /** clientID */
    private clientId: number;

    constructor(
        private formBuilder: FormBuilder
    ) {
        super()
        this.initProperty();
    }

    /** Build Filter Form */
    public buildFilterForm(): FormGroup {
        return this.formBuilder.group({
            startDate: [null, [Validators.required]],
            endDate: [null, [Validators.required]]
        })
    }

    /**
     * This will bind the form control value
     * @param formGroup is the form group containing all the controls
     */
    public bindControlValue(formGroup: FormGroup): any {
        formGroup.patchValue({
            startDate: this.startDate,
            endDate: this.endDate
        });

        return formGroup;
    }

    /**
     * used to call api for filter
     * @param filterData filter record 
     */
    public costRecoveryFilter(costRecoveryFormGroup: FormGroup): void {
        if (costRecoveryFormGroup.valid) {
            this.isFormSubmitted = false;
            let costRecoveryFilterData: FilterRecord = costRecoveryFormGroup.value;

            this.filterData = costRecoveryFilterData;
            Object.keys(costRecoveryFilterData).forEach((key: string) => {
                if (!costRecoveryFilterData[key] && costRecoveryFilterData[key] !== false) {
                    delete costRecoveryFilterData[key];
                }
            });
            this.tableProperty.filter = { clientId: this.clientId, ...costRecoveryFilterData };
            if (!this.clientId) {
                delete this.tableProperty.filter['clientId'];
            }
            this.resetCostRecoveryTableProps();
            this.setTableProperty(this.tableProperty);
        } else {
            this.isFormSubmitted = true;
        }
    }

    /**
     * This methos is set the client id in the filter when client change
     * @param clientId Get the Client Id
     */
    public costRecoveryClientChange(clientId?: number): void {
        if (clientId > 0) {
            this.clientId = clientId;
            this.tableProperty.filter.clientId = this.clientId;
        } else {
            this.clientId = undefined;
            let filterData: FilterRecord = { ...this.filterData };
            delete filterData[clientId];
            this.tableProperty.filter = filterData;
        }
        this.setTableProperty(this.tableProperty);
    }

    /**
     * This method are set null end date and set start date in the mindate 
     * @param formGroup Get the cost-recovery filter form group
     * @param startDate Get the start date
     */
    public setCostRecoveryStartDate(formGroup: FormGroup, startDate: Date): void {
        this.setStartDate(formGroup, startDate);
    }

    /**
     * Compare two month in charge back start and end period
     * @param tableProperty Get the table property
     */
    public compareMonth(tableProperty: TableProperty): void {
        this.setCompareMonth(tableProperty);
    }

    /**
     * Sets table data
     */
    public setTableData(): void {
        if (this.tableProperty.pageNumber > 0 && this.costRecoveryList.length === 0) {
            // this.toaster.info('No more records found', 'alert');
            return;
        } else if (this.costRecoveryList.length === 0) {
            this.tableProperty.pageNumber = 0;
        }
        const costRecoveryLength: number = this.costRecoveryList.length;
        this.costRecoveryData.next(this.costRecoveryList);
        this.tableProperty = this.getTableProperty(this.tableProperty, costRecoveryLength);
        this.tableProp.next(this.tableProperty);
    }

    /**
     * Prepared the Cost-Recovery list
     * @param costRecovery Get the cost-recovery list
     */
    public setCostRecoveryData(costRecovery: CostRecovery): User[] {

        let costRecoveryList: User[] = [];

        costRecovery.users.forEach((user: User) => {

            let finishingList: FinishingDetail[] = this.findQtyAndRateDetails(user, FIND_RATE_CHARGES.Finishing, costRecovery.finishing, FIND_MASTER.Finishing);
            let paperStockList: PaperStockDetail[] = this.findQtyAndRateDetails(user, FIND_RATE_CHARGES.PaperStock, costRecovery.paperStock, FIND_MASTER.PaperStock);
            let tabsList: TabsDetail[] = this.findQtyAndRateDetails(user, FIND_RATE_CHARGES.Tabs, costRecovery.tabs, FIND_MASTER.Tabs);
            let envelopesList: EnvelopeDetail[] = this.findQtyAndRateDetails(user, FIND_RATE_CHARGES.Envelopes, costRecovery.envelopes, FIND_MASTER.Envelopes);
            let overSizeList: OverSizeDetail[] = this.findQtyAndRateDetails(user, FIND_RATE_CHARGES.OverSize, costRecovery.overSize, FIND_MASTER.OverSize);

            let findPaperSizes: PaperSizeDetail[] = this.findPaperSize(user, costRecovery.paperSize);
            let findMeterReads: MeterRead[] = this.findMeterReadDetail(user);
            let findUniquePapers: PaperSizeDetail[] = this.findUniquePaperSize(findPaperSizes);
            let finalPaperSize: MeterReadsDetail[] = this.preparePaperSizeDetails(findUniquePapers, findMeterReads);

            let userObj: User = {
                ...user,
                paperSizeDetail: finalPaperSize,
                finishingDetail: finishingList,
                paperStockDetail: paperStockList,
                tabsDetail: tabsList,
                envelopeDetail: envelopesList,
                overSizeDetail: overSizeList,
            }
            delete userObj['paperSizeMeterReads'];
            userObj && costRecoveryList.push(userObj);
        });
        return costRecoveryList;
    }

    /**
     * Find Master Details
     * @param userInfo Get the user object
     * @param userInfoKey Get the key of user deatils
     * @param masterDetails Get the master deatils of cost recovery
     * @param masterTitle Get the key of master deatils
     */
    private findQtyAndRateDetails(userInfo: User, userInfoKey: string, masterDetails: CostRecoveryDetail[], masterTitle: string): CostRecoveryDetail[] {

        let costRecoveryDetail: CostRecoveryDetail[] = [];
        let findQuantityAndRate: CostRecoveryDetail;

        if (masterDetails) {
            masterDetails.forEach((masterData: any) => {

                if (userInfo[userInfoKey]) {
                    const list: CostRecoveryDetail[] = (userInfo[userInfoKey] as Array<any>).filter((item: CostRecoveryDetail) => item.id === masterData.id);
                    findQuantityAndRate = list ? (list.length > 1 ? this.sumQtyAndCharges(list) : list[0]) : null;
                    // findQuantityAndRate = userInfo[userInfoKey].find((item: CostRecoveryDetail) => item.id === masterData.id);
                }

                if (findQuantityAndRate) {
                    let costRecoveryDetailObj: CostRecoveryDetail = new CostRecoveryDetail();

                    costRecoveryDetailObj.id = findQuantityAndRate.id;
                    costRecoveryDetailObj.title = masterData[masterTitle];
                    costRecoveryDetailObj.quantity = findQuantityAndRate.quantity;
                    costRecoveryDetailObj.rate = findQuantityAndRate.rate;
                    costRecoveryDetailObj.charges = findQuantityAndRate.charges;

                    costRecoveryDetailObj && costRecoveryDetail.push(costRecoveryDetailObj);
                }
            });
        }

        return costRecoveryDetail;
    }

    /**
     * Sum quantity and charges for similar attributes
     * @param list CostRecoveryDetail
     */
    private sumQtyAndCharges(list: CostRecoveryDetail[] = []): CostRecoveryDetail {
        return list.reduce((a: CostRecoveryDetail, b: CostRecoveryDetail) => {
            const quantity: number = a.quantity + (b.quantity || 0);
            const charges: number = a.charges + (b.charges || 0);
            return { ...list[0], quantity, charges };
        }, { quantity: 0, charges: 0 })
    }

    /**
     * Find Master Details
     * @param userInfo Get the User object
     * @param masterPaperSize Get the master paper size details
     */
    private findPaperSize(userInfo: User, masterPaperSize: PaperSize[]): PaperSizeDetail[] {

        let paperSizeDeatils: PaperSizeDetail[] = [];

        masterPaperSize && masterPaperSize.forEach((paperSize: PaperSize) => {

            let findRateAndCharges: PaperSizeDetail[];

            if (userInfo.paperSizeDetail) {
                findRateAndCharges = userInfo.paperSizeDetail && userInfo.paperSizeDetail.filter((item: PaperSizeDetail) => item.id === paperSize.id);
            }

            findRateAndCharges && findRateAndCharges.forEach((paper: PaperSizeDetail) => {
                let paperSizeDetail: PaperSizeDetail = {
                    id: paper.id,
                    assetMeterId: paper.assetMeterId,
                    paperType: paper.paperType,
                    title: paperSize.paperSize,
                    rate: paper.rate,
                    charges: paper.charges,
                }

                paperSizeDetail && paperSizeDeatils.push(paperSizeDetail);
            });
        });

        return paperSizeDeatils;
    }

    /**
     * Find Paper Size and Meter Read
     * @param user Get the user object
     */
    private findMeterReadDetail(user: User): MeterRead[] {

        let meterReadsDetails: MeterRead[] = [];

        let id: number = 0;

        user.paperSizeMeterReads && user.paperSizeMeterReads.map((meterRead: PaperSizeMeterReads) => {

            let meterReadObj: MeterRead;

            const colorPaper: PaperSizeDetail = user.paperSizeDetail && user.paperSizeDetail.find((paper: PaperSizeDetail) =>
                (paper.assetMeterId === meterRead.id && paper.paperType === 1) && (paper.id === meterRead.colorPaperSizeId));

            const bAndWPaper: PaperSizeDetail = user.paperSizeDetail && user.paperSizeDetail.find((paper: PaperSizeDetail) =>
                (paper.assetMeterId === meterRead.id && paper.paperType === 2) && (paper.id === meterRead.bwPaperSizeId));

            if (colorPaper) {
                meterReadObj = {
                    id: id++,
                    paperSizeId: colorPaper.id,
                    assetMeterId: meterRead.id,
                    assetId: meterRead.assetId,
                    assetNo: meterRead.assetNo,
                    manufacturer: meterRead.manufacturer,
                    modelNo: meterRead.modelNo,
                    prevRead: meterRead.colorPrevRead,
                    currentRead: meterRead.colorCurrentRead,
                    noOfPages: meterRead.noOfPages,
                    rate: colorPaper.rate,
                    charges: colorPaper.charges,
                    paperType: colorPaper.paperType
                }
            }

            if (bAndWPaper) {
                meterReadObj = {
                    id: id++,
                    paperSizeId: bAndWPaper.id,
                    assetMeterId: meterRead.id,
                    assetId: meterRead.assetId,
                    assetNo: meterRead.assetNo,
                    manufacturer: meterRead.manufacturer,
                    modelNo: meterRead.modelNo,
                    prevRead: meterRead.bwPrevRead,
                    currentRead: meterRead.bwCurrentRead,
                    noOfPages: meterRead.noOfPages,
                    rate: bAndWPaper.rate,
                    charges: bAndWPaper.charges,
                    paperType: bAndWPaper.paperType
                }
            }

            meterReadObj && meterReadsDetails.push(meterReadObj);

        });

        return meterReadsDetails;
    }

    /**
     * This methos is used for find unique paper size
     * @param paperSizeDetails Get the Paper Size Deatils
     */
    private findUniquePaperSize(paperSizeDetails: PaperSizeDetail[]): PaperSizeDetail[] {

        let uniquePaperSize: PaperSizeDetail[] = [];

        paperSizeDetails && paperSizeDetails.filter((paper: PaperSizeDetail) => {
            let index: number = uniquePaperSize.findIndex((x) => x.id === paper.id);

            if (index <= -1) {
                let paperSizeDetail: PaperSizeDetail = {
                    id: paper.id,
                    assetMeterId: paper.assetMeterId,
                    paperType: paper.paperType,
                    title: paper.title,
                    rate: paper.rate,
                    charges: paper.charges,
                }
                paperSizeDetail && uniquePaperSize.push(paperSizeDetail);
            }
            return null;
        });

        return uniquePaperSize;
    }

    /**
     * This methos is used for merge Paper Size and Meter Read
     * @param paperSizes Get the paper size deatils
     * @param meterReadsDetail  Get the Meter Read Deatils
     */
    private preparePaperSizeDetails(paperSizes: PaperSizeDetail[], meterReadsDetail: MeterRead[]): MeterReadsDetail[] {

        let paperSizeDeatils: MeterReadsDetail[] = [];

        let id: number = 0;

        paperSizes && paperSizes.forEach((paper: PaperSizeDetail) => {

            let meterReadList: MeterRead[] = meterReadsDetail && meterReadsDetail.filter((meterRead: MeterRead) => meterRead.paperSizeId === paper.id);

            let paperSizeobj: MeterReadsDetail = {
                id: id++,
                paperSize: paper.title,
                meterReads: meterReadList
            }

            paperSizeobj && paperSizeDeatils.push(paperSizeobj);
        });

        return paperSizeDeatils;
    }

    /** it will reset the cost recovery table property */
    private resetCostRecoveryTableProps(): void {
        this.tableProperty.pageNumber = 0;
    }

    /** Initializes default properties for the cost recovery component */
    private initProperty(): void {
        this.filterData = { startDate: this.startDate, endDate: this.endDate };
        this.costRecoveryList = [];
        this.selectedCostRecoverys = new Set();
        this.tableProp = new Subject();
        this.costRecoveryData = new Subject();
        this.tableProperty.pageLimit = 5;
        this.tableProperty.filter = new FilterRecord(null, this.startDate, this.endDate);
        this.tableProp$ = this.tableProp.asObservable();
    }
}