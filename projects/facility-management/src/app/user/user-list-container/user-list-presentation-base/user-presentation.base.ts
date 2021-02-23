import { Output, EventEmitter, Input } from '@angular/core';
// --------------------------------------- //
import { User } from '../../user.model';
import { FloorMaster, OfficeMaster } from '../../../core/model/common.model';

// tslint:disable-next-line: completed-docs
export class BaseUserPresentation {

    /** list of offices */
    @Input() public offices: OfficeMaster[];
    /** list of floors */
    @Input() public floors: FloorMaster[];
    /*** it will used for emit the add user form value to the parent component */
    @Output() public add: EventEmitter<User>;
    /*** it will used for emit the update user form value to the parent component */
    @Output() public update: EventEmitter<User>;
    /*** it will used to emit the event for get the office list by client id */
    @Output() public getOffices: EventEmitter<number>;
    /*** it will used to emit the event for get the floors list by office id */
    @Output() public getFloors: EventEmitter<number>;

    constructor() {
        this.add = new EventEmitter<User>();
        this.update = new EventEmitter<User>();
        this.getOffices = new EventEmitter<number>();
        this.getFloors = new EventEmitter<number>();
    }

    /**
     * this will call on client change
     * @param clientId it will have the client id
     */
    public onClientChange(clientId: number): void {
        this.getOffices.emit(clientId);
    }

    /**
     * this will call on office change
     * @param officeId it will have the office id
     */
    public onOfficeChange(officeId: number): void {
        this.getFloors.emit(officeId);
    }
}