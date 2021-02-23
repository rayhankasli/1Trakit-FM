import { Injectable } from '@angular/core';
// ------------------------------------------------------ //
import { Adapter } from 'common-libs';
// ------------------------------------------------------ //
import { getLocaleDate } from '../../../../core/utility/utility';
import { CostRecovery, CostRecoveryResponse, User, ReportPeriod } from '../cost-recovery.model';


/** CostRecoveryAdapter */
@Injectable()
export class CostRecoveryAdapter implements Adapter<CostRecovery> {

    constructor() { }

    /** This method is used to transform response object into T object. */
    public toResponse(item: CostRecoveryResponse): CostRecovery {

        const costRecovery: CostRecovery = new CostRecovery();
        costRecovery.finishing = item.finishing;
        costRecovery.paperSize = item.paperSize;
        costRecovery.paperStock = item.paperStock;
        costRecovery.tabs = item.tabs;
        costRecovery.envelopes = item.envelopes;
        costRecovery.overSize = item.overSize;
        costRecovery.users = this.bindUserDetail(item.data);
        costRecovery.totalCount = item.totalCount;

        return costRecovery;
    }

    // /** This method is used to transform T object into request object. */
    public toRequest(item: CostRecoveryResponse): CostRecovery {
        const costRecovery: CostRecovery = new CostRecovery();
        return costRecovery;
    }

    /** Set User Data */
    private bindUserDetail(userList: User[]): User[] {

        let users: User[] = [];

        if (userList) {
            userList.forEach((user: User) => {
                const item: User = new User();

                item.copyItId = user.copyItId;
                item.clientId = user.clientId;
                item.requestorName = user.requestorName;
                item.description = user.description;
                item.date = getLocaleDate(user.date);
                item.accountBilling = user.accountBilling;
                item.department = user.department;
                item.jobTicket = user.jobTicket;
                item.printer = user.printer;
                item.dateDue = getLocaleDate(user.dateDue);
                item.dateFinished = getLocaleDate(user.dateFinished);
                item.onTime = user.onTime;
                item.productionType = user.productionType;
                item.noPages = user.noPages;
                item.noCopies = user.noCopies;
                item.totalCopies = user.totalCopies;
                item.totalCharges = user.totalCharges;
                item.totalAttributeCharges = user.totalAttributeCharges;
                item.totalCopiesAndAttrCharges = user.totalCopiesAndAttrCharges;

                item.paperSizeMeterReads = user.paperSizeMeterReads;
                item.scanMeterReads = user.scanMeterReads;
                item.finishingDetail = user.finishingDetail;
                item.paperSizeDetail = user.paperSizeDetail;
                item.paperStockDetail = user.paperStockDetail;
                item.tabsDetail = user.tabsDetail;
                item.envelopeDetail = user.envelopeDetail;
                item.overSizeDetail = user.overSizeDetail;

                users.push(item);
            });
        }

        return users;
    }

}

@Injectable()
export class CostRecoveryFilterAdapter implements Adapter<ReportPeriod> {

    /** This method is used to transform T object into request object. */
    public toRequest(item: ReportPeriod): ReportPeriod {
        const reportPeriod: ReportPeriod = new ReportPeriod(
            this.convertDateFormat(item.startDate),
            this.convertDateFormat(item.endDate)
        );
        return reportPeriod;
    }

    /** Date conversion in mm-dd-yyyy */
    private convertDateFormat(date: any): any {
        let dateConvert: any;
        dateConvert = date ? (1 + date.getMonth()).toString().padStart(2, '0') + '-' + date.getDate().toString().padStart(2, '0') + '-' + date.getFullYear() : '';
        return dateConvert;
    }
}