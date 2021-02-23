

/**
 * @author Enter Your Name Here.
 * @description This is adapter service use for transforming data base user requirement. 
 */

import { Injectable } from '@angular/core';
// -------------------------------------------- //
import { Adapter } from 'common-libs';
// -------------------------------------------- //
import { environment } from '../../../../environments/environment';
import { Pictures } from '../../../core/model/common.model';
import { ImageType } from '../../../core/utility/enums';
import { getLocaleDate } from '../../../core/utility/utility';
import { MailChartModel, MailReport, MailReportFilterRecord } from '../report-mail.model';




@Injectable()
export class MailReportAdapter implements Adapter<MailReport> {

    /** This method is used to transform response object into T object. */
    public toResponse(item: MailReport): MailReport {

         const mailReport: MailReport = new MailReport(
            item.packageId,
            item.scanId,
            item.courierCompany,
            item.scannedBy,
            item.deliveredTo ? item.deliveredTo.trim() : null,
            item.dateTime ? getLocaleDate(item.dateTime) : null,
            item.receivingType,
            item.status,
            item.attempts,
            item.recipient,
            this.getPictures(item.pictures)
        );
         return mailReport;
    }

     /** getPictures  */
    private getPictures(picture: Pictures[]): Pictures[] {
        let pictures: Pictures[] = [];
        picture.forEach((pic: Pictures) => {
            let pictureData: Pictures = new Pictures();
            pictureData.actualImageName = pic.actualImageName;
            if (pic.imageType) {
                if(pic.imageType === ImageType.Scan_Type) {
                    pictureData.systemImageName = `${environment.base_host_url}Packages/${pic.systemImageName}`;
                    pictureData.imageDesription = ImageType.Scan_Image;
                } else if (pic.imageType === ImageType.Delivery_Type) {
                    pictureData.systemImageName = `${environment.base_host_url}Deliveries/${pic.systemImageName}`;
                    pictureData.imageDesription = ImageType.Delivery_Image;
                } else if (pic.imageType === ImageType.Signature_Type) {
                    pictureData.systemImageName = `${environment.base_host_url}Signatures/${pic.systemImageName}`;
                    pictureData.imageDesription = ImageType.Signature_Image;
                }
            }
            pictures.push(pictureData);
        });
        return pictures;
    }
}


@Injectable()
export class MailReportFilterAdapter implements Adapter<MailReportFilterRecord> {

    /** This method is used to transform response object into T object. */
    public toResponse(item: MailReportFilterRecord): MailReportFilterRecord {
        return new MailReportFilterRecord(item);
    }

    /** This method is used to transform T object into request object. */
    public toRequest(item: MailReportFilterRecord): MailReportFilterRecord {
        const mailReportFilter: MailReportFilterRecord = new MailReportFilterRecord({});
        mailReportFilter.clientId = item.clientId;
        mailReportFilter.startDate = (item.startDate as Date).toDateString();
        mailReportFilter.endDate = (item.endDate as Date).toDateString();
        return mailReportFilter;
    }
}


@Injectable()
export class MailChartAdapter implements Adapter<MailChartModel> {

    /** This method is used to transform response object into T object. */
    public toResponse(item: MailChartModel): MailChartModel {
        const mailReport: MailChartModel = new MailChartModel(
            item.open,
            item.delivered,
            item.attempted,
            item.period
        );
        return mailReport;
    }

}
