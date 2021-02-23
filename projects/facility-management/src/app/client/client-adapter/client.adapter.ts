

/**
 * @author Enter Your Name Here.
 * @description This is adapter service use for transforming data base user requirement. 
 */

import { Injectable } from '@angular/core';
import { NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
// -------------------------------------------- //
import { Adapter, NgbTimeStringAdapter } from 'common-libs';
// -------------------------------------------- //
import { environment } from '../../../environments/environment';
import { ClientFilterRequest, Client, ClientDetails, ClientDetailsResponse } from '../client.model';
import { getLocaleDate } from '../../core/utility/utility';



@Injectable()
export class ClientAdapter implements Adapter<Client> {

    /** This method is used to transform response object into T object. */
    public toResponse(item: Client): Client {
        const client: Client = new Client();
        client.clientId = item.clientId;
        client.companyName = item.companyName;
        client.contactPerson = item.contactPerson;
        client.contactNumber = item.contactNumber;
        client.createdDate = getLocaleDate(item.createdDate).toString();
        client.isActive = item.isActive;
        client.copyIt = item.copyIt;
        client.mail = item.mail;
        client.workflow = item.workflow;
        client.bookIt = item.bookIt;
        client.visitorLog = item.visitorLog;
        return client;
    }

    /** This method is used to transform T object into request object. */
    public toRequest(item: Client): Client {
        const client: Client = new Client();
        return client;
    }
}


@Injectable()
export class ClientFilterAdapter implements Adapter<ClientFilterRequest> {

    /** This method is used to transform response object into T object. */
    public toResponse(item: ClientFilterRequest): ClientFilterRequest {
        const clientFilter: ClientFilterRequest = new ClientFilterRequest();
        return clientFilter;
    }

    /** This method is used to transform T object into request object. */
    public toRequest(item: ClientFilterRequest): ClientFilterRequest {
        const clientFilter: ClientFilterRequest = new ClientFilterRequest(
            item.isActive
        );
        return clientFilter;
    }
}

@Injectable()
export class ClientFormAdapter implements Adapter<ClientDetails>{

    constructor(private ngbTimeAdapter: NgbTimeStringAdapter) { }
    /** This method is used to transform response object into T object. */
    public toResponse(item: ClientDetailsResponse): ClientDetails {
        const client: ClientDetails = new ClientDetails();
        client.clientId = item.clientId;
        client.companyName = item.companyName;
        client.contactPerson = item.contactPerson;
        client.contactNumber = item.contactNumber;
        client.emailAddress = item.emailAddress;

        client.website = item.website;
        client.logoFileNameSmall = item.logoFileNameSmall;
        client.logoFileNameLarge = item.logoFileNameLarge;
        client.originalLogoSmall = item.originalLogoSmall;
        client.originalLogoLarge = item.originalLogoLarge;

        client.tenants = item.tenants;
        client.notifications = item.notifications;
        client.accountNumber = item.accountNumber;

        client.copyIt = item.copyIt;
        client.bookIt = item.bookIt;
        client.mail = item.mail;
        client.workflow = item.workflow;
        client.visitorLog = item.visitorLog;

        client.copyItSlaTimeLimit = this.convertToHours(+item.copyItSlaTimeLimit);
        client.fleetItSlaTimeLimit = this.convertToHours(+item.fleetItSlaTimeLimit);
        client.bookItSlaTimeLimit = this.convertToHours(+item.bookItSlaTimeLimit);

        client._logoSmall = item.logoFileNameSmall ? this.getFilePath(item.logoFileNameSmall) : null;
        client._logoLarge = item.logoFileNameLarge ? this.getFilePath(item.logoFileNameLarge) : null;

        client.contactEmail = item.contactEmail;
        client.contactPhoneNumber = item.contactPhoneNumber;
        // client.logoSmallExtension = item.logoSmallExtension;
        // client.logoLargeExtension = item.logoLargeExtension;

        // client._logoFileNameSmall = item.logoFileNameSmall;
        // client._logoFileNameLarge = item.logoFileNameLarge;
        return client;
    }

    /** This method is used to transform T object into request object. */
    public toRequest(item: ClientDetails): ClientDetails {
        const client: ClientDetails = new ClientDetails();

        client.companyName = item.companyName;
        client.contactPerson = item.contactPerson;
        client.contactNumber = item.contactNumber;
        client.emailAddress = item.emailAddress;
        client.website = item.website || null;

        client.originalLogoSmall = item.originalLogoSmall || null;
        client.logoSmall = this.getBase64StringFromFileData(item.logoSmall);
        client.logoSmallExtension = item.logoSmallExtension || null;

        client.originalLogoLarge = item.originalLogoLarge || null;
        client.logoLarge = this.getBase64StringFromFileData(item.logoLarge);
        client.logoLargeExtension = item.logoLargeExtension || null;

        client.tenants = item.tenants;
        client.notifications = item.notifications;
        client.accountNumber = item.accountNumber;

        client.copyIt = item.copyIt;
        client.bookIt = item.bookIt;
        client.mail = item.mail;
        client.workflow = item.workflow;
        client.visitorLog = item.visitorLog;

        client.copyItSlaTimeLimit = item.copyItSlaTimeLimit ? this.convertToMinutes(`${item.copyItSlaTimeLimit}`) : null;
        client.fleetItSlaTimeLimit = item.fleetItSlaTimeLimit ? this.convertToMinutes(`${item.fleetItSlaTimeLimit}`) : null;
        client.bookItSlaTimeLimit = item.bookItSlaTimeLimit ? this.convertToMinutes(`${item.bookItSlaTimeLimit}`) : null;
        client.contactEmail = item.contactEmail;
        client.contactPhoneNumber = item.contactPhoneNumber;
        return client;
    }

    /**
     * Get encoded base64 string from file data
     * @param data File data
     */
    private getBase64StringFromFileData(data: string): string {
        return data ? data.split('base64,').pop() : null;
    }
    
    /** Get full path for the client logo file */
    private getFilePath(fileName: string): string {
        return `${environment.base_host_url}ClientLogo/${fileName}`;
    }

    /** convert time to minutes */
    private convertToMinutes(timeData: string): number {
        const time: NgbTimeStruct = this.ngbTimeAdapter.fromModel(timeData);
        const totalMinutes: number = time && time.minute + (time.hour * 60);
        return totalMinutes;
    }

    /**
     * Convert time to string before save
     * @param data SLA time
     */
    private convertToHours(totalMinutes: number): string {
        const time: NgbTimeStruct = this.ngbTimeAdapter.fromModel('00:00:00');
        time.hour = Math.floor(totalMinutes / 60);
        time.minute = totalMinutes % 60;
        return this.ngbTimeAdapter.toModel(time);
    }

}
