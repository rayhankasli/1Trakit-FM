/**
 * @author Enter Your Name Here.
 * @description This is adapter service use for transforming data base user requirement. 
 */

import { Injectable } from '@angular/core';
// -------------------------------------------- //
import { Adapter } from 'common-libs';
// ---------------------------------------------- //
import { getLocaleDate } from '../../../../core/utility/utility';
import { ChargeBack, ChargeBackResponse, AccountNumber, Job, FilterRecord, ChargeBackData } from '../chargeback.model';



@Injectable()
export class ChargeBackListAdapter implements Adapter<ChargeBack> {

    /** This method is used to transform response object into T object. */
    public toResponse(item: ChargeBackResponse): ChargeBack {
        const chargeBackList: ChargeBack = new ChargeBack();
        chargeBackList.totalCount = item.totalCount;
        chargeBackList.chargeBackData = this.getChargeBack(item.data);
        return chargeBackList;
    }

    /** This method is used to transform T object into request object. */
    public toRequest(item: ChargeBackResponse): ChargeBack {
        const chargeBackList: ChargeBack = new ChargeBack();
        return chargeBackList;
    }

    /** ChargeBack list of  Data */
    private getChargeBack(chargeBackList: ChargeBackData[]): ChargeBackData[] {
        let chargeBackData: any[] = [];

        chargeBackList.forEach((item: ChargeBackData) => {
            const chargeBack: ChargeBackData = new ChargeBackData();

            chargeBack.id = item.id;
            chargeBack.jobNo = item.jobNo;
            chargeBack.date = getLocaleDate(item.date);
            chargeBack.accountNo = item.accountNo;
            chargeBack.department = item.department;
            chargeBack.requestorName = item.requestorName;
            chargeBack.description = item.description;
            chargeBack.clientId = item.clientId;
            chargeBack.cost = item.cost;
            chargeBack.total = item.cost;

            chargeBackData.push(chargeBack);
        });

        return chargeBackData;
    }
}

@Injectable()
export class ChargeBackFilterAdapter implements Adapter<FilterRecord> {

    /** This method is used to transform T object into request object. */
    public toResponse(item: FilterRecord): FilterRecord {
        const filterRecord: FilterRecord = new FilterRecord();
        return filterRecord;
    }

    /** This method is used to transform T object into request object. */
    public toRequest(item: FilterRecord): FilterRecord {
        const filterRecord: FilterRecord = new FilterRecord();
        filterRecord.accountNo = item.accountNo ? item.accountNo : [];
        filterRecord.job = item.job ? item.job : [];
        filterRecord.startDate = this.convertDateFormat(item.startDate);
        filterRecord.endDate = this.convertDateFormat(item.endDate);

        return filterRecord;
    }

    /** Date conversion in mm-dd-yyyy */
    private convertDateFormat(date: any): any {
        let dateConvert: any;
        dateConvert = date ?  (1 + date.getMonth()).toString().padStart(2, '0') + '-' + date.getDate().toString().padStart(2, '0') + '-' + date.getFullYear() : '';
        return dateConvert;
    }
}

@Injectable()
export class AccountNumberAdapter implements Adapter<AccountNumber> {

    /** This method is used to transform response object into T object. */
    public toResponse(item: AccountNumber): AccountNumber {
        const accountNumber: AccountNumber = new AccountNumber();
        accountNumber.clientId = item.clientId;
        accountNumber.companyName = item.companyName;
        accountNumber.accountDetail = item.accountDetail;

        return accountNumber;
    }

    /** This method is used to transform T object into request object. */
    public toRequest(item: AccountNumber): AccountNumber {
        const accountNumber: AccountNumber = new AccountNumber();
        return accountNumber;
    }
}

@Injectable()
export class JobAdapter implements Adapter<Job> {

    /** This method is used to transform response object into T object. */
    public toResponse(item: Job): Job {
        const accountNumber: Job = new Job();
        accountNumber.clientId = item.clientId;
        accountNumber.companyName = item.companyName;
        accountNumber.jobDetail = item.jobDetail;

        return accountNumber;
    }

    /** This method is used to transform T object into request object. */
    public toRequest(item: Job): Job {
        const job: Job = new Job();
        return job;
    }
}



